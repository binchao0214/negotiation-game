// --- 核心设定 (Core Settings) ---
const OBLIGATION_LEVELS = { 
    1: { name: '輕度義務', en_name: 'Light' }, 
    2: { name: '一般義務', en_name: 'General' }, 
    3: { name: '中度義務', en_name: 'Moderate' }, 
    4: { name: '重度義務', en_name: 'Heavy' }, 
    5: { name: '全面義務', en_name: 'Comprehensive' } 
};
const BASE_PARAMS = {
    user: {
        cost:       { expect: 10500000, reserve: 9000000, name: '總造價',       en_name: 'Total Cost',       unit: '元', en_unit: '' },
        duration:   { expect: 330,      reserve: 240,     name: '工期',         en_name: 'Duration',         unit: '天', en_unit: ' Days' },
        warranty:   { expect: 1,        reserve: 4,       name: '保修期',       en_name: 'Warranty',         unit: '年', en_unit: ' Years' },
        prepayment: { expect: 25,       reserve: 15,      name: '預付款',       en_name: 'Prepayment',       unit: '%',  en_unit: '%' },
        obligation: { expect: 1,        reserve: 4,       name: '附加義務等級', en_name: 'Obligation Level', unit: '',   en_unit: '' }
    },
    ai: {
        cost:       { expect: 8500000,  reserve: 10000000, name: '總造價',       en_name: 'Total Cost',       unit: '元', en_unit: '' },
        duration:   { expect: 210,      reserve: 270,      name: '工期',         en_name: 'Duration',         unit: '天', en_unit: ' Days' },
        warranty:   { expect: 5,        reserve: 3,        name: '保修期',       en_name: 'Warranty',         unit: '年', en_unit: ' Years' },
        prepayment: { expect: 10,       reserve: 20,       name: '預付款',       en_name: 'Prepayment',       unit: '%',  en_unit: '%' },
        obligation: { expect: 5,        reserve: 3,        name: '附加義務等級', en_name: 'Obligation Level', unit: '',   en_unit: '' }
    }
};
const AI_STYLES = {
    tough:       { name: '強悍型',       en_name: 'Tough',         desc: '業主尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks a perfect match. Deal Condition: All 5 negotiation items must fall within the ZOPA.' },
    horseTrader: { name: '交換型',       en_name: 'Horse-Trader',  desc: '業主注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client focuses on majority consensus. Deal Condition: At least 4 negotiation items must fall within the ZOPA.' },
    fair:        { name: '公平型',       en_name: 'Fair',          desc: '業主尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks an overall balance. Deal Condition: At least 3 negotiation items must fall within the ZOPA.' },
    key:         { name: '關鍵變量型',   en_name: 'Key-Variable',  desc: '業主對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「總造價」和「工期」。', en_desc: 'The client is uncompromising on core interests. Deal Condition: At least 3 items in ZOPA, which must include Total Cost and Duration.' },
    accommodating: { name: '隨和型',     en_name: 'Accommodating', desc: '業主態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client is open and easy to deal with. Deal Condition: At least 2 negotiation items must fall within the ZOPA.' }
};
const USER_BATNA = { cost: 9500000, duration: 300, warranty: 2, prepayment: 15, obligation: 2 };

