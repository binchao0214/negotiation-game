// --- 核心设定 ---
const OBLIGATION_LEVELS = { 1: { name: '輕度義務' }, 2: { name: '一般義務' }, 3: { name: '中度義務' }, 4: { name: '重度義務' }, 5: { name: '全面義務' } };
const BASE_PARAMS = {
    user: {
        cost: { expect: 10500000, reserve: 9000000, name: '總造價', unit: '元' },
        duration: { expect: 330, reserve: 240, name: '工期', unit: '天' },
        warranty: { expect: 1, reserve: 4, name: '保修期', unit: '年' },
        prepayment: { expect: 25, reserve: 15, name: '預付款', unit: '%' },
        obligation: { expect: 1, reserve: 4, name: '附加義務等級', unit: '' }
    },
    ai: {
        cost: { expect: 8500000, reserve: 10000000, name: '總造價', unit: '元' },
        duration: { expect: 210, reserve: 270, name: '工期', unit: '天' },
        warranty: { expect: 5, reserve: 3, name: '保修期', unit: '年' },
        prepayment: { expect: 10, reserve: 20, name: '預付款', unit: '%' },
        obligation: { expect: 5, reserve: 3, name: '附加義務等級', unit: '' }
    }
};
const AI_STYLES = {
    tough: { name: '強悍型', desc: '業主尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。' },
    horseTrader: { name: '交換型', desc: '業主注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。' },
    fair: { name: '公平型', desc: '業主尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。' },
    key: { name: '關鍵變量型', desc: '業主對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「總造價」和「工期」。' },
    accommodating: { name: '隨和型', desc: '業主態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。' }
};

