// --- Core Game Logic and Configuration (Protected on Server) ---
const OBLIGATION_LEVELS = { 1: { name: '輕度義務' }, 2: { name: '一般義務' }, 3: { name: '中度義務' }, 4: { name: '重度義務' }, 5: { name: '全面義務' } };
const BASE_PARAMS = {
    user: {
        cost: { expect: 10500000, reserve: 9000000, name: '總造價', unit: '元' },
        duration: { expect: 330, reserve: 240, name: '工期', unit: '天' },
        warranty: { expect: 1, reserve: 4, name: '保修期', unit: '年' },
        prepayment: { expect: 25, reserve: 15, name: '預付款', unit: '%' },
        obligation: { expect: 1, reserve: 4, name: '附加義務等級', unit: '' }
    }
};
const AI_STYLES = {
    tough: { name: '強悍型', desc: '業主尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。' },
    horseTrader: { name: '交換型', desc: '業主注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。' },
    fair: { name: '公平型', desc: '業主尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。' },
    key: { name: '關鍵變量型', desc: '業主對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「總造價」和「工期」。' },
    accommodating: { name: '隨和型', desc: '業主態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。' }
};

// --- Helper Functions (Server-Side) ---
function encodeState(state) {
    const jsonString = JSON.stringify(state);
    return Buffer.from(jsonString).toString('base64');
}
function decodeState(token) {
    try {
        const jsonString = Buffer.from(token, 'base64').toString('utf-8');
        return JSON.parse(jsonString);
    } catch (e) { return null; }
}
function generateDynamicParams(styleKey) {
    const flexibilityFactors = { tough: 0.4, horseTrader: 0.6, fair: 0.8, key: 0.7, accommodating: 1.0 };
    const baseAiParams = {
        cost: { expect: 8500000, reserve: 10000000, name: '總造價', unit: '元' },
        duration: { expect: 210, reserve: 270, name: '工期', unit: '天' },
        warranty: { expect: 5, reserve: 3, name: '保修期', unit: '年' },
        prepayment: { expect: 10, reserve: 20, name: '預付款', unit: '%' },
        obligation: { expect: 5, reserve: 3, name: '附加義務等級', unit: '' }
    };
    const newAiParams = JSON.parse(JSON.stringify(baseAiParams));
    const factor = flexibilityFactors[styleKey] || 0.8;
    for (const key in newAiParams) {
        const param = newAiParams[key];
        const originalRange = Math.abs(param.reserve - param.expect);
        const newRange = originalRange * factor;
        if (param.reserve > param.expect) {
            param.reserve = Math.round((param.expect + newRange) / (key === 'cost' ? 10000 : 1)) * (key === 'cost' ? 10000 : 1);
        } else {
            param.reserve = Math.round(param.expect - newRange);
        }
    }
    return newAiParams;
}
function isWithinZOPA(key, value, userReserve, aiReserve) {
    if (key === 'cost' || key === 'prepayment' || key === 'duration') {
        return value >= userReserve && value <= aiReserve;
    } else {
        return value <= userReserve && value >= aiReserve;
    }
}
function checkDealCondition(offer, aiStyleKey, aiParams) {
    const zopaStatus = {};
    for (const key in offer) {
        zopaStatus[key] = isWithinZOPA(key, offer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve);
    }
    const zopaCount = Object.values(zopaStatus).filter(Boolean).length;
    switch (aiStyleKey) {
        case 'tough': return zopaCount >= 5;
        case 'horseTrader': return zopaCount >= 4;
        case 'fair': return zopaCount >= 3;
        case 'key': return zopaCount >= 3 && zopaStatus.cost && zopaStatus.duration;
        case 'accommodating': return zopaCount >= 2;
        default: return false;
    }
}
function generateAiResponse(offer, gameState) {
    const { aiParams } = gameState;
    const painPoints = [];
    for (const key in offer) {
        const userValue = offer[key];
        const aiReserve = aiParams[key].reserve;
        let isPainful = false;
        if (key === 'cost' || key === 'prepayment' || key === 'duration') {
            if (userValue > aiReserve) isPainful = true;
        } else {
            if (userValue < aiReserve) isPainful = true;
        }
        if (isPainful) {
            painPoints.push({ key, userValue, aiExpect: aiParams[key].expect, aiReserve });
        }
    }
    if (painPoints.length === 0) {
        return `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下。`;
    }
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const paramName = aiParams[mainPainPoint.key].name;
    if (gameState.lastPainPoint === mainPainPoint.key) {
        gameState.consecutivePainPointCount++;
    } else {
        gameState.lastPainPoint = mainPainPoint.key;
        gameState.consecutivePainPointCount = 1;
    }
    const responses = [
        `關於<strong>${paramName}</strong>，您提出的 ${mainPainPoint.userValue.toLocaleString()} 條件，與我方的預期差距有點大。`,
        `我理解您的立場，但在<strong>${paramName}</strong>這項上，我們恐怕無法接受 ${mainPainPoint.userValue.toLocaleString()} 這個數字。`,
    ];
    if (gameState.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${paramName}</strong>上卡關了。這個條件 ${mainPainPoint.userValue.toLocaleString()} 對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？`;
    }
    return responses[Math.floor(Math.random() * responses.length)];
}
function generateReportData(gameState, finalOffer, isSuccess) {
    const { aiStyle, aiParams, stats } = gameState;
    const finalZopaStatus = {};
     for (const key in finalOffer) {
        finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve);
    }
    const report = {
        isSuccess,
        resultText: isSuccess ? '恭喜！您與業主達成了雙方都能接受的協議。' : '很遺憾，雙方未能達成共識，談判破裂。',
        aiStyleName: aiStyle.name,
        reportTableHTML: Object.keys(BASE_PARAMS.user).map(key => `
            <tr class="border-b">
                <td class="p-3 font-medium">${BASE_PARAMS.user[key].name}</td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : 'text-slate-700'}">${finalOffer[key].toLocaleString()}${BASE_PARAMS.user[key].unit}</td>
                <td class="p-3">${BASE_PARAMS.user[key].expect.toLocaleString()}${BASE_PARAMS.user[key].unit}</td>
                <td class="p-3">${BASE_PARAMS.user[key].reserve.toLocaleString()}${BASE_PARAMS.user[key].unit}</td>
                <td class="p-3">${aiParams[key].reserve.toLocaleString()}${aiParams[key].unit}</td>
                <td class="p-3">${aiParams[key].expect.toLocaleString()}${aiParams[key].unit}</td>
            </tr>
        `).join(''),
        dealZoneAnalysisHTML: Object.keys(BASE_PARAMS.user).map(key => {
            const inZopa = finalZopaStatus[key];
            const statusText = inZopa ? '在成交區間內' : '未落在成交區間';
            const colorClass = inZopa ? 'bg-green-500' : 'bg-red-500';
            return `<div><span class="font-medium">${BASE_PARAMS.user[key].name}:</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${colorClass}">${statusText}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>您共提出了 <strong>${stats.offers}</strong> 次方案。</li><li>您查看了 <strong>${stats.batnaViews}</strong> 次 BATNA。</li>`,
        satisfactionScoresHTML: isSuccess ? '<li>用戶滿意度: 計算中...</li><li>AI 滿意度: 計算中...</li>' : '<li>用戶滿意度: --/10</li><li>AI 滿意度: --/10</li>',
        smartTipsHTML: isSuccess ? `<p><strong>成交分析：</strong>您的方案滿足了業主 ${aiStyle.name} 風格的成交條件 (${aiStyle.desc})。</p>` : `<p><strong>破裂分析：</strong>您的最終方案未能滿足業主 ${aiStyle.name} 風格的成交條件 (${aiStyle.desc})。</p>`
    };
    return report;
}

