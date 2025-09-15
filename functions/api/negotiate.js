// --- 核心设定 (Core Settings) ---

// --- 練習輪：小組報告分工 (Practice Round: Group Project) ---
const PRACTICE_PARAMS = {
    user: {
        dataCollection: { expect: 40, reserve: 60, name: '我方資料搜集比例', en_name: 'My Data Collection %', unit: '%' },
        slides:         { expect: 40, reserve: 70, name: '我方簡報製作比例', en_name: 'My Slides Production %', unit: '%' },
        writing:        { expect: 40, reserve: 70, name: '我方報告撰寫比例', en_name: 'My Report Writing %', unit: '%' },
        presentation:   { expect: 8,  reserve: 12, name: '我方報告時長(分)', en_name: 'My Presentation Time (min)', unit: ' min' },
        leadership:     { expect: 2,  reserve: 3,  name: '我方領導責任', en_name: 'My Leadership Role', unit: '', format: 'level', levels: { 1: { name: '組員', en_name: 'Member'}, 2: { name: '共同負責', en_name: 'Co-lead'}, 3: { name: '組長', en_name: 'Lead'} } }
    },
    ai: {
        dataCollection: { expect: 70, reserve: 50 },
        slides:         { expect: 80, reserve: 50 },
        writing:        { expect: 80, reserve: 50 },
        presentation:   { expect: 15, reserve: 10 },
        leadership:     { expect: 3,  reserve: 2  }
    }
};
const PRACTICE_USER_BATNA = { dataCollection: 50, slides: 50, writing: 50, presentation: 10, leadership: 2 };
const PRACTICE_BATNA_HTML = `<p class="font-bold">您的最佳替代方案是與另一位可靠的同學合作，你們同意公平分工：</p><p class="en-text">Your best alternative is to work with another reliable student, with whom you agree to a fair division of labor:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>各項工作貢獻 (Work Contribution for all items):</strong> 50%</li><li><strong>報告時長 (Presentation Time):</strong> 10 分鐘</li><li><strong>領導責任 (Leadership):</strong> 共同負責 (Co-lead)</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">如果現在的組員提出的分工比這還差，您應該考慮退出，即使可能影響成績。<br><span class="text-amber-700">If the current offer is worse than this, you should consider leaving the group, despite the potential impact on your grade.</span></p>`;


// --- 正式挑戰：實習 Offer (Official Challenge: Internship Offer) ---
const BASE_PARAMS = {
    user: {
        salary:     { expect: 8000, reserve: 5000, name: '實習月薪', en_name: 'Monthly Salary', unit: ' 元', format: 'currency' },
        duration:   { expect: 8,    reserve: 12,   name: '實習時長', en_name: 'Internship Duration', unit: ' 週 (Weeks)' },
        stipend:    { expect: 1500, reserve: 500,  name: '住房補貼', en_name: 'Housing Stipend', unit: ' 元/月', format: 'currency' },
        autonomy:   { expect: 4,    reserve: 2,    name: '專案主導權', en_name: 'Project Autonomy', unit: '', format: 'level', levels: { 1: { name: '輔助', en_name: 'Support'}, 2: { name: '參與', en_name: 'Participant'}, 3: { name: '負責模塊', en_name: 'Module Owner'}, 4: { name: '擁有決策權', en_name: 'Decision-maker'}, 5: { name: '領導子專案', en_name: 'Sub-project Lead'} } },
        mentorship: { expect: 4,    reserve: 2,    name: '導師等級', en_name: 'Mentorship Level', unit: '', format: 'level', levels: { 1: { name: '無', en_name: 'None'}, 2: { name: '組內提問', en_name: 'Team Q&A'}, 3: { name: '指定導師', en_name: 'Assigned Mentor'}, 4: { name: '總監級指導', en_name: 'Director-level'}, 5: { name: '一對一指導', en_name: '1-on-1 Mentoring'} } }
    },
    ai: {
        salary:     { expect: 4000, reserve: 6500 },
        duration:   { expect: 16,   reserve: 10   },
        stipend:    { expect: 0,    reserve: 1000 },
        autonomy:   { expect: 1,    reserve: 3    },
        mentorship: { expect: 1,    reserve: 3    }
    }
};
const USER_BATNA = { salary: 6000, duration: 10, stipend: 800, autonomy: 3, mentorship: 2 };
const OFFICIAL_BATNA_HTML = `<p class="font-bold">您的最佳替代方案是接受另一家公司的 Offer，其待遇可量化為：</p><p class="en-text">Your best alternative is another company's offer, quantifiable as:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>月薪 (Salary):</strong> 6,000 元</li><li><strong>實習時長 (Duration):</strong> 10 週</li><li><strong>住房補貼 (Stipend):</strong> 800 元/月</li><li><strong>專案主導權 (Autonomy):</strong> 等級 3 (負責模塊 / Module Owner)</li><li><strong>導師等級 (Mentorship):</strong> 等級 2 (組內提問 / Team Q&A)</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">當前談判的條件若劣於此方案，您應當選擇放棄。<br><span class="text-amber-700">If the current negotiation terms are worse than this alternative, you should walk away.</span></p>`;
const AUTONOMY_DEFS = { 
    1: '輔助角色：主要負責執行團隊分配的具體、明確的任務。<p class="en-text">Support Role: Mainly responsible for executing specific, clear tasks assigned by the team.</p>', 
    2: '正式參與：作為團隊一員參與專案，可以提出建議，但無決策權。<p class="en-text">Participant: Participate as a team member, can make suggestions but has no decision-making power.</p>', 
    3: '負責模塊：獨立負責專案中的一個小模塊或功能。<p class="en-text">Module Owner: Independently responsible for a small module or feature within the project.</p>', 
    4: '擁有決策權：在自己負責的模塊內，擁有一定的技術或執行決策權。<p class="en-text">Decision-maker: Have a certain degree of technical or implementation decision-making power within your responsible module.</p>', 
    5: '領導子專案：主導一個小型內部專案或大型專案的子方向。<p class="en-text">Sub-project Lead: Lead a small internal project or a sub-direction of a larger project.</p>'
};


