// --- 核心设定 (Core Settings) ---
const SCENARIOS = {
    practice: {
        id: 'practice',
        title: '練習輪：辦公室裝修', en_title: 'Practice Round: Office Renovation',
        desc: '您將為一間新創公司的辦公室進行裝修工程。', en_desc: 'You will be renovating the office for a startup company.',
        coolDownMessage: { zh: '想清楚再出牌！合約上的每個字都代表成本。', en: 'Think twice before you make a move! Every word on the contract represents cost.'},
        params: {
            user: { cost: { expect: 1500000, reserve: 1200000, name: '總造價', en_name: 'Total Cost', unit: '元' }, duration: { expect: 60, reserve: 45, name: '工期', en_name: 'Duration', unit: '天' }, warranty: { expect: 1, reserve: 2, name: '保修期', en_name: 'Warranty', unit: '年' }, prepayment: { expect: 30, reserve: 20, name: '預付款', en_name: 'Prepayment', unit: '%' }, obligation: { expect: 1, reserve: 2, name: '附加義務等級', en_name: 'Obligation Level', unit: '' } },
            ai: { cost: { expect: 1100000, reserve: 1400000, name: '總造價', en_name: 'Total Cost' }, duration: { expect: 40, reserve: 55, name: '工期', en_name: 'Duration' }, warranty: { expect: 3, reserve: 1, name: '保修期', en_name: 'Warranty' }, prepayment: { expect: 10, reserve: 25, name: '預付款', en_name: 'Prepayment' }, obligation: { expect: 3, reserve: 1, name: '附加義務等級', en_name: 'Obligation Level' } }
        },
        batna: { text: '接受另一個報價 1,300,000 元，工期 50 天的案子。<p class="en-text">Accept another project with a price of 1,300,000 and a 50-day duration.</p>', values: { cost: 1350000, duration: 50, warranty: 1, prepayment: 20, obligation: 1 } },
        sliderConfig: { cost: { min: 1000000, max: 1600000, step: 10000 }, duration: { min: 30, max: 70, step: 1 }, warranty: { min: 1, max: 3, step: 1 }, prepayment: { min: 10, max: 40, step: 1 }, obligation: { min: 1, max: 3, step: 1 } }
    },
    professional: {
        id: 'professional',
        title: '正式挑戰：商業綜合體總承包', en_title: 'Official Challenge: General Contractor for a Commercial Complex',
        desc: '您將為一個新的商業綜合體建設項目進行總承包談判。', en_desc: 'You will negotiate the general contract for a new commercial complex project.',
        coolDownMessage: { zh: '你家不是開銀行的，請仔細思考後再提出方案！', en: 'Your family doesn\'t own a bank, please think carefully before making an offer!' },
        params: {
            user: { cost: { expect: 10500000, reserve: 9000000, name: '總造價', en_name: 'Total Cost', unit: '元' }, duration: { expect: 330, reserve: 240, name: '工期', en_name: 'Duration', unit: '天' }, warranty: { expect: 1, reserve: 4, name: '保修期', en_name: 'Warranty', unit: '年' }, prepayment: { expect: 25, reserve: 15, name: '預付款', en_name: 'Prepayment', unit: '%' }, obligation: { expect: 1, reserve: 4, name: '附加義務等級', en_name: 'Obligation Level', unit: '' } },
            ai: { cost: { expect: 8500000, reserve: 10000000, name: '總造價' }, duration: { expect: 210, reserve: 270, name: '工期' }, warranty: { expect: 5, reserve: 3, name: '保修期' }, prepayment: { expect: 10, reserve: 20, name: '預付款' }, obligation: { expect: 5, reserve: 3, name: '附加義務等級' } }
        },
        batna: { text: '接受另一個住宅項目合約。<p class="en-text">Accept another residential project contract.</p>', values: { cost: 9500000, duration: 300, warranty: 2, prepayment: 15, obligation: 2 } },
        sliderConfig: { cost: { min: 8500000, max: 11000000, step: 50000 }, duration: { min: 200, max: 350, step: 5 }, warranty: { min: 1, max: 5, step: 1 }, prepayment: { min: 10, max: 30, step: 1 }, obligation: { min: 1, max: 5, step: 1 } },
        discussionQuestions: [
            { zh: '在面對「強悍型」或「關鍵變量型」對手時，你的情緒或決策受到了什麼影響？結合你的總結報告，你認為你的應對策略成功了嗎？如果再有一次機會，你會做什麼不同的嘗試？', en: 'When facing a "Tough" or "Key-Variable" opponent, how were your emotions or decisions affected? Based on your summary report, do you think your coping strategy was successful? If you had another chance, what would you do differently?'},
            { zh: '除了遊戲中的五個變數，回想一個你最近在工作中遇到的（不一定成功）溝通場景。你認為當時是否存在可以進行 Trade-on（價值交換）的潛在機會？如果有的話，會是什麼？', en: 'Besides the five variables in the game, recall a recent communication scenario at work (successful or not). Do you think there were potential opportunities for a Trade-on? If so, what were they?'},
            { zh: '分析總結報告中「您的滿意度」與「業主滿意度」的得分。是否存在某輪談判，你為了追求自身滿意度最大化，而導致對方滿意度過低？這在需要建立長期合作關係的真實商業情境中，可能帶來什麼隱患？', en: 'Analyze the "Your Satisfaction" and "Client\'s Satisfaction" scores in your summary report. Was there a round where maximizing your own satisfaction led to a very low score for the opponent? In real business situations that require long-term relationships, what potential risks might this behavior create?'}
        ]
    },
    student: {
        id: 'student',
        title: '正式挑戰：爭取實習 Offer', en_title: 'Official Challenge: Internship Offer Negotiation',
        desc: '在獲得一家心儀公司的實習 Offer 後，與 HR 就薪資、實習時長、專案內容等進行談判。', en_desc: 'After receiving an internship offer from your dream company, negotiate terms like salary, duration, and project scope with HR.',
        coolDownMessage: { zh: 'HR 的時間很寶貴，想清楚再開口！', en: 'An HR\'s time is precious, think carefully before you speak!' },
        params: {
            user: { cost: { expect: 20000, reserve: 15000, name: '月薪', en_name: 'Monthly Salary', unit: '元' }, duration: { expect: 60, reserve: 90, name: '實習時長', en_name: 'Internship Duration', unit: '天' }, warranty: { expect: 1, reserve: 3, name: '專案類型', en_name: 'Project Type', unit: '' }, prepayment: { expect: 5000, reserve: 0, name: '交通補貼', en_name: 'Commuting Allowance', unit: '元' }, obligation: { expect: 1, reserve: 2, name: '加班頻率', en_name: 'Overtime Frequency', unit: '' } },
            ai: { cost: { expect: 12000, reserve: 18000, name: '月薪' }, duration: { expect: 90, reserve: 60, name: '實習時長' }, warranty: { expect: 3, reserve: 1, name: '專案類型' }, prepayment: { expect: 0, reserve: 3000, name: '交通補貼' }, obligation: { expect: 3, reserve: 1, name: '加班頻率' } }
        },
        batna: { text: '接受另一家公司月薪 16,000，但專案類型普通的 Offer。<p class="en-text">Accept an offer from another company with a 16,000 monthly salary but a less interesting project.</p>', values: { cost: 16000, duration: 90, warranty: 2, prepayment: 0, obligation: 2 } },
        sliderConfig: { cost: { min: 10000, max: 22000, step: 500 }, duration: { min: 50, max: 100, step: 5 }, warranty: { min: 1, max: 3, step: 1 }, prepayment: { min: 0, max: 6000, step: 200 }, obligation: { min: 1, max: 3, step: 1 } },
        discussionQuestions: [
            { zh: '回顧你的總結報告，在哪一輪（或哪一種對手風格）中，你感覺 ZOPA（可能成交區間）最為狹窄？你是如何察覺到這一點的？你當時採取了什麼策略來試圖達成協議？', en: 'Review your summary report. In which round (or against which opponent style) did you feel the ZOPA (Zone of Possible Agreement) was the narrowest? How did you notice this? What strategy did you use to try to reach an agreement?'},
            { zh: '你的 BATNA（最佳替代方案）在整個決策過程中扮演了什麼角色？在哪個時刻，「查看 BATNA」這個動作對你接下來的出價產生了最關鍵的影響？', en: 'What role did your BATNA (Best Alternative to a Negotiated Agreement) play in your decision-making process? At what moment did the action of "viewing your BATNA" have the most critical impact on your subsequent offers?'},
            { zh: '在哪一次成功的談判中，你最有意識地運用了 Trade-on（價值交換）的思維？請具體說明你用哪一項「次要利益」交換了哪一項「核心利益」，從而打破了僵局？', en: 'In which successful negotiation were you most consciously using the concept of a Trade-on? Please specify which "minor interest" you exchanged for which "core interest" to break the deadlock.'}
        ]
    },
    general: {
        id: 'general',
        title: '正式挑戰：親子 3C 使用協議', en_title: 'Official Challenge: Parent-Child Screen Time Agreement',
        desc: '扮演家長，與 AI 扮演的孩子協商使用 3C 產品的規則。', en_desc: 'Play as a parent negotiating screen time rules with your AI child.',
        coolDownMessage: { zh: '不好好想的話，以後孩子就不聽你的了！', en: 'If you don\'t think carefully, your kids won\'t listen to you anymore!' },
        params: {
            user: { cost: { expect: 30, reserve: 60, name: '平日每日時長(分)', en_name: 'Weekday Daily Time (min)', unit: '分' }, duration: { expect: 60, reserve: 120, name: '假日每日時長(分)', en_name: 'Weekend Daily Time (min)', unit: '分' }, warranty: { expect: 1, reserve: 3, name: '可玩遊戲類型(限制級)', en_name: 'Allowed Game Rating', unit: '' }, prepayment: { expect: 30, reserve: 0, name: '獎勵時間(分)', en_name: 'Bonus Time (min)', unit: '分' }, obligation: { expect: 22, reserve: 21, name: '睡前禁用(時間點)', en_name: 'Bedtime Cutoff (Time)', unit: '' } },
            ai: { cost: { expect: 90, reserve: 45, name: '平日每日時長(分)' }, duration: { expect: 180, reserve: 90, name: '假日每日時長(分)' }, warranty: { expect: 3, reserve: 1, name: '可玩遊戲類型(限制級)' }, prepayment: { expect: 60, reserve: 15, name: '獎勵時間(分)' }, obligation: { expect: 20, reserve: 21.5, name: '睡前禁用(時間點)' } }
        },
        batna: { text: '單方面沒收所有設備一週。<p class="en-text">Unilaterally confiscate all devices for one week.</p>', values: { cost: 0, duration: 0, warranty: 1, prepayment: 0, obligation: 24 } },
        sliderConfig: { cost: { min: 20, max: 100, step: 5 }, duration: { min: 50, max: 200, step: 10 }, warranty: { min: 1, max: 3, step: 1 }, prepayment: { min: 0, max: 60, step: 5 }, obligation: { min: 20, max: 23, step: 0.5 } },
        discussionQuestions: [
            { zh: '感受談判的「力量」：回想五輪談判，在哪個瞬間你感覺自己最具主導權？是哪個因素（例如，對方的讓步、你手上的好牌、或是你的 BATNA）給了你這種感覺？', en: 'Feeling the "Power" in Negotiation: Looking back at the five rounds, at what moment did you feel most in control? What factor (e.g., the opponent\'s concession, a strong position on an issue, or your BATNA) gave you that feeling?'},
            { zh: '面對「卡關」的時刻：當你感覺談判陷入僵局，AI 不斷拒絕你的方案時，你腦中最先出現的想法是什麼？你最終是如何打破僵局的，或者，是什麼讓你決定放棄？', en: 'Facing a Deadlock: When you felt the negotiation was deadlocked and the AI kept rejecting your offers, what was the first thought that came to your mind? How did you eventually break the impasse, or what made you decide to walk away?'},
            { zh: '生活中的談判：除了親子溝通，你認為這些概念（有一個「備案」、找到雙方都能接受的「中間地帶」、用「A 換 B」）可以應用在生活的哪個方面？（例如：與朋友規劃活動、與同事協調工作等）', en: 'Negotiations in Everyday Life: Beyond parent-child communication, in what other areas of your life do you think these concepts (having a "backup plan," finding a "middle ground," trading "A for B") can be applied? (e.g., planning activities with friends, coordinating tasks with colleagues, etc.)'}
        ]
    }
};