// --- Cloudflare Function Handler ---
export const onRequest = async ({ request }) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { action, token, offer } = body;
    let gameState;

    if (token) {
        gameState = decodeState(token);
    }

    // This is the new robust check to prevent crashes
    if (action !== 'init' && (!gameState || !gameState.stats || !gameState.aiStyle || !gameState.aiParams)) {
        return new Response(JSON.stringify({ error: "Invalid or missing game state token." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    switch (action) {
        case 'init': {
            gameState = {
                stats: { offers: 0, batnaViews: 0 },
                lastPainPoint: null,
                consecutivePainPointCount: 0,
            };
            const allStyleKeys = Object.keys(AI_STYLES);
            const randomStyleKey = allStyleKeys[Math.floor(Math.random() * allStyleKeys.length)];
            gameState.aiStyle = { key: randomStyleKey, ...AI_STYLES[randomStyleKey] };
            gameState.aiParams = generateDynamicParams(randomStyleKey);
            const leakableParams = ['duration', 'warranty', 'prepayment', 'obligation'];
            const shuffledLeaks = leakableParams.sort(() => 0.5 - Math.random());
            const leaksToReveal = shuffledLeaks.slice(0, Math.random() < 0.5 ? 1 : 2);
            let leakText = '情報顯示：業主方';
            leaksToReveal.forEach((paramKey, index) => {
                const param = gameState.aiParams[paramKey];
                const type = Math.random() < 0.5 ? '期望' : '底線';
                const value = type === '期望' ? param.expect : param.reserve;
                leakText += `${index > 0 ? '，同時' : ''}對 <strong>${param.name}</strong> 的${type}是 <strong>${value}${param.unit}</strong>`;
            });
            const responsePayload = {
                aiStyleName: gameState.aiStyle.name,
                leakedInfoHTML: leakText,
                token: encodeState(gameState),
            };
            return new Response(JSON.stringify(responsePayload), { headers: { 'Content-Type': 'application/json' } });
        }
        case 'submit': {
            if (!offer) {
                 return new Response(JSON.stringify({ error: "Offer data is missing in submit action." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            gameState.stats.offers++;
            const isDeal = checkDealCondition(offer, gameState.aiStyle.key, gameState.aiParams);
            let responsePayload;
            if (isDeal) {
                responsePayload = {
                    isDeal: true,
                    reportData: generateReportData(gameState, offer, true)
                };
            } else {
                const aiResponseHTML = generateAiResponse(offer, gameState);
                responsePayload = {
                    isDeal: false,
                    aiResponseHTML,
                    token: encodeState(gameState),
                };
            }
            return new Response(JSON.stringify(responsePayload), { headers: { 'Content-Type': 'application/json' } });
        }
        case 'end': {
            const finalOffer = offer || Object.fromEntries(
                Object.keys(BASE_PARAMS.user).map(key => [key, BASE_PARAMS.user[key].expect])
            );
            const reportData = generateReportData(gameState, finalOffer, false);
            return new Response(JSON.stringify(reportData), { headers: { 'Content-Type': 'application/json' } });
        }
        case 'viewBatna': {
            gameState.stats.batnaViews++;
            const responsePayload = {
                token: encodeState(gameState)
            };
            return new Response(JSON.stringify(responsePayload), { headers: { 'Content-Type': 'application/json' } });
        }
        default:
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
};
