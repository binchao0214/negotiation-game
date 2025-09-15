//【稳定重构版】negotiate.js

// --- 核心设定 (保持不变) ---
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

// --- 核心辅助函数 (保持不变) ---
function encodeState(state) { return Buffer.from(JSON.stringify(state)).toString('base64'); }
function decodeState(token) { try { return JSON.parse(Buffer.from(token, 'base64').toString('utf-8')); } catch (e) { return null; } }
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
    if (key === 'cost' || key === 'prepayment' || key === 'duration') { return value >= userReserve && value <= aiReserve; } 
    else { return value <= userReserve && value >= aiReserve; }
}
function checkDealCondition(offer, aiStyleKey, aiParams) {
    const zopaStatus = {};
    for (const key in offer) { zopaStatus[key] = isWithinZOPA(key, offer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve); }
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
        if (key === 'cost' || key === 'prepayment' || key === 'duration') { if (userValue > aiReserve) isPainful = true; } 
        else { if (userValue < aiReserve) isPainful = true; }
        if (isPainful) { painPoints.push({ key, userValue, aiExpect: aiParams[key].expect, aiReserve }); }
    }
    if (painPoints.length === 0) { return `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下。`; }
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const paramName = aiParams[mainPainPoint.key].name;
    if (gameState.lastPainPoint === mainPainPoint.key) { gameState.consecutivePainPointCount++; } 
    else { gameState.lastPainPoint = mainPainPoint.key; gameState.consecutivePainPointCount = 1; }
    const responses = [
        `關於<strong>${paramName}</strong>，您提出的 ${mainPainPoint.userValue.toLocaleString()} 條件，與我方的預期差距有點大。`,
        `我理解您的立場，但在<strong>${paramName}</strong>這項上，我們恐怕無法接受 ${mainPainPoint.userValue.toLocaleString()} 這個數字。`,
    ];
    if (gameState.consecutivePainPointCount >= 2) { return `我們似乎在<strong>${paramName}</strong>上卡關了。這個條件 ${mainPainPoint.userValue.toLocaleString()} 對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？`; }
    return responses[Math.floor(Math.random() * responses.length)];
}
function generateReportData(gameState, finalOffer, isSuccess) {
    const { aiStyle, aiParams, stats } = gameState;
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve); }
    return {
        isSuccess,
        resultText: isSuccess ? '恭喜！您與業主達成了雙方都能接受的協議。' : '很遺憾，雙方未能達成共識，談判破裂。',
        aiStyleName: aiStyle.name,
        reportTableHTML: Object.keys(BASE_PARAMS.user).map(key => `<tr class="border-b"><td class="p-3 font-medium">${BASE_PARAMS.user[key].name}</td><td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalOffer[key].toLocaleString()}${BASE_PARAMS.user[key].unit}</td><td>${BASE_PARAMS.user[key].expect.toLocaleString()}${BASE_PARAMS.user[key].unit}</td><td>${BASE_PARAMS.user[key].reserve.toLocaleString()}${BASE_PARAMS.user[key].unit}</td><td>${aiParams[key].reserve.toLocaleString()}${aiParams[key].unit}</td><td>${aiParams[key].expect.toLocaleString()}${aiParams[key].unit}</td></tr>`).join(''),
        dealZoneAnalysisHTML: Object.keys(BASE_PARAMS.user).map(key => { const inZopa = finalZopaStatus[key]; return `<div><span class="font-medium">${BASE_PARAMS.user[key].name}:</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內' : '未落在成交區間'}</span></div>`; }).join(''),
        behaviorStatsHTML: `<li>您共提出了 <strong>${stats.offers}</strong> 次方案。</li><li>您查看了 <strong>${stats.batnaViews}</strong> 次 BATNA。</li>`,
        satisfactionScoresHTML: '<li>用戶滿意度: --/10</li><li>AI 滿意度: --/10</li>',
        smartTipsHTML: `<p><strong>分析：</strong>您的方案${isSuccess ? '' : '未'}能滿足業主 ${aiStyle.name} 風格的成交條件 (${aiStyle.desc})。</p>`
    };
}

// --- 路由器和主处理函数 (重构和简化) ---
const handleAction = {
    'init': () => {
        let gameState = { stats: { offers: 0, batnaViews: 0 }, lastPainPoint: null, consecutivePainPointCount: 0 };
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
            leakText += `${index > 0 ? '，同時' : ''}對 <strong>${param.name}</strong> 的${type}是 <strong>${value}${param.unit || ''}</strong>`;
        });
        return { aiStyleName: gameState.aiStyle.name, leakedInfoHTML: leakText, token: encodeState(gameState) };
    },
    'submit': (gameState, payload) => {
        const { offer } = payload;
        if (!offer) throw new Error("缺少 offer 数据");
        gameState.stats.offers++;
        const isDeal = checkDealCondition(offer, gameState.aiStyle.key, gameState.aiParams);
        if (isDeal) {
            return { isDeal: true, reportData: generateReportData(gameState, offer, true) };
        } else {
            return { isDeal: false, aiResponseHTML: generateAiResponse(offer, gameState), token: encodeState(gameState) };
        }
    },
    'end': (gameState, payload) => {
        const finalOffer = payload.offer || Object.fromEntries(Object.keys(BASE_PARAMS.user).map(key => [key, BASE_PARAMS.user[key].expect]));
        return generateReportData(gameState, finalOffer, false);
    },
    'viewBatna': (gameState) => {
        gameState.stats.batnaViews++;
        return { token: encodeState(gameState) };
    }
};

export const onRequest = async ({ request }) => {
    try {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        }
        
        const payload = await request.json();
        const { action, token } = payload;

        if (!action || !handleAction[action]) {
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        let gameState = null;
        if (action !== 'init') {
            gameState = decodeState(token);
            if (!gameState) {
                return new Response(JSON.stringify({ error: 'Invalid or missing game state token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
        }
        
        const result = handleAction[action](gameState, payload);
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