// --- 辅助函数 (Helper Functions) ---
function encodeState(state) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { console.error('Encoding failed:', e); return ''; } }
function decodeState(token) { try { return JSON.parse(decodeURIComponent(escape(atob(token)))); } catch (e) { console.error('Decoding failed:', e); return null; } }

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
    const { aiParams } = gameState.currentRound;
    const painPoints = [];
    // A pain point for the AI is when the user's offer is WORSE for the AI than its reserve value.
    for (const key in offer) {
        const userValue = offer[key];
        const aiReserve = aiParams[key].reserve;
        let isPainful = false;
        
        // Higher is worse for AI
        if (key === 'cost' || key === 'duration') {
             if (userValue > aiReserve) isPainful = true;
        // Lower is worse for AI
        } else { // warranty, prepayment, obligation
             if (userValue < aiReserve) isPainful = true;
        }

        if(isPainful) {
            painPoints.push({ key, userValue });
        }
    }

    if (painPoints.length === 0) { 
        return `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下，才能完全同意。<p class="en-text">This offer shows sincerity, and we are getting close to a consensus. However, I need to re-evaluate the overall benefits for our side.</p>`; 
    }
    
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const param = aiParams[mainPainPoint.key];
    const { name, en_name } = param;

    if (gameState.currentRound.lastPainPoint === mainPainPoint.key) { gameState.currentRound.consecutivePainPointCount++; } 
    else { gameState.currentRound.lastPainPoint = mainPainPoint.key; gameState.currentRound.consecutivePainPointCount = 1; }
    
    const responses = {
        cost: [ 
            `關於<strong>${name}</strong>，您提出的 ${mainPainPoint.userValue.toLocaleString()} 元，與我們的預算差距有點大。<p class="en-text">Regarding the <strong>${en_name}</strong>, your offer of ${mainPainPoint.userValue.toLocaleString()} is a bit far from our budget.</p>`, 
            `我理解您的成本考量，但在<strong>${name}</strong>上，我們恐怕無法接受 ${mainPainPoint.userValue.toLocaleString()} 元這個數字。<p class="en-text">I understand your cost considerations, but we cannot accept the figure of ${mainPainPoint.userValue.toLocaleString()} for the <strong>${en_name}</strong>.</p>` 
        ],
        duration: [ 
            `在<strong>${name}</strong>方面，${mainPainPoint.userValue} 天的時間對我們來說太長了，我們有嚴格的上市時程。<p class="en-text">As for the <strong>${en_name}</strong>, ${mainPainPoint.userValue} days is too long for us; we have a strict go-to-market schedule.</p>`, 
            `我方非常重視效率，${mainPainPoint.userValue} 天的<strong>${name}</strong>不符合我們的期望。<p class="en-text">We prioritize efficiency, and a <strong>${en_name}</strong> of ${mainPainPoint.userValue} days does not meet our expectations.</p>`
        ],
        default: [ 
            `我們注意到在<strong>${name}</strong>這項，您提出的條件是 ${mainPainPoint.userValue}，這與我方的立場有一定距離。<p class="en-text">We've noted that on <strong>${en_name}</strong>, your proposed term of ${mainPainPoint.userValue} is some distance from our position.</p>`, 
            `我理解您的立場，但在<strong>${name}</strong>上，我們需要尋求一個更接近我方期望的方案。<p class="en-text">I understand your position, but on <strong>${en_name}</strong>, we need to find a solution closer to our expectations.</p>`
        ]
    };

    if (gameState.currentRound.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${name}</strong>上卡關了。這個條件對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？<p class="en-text">It seems we're stuck on the <strong>${en_name}</strong>. This term is a real obstacle for us. Could you perhaps make a concession elsewhere to balance it out?</p>`;
    }

    const responseSet = responses[mainPainPoint.key] || responses.default;
    return responseSet[Math.floor(Math.random() * responseSet.length)];
}