// --- 通用設定 (Universal Settings) ---
const AI_STYLES = {
    tough:       { name: '強悍型',       en_name: 'Tough',         desc: 'HR 尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR seeks a perfect match. Deal Condition: All 5 negotiation items must fall within the ZOPA.' },
    horseTrader: { name: '交換型',       en_name: 'Horse-Trader',  desc: 'HR 注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR focuses on majority consensus. Deal Condition: At least 4 negotiation items must fall within the ZOPA.' },
    fair:        { name: '公平型',       en_name: 'Fair',          desc: 'HR 尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR seeks an overall balance. Deal Condition: At least 3 negotiation items must fall within the ZOPA.' },
    key:         { name: '關鍵變量型',   en_name: 'Key-Variable',  desc: 'HR 對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「實習月薪」和「實習時長」。', en_desc: 'The HR is uncompromising on core interests. Deal Condition: At least 3 items in ZOPA, which must include Salary and Duration.' },
    accommodating: { name: '隨和型',     en_name: 'Accommodating', desc: 'HR 態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR is open and easy to deal with. Deal Condition: At least 2 negotiation items must fall within the ZOPA.' }
};

// --- 辅助函数 (Helper Functions) ---
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
        if (param.reserve > param.expect) { // AI wants higher value (e.g. user contribution), more flexibility means lower reserve
            param.reserve = Math.round((param.expect + newRange) / (key === 'salary' ? 100 : 1)) * (key === 'salary' ? 100 : 1);
        } else { // AI wants lower value (e.g. salary), more flexibility means higher reserve
             param.reserve = Math.round(param.expect - newRange);
        }
    }
    return newAiParams;
}

function isWithinZOPA(key, value, userParams, aiParams) {
    const userReserve = userParams[key].reserve;
    const aiReserve = aiParams[key].reserve;
    // If user's expectation is higher than their reserve, it means higher is better for user.
    if (userParams[key].expect > userReserve) { 
        return value >= userReserve && value <= aiReserve;
    } 
    // Otherwise, lower is better for user.
    else { 
        return value <= userReserve && value >= aiReserve;
    }
}

function checkDealCondition(offer, aiStyleKey, gameState) {
    const { aiParams, isPractice } = gameState.currentRound;
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
    
    const zopaStatus = {};
    for (const key in offer) { zopaStatus[key] = isWithinZOPA(key, offer[key], userParams, aiParams); }
    const zopaCount = Object.values(zopaStatus).filter(Boolean).length;
    
    switch (aiStyleKey) {
        case 'tough': return zopaCount >= 5;
        case 'horseTrader': return zopaCount >= 4;
        case 'fair': return zopaCount >= 3;
        case 'key': return zopaCount >= 3 && zopaStatus.salary && zopaStatus.duration;
        case 'accommodating': return zopaCount >= 2;
        default: return false;
    }
}