const AI_STYLES = {
    tough:       { name: '強悍型',       en_name: 'Tough',         desc: '業主尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks a perfect match. Deal Condition: All 5 negotiation items must fall within the ZOPA.' },
    horseTrader: { name: '交換型',       en_name: 'Horse-Trader',  desc: '業主注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client focuses on majority consensus. Deal Condition: At least 4 negotiation items must fall within the ZOPA.' },
    fair:        { name: '公平型',       en_name: 'Fair',          desc: '業主尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks an overall balance. Deal Condition: At least 3 negotiation items must fall within the ZOPA.' },
    key:         { name: '關鍵變量型',   en_name: 'Key-Variable',  desc: '業主對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「總造價」和「工期」。', en_desc: 'The client is uncompromising on core interests. Deal Condition: At least 3 items in ZOPA, which must include Total Cost and Duration.' },
    accommodating: { name: '隨和型',     en_name: 'Accommodating', desc: '業主態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client is open and easy to deal with. Deal Condition: At least 2 negotiation items must fall within the ZOPA.' }
};

// --- Helper Functions ---
function encodeState(state) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { console.error('Encoding failed:', e); return ''; } }
function decodeState(token) { try { return JSON.parse(decodeURIComponent(escape(atob(token)))); } catch (e) { console.error('Decoding failed:', e); return null; } }