function calculateSatisfactionScores(finalOffer, aiParams, isPractice) {
    const RANGES = isPractice ? { cost: { min: 1100000, max: 1500000 }, duration: { min: 40, max: 60 }, warranty: { min: 1, max: 3 }, prepayment: { min: 10, max: 30 }, obligation: { min: 1, max: 3 } } : { cost: { min: 8500000, max: 11000000 }, duration: { min: 200, max: 350 }, warranty: { min: 1, max: 5 }, prepayment: { min: 10, max: 30 }, obligation: { min: 1, max: 5 } };
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
    const aiBaseParams = isPractice ? PRACTICE_PARAMS.ai : BASE_PARAMS.ai;
    const batna = isPractice ? PRACTICE_USER_BATNA : USER_BATNA;

    const normalize = (key, value) => (RANGES[key].max - RANGES[key].min === 0) ? 0 : (value - RANGES[key].min) / (RANGES[key].max - RANGES[key].min);
    
    let userSqDiff = 0, aiSqDiff = 0;
    
    for (const key in finalOffer) {
        const normFinal = normalize(key, finalOffer[key]);
        const normUserExpect = normalize(key, userParams[key].expect);
        const normAiExpect = normalize(key, aiBaseParams[key].expect);
        userSqDiff += Math.pow(normFinal - normUserExpect, 2);
        aiSqDiff += Math.pow(normFinal - normAiExpect, 2);
    }

    const maxDist = Math.sqrt(Object.keys(finalOffer).length);
    let userSatisfaction = Math.max(0, 10 * (1 - Math.sqrt(userSqDiff) / maxDist));
    const aiSatisfaction = Math.max(0, 10 * (1 - Math.sqrt(aiSqDiff) / maxDist)).toFixed(1);

    // --- Penalty Logic for Over-concession ---
    let penaltyFactor = 1.0;
    const penaltyReasons = [];
    if (finalOffer.cost < aiParams.cost.expect && finalOffer.cost < batna.cost) { penaltyFactor -= 0.15; penaltyReasons.push('總造價遠低於市場行情 (Cost was well below market rate)'); }
    if (finalOffer.duration < aiParams.duration.expect && finalOffer.duration < batna.duration) { penaltyFactor -= 0.15; penaltyReasons.push('工期過於倉促 (Duration was unnecessarily short)'); }
    if (finalOffer.prepayment < aiParams.prepayment.expect && finalOffer.prepayment < batna.prepayment) { penaltyFactor -= 0.15; penaltyReasons.push('預付款要求過低 (Prepayment was too low)'); }
    if (finalOffer.warranty > aiParams.warranty.expect && finalOffer.warranty > batna.warranty) { penaltyFactor -= 0.15; penaltyReasons.push('保修期承諾過長 (Warranty period was excessively long)'); }
    if (finalOffer.obligation > aiParams.obligation.expect && finalOffer.obligation > batna.obligation) { penaltyFactor -= 0.15; penaltyReasons.push('承擔了過多附加義務 (Took on too many obligations)'); }
    
    userSatisfaction *= penaltyFactor;

    return { 
        user: Math.max(0, userSatisfaction).toFixed(1),
        ai: aiSatisfaction,
        penaltyReasons: penaltyReasons
    };
}