function generateAiResponse(offer, gameState) {
    const { aiParams, isPractice } = gameState.currentRound;
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;

    const painPoints = [];
    for (const key in offer) {
        if (!isWithinZOPA(key, offer[key], userParams, aiParams)) {
            painPoints.push({ key, userValue: offer[key] });
        }
    }

    if (painPoints.length === 0) { 
        return isPractice 
            ? `嗯，你提的這個分工方案我看了一下，感覺可以接受，那我們就這麼定了？<p class="en-text">Hmm, I looked at the work distribution plan you proposed. It seems acceptable. Should we finalize it?</p>`
            : `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下，才能完全同意。<p class="en-text">This offer shows sincerity, and we are getting close to a consensus. However, I need to re-evaluate the overall benefits for our side before I can fully agree.</p>`; 
    }
    
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const param = userParams[mainPainPoint.key];
    const { name, en_name } = param;

    if (gameState.currentRound.lastPainPoint === mainPainPoint.key) { gameState.currentRound.consecutivePainPointCount++; } 
    else { gameState.currentRound.lastPainPoint = mainPainPoint.key; gameState.currentRound.consecutivePainPointCount = 1; }
    
    const practiceResponses = {
        default: [ 
            `關於<strong>${name}</strong>，我覺得 ${mainPainPoint.userValue}${param.unit || ''} 對我來說有點困難，我這學期課業壓力比較大。<p class="en-text">Regarding the <strong>${en_name}</strong>, I feel that ${mainPainPoint.userValue}${param.unit || ''} is a bit difficult for me. I have a heavy workload this semester.</p>`, 
            `我不太擅長<strong>${name}</strong>這部分耶，你這邊能多承擔一些嗎？<p class="en-text">I'm not very good at the <strong>${en_name}</strong> part. Could you take on a bit more of that?</p>`
        ]
    };

    const officialResponses = {
        salary: [ `關於<strong>${name}</strong>，${mainPainPoint.userValue.toLocaleString()} 元超出了我們這個職位的預算標準。<p class="en-text">Regarding the <strong>${en_name}</strong>, ${mainPainPoint.userValue.toLocaleString()} exceeds our budget for this position.</p>` ],
        duration: [ `在<strong>${name}</strong>方面，${mainPainPoint.userValue} 週的時間對我們來說太短了，我們希望實習生能更完整地參與專案。<p class="en-text">As for the <strong>${en_name}</strong>, a duration of ${mainPainPoint.userValue} weeks is too short for us; we hope interns can participate more fully in the project.</p>` ],
        default: [ `我們注意到在<strong>${name}</strong>這項，您提出的條件與我司的標準做法有一定距離。<p class="en-text">We've noted that on <strong>${en_name}</strong>, your proposed term is some distance from our company's standard practice.</p>` ]
    };

    if (gameState.currentRound.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${name}</strong>上卡關了。這個條件對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？<p class="en-text">It seems we're stuck on the <strong>${en_name}</strong>. This term is a real obstacle for us. Could you perhaps make a concession elsewhere to balance it out?</p>`;
    }
    
    const responseSet = isPractice ? practiceResponses.default : (officialResponses[mainPainPoint.key] || officialResponses.default);
    return responseSet[Math.floor(Math.random() * responseSet.length)];
}