// --- 辅助函数 ---
function encodeState(state) {
    try {
        const jsonString = JSON.stringify(state);
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (e) {
        console.error('Encoding failed:', e);
        return '';
    }
}

function decodeState(token) {
    try {
        const jsonString = decodeURIComponent(escape(atob(token)));
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Decoding failed:', e);
        return null;
    }
}

function generateDynamicParams(styleKey) {
    const flexibilityFactors = { tough: 0.4, horseTrader: 0.6, fair: 0.8, key: 0.7, accommodating: 1.0 };
    const newAiParams = JSON.parse(JSON.stringify(BASE_PARAMS.ai));
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
        if (!isWithinZOPA(key, offer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve)) {
            painPoints.push({ key, userValue: offer[key] });
        }
    }

    if (painPoints.length === 0) { return `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下，才能完全同意。`; }
    
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const paramName = aiParams[mainPainPoint.key].name;

    if (gameState.lastPainPoint === mainPainPoint.key) { gameState.consecutivePainPointCount++; } 
    else { gameState.lastPainPoint = mainPainPoint.key; gameState.consecutivePainPointCount = 1; }
    
    const responses = {
        cost: [ `關於<strong>${paramName}</strong>，您提出的 ${mainPainPoint.userValue.toLocaleString()} 元，與我們的預算差距有點大。`, `我理解您的成本考量，但在<strong>${paramName}</strong>上，我們恐怕無法接受 ${mainPainPoint.userValue.toLocaleString()} 元這個數字。` ],
        duration: [ `在<strong>${paramName}</strong>方面，${mainPainPoint.userValue} 天的時間對我們來說太長了，我們有嚴格的上市時程。`, `我方非常重視效率，${mainPainPoint.userValue} 天的<strong>${paramName}</strong>不符合我們的期望。` ],
        default: [ `我們注意到在<strong>${paramName}</strong>這項，您提出的條件是 ${mainPainPoint.userValue}，這與我方的立場有一定距離。`, `我理解您的立場，但在<strong>${paramName}</strong>上，我們需要尋求一個更接近我方期望的方案。` ]
    };

    if (gameState.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${paramName}</strong>上卡關了。這個條件對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？`;
    }

    const responseSet = responses[mainPainPoint.key] || responses.default;
    return responseSet[Math.floor(Math.random() * responseSet.length)];
}

function calculateSatisfactionScores(finalOffer) {
    const RANGES = { cost: { min: 8500000, max: 11000000 }, duration: { min: 200, max: 350 }, warranty: { min: 1, max: 5 }, prepayment: { min: 10, max: 30 }, obligation: { min: 1, max: 5 } };
    const normalize = (key, value) => (value - RANGES[key].min) / (RANGES[key].max - RANGES[key].min);
    
    let userSqDiff = 0;
    let aiSqDiff = 0;
    
    for (const key in finalOffer) {
        const normFinal = normalize(key, finalOffer[key]);
        const normUserExpect = normalize(key, BASE_PARAMS.user[key].expect);
        const normAiExpect = normalize(key, BASE_PARAMS.ai[key].expect);
        userSqDiff += Math.pow(normFinal - normUserExpect, 2);
        aiSqDiff += Math.pow(normFinal - normAiExpect, 2);
    }

    const userDist = Math.sqrt(userSqDiff);
    const aiDist = Math.sqrt(aiSqDiff);
    const maxDist = Math.sqrt(Object.keys(finalOffer).length);

    const userSatisfaction = Math.max(0, 10 * (1 - userDist / maxDist)).toFixed(1);
    const aiSatisfaction = Math.max(0, 10 * (1 - aiDist / maxDist)).toFixed(1);

    return { user: userSatisfaction, ai: aiSatisfaction };
}

function generateReportData(gameState, finalOffer, isSuccess) {
    const { aiStyle, aiParams, stats, gameHistory } = gameState;
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], BASE_PARAMS.user[key].reserve, aiParams[key].reserve); }
    
    const satisfaction = isSuccess ? calculateSatisfactionScores(finalOffer) : { user: '--', ai: '--' };

    const currentRoundHistory = {
        styleName: aiStyle.name,
        isSuccess,
        satisfaction,
        offersSubmitted: stats.offers
    };
    const updatedGameHistory = [...gameHistory, currentRoundHistory];
    const isGameOver = updatedGameHistory.length >= Object.keys(AI_STYLES).length;

    return {
        isSuccess,
        isGameOver,
        gameHistory: updatedGameHistory,
        resultText: isSuccess ? '恭喜！您與業主達成了雙方都能接受的協議。' : '很遺憾，雙方未能達成共識，談判破裂。',
        aiStyleName: aiStyle.name,
        reportTableHTML: Object.keys(BASE_PARAMS.user).map(key => {
            const param = BASE_PARAMS.user[key];
            const finalValue = finalOffer[key];
            return `<tr class="border-b">
                <td class="p-3 font-medium">${param.name}</td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalValue.toLocaleString()}${param.unit}</td>
                <td>${param.expect.toLocaleString()}${param.unit}</td><td>${param.reserve.toLocaleString()}${param.unit}</td>
                <td>${aiParams[key].reserve.toLocaleString()}${aiParams[key].unit}</td><td>${aiParams[key].expect.toLocaleString()}${aiParams[key].unit}</td>
            </tr>`;
        }).join(''),
        dealZoneAnalysisHTML: Object.keys(BASE_PARAMS.user).map(key => {
            const inZopa = finalZopaStatus[key];
            return `<div><span class="font-medium">${BASE_PARAMS.user[key].name}:</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內' : '未落在成交區間'}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>對話輪次: <strong>${stats.offers}</strong> 次</li><li>查看 BATNA: <strong>${stats.batnaViews}</strong> 次</li>`,
        satisfactionScoresHTML: `<div class="flex justify-between"><span>您的滿意度:</span><span class="font-bold text-lg">${satisfaction.user} / 10</span></div><div class="flex justify-between"><span>業主滿意度:</span><span class="font-bold text-lg">${satisfaction.ai} / 10</span></div>`,
        smartTipsHTML: `<p><strong>分析：</strong>您的方案${isSuccess ? '' : '未'}能滿足業主 ${aiStyle.name} 風格的成交條件 (${aiStyle.desc})。</p>`
    };
}

