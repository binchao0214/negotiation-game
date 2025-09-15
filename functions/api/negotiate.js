// --- 核心设定 (Core Settings) ---
const GAME_THEMES = {
    student: {
        PRACTICE_PARAMS: { /* ... 內容與上一版相同 ... */ },
        PRACTICE_USER_BATNA_HTML: `...`,
        BASE_PARAMS: { /* ... 內容與上一版相同 ... */ },
        OFFICIAL_USER_BATNA_HTML: `...`,
        OBLIGATION_DEFS: { 
            1: '輔助角色：主要負責執行團隊分配的具體、明確的任務。<p class="en-text">Support Role: Mainly responsible for executing specific, clear tasks assigned by the team.</p>', 
            2: '正式參與：作為團隊一員參與專案，可以提出建議，但無決策權。<p class="en-text">Participant: Participate as a team member, can make suggestions but has no decision-making power.</p>', 
            3: '負責模塊：獨立負責專案中的一個小模塊或功能。<p class="en-text">Module Owner: Independently responsible for a small module or feature within the project.</p>', 
            4: '擁有決策權：在自己負責的模塊內，擁有一定的技術或執行決策權。<p class="en-text">Decision-maker: Have a certain degree of technical or implementation decision-making power within your responsible module.</p>', 
            5: '領導子專案：主導一個小型內部專案或大型專案的子方向。<p class="en-text">Sub-project Lead: Lead a small internal project or a sub-direction of a larger project.</p>'
        },
        AI_STYLES: { /* ... 內容與上一版相同 ... */ },
        TEXT_SNIPPETS: {
            practiceSceneTitle: '練習輪：小組報告分工', en_practiceSceneTitle: 'Practice Round: Group Project',
            practiceSceneDesc: '你正在與一位（AI扮演的）傳說中的「搭便車」組員協商課程報告的分工。你們需要就工作量和責任達成共識。',
            en_practiceSceneDesc: 'You are negotiating the division of labor for a course report with a legendary "freerider" groupmate (played by an AI). You need to reach a consensus on workload and responsibilities.',
            officialSceneTitle: '正式挑戰：爭取實習 Offer', en_officialSceneTitle: 'Official Challenge: Internship Offer Negotiation',
            officialSceneDesc: '恭喜！你獲得了心儀公司的實習 Offer。現在，你將與 HR 進行最後的細節談判，為自己爭取最佳條件。',
            en_officialSceneDesc: 'Congratulations! You\'ve received an internship offer from your desired company. Now, you will negotiate the final details with HR to secure the best possible terms.',
            practiceAiOpponentName: '組員 (AI) 回應', en_practiceAiOpponentName: 'Groupmate (AI) Response',
            officialAiOpponentName: 'HR (AI) 回應', en_officialAiOpponentName: 'HR (AI) Response',
            obligationTitle: '專案主導權等級定義', en_obligationTitle: 'Project Autonomy Level Definitions',
            successModalTitle: '達成共識！', en_successModalTitle: 'Agreement Reached!',
            successModalText: '合作愉快！', en_successModalText: 'Pleasure working with you!',
            reportTableHead: '<tr><th class="p-3">參數<p class="en-text font-normal">Parameter</p></th><th class="p-3 text-sky-600">您的最終方案<p class="en-text font-normal">Your Final Offer</p></th><th class="p-3 text-green-600">您的期望<p class="en-text font-normal">Your Expectation</p></th><th class="p-3 text-red-600">您的底線<p class="en-text font-normal">Your Reserve</p></th><th class="p-3 text-red-600">對方底線<p class="en-text font-normal">Opponent\'s Reserve</p></th><th class="p-3 text-green-600">對方期望<p class="en-text font-normal">Opponent\'s Expectation</p></th></tr>',
            finalSummaryTableHead: '<tr><th class="p-3">HR 談判風格<p class="en-text font-normal">Style</p></th><th class="p-3">結果<p class="en-text font-normal">Result</p></th><th class="p-3">Offer 內容<p class="en-text font-normal">Offer Terms</p></th><th class="p-3">對話輪次<p class="en-text font-normal">Rounds</p></th><th class="p-3">BATNA 查看<p class="en-text font-normal">BATNA Views</p></th><th class="p-3">過度讓步<p class="en-text font-normal">Over-concessions</p></th><th class="p-3">非理性思考<p class="en-text font-normal">Irrational Moves</p></th><th class="p-3">您的滿意度<p class="en-text font-normal">Your Score</p></th><th class="p-3">HR 滿意度<p class="en-text font-normal">HR\'s Score</p></th></tr>',
            DISCUSSION_QUESTIONS: `...`
        }
    },
    contractor: {
        PRACTICE_PARAMS: { /* ... 內容與上一版相同 ... */ },
        PRACTICE_USER_BATNA_HTML: `...`,
        BASE_PARAMS: { /* ... 內容與上一版相同 ... */ },
        OFFICIAL_USER_BATNA_HTML: `...`,
        OBLIGATION_DEFS: { 
            1: '配合標準審計流程，提供常規進度報告。<p class="en-text">Cooperate with standard audit procedures, provide regular progress reports.</p>', 
            2: '除標準報告外，需提供額外的專項報告（如環保、安全）。<p class="en-text">In addition to standard reports, provide extra special reports (e.g., environmental, safety).</p>', 
            3: '需承擔與所有由業主直接指定的分包商的協調管理責任。<p class="en-text">Assume coordination and management responsibility for all subcontractors directly appointed by the client.</p>', 
            4: '需承擔因非承包商原因導致的部分設計變更（累計不超過合約價5%）所引發的現場管理成本。<p class="en-text">Bear site management costs for partial design changes (not exceeding 5% of contract value) not caused by the contractor.</p>', 
            5: '需承擔項目範圍內全部未知地質條件、以及因極端天氣導致的工期延誤風險。<p class="en-text">Assume risks for all unknown geological conditions and project delays due to extreme weather.</p>'
        },
        AI_STYLES: { /* ... 內容與上一版相同 ... */ },
        TEXT_SNIPPETS: {
            practiceSceneTitle: '練習輪：辦公室裝修', en_practiceSceneTitle: 'Practice Round: Office Renovation',
            practiceSceneDesc: '您將為一間新創公司的辦公室進行裝修工程。', en_practiceSceneDesc: 'You will be renovating the office for a startup company.',
            officialSceneTitle: '正式挑戰：商業綜合體總承包', en_officialSceneTitle: 'Official Challenge: General Contractor for a Commercial Complex',
            officialSceneDesc: '您將為一個新的商業綜合體建設項目進行總承包談判。', en_officialSceneDesc: 'You will negotiate the general contract for a new commercial complex project.',
            practiceAiOpponentName: '業主 (AI) 回應', en_practiceAiOpponentName: 'Client (AI) Response',
            officialAiOpponentName: '業主 (AI) 回應', en_officialAiOpponentName: 'Client (AI) Response',
            obligationTitle: '附加義務等級定義', en_obligationTitle: 'Obligation Level Definitions',
            successModalTitle: '成交！', en_successModalTitle: 'Deal!',
            successModalText: '這工程有勞你了！', en_successModalText: 'We\'re counting on you for this project!',
            reportTableHead: '<tr><th class="p-3">參數<p class="en-text font-normal">Parameter</p></th><th class="p-3 text-sky-600">您的最終方案<p class="en-text font-normal">Your Final Offer</p></th><th class="p-3 text-green-600">您的期望<p class="en-text font-normal">Your Expectation</p></th><th class="p-3 text-red-600">您的底線<p class="en-text font-normal">Your Reserve</p></th><th class="p-3 text-red-600">業主底線<p class="en-text font-normal">Client\'s Reserve</p></th><th class="p-3 text-green-600">業主期望<p class="en-text font-normal">Client\'s Expectation</p></th></tr>',
            finalSummaryTableHead: '<tr><th class="p-3">談判風格<p class="en-text font-normal">Style</p></th><th class="p-3">結果<p class="en-text font-normal">Result</p></th><th class="p-3">成交方案<p class="en-text font-normal">Deal Terms</p></th><th class="p-3">對話輪次<p class="en-text font-normal">Rounds</p></th><th class="p-3">BATNA 查看<p class="en-text font-normal">BATNA Views</p></th><th class="p-3">過度讓步<p class="en-text font-normal">Over-concessions</p></th><th class="p-3">非理性思考<p class="en-text font-normal">Irrational Moves</p></th><th class="p-3">您的滿意度<p class="en-text font-normal">Your Score</p></th><th class="p-3">業主滿意度<p class="en-text font-normal">Client\'s Score</p></th></tr>',
            DISCUSSION_QUESTIONS: `...`
        }
    }
};