function calculateSatisfactionScores(finalOffer, isPractice) {
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
    const batna = isPractice ? PRACTICE_USER_BATNA : USER_BATNA;

    let userSatisfaction = 10.0;
    const penaltyReasons = [];
    
    // Generic function to check for over-concession
    const checkOverConcession = (key, offerValue, batnaValue, isHigherBetter, reason) => {
        if (isHigherBetter && offerValue < batnaValue) { userSatisfaction -= 1.5; penaltyReasons.push(reason); }
        if (!isHigherBetter && offerValue > batnaValue) { userSatisfaction -= 1.5; penaltyReasons.push(reason); }
    };
    
    if (isPractice) {
        checkOverConcession('dataCollection', finalOffer.dataCollection, batna.dataCollection, false, '承擔了過多資料搜集工作 (Took on too much data collection)');
        checkOverConcession('slides', finalOffer.slides, batna.slides, false, '承擔了過多簡報製作 (Did too much of the slide production)');
        checkOverConcession('writing', finalOffer.writing, batna.writing, false, '承擔了過多報告撰寫 (Wrote too much of the report)');
    } else {
        checkOverConcession('salary', finalOffer.salary, batna.salary, true, '接受的薪資低於備選 Offer (Accepted a salary lower than your alternative offer)');
        checkOverConcession('duration', finalOffer.duration, batna.duration, false, '接受的實習時長長於備選 Offer (Accepted a longer internship than your alternative)');
        checkOverConcession('stipend', finalOffer.stipend, batna.stipend, true, '接受的補貼低於備選 Offer (Accepted a lower stipend than your alternative)');
        checkOverConcession('autonomy', finalOffer.autonomy, batna.autonomy, true, '接受的專案主導權低於備選 Offer (Accepted less project autonomy than your alternative)');
    }
    
    // Simple AI score based on how close the offer is to their expectation
    let aiSatisfaction = 0;
    const aiParams = isPractice ? PRACTICE_PARAMS.ai : BASE_PARAMS.ai;
    for (const key in finalOffer) {
        const aiExpect = aiParams[key].expect;
        const aiReserve = aiParams[key].reserve;
        const range = Math.abs(aiExpect - aiReserve);
        const progress = Math.abs(finalOffer[key] - aiReserve);
        aiSatisfaction += (progress / range) * 2; // Each param worth 2 points
    }

    return { 
        user: Math.max(0, userSatisfaction).toFixed(1),
        ai: Math.min(10, aiSatisfaction).toFixed(1),
        penaltyReasons
    };
}

function generateReportData(gameState, finalOffer, isSuccess) {
    const { currentRound, gameHistory } = gameState;
    const { aiStyle, aiParams, stats, isPractice } = currentRound;
    const userParams = isPractice ? PRACTICE_PARAMS.user : BASE_PARAMS.user;
    
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], userParams, aiParams); }
    
    const satisfaction = isSuccess ? calculateSatisfactionScores(finalOffer, isPractice) : { user: '--', ai: '--', penaltyReasons: [] };

    let updatedGameHistory = [...gameHistory];
    let isGameOver = false;

    if (!isPractice) {
        const finalOfferHTML = Object.entries(finalOffer).map(([key, value]) => {
            const param = userParams[key];
            return `${param.name}: ${value.toLocaleString()}${param.unit || ''}<br><span class="en-text">${param.en_name}: ${value.toLocaleString()}${param.unit || ''}</span>`;
        }).join('<br>');

        const currentRoundHistory = {
            styleName: aiStyle.name, en_styleName: aiStyle.en_name,
            isSuccess, satisfaction,
            offersSubmitted: stats.offers, batnaViews: stats.batnaViews,
            irrationalMoves: stats.irrationalMoves,
            finalOfferHTML: isSuccess ? finalOfferHTML : null,
        };
        updatedGameHistory = [...gameHistory, currentRoundHistory];
        isGameOver = updatedGameHistory.length >= Object.keys(AI_STYLES).length;
    }
    
    let finalScore = null;
    if (isGameOver) { finalScore = calculateFinalScore(updatedGameHistory); }

    let smartTipsHTML = `<p><strong>分析 (Analysis):</strong> 您的方案${isSuccess ? '' : '未'}能滿足對方 ${aiStyle.name} (${aiStyle.en_name}) 風格的成交條件。<br>${aiStyle.desc}<br><span class="en-text">${aiStyle.en_desc}</span></p>`;
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
        resultText: isSuccess ? '恭喜！你們達成了共識。<p class="en-text">Congratulations! You have reached an agreement.</p>' : '很遺憾，雙方未能達成共識，談判破裂。<p class="en-text">Unfortunately, a consensus was not reached, and the negotiation has failed.</p>',
        aiStyleName: `${aiStyle.name}<p class="en-text">${aiStyle.en_name}</p>`,
        reportTableHTML: Object.keys(userParams).map(key => {
            const param = userParams[key];
            const finalValue = finalOffer[key];
            return `<tr class="border-b">
                <td class="p-3 font-medium">${param.name}<p class="en-text font-normal">${param.en_name}</p></td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalValue.toLocaleString()}${param.unit || ''}</td>
                <td>${userParams[key].expect.toLocaleString()}${param.unit || ''}</td><td>${userParams[key].reserve.toLocaleString()}${param.unit || ''}</td>
                <td>${aiParams[key].reserve.toLocaleString()}${param.unit || ''}</td><td>${aiParams[key].expect.toLocaleString()}${param.unit || ''}</td>
            </tr>`;
        }).join(''),
        dealZoneAnalysisHTML: Object.keys(userParams).map(key => {
            const inZopa = finalZopaStatus[key];
            return `<div><span class="font-medium">${userParams[key].name} (${userParams[key].en_name}):</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內 (In ZOPA)' : '未落在成交區間 (Outside ZOPA)'}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>對話輪次 (Rounds): <strong>${stats.offers}</strong> 次</li><li>查看 BATNA (BATNA Views): <strong>${stats.batnaViews}</strong> 次</li><li>非理性思考 (Irrational Moves): <strong>${stats.irrationalMoves}</strong> 次</li>`,
        satisfactionScoresHTML: `<div class="flex justify-between"><span>您的滿意度 (Your Score):</span><span class="font-bold text-lg">${satisfaction.user} / 10</span></div><div class="flex justify-between"><span>對方滿意度 (Opponent's Score):</span><span class="font-bold text-lg">${satisfaction.ai} / 10</span></div>`,
        smartTipsHTML
    };
}