function generateReportData(gameState, finalOffer, isSuccess) {
    const { currentRound, gameHistory } = gameState;
    const { aiStyle, aiParams, stats, isPractice } = currentRound;
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], userParams[key].reserve, aiParams[key].reserve); }
    
    const satisfaction = isSuccess ? calculateSatisfactionScores(finalOffer, aiParams, isPractice) : { user: '--', ai: '--', penaltyReasons: [] };

    let updatedGameHistory = [...gameHistory];
    let isGameOver = false;

    if (!isPractice) {
        const currentRoundHistory = {
            styleName: aiStyle.name, en_styleName: aiStyle.en_name,
            isSuccess, satisfaction,
            offersSubmitted: stats.offers, batnaViews: stats.batnaViews,
            irrationalMoves: stats.irrationalMoves,
            finalOffer: isSuccess ? finalOffer : null
        };
        updatedGameHistory = [...gameHistory, currentRoundHistory];
        isGameOver = updatedGameHistory.length >= Object.keys(AI_STYLES).length;
    }
    
    let finalScore = null;
    if (isGameOver) {
        finalScore = calculateFinalScore(updatedGameHistory);
    }

    let smartTipsHTML = `<p><strong>分析 (Analysis):</strong> 您的方案${isSuccess ? '' : '未'}能滿足業主 ${aiStyle.name} (${aiStyle.en_name}) 風格的成交條件。<br>${aiStyle.desc}<br><span class="en-text">${aiStyle.en_desc}</span></p>`;
    if (isSuccess && satisfaction.penaltyReasons.length > 0) {
        smartTipsHTML += `<div class="mt-2 pt-2 border-t border-sky-300">
            <p class="font-bold text-amber-700">警示：您的滿意度被調降，因為您可能做出了 ${satisfaction.penaltyReasons.length} 次過度讓步：</p>
            <p class="en-text text-amber-600">Warning: Your satisfaction score was penalized for ${satisfaction.penaltyReasons.length} potentially excessive concessions:</p>
            <ul class="list-disc list-inside text-amber-700 mt-1">
                ${satisfaction.penaltyReasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        </div>`;
    }

    return {
        isSuccess, isGameOver, isPracticeRoundOver: isPractice, gameHistory: updatedGameHistory, finalScore,
        resultText: isSuccess ? '恭喜！您與業主達成了雙方都能接受的協議。<p class="en-text">Congratulations! You have reached a mutually acceptable agreement with the client.</p>' : '很遺憾，雙方未能達成共識，談判破裂。<p class="en-text">Unfortunately, a consensus was not reached, and the negotiation has failed.</p>',
        aiStyleName: `${aiStyle.name}<p class="en-text">${aiStyle.en_name}</p>`,
        reportTableHTML: Object.keys(userParams).map(key => {
            const param = userParams[key];
            const finalValue = finalOffer[key];
            return `<tr class="border-b">
                <td class="p-3 font-medium">${param.name}<p class="en-text font-normal">${param.en_name}</p></td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalValue.toLocaleString()}${param.unit}</td>
                <td>${param.expect.toLocaleString()}${param.unit}</td><td>${param.reserve.toLocaleString()}${param.unit}</td>
                <td>${aiParams[key].reserve.toLocaleString()}${aiParams[key].unit}</td><td>${aiParams[key].expect.toLocaleString()}${aiParams[key].unit}</td>
            </tr>`;
        }).join(''),
        dealZoneAnalysisHTML: Object.keys(userParams).map(key => {
            const inZopa = finalZopaStatus[key];
            return `<div><span class="font-medium">${userParams[key].name} (${userParams[key].en_name}):</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內 (In ZOPA)' : '未落在成交區間 (Outside ZOPA)'}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>對話輪次 (Rounds): <strong>${stats.offers}</strong> 次</li><li>查看 BATNA (BATNA Views): <strong>${stats.batnaViews}</strong> 次</li>`,
        satisfactionScoresHTML: `<div class="flex justify-between"><span>您的滿意度 (Your Score):</span><span class="font-bold text-lg">${satisfaction.user} / 10</span></div><div class="flex justify-between"><span>業主滿意度 (Client's Score):</span><span class="font-bold text-lg">${satisfaction.ai} / 10</span></div>`,
        smartTipsHTML
    };
}

function calculateFinalScore(gameHistory) {
    let totalScore = 0;
    gameHistory.forEach(round => {
        if (round.isSuccess) {
            totalScore += 10 + parseFloat(round.satisfaction.user);
        }
    });
    return {
        score: totalScore.toFixed(1),
        logic: '總分滿分為 100 分，每輪滿分 20 分。談判成功可獲得 10 分基礎分，並額外加上您的滿意度評分 (最高 10 分)。談判破裂則該輪為 0 分。<p class="en-text">The total score is 100, with a maximum of 20 points per round. A successful deal earns a base of 10 points plus your satisfaction score (up to 10). A failed negotiation scores 0 for the round.</p>'
    };
}

const handleAction = {
    'init': (payload) => {
        let state = payload.token ? decodeState(payload.token) : { gameHistory: [], completedStyles: [] };
        
        if (state.completedStyles.length >= Object.keys(AI_STYLES).length) {
            const finalScore = calculateFinalScore(state.gameHistory);
            return { isGameOver: true, gameHistory: state.gameHistory, finalScore };
        }
        
        const isPractice = !state.gameHistory || state.gameHistory.length === 0 || (payload.token === null && state.completedStyles.length === 0);

        let currentRound;
        let scene;
        let sliderConfig;

        if (isPractice) {
            currentRound = {
                isPractice: true,
                aiStyle: { key: 'fair', ...AI_STYLES['fair'] },
                aiParams: generateDynamicParams('fair', PRACTICE_PARAMS.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
                lastPainPoint: null, consecutivePainPointCount: 0,
            };
            scene = {
                title: '練習輪：辦公室裝修', en_title: 'Practice Round: Office Renovation',
                desc: '您將為一間新創公司的辦公室進行裝修工程。', en_desc: 'You will be renovating the office for a startup company.',
                userParams: PRACTICE_PARAMS.user,
                userBatna: '接受另一個報價 1,300,000 元，工期 50 天的案子。<p class="en-text">Accept another project with a price of 1,300,000 and a 50-day duration.</p>'
            };
            sliderConfig = {
                cost: { min: 1000000, max: 1600000, step: 10000 },
                duration: { min: 30, max: 70, step: 1 },
                warranty: { min: 1, max: 3, step: 1 },
                prepayment: { min: 10, max: 40, step: 1 },
                obligation: { min: 1, max: 3, step: 1 }
            };
             state = { gameHistory: [], completedStyles: [] }; // Reset for official rounds
        } else {
            const availableStyles = Object.keys(AI_STYLES).filter(k => !state.completedStyles.includes(k));
            const randomStyleKey = availableStyles[Math.floor(Math.random() * availableStyles.length)];
            currentRound = {
                isPractice: false,
                aiStyle: { key: randomStyleKey, ...AI_STYLES[randomStyleKey] },
                aiParams: generateDynamicParams(randomStyleKey, BASE_PARAMS.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
                lastPainPoint: null, consecutivePainPointCount: 0,
            };
            scene = {
                title: '正式挑戰：商業綜合體總承包', en_title: 'Official Challenge: General Contractor for a Commercial Complex',
                desc: '您將為一個新的商業綜合體建設項目進行總承包談判。', en_desc: 'You will negotiate the general contract for a new commercial complex project.',
                userParams: BASE_PARAMS.user,
                userBatna: '接受另一個住宅項目合約。<p class="en-text">Accept another residential project contract.</p>'
            };
            sliderConfig = {
                cost: { min: 8500000, max: 11000000, step: 50000 },
                duration: { min: 200, max: 350, step: 5 },
                warranty: { min: 1, max: 5, step: 1 },
                prepayment: { min: 10, max: 30, step: 1 },
                obligation: { min: 1, max: 5, step: 1 }
            };
        }

        state.currentRound = currentRound;
        
        let leakText = '情報顯示 (Intel shows): 業主方 (the Client)...';
        const leakableParams = ['duration', 'warranty', 'prepayment', 'obligation'];
        const shuffledLeaks = leakableParams.sort(() => 0.5 - Math.random());
        const leaksToReveal = shuffledLeaks.slice(0, 1 + Math.floor(Math.random() * 2));
        leaksToReveal.forEach((paramKey, index) => {
            const param = currentRound.aiParams[paramKey];
            const type = Math.random() < 0.5 ? '期望' : '底線';
            const en_type = type === '期望' ? 'expectation' : 'reserve point';
            const value = type === '期望' ? param.expect : param.reserve;
            leakText += `<br>${index > 0 ? '同時' : '對'} <strong>${param.name} (${param.en_name})</strong> 的${type}是 <strong>${value}${param.unit || ''}</strong>. <span class="en-text">(...and their ${en_type} for <strong>${param.en_name}</strong> is <strong>${value}${param.en_unit || ''}</strong>)</span>`;
        });
        
        return {
            isGameOver: false, isPractice, roundNum: state.gameHistory.length + 1,
            scene, sliderConfig,
            aiStyleName: currentRound.aiStyle.name, aiStyleEnName: currentRound.aiStyle.en_name,
            leakedInfoHTML: leakText,
            initialOffer: Object.fromEntries(Object.keys(scene.userParams).map(key => [key, scene.userParams[key].expect])),
            token: encodeState(state)
        };
    },
    'submit': (gameState, payload) => {
        const { offer } = payload;
        if (!offer) throw new Error("缺少 offer 数据 (Missing offer data)");
        gameState.currentRound.stats.offers++;
        const isDeal = checkDealCondition(offer, gameState.currentRound.aiStyle.key, gameState.currentRound.aiParams, gameState.currentRound.isPractice);
        
        if (isDeal) {
            const reportData = generateReportData(gameState, offer, true);
            if (!gameState.currentRound.isPractice) {
                gameState.completedStyles.push(gameState.currentRound.aiStyle.key);
                gameState.gameHistory = reportData.gameHistory;
            }
            return { isDeal: true, reportData, token: encodeState(gameState) };
        } else {
            return { isDeal: false, aiResponseHTML: generateAiResponse(offer, gameState), token: encodeState(gameState) };
        }
    },
    'end': (gameState, payload) => {
        const userParams = gameState.currentRound.isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
        const finalOffer = payload.offer || Object.fromEntries(Object.keys(userParams).map(key => [key, userParams[key].expect]));
        const reportData = generateReportData(gameState, finalOffer, false);
        if (!gameState.currentRound.isPractice) {
            gameState.completedStyles.push(gameState.currentRound.aiStyle.key);
            gameState.gameHistory = reportData.gameHistory;
        }
        return { reportData, token: encodeState(gameState) };
    },
    'viewBatna': (gameState) => {
        gameState.currentRound.stats.batnaViews++;
        return { token: encodeState(gameState) };
    },
    'irrationalMove': (gameState) => {
        gameState.currentRound.stats.irrationalMoves++;
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