function generateDynamicParams(styleKey, baseAiParams) {
    const flexibilityFactors = { tough: 0.4, horseTrader: 0.6, fair: 0.8, key: 0.7, accommodating: 1.0 };
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

function isWithinZOPA(key, value, userParam, aiReserve) {
    if (userParam.expect > userParam.reserve) { // Higher values are better for user
        return value >= userParam.reserve && value <= aiReserve;
    } else { // Lower values are better for user
        return value <= userParam.reserve && value >= aiReserve;
    }
}

function checkDealCondition(offer, aiStyleKey, aiParams, userParams, identity) {
    const zopaStatus = {};
    for (const key in offer) { zopaStatus[key] = isWithinZOPA(key, offer[key], userParams[key], aiParams[key].reserve); }
    const zopaCount = Object.values(zopaStatus).filter(Boolean).length;
    
    let keyItems = ['cost', 'duration']; // Default for professional, student, general
    
    switch (aiStyleKey) {
        case 'tough': return zopaCount >= 5;
        case 'horseTrader': return zopaCount >= 4;
        case 'fair': return zopaCount >= 3;
        case 'key': return zopaCount >= 3 && zopaStatus[keyItems[0]] && zopaStatus[keyItems[1]];
        case 'accommodating': return zopaCount >= 2;
        default: return false;
    }
}

function generateAiResponse(offer, gameState) {
    const { aiParams, isPractice } = gameState.currentRound;
    const userParams = isPractice ? SCENARIOS.practice.params.user : SCENARIOS[gameState.identity].params.user;
    const painPoints = [];
    
    for (const key in offer) {
        const userValue = offer[key];
        const aiReserve = aiParams[key].reserve;
        const aiExpect = aiParams[key].expect;
        let isPainful = false;

        if (aiReserve > aiExpect) { // Higher is worse for AI
            if (userValue > aiReserve) isPainful = true;
        } else { // Lower is worse for AI
            if (userValue < aiReserve) isPainful = true;
        }

        if (isPainful) {
            painPoints.push({ key, userValue });
        }
    }

    if (painPoints.length === 0) { 
        return `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下，才能完全同意。<p class="en-text">This offer shows sincerity, and we are getting close to a consensus. However, I need to re-evaluate the overall benefits for our side.</p>`; 
    }
    
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const param = userParams[mainPainPoint.key];
    const { name, en_name } = param;

    if (gameState.currentRound.lastPainPoint === mainPainPoint.key) { gameState.currentRound.consecutivePainPointCount++; } 
    else { gameState.currentRound.lastPainPoint = mainPainPoint.key; gameState.currentRound.consecutivePainPointCount = 1; }
    
    if (gameState.currentRound.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${name}</strong>上卡關了。這個條件對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？<p class="en-text">It seems we're stuck on the <strong>${en_name}</strong>. This term is a real obstacle for us. Could you perhaps make a concession elsewhere to balance it out?</p>`;
    }
    return `關於<strong>${name}</strong>，您提出的條件與我方立場有一定距離。<p class="en-text">Regarding <strong>${en_name}</strong>, your proposed term is some distance from our position.</p>`;
}

function calculateSatisfactionScores(finalOffer, scene) {
    const RANGES = scene.sliderConfig;
    const userParams = scene.params.user;
    const aiBaseParams = scene.params.ai;
    const batna = scene.batna.values;

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

    let penaltyFactor = 1.0;
    const penaltyReasons = [];
    
    for(const key in finalOffer) {
        const userValue = finalOffer[key];
        const aiExpect = aiBaseParams[key].expect;
        const batnaValue = batna[key];
        let overConceded = false;
        
        // Check if user's offer is better for AI than AI's expectation, AND worse for user than user's BATNA
        if (aiBaseParams[key].reserve > aiExpect) { // Higher is worse for AI -> Lower is better
            if(userValue < aiExpect && userValue < batnaValue) overConceded = true;
        } else { // Lower is worse for AI -> Higher is better
            if(userValue > aiExpect && userValue > batnaValue) overConceded = true;
        }

        if(overConceded){
             penaltyFactor -= 0.15;
             penaltyReasons.push(`${userParams[key].name} (${userParams[key].en_name})`);
        }
    }
    
    userSatisfaction *= penaltyFactor;

    return { 
        user: Math.max(0, userSatisfaction).toFixed(1),
        ai: aiSatisfaction,
        penaltyReasons: penaltyReasons
    };
}

function generateReportData(gameState, finalOffer, isSuccess) {
    const { currentRound, gameHistory } = gameState;
    const { aiStyle, aiParams, isPractice } = currentRound;
    const scene = isPractice ? SCENARIOS.practice : SCENARIOS[gameState.identity];
    const userParams = scene.params.user;
    
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], userParams[key], aiParams[key].reserve); }
    
    const satisfaction = isSuccess ? calculateSatisfactionScores(finalOffer, scene) : { user: '--', ai: '--', penaltyReasons: [] };

    let updatedGameHistory = [...gameHistory];
    let isGameOver = false;

    if (!isPractice) {
        const currentRoundHistory = {
            styleName: aiStyle.name, en_styleName: aiStyle.en_name,
            isSuccess, satisfaction,
            offersSubmitted: currentRound.stats.offers, batnaViews: currentRound.stats.batnaViews,
            irrationalMoves: currentRound.stats.irrationalMoves,
            finalOffer: isSuccess ? finalOffer : null
        };
        updatedGameHistory = [...gameHistory, currentRoundHistory];
        isGameOver = updatedGameHistory.length >= Object.keys(AI_STYLES).length;
    }
    
    let finalScore = null;
    let discussionQuestions = null;
    if (isGameOver) {
        finalScore = calculateFinalScore(updatedGameHistory);
        discussionQuestions = SCENARIOS[gameState.identity].discussionQuestions;
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
        isSuccess, isGameOver, isPracticeRoundOver: isPractice, gameHistory: updatedGameHistory, finalScore, discussionQuestions,
        resultText: isSuccess ? '恭喜！您與業主達成了雙方都能接受的協議。<p class="en-text">Congratulations! You have reached a mutually acceptable agreement with the client.</p>' : '很遺憾，雙方未能達成共識，談判破裂。<p class="en-text">Unfortunately, a consensus was not reached, and the negotiation has failed.</p>',
        aiStyleName: `${aiStyle.name}<p class="en-text">${aiStyle.en_name}</p>`,
        reportTableHTML: Object.keys(userParams).map(key => {
            const param = userParams[key];
            const finalValue = finalOffer[key];
            const unit = param.unit || '';
            return `<tr class="border-b">
                <td class="p-3 font-medium">${param.name}<p class="en-text font-normal">${param.en_name}</p></td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalValue.toLocaleString()}${unit}</td>
                <td>${param.expect.toLocaleString()}${unit}</td><td>${param.reserve.toLocaleString()}${unit}</td>
                <td>${aiParams[key].reserve.toLocaleString()}${unit}</td><td>${aiParams[key].expect.toLocaleString()}${unit}</td>
            </tr>`;
        }).join(''),
        dealZoneAnalysisHTML: Object.keys(userParams).map(key => {
            const inZopa = finalZopaStatus[key];
            return `<div><span class="font-medium">${userParams[key].name} (${userParams[key].en_name}):</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內 (In ZOPA)' : '未落在成交區間 (Outside ZOPA)'}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>對話輪次 (Rounds): <strong>${currentRound.stats.offers}</strong> 次</li><li>查看 BATNA (BATNA Views): <strong>${currentRound.stats.batnaViews}</strong> 次</li>`,
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
        let state = payload.token ? decodeState(payload.token) : { gameHistory: [], completedStyles: [], identity: payload.identity || 'general', isPracticeComplete: false };
        if (payload.identity && !state.identity) {
             state.identity = payload.identity;
        }

        if (state.isPracticeComplete && state.completedStyles.length >= Object.keys(AI_STYLES).length) {
            const finalScore = calculateFinalScore(state.gameHistory);
            return { isGameOver: true, gameHistory: state.gameHistory, finalScore, discussionQuestions: SCENARIOS[state.identity].discussionQuestions };
        }
        
        const isPractice = !state.isPracticeComplete;
        let currentRound, scene, leakText;

        if (isPractice) {
            scene = SCENARIOS.practice;
            currentRound = {
                isPractice: true,
                aiStyle: { key: 'fair', ...AI_STYLES['fair'] },
                aiParams: generateDynamicParams('fair', scene.params.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
                lastPainPoint: null, consecutivePainPointCount: 0,
            };
            leakText = '本次為練習輪，部分資訊已揭露以利您熟悉操作。<p class="en-text">This is a practice round. Some information is revealed to help you get familiar with the controls.</p>';
            state = { gameHistory: [], completedStyles: [], identity: state.identity, isPracticeComplete: false };
        } else {
            scene = SCENARIOS[state.identity];
            const availableStyles = Object.keys(AI_STYLES).filter(k => !state.completedStyles.includes(k));
            const randomStyleKey = availableStyles[Math.floor(Math.random() * availableStyles.length)];
            currentRound = {
                isPractice: false,
                aiStyle: { key: randomStyleKey, ...AI_STYLES[randomStyleKey] },
                aiParams: generateDynamicParams(randomStyleKey, scene.params.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
                lastPainPoint: null, consecutivePainPointCount: 0,
            };
            leakText = '情報顯示 (Intel shows): 業主方 (the Client)...';
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
        }
        
        state.currentRound = currentRound;

        return {
            isGameOver: false, isPractice, roundNum: state.gameHistory.length + 1,
            scene, sliderConfig: scene.sliderConfig, coolDownMessage: scene.coolDownMessage,
            aiStyleName: currentRound.aiStyle.name, aiStyleEnName: currentRound.aiStyle.en_name,
            leakedInfoHTML: leakText,
            initialOffer: Object.fromEntries(Object.keys(scene.params.user).map(key => [key, scene.params.user[key].expect])),
            token: encodeState(state)
        };
    },
    'submit': (gameState, payload) => {
        const { offer } = payload;
        if (!offer) throw new Error("缺少 offer 数据 (Missing offer data)");
        gameState.currentRound.stats.offers++;
        const userParams = gameState.currentRound.isPractice ? SCENARIOS.practice.params.user : SCENARIOS[gameState.identity].params.user;
        const isDeal = checkDealCondition(offer, gameState.currentRound.aiStyle.key, gameState.currentRound.aiParams, userParams, gameState.identity);
        
        if (isDeal) {
            const reportData = generateReportData(gameState, offer, true);
            if (gameState.currentRound.isPractice) {
                gameState.isPracticeComplete = true;
            } else {
                gameState.completedStyles.push(gameState.currentRound.aiStyle.key);
            }
            gameState.gameHistory = reportData.gameHistory;
            return { isDeal: true, reportData, token: encodeState(gameState) };
        } else {
            return { isDeal: false, aiResponseHTML: generateAiResponse(offer, gameState), token: encodeState(gameState) };
        }
    },
    'end': (gameState, payload) => {
        const scene = gameState.currentRound.isPractice ? SCENARIOS.practice : SCENARIOS[gameState.identity];
        const finalOffer = payload.offer || Object.fromEntries(Object.keys(scene.params.user).map(key => [key, scene.params.user[key].expect]));
        const reportData = generateReportData(gameState, finalOffer, false);
        if (gameState.currentRound.isPractice) {
            gameState.isPracticeComplete = true;
        } else {
            gameState.completedStyles.push(gameState.currentRound.aiStyle.key);
        }
        gameState.gameHistory = reportData.gameHistory;
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