function calculateFinalScore(gameHistory) {
    let totalScore = 0;
    gameHistory.forEach(round => { if (round.isSuccess) { totalScore += 10 + parseFloat(round.satisfaction.user); }});
    return {
        score: totalScore.toFixed(1),
        logic: '總分滿分為 100 分，每輪滿分 20 分。談判成功可獲得 10 分基礎分，並額外加上您的滿意度評分 (最高 10 分)。談判破裂則該輪為 0 分。<p class="en-text">The total score is 100, with a maximum of 20 points per round. A successful deal earns a base of 10 points plus your satisfaction score (up to 10). A failed negotiation scores 0 for the round.</p>'
    };
}

const handleAction = {
    'init': (payload) => {
        let state = payload.token ? decodeState(payload.token) : { gameHistory: [], completedStyles: [] };
        
        if (!state.isPracticeComplete) {
            // Practice Round
            const currentRound = {
                isPractice: true,
                aiStyle: { key: 'fair', ...AI_STYLES['fair'] },
                aiParams: generateDynamicParams('fair', PRACTICE_PARAMS.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
                lastPainPoint: null, consecutivePainPointCount: 0,
            };
            const scene = {
                title: '練習輪：小組報告分工', en_title: 'Practice Round: Group Project',
                desc: '你正在與一位（AI扮演的）傳說中的「搭便車」組員協商課程報告的分工。你們需要就工作量和責任達成共識。', 
                en_desc: 'You are negotiating the division of labor for a course report with a legendary "freerider" groupmate (played by an AI). You need to reach a consensus on workload and responsibilities.',
                userParams: PRACTICE_PARAMS.user,
                userBatnaHTML: PRACTICE_BATNA_HTML,
                aiOpponent: { name: '組員 (AI) 回應', en_name: 'Groupmate (AI) Response' }
            };
            const sliderConfig = {
                dataCollection: { min: 20, max: 80, step: 5 },
                slides:         { min: 20, max: 80, step: 5 },
                writing:        { min: 20, max: 80, step: 5 },
                presentation:   { min: 5,  max: 15, step: 1 },
                leadership:     { min: 1,  max: 3,  step: 1 }
            };
            state.currentRound = currentRound;
            return {
                isGameOver: false, isPractice: true, roundNum: 1,
                scene, sliderConfig, obligationDefs: {},
                aiStyleName: '搭便車型 (Freerider)', aiStyleEnName: 'Freerider',
                leakedInfoHTML: '你聽說這位組員向來不喜歡負責，只想輕鬆拿學分。<p class="en-text">You\'ve heard this groupmate dislikes responsibility and just wants an easy grade.</p>',
                initialOffer: Object.fromEntries(Object.keys(scene.userParams).map(key => [key, scene.userParams[key].expect])),
                token: encodeState(state)
            };
        }

        if (state.completedStyles.length >= Object.keys(AI_STYLES).length) {
            return { isGameOver: true, gameHistory: state.gameHistory, finalScore: calculateFinalScore(state.gameHistory) };
        }
        
        const availableStyles = Object.keys(AI_STYLES).filter(k => !state.completedStyles.includes(k));
        const randomStyleKey = availableStyles[Math.floor(Math.random() * availableStyles.length)];
        
        const currentRound = {
            isPractice: false,
            aiStyle: { key: randomStyleKey, ...AI_STYLES[randomStyleKey] },
            aiParams: generateDynamicParams(randomStyleKey, BASE_PARAMS.ai),
            stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 },
            lastPainPoint: null, consecutivePainPointCount: 0,
        };
        const scene = {
            title: '正式挑戰：爭取實習 Offer', en_title: 'Official Challenge: Internship Offer Negotiation',
            desc: '恭喜！你獲得了心儀公司的實習 Offer。現在，你將與 HR 進行最後的細節談判，為自己爭取最佳條件。', 
            en_desc: 'Congratulations! You\'ve received an internship offer from your desired company. Now, you will negotiate the final details with HR to secure the best possible terms.',
            userParams: BASE_PARAMS.user,
            userBatnaHTML: OFFICIAL_BATNA_HTML,
            aiOpponent: { name: 'HR (AI) 回應', en_name: 'HR (AI) Response' }
        };
        const sliderConfig = {
            salary:     { min: 3000, max: 9000, step: 200 },
            duration:   { min: 6, max: 18, step: 1 },
            stipend:    { min: 0, max: 2000, step: 100 },
            autonomy:   { min: 1, max: 5, step: 1 },
            mentorship: { min: 1, max: 5, step: 1 }
        };

        state.currentRound = currentRound;
        
        let leakText = '從學長姐那裡打聽到 (Intel from seniors shows): 這家公司的 HR (the HR)...';
        const leakableParams = ['stipend', 'autonomy', 'mentorship'];
        const leaksToReveal = leakableParams.sort(() => 0.5 - Math.random()).slice(0, 1);
        leaksToReveal.forEach((paramKey) => {
            const param = currentRound.aiParams[paramKey];
            const userParam = BASE_PARAMS.user[paramKey];
            const type = Math.random() < 0.5 ? '期望' : '底線';
            const en_type = type === '期望' ? 'expectation' : 'reserve point';
            const value = type === '期望' ? param.expect : param.reserve;
            leakText += `<br>對 <strong>${userParam.name} (${userParam.en_name})</strong> 的${type}是 <strong>等級 ${value}</strong>. <span class="en-text">(...their ${en_type} for <strong>${userParam.en_name}</strong> is <strong>Level ${value}</strong>)</span>`;
        });
        
        return {
            isGameOver: false, isPractice: false, roundNum: state.gameHistory.length + 1,
            scene, sliderConfig, obligationDefs: AUTONOMY_DEFS,
            aiStyleName: currentRound.aiStyle.name, aiStyleEnName: currentRound.aiStyle.en_name,
            leakedInfoHTML: leakText,
            initialOffer: Object.fromEntries(Object.keys(scene.userParams).map(key => [key, scene.userParams[key].expect])),
            token: encodeState(state)
        };
    },
    'submit': (gameState, payload) => {
        const { offer } = payload;
        if (!offer) throw new Error("Missing offer data");
        gameState.currentRound.stats.offers++;
        const isDeal = checkDealCondition(offer, gameState.currentRound.aiStyle.key, gameState);
        
        if (isDeal) {
            const reportData = generateReportData(gameState, offer, true);
            if (gameState.currentRound.isPractice) {
                gameState.isPracticeComplete = true;
            } else {
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
        if (gameState.currentRound.isPractice) {
            gameState.isPracticeComplete = true;
        } else {
            gameState.completedStyles.push(gameState.currentRound.aiStyle.key);
            gameState.gameHistory = reportData.gameHistory;
        }
        return { reportData, token: encodeState(gameState) };
    },
    'viewBatna': (gameState) => {
        gameState.currentRound.stats.batnaViews++;
        const batnaHTML = gameState.currentRound.isPractice ? PRACTICE_BATNA_HTML : OFFICIAL_BATNA_HTML;
        return { batnaHTML, token: encodeState(gameState) };
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