// --- 通用辅助函数 (Universal Helper Functions) ---
// (此處省略 encodeState, decodeState, generateDynamicParams, isWithinZOPA 等通用函式，它們與上一版相同)

// --- 主要遊戲邏輯函式 (Main Game Logic Functions) ---

function checkDealCondition(offer, gameState) { /* ... 邏輯與上一版相同 ... */ }
function generateAiResponse(offer, gameState) { /* ... 邏輯與上一版相同 ... */ }
function calculateSatisfactionScores(finalOffer, gameState) { /* ... 邏輯與上一版相同 ... */ }
function generateReportData(gameState, finalOffer, isSuccess) { /* ... 邏輯與上一版相同 ... */ }
function calculateFinalScore(gameHistory) { /* ... 邏輯與上一版相同 ... */ }


const handleAction = {
    'init': ({ payload, gameState: decodedState }) => {
        const { theme } = payload;
        let gameState = decodedState;

        if (!gameState && theme) {
            gameState = { theme, gameHistory: [], completedStyles: [] };
        } else if (!gameState) {
            return { error: "Invalid state: No token or theme provided." };
        }
        
        const THEME_DATA = GAME_THEMES[gameState.theme];
        // ... 此處省略完整 init 邏輯，與上一版相同
        // 確保 scene 物件包含 obligationTitle 和 obligationDefs
        const scene = {
            // ... 其他 scene 屬性
            obligationTitle: THEME_DATA.TEXT_SNIPPETS.obligationTitle,
            en_obligationTitle: THEME_DATA.TEXT_SNIPPETS.en_obligationTitle,
            obligationDefs: THEME_DATA.OBLIGATION_DEFS,
        };
        // ... 返回完整的物件
    },

    'submit': ({ payload, gameState }) => {
        if (!gameState) return { error: "Invalid game state" };
        const { offer } = payload;
        gameState.currentRound.stats.offers++;
        const isDeal = checkDealCondition(offer, gameState);
        
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
    
    'end': ({ payload, gameState }) => {
        if (!gameState) return { error: "Invalid game state" };
        const THEME_DATA = GAME_THEMES[gameState.theme];
        const userParams = gameState.currentRound.isPractice ? THEME_DATA.PRACTICE_PARAMS.user : THEME_DATA.BASE_PARAMS.user;
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
    
    'viewBatna': ({ gameState }) => {
        if (!gameState) return { error: "Invalid game state" };
        gameState.currentRound.stats.batnaViews++;
        const THEME_DATA = GAME_THEMES[gameState.theme];
        const batnaHTML = gameState.currentRound.isPractice ? THEME_DATA.PRACTICE_USER_BATNA_HTML : THEME_DATA.OFFICIAL_USER_BATNA_HTML;
        return { batnaHTML, token: encodeState(gameState) };
    },
    
    'irrationalMove': ({ gameState }) => {
        if (!gameState) return { error: "Invalid game state" };
        gameState.currentRound.stats.irrationalMoves++;
        return { token: encodeState(gameState) };
    }
};

// 【關鍵修正】: 確保只有一個 `export const onRequest` 函式。
export const onRequest = async ({ request }) => {
    try {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
        }
        const payload = await request.json();
        const { action, token } = payload;

        if (!action || !handleAction[action]) {
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
        }
        
        const gameState = token ? decodeState(token) : null;
        
        // 將 payload 和解析後的 gameState 傳遞給對應的 action 處理器
        const result = handleAction[action]({ payload, gameState });
        
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
    }
};