const handleAction = {
    'init': (payload) => {
        let decodedToken = payload.token ? decodeState(payload.token) : null;
        let completedStyles = (decodedToken && decodedToken.completedStyles) ? decodedToken.completedStyles : [];
        let gameHistory = (decodedToken && decodedToken.gameHistory) ? decodedToken.gameHistory : [];
        
        const allStyleKeys = Object.keys(AI_STYLES);
        if (completedStyles.length >= allStyleKeys.length) {
            return { isGameOver: true, gameHistory: gameHistory };
        }
        
        let availableStyles = allStyleKeys.filter(k => !completedStyles.includes(k));
        const randomStyleKey = availableStyles[Math.floor(Math.random() * availableStyles.length)];
        
        let gameState = {
            stats: { offers: 0, batnaViews: 0 },
            lastPainPoint: null,
            consecutivePainPointCount: 0,
            completedStyles: completedStyles,
            gameHistory: gameHistory
        };

        gameState.aiStyle = { key: randomStyleKey, ...AI_STYLES[randomStyleKey] };
        gameState.aiParams = generateDynamicParams(randomStyleKey);
        
        let leakText = '情報顯示：業主方';
        const leakableParams = ['duration', 'warranty', 'prepayment', 'obligation'];
        const shuffledLeaks = leakableParams.sort(() => 0.5 - Math.random());
        const leaksToReveal = shuffledLeaks.slice(0, Math.random() < 0.5 ? 1 : 2);
        leaksToReveal.forEach((paramKey, index) => {
            const param = gameState.aiParams[paramKey];
            const type = Math.random() < 0.5 ? '期望' : '底線';
            const value = type === '期望' ? param.expect : param.reserve;
            leakText += `${index > 0 ? '，同時' : ''}對 <strong>${param.name}</strong> 的${type}是 <strong>${value}${param.unit || ''}</strong>`;
        });
        
        return {
            isGameOver: false,
            aiStyleName: gameState.aiStyle.name,
            leakedInfoHTML: leakText,
            initialOffer: Object.fromEntries(Object.keys(BASE_PARAMS.user).map(key => [key, BASE_PARAMS.user[key].expect])),
            token: encodeState(gameState)
        };
    },
    'submit': (gameState, payload) => {
        const { offer } = payload;
        if (!offer) throw new Error("缺少 offer 数据");
        gameState.stats.offers++;
        const isDeal = checkDealCondition(offer, gameState.aiStyle.key, gameState.aiParams);
        
        if (isDeal) {
            const reportData = generateReportData(gameState, offer, true);
            gameState.completedStyles.push(gameState.aiStyle.key);
            gameState.gameHistory = reportData.gameHistory;
            return { isDeal: true, reportData, token: encodeState(gameState) };
        } else {
            return { isDeal: false, aiResponseHTML: generateAiResponse(offer, gameState), token: encodeState(gameState) };
        }
    },
    'end': (gameState, payload) => {
        const finalOffer = payload.offer || Object.fromEntries(Object.keys(BASE_PARAMS.user).map(key => [key, BASE_PARAMS.user[key].expect]));
        const reportData = generateReportData(gameState, finalOffer, false);
        gameState.completedStyles.push(gameState.aiStyle.key);
        gameState.gameHistory = reportData.gameHistory;
        return { reportData, token: encodeState(gameState) };
    },
    'viewBatna': (gameState) => {
        gameState.stats.batnaViews++;
        return { token: encodeState(gameState) };
    }
};

export const onRequest = async ({ request }) => {
    try {
        if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
        
        const payload = await request.json();
        const { action, token } = payload;

        if (!action || !handleAction[action]) return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        
        let gameState = action === 'init' ? null : decodeState(token);
        if (action !== 'init' && !gameState) return new Response(JSON.stringify({ error: 'Invalid game state token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        
        const result = handleAction[action](action === 'init' ? payload : gameState, payload);
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

