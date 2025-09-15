// --- 核心设定 (Core Settings) ---
const GAME_THEMES = {
    student: {
        PRACTICE_PARAMS: {
            user: {
                dataCollection: { expect: 40, reserve: 60, name: '我方資料搜集比例', en_name: 'My Data Collection %', unit: '%' , format: 'percent' },
                slides:         { expect: 40, reserve: 70, name: '我方簡報製作比例', en_name: 'My Slides Production %', unit: '%', format: 'percent' },
                writing:        { expect: 40, reserve: 70, name: '我方報告撰寫比例', en_name: 'My Report Writing %', unit: '%' , format: 'percent'},
                presentation:   { expect: 8,  reserve: 12, name: '我方報告時長(分)', en_name: 'My Presentation Time (min)', unit: ' min' },
                leadership:     { expect: 2,  reserve: 3,  name: '我方領導責任', en_name: 'My Leadership Role', unit: '', format: 'level', levels: { 1: { name: '組員', en_name: 'Member'}, 2: { name: '共同負責', en_name: 'Co-lead'}, 3: { name: '組長', en_name: 'Lead'} } }
            },
            ai: { dataCollection: { expect: 70, reserve: 50 }, slides: { expect: 80, reserve: 50 }, writing: { expect: 80, reserve: 50 }, presentation:   { expect: 15, reserve: 10 }, leadership: { expect: 3,  reserve: 2  } }
        },
        PRACTICE_USER_BATNA: { dataCollection: 50, slides: 50, writing: 50, presentation: 10, leadership: 2 },
        PRACTICE_USER_BATNA_HTML: `<p class="font-bold">您的最佳替代方案是與另一位可靠的同學合作，你們同意公平分工：</p><p class="en-text">Your best alternative is to work with another reliable student, with whom you agree to a fair division of labor:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>各項工作貢獻 (Work Contribution for all items):</strong> 50%</li><li><strong>報告時長 (Presentation Time):</strong> 10 分鐘</li><li><strong>領導責任 (Leadership):</strong> 共同負責 (Co-lead)</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">如果現在的組員提出的分工比這還差，您應該考慮退出，即使可能影響成績。<br><span class="text-amber-700">If the current offer is worse than this, you should consider leaving the group, despite the potential impact on your grade.</span></p>`,
        BASE_PARAMS: {
            user: {
                salary:     { expect: 8000, reserve: 5000, name: '實習月薪', en_name: 'Monthly Salary', unit: ' 元', format: 'currency' },
                duration:   { expect: 8,    reserve: 12,   name: '實習時長', en_name: 'Internship Duration', unit: ' 週', unit_en: ' Weeks' },
                stipend:    { expect: 1500, reserve: 500,  name: '住房補貼', en_name: 'Housing Stipend', unit: ' 元/月', format: 'currency' },
                autonomy:   { expect: 4,    reserve: 2,    name: '專案主導權', en_name: 'Project Autonomy', unit: '', format: 'level', levels: { 1: { name: '輔助', en_name: 'Support'}, 2: { name: '參與', en_name: 'Participant'}, 3: { name: '負責模塊', en_name: 'Module Owner'}, 4: { name: '擁有決策權', en_name: 'Decision-maker'}, 5: { name: '領導子專案', en_name: 'Sub-project Lead'} } },
                mentorship: { expect: 4,    reserve: 2,    name: '導師等級', en_name: 'Mentorship Level', unit: '', format: 'level', levels: { 1: { name: '無', en_name: 'None'}, 2: { name: '組內提問', en_name: 'Team Q&A'}, 3: { name: '指定導師', en_name: 'Assigned Mentor'}, 4: { name: '總監級指導', en_name: 'Director-level'}, 5: { name: '一對一指導', en_name: '1-on-1 Mentoring'} } }
            },
            ai: { salary: { expect: 4000, reserve: 6500 }, duration:   { expect: 16,   reserve: 10   }, stipend:    { expect: 0,    reserve: 1000 }, autonomy:   { expect: 1,    reserve: 3    }, mentorship: { expect: 1,    reserve: 3    } }
        },
        USER_BATNA: { salary: 6000, duration: 10, stipend: 800, autonomy: 3, mentorship: 2 },
        OFFICIAL_USER_BATNA_HTML: `<p class="font-bold">您的最佳替代方案是接受另一家公司的 Offer，其待遇可量化為：</p><p class="en-text">Your best alternative is another company's offer, quantifiable as:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>月薪 (Salary):</strong> 6,000 元</li><li><strong>實習時長 (Duration):</strong> 10 週</li><li><strong>住房補貼 (Stipend):</strong> 800 元/月</li><li><strong>專案主導權 (Autonomy):</strong> 等級 3 (負責模塊 / Module Owner)</li><li><strong>導師等級 (Mentorship):</strong> 等級 2 (組內提問 / Team Q&A)</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">當前談判的條件若劣於此方案，您應當選擇放棄。<br><span class="text-amber-700">If the current negotiation terms are worse than this alternative, you should walk away.</span></p>`,
        OBLIGATION_DEFS: { 
            1: '輔助角色：主要負責執行團隊分配的具體、明確的任務。<p class="en-text">Support Role: Mainly responsible for executing specific, clear tasks assigned by the team.</p>', 
            2: '正式參與：作為團隊一員參與專案，可以提出建議，但無決策權。<p class="en-text">Participant: Participate as a team member, can make suggestions but has no decision-making power.</p>', 
            3: '負責模塊：獨立負責專案中的一個小模塊或功能。<p class="en-text">Module Owner: Independently responsible for a small module or feature within the project.</p>', 
            4: '擁有決策權：在自己負責的模塊內，擁有一定的技術或執行決策權。<p class="en-text">Decision-maker: Have a certain degree of technical or implementation decision-making power within your responsible module.</p>', 
            5: '領導子專案：主導一個小型內部專案或大型專案的子方向。<p class="en-text">Sub-project Lead: Lead a small internal project or a sub-direction of a larger project.</p>'
        },
        AI_STYLES: {
            tough:       { name: '強悍型', en_name: 'Tough', desc: 'HR 尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR seeks a perfect match. Deal Condition: All 5 negotiation items must fall within the ZOPA.' },
            horseTrader: { name: '交換型', en_name: 'Horse-Trader', desc: 'HR 注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR focuses on majority consensus. Deal Condition: At least 4 negotiation items must fall within the ZOPA.' },
            fair:        { name: '公平型', en_name: 'Fair', desc: 'HR 尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR seeks an overall balance. Deal Condition: At least 3 negotiation items must fall within the ZOPA.' },
            key:         { name: '關鍵變量型', en_name: 'Key-Variable', desc: 'HR 對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「實習月薪」和「實習時長」。', en_desc: 'The HR is uncompromising on core interests. Deal Condition: At least 3 items in ZOPA, which must include Salary and Duration.' },
            accommodating: { name: '隨和型', en_name: 'Accommodating', desc: 'HR 態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The HR is open and easy to deal with. Deal Condition: At least 2 negotiation items must fall within the ZOPA.' }
        },
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
            DISCUSSION_QUESTIONS: `
                <h4><span class="text-sky-600">共性思維</span>：概念複習</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>無論在哪种情境，「最佳替代方案」(BATNA) 都至关重要。请问你的 BATNA 在哪一轮谈判中对你的帮助最大？它是如何让你更有底气地坚持立场或放弃谈判的？</li>
                    <li>「可能成交区间」(ZOPA) 是双方底线的交集。有没有哪一轮你感觉 ZOPA 特别狭窄？你是如何通过「价值交换」(Trade-on)，比如用自己不太在意的项目去换取核心利益，从而成功创造出 ZOPA 的？</li>
                </ol>
                <h4 class="mt-4"><span class="text-sky-600">个体化差异</span>：策略复盘</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>回顾你得分最高或最低的一轮谈判，你认为成功的关键或失败的原因是什么？你的开价策略（先高后低，还是接近底线）是如何影响整个谈判过程的？</li>
                    <li>面对五种不同风格的对手（强悍型、交换型、公平型、关键变量型、随和型），你的应对策略有何不同？哪一种风格的对手让你觉得最难处理，为什么？</li>
                </ol>
                <h4 class="mt-4"><span class="text-sky-600">启发与应用</span>：延伸思考</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>除了求职和做项目，你还能想到哪些生活或学习场景可以应用 BATNA、ZOPA 和价值交换的思维？（例如：与室友协商生活公约、购物砍价、规划旅行等）请举一个具体例子。</li>
                </ol>`
        }
    },
    contractor: {
        PRACTICE_PARAMS: {
            user: {
                cost:       { expect: 1500000, reserve: 1200000, name: '總造價', en_name: 'Total Cost', unit: '元', format: 'currency'},
                duration:   { expect: 60,      reserve: 45,      name: '工期', en_name: 'Duration', unit: '天', unit_en: ' Days' },
                warranty:   { expect: 1,       reserve: 2,       name: '保修期', en_name: 'Warranty', unit: '年', unit_en: ' Years' },
                prepayment: { expect: 30,      reserve: 20,      name: '預付款', en_name: 'Prepayment', unit: '%' },
                obligation: { expect: 1,       reserve: 2,       name: '附加義務等級', en_name: 'Obligation Level', unit: '', format: 'level', levels: { 1: { name: '輕度', en_name: 'Light'}, 2: { name: '一般', en_name: 'General'}, 3: { name: '中度', en_name: 'Moderate'} } }
            },
            ai: { cost: { expect: 1100000, reserve: 1400000 }, duration:   { expect: 40,      reserve: 55 }, warranty:   { expect: 3,       reserve: 1 }, prepayment: { expect: 10,      reserve: 25 }, obligation: { expect: 3,       reserve: 1 } }
        },
        PRACTICE_USER_BATNA: { cost: 1350000, duration: 50, warranty: 1, prepayment: 20, obligation: 1 },
        PRACTICE_USER_BATNA_HTML: `<p class="font-bold">您的最佳替代方案是接受另一個辦公室裝修案，其價值可量化為：</p><p class="en-text">Your best alternative is to accept another office renovation project, quantifiable as:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>總造價 (Total Cost):</strong> 1,350,000 元</li><li><strong>工期 (Duration):</strong> 50 天</li><li><strong>保修期 (Warranty):</strong> 1 年</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">若當前談判的條件劣於此方案，您應當選擇放棄。<br><span class="text-amber-700">If the current negotiation terms are worse than this alternative, you should walk away.</span></p>`,
        BASE_PARAMS: {
            user: {
                cost:       { expect: 10500000, reserve: 9000000, name: '總造價', en_name: 'Total Cost', unit: '元', format: 'currency'},
                duration:   { expect: 330,      reserve: 240,     name: '工期', en_name: 'Duration', unit: '天', unit_en: ' Days' },
                warranty:   { expect: 1,        reserve: 4,       name: '保修期', en_name: 'Warranty', unit: '年', unit_en: ' Years' },
                prepayment: { expect: 25,       reserve: 15,      name: '預付款', en_name: 'Prepayment', unit: '%' },
                obligation: { expect: 1,        reserve: 4,       name: '附加義務等級', en_name: 'Obligation Level', unit: '', format: 'level', levels: { 1: { name: '輕度', en_name: 'Light' }, 2: { name: '一般', en_name: 'General' }, 3: { name: '中度', en_name: 'Moderate' }, 4: { name: '重度', en_name: 'Heavy' }, 5: { name: '全面', en_name: 'Comprehensive' } } }
            },
            ai: { cost: { expect: 8500000,  reserve: 10000000 }, duration:   { expect: 210,      reserve: 270 }, warranty:   { expect: 5,        reserve: 3 }, prepayment: { expect: 10,       reserve: 20 }, obligation: { expect: 5,        reserve: 3 } }
        },
        USER_BATNA: { cost: 9500000, duration: 300, warranty: 2, prepayment: 15, obligation: 2 },
        OFFICIAL_USER_BATNA_HTML: `<p class="font-bold">您的最佳替代方案是接受另一個住宅項目合約，其價值可量化為：</p><p class="en-text">Your best alternative is a residential project contract, quantifiable as:</p><ul class="list-disc list-inside mt-2 space-y-1 text-slate-700"><li><strong>報價 (Price):</strong> 9,500,000 元</li><li><strong>工期 (Duration):</strong> 300 天</li><li><strong>保修期 (Warranty):</strong> 2 年</li></ul><p class="mt-4 text-sm bg-amber-100 p-2 rounded">當前談判的條件若劣於此方案，您應當選擇放棄。<br><span class="text-amber-700">If the current negotiation terms are worse than this alternative, you should walk away.</span></p>`,
        OBLIGATION_DEFS: { 
            1: '配合標準審計流程，提供常規進度報告。<p class="en-text">Cooperate with standard audit procedures, provide regular progress reports.</p>', 
            2: '除標準報告外，需提供額外的專項報告（如環保、安全）。<p class="en-text">In addition to standard reports, provide extra special reports (e.g., environmental, safety).</p>', 
            3: '需承擔與所有由業主直接指定的分包商的協調管理責任。<p class="en-text">Assume coordination and management responsibility for all subcontractors directly appointed by the client.</p>', 
            4: '需承擔因非承包商原因導致的部分設計變更（累計不超過合約價5%）所引發的現場管理成本。<p class="en-text">Bear site management costs for partial design changes (not exceeding 5% of contract value) not caused by the contractor.</p>', 
            5: '需承擔項目範圍內全部未知地質條件、以及因極端天氣導致的工期延誤風險。<p class="en-text">Assume risks for all unknown geological conditions and project delays due to extreme weather.</p>'
        },
        AI_STYLES: {
            tough:       { name: '強悍型',       en_name: 'Tough',         desc: '業主尋求完美匹配。成交條件：所有 5 個談判項必須全部落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks a perfect match. Deal Condition: All 5 negotiation items must fall within the ZOPA.' },
            horseTrader: { name: '交換型',       en_name: 'Horse-Trader',  desc: '業主注重多數共識。成交條件：至少有 4 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client focuses on majority consensus. Deal Condition: At least 4 negotiation items must fall within the ZOPA.' },
            fair:        { name: '公平型',       en_name: 'Fair',          desc: '業主尋求整體平衡。成交條件：至少有 3 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client seeks an overall balance. Deal Condition: At least 3 negotiation items must fall within the ZOPA.' },
            key:         { name: '關鍵變量型',   en_name: 'Key-Variable',  desc: '業主對核心利益寸步不讓。成交條件：至少有 3 個談判項落在 ZOPA 內，且其中必須包含「總造價」和「工期」。', en_desc: 'The client is uncompromising on core interests. Deal Condition: At least 3 items in ZOPA, which must include Total Cost and Duration.' },
            accommodating: { name: '隨和型',     en_name: 'Accommodating', desc: '業主態度開放，容易達成。成交條件：至少有 2 個談判項落在雙方的成交區間 (ZOPA) 內。', en_desc: 'The client is open and easy to deal with. Deal Condition: At least 2 negotiation items must fall within the ZOPA.' }
        },
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
            DISCUSSION_QUESTIONS: `
                <h4><span class="text-emerald-600">共性思維</span>：概念複習</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>無論在哪种情境，「最佳替代方案」(BATNA) 都至关重要。请问你的 BATNA 在哪一轮谈判中对你的帮助最大？它是如何让你更有底气地坚持立场或放弃谈判的？</li>
                    <li>「可能成交区间」(ZOPA) 是双方底线的交集。有没有哪一轮你感觉 ZOPA 特别狭窄？你是如何通过「价值交换」(Trade-on)，比如用自己不太在意的项目去换取核心利益，从而成功创造出 ZOPA 的？</li>
                </ol>
                <h4 class="mt-4"><span class="text-emerald-600">个体化差异</span>：策略复盘</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>回顾你得分最高或最低的一轮谈判，你认为成功的关键或失败的原因是什么？你的开价策略（先高后低，还是接近底线）是如何影响整个谈判过程的？</li>
                    <li>面对五种不同风格的对手（强悍型、交换型、公平型、关键变量型、随和型），你的应对策略有何不同？哪一种风格的对手让你觉得最难处理，为什么？</li>
                </ol>
                <h4 class="mt-4"><span class="text-emerald-600">启发与应用</span>：延伸思考</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>除了工程投标，你还能想到哪些商业或工作场景可以应用 BATNA、ZOPA 和价值交换的思维？（例如：与供应商议价、争取项目资源、部门间协作等）请举一个具体例子。</li>
                </ol>`
        }
    }
};

// --- 通用辅助函数 (Universal Helper Functions) ---
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
            param.reserve = Math.round((param.expect + newRange) / (key.includes('cost') || key.includes('salary') ? 100 : 1)) * (key.includes('cost') || key.includes('salary') ? 100 : 1);
        } else {
            param.reserve = Math.round(param.expect - newRange);
        }
    }
    return newAiParams;
}

function isWithinZOPA(key, value, userParams, aiParams) {
    const userReserve = userParams[key].reserve;
    const aiReserve = aiParams[key].reserve;
    if (userParams[key].expect > userReserve) { 
        return value >= userReserve && value <= aiReserve;
    } else { 
        return value <= userReserve && value >= aiReserve;
    }
}

function checkDealCondition(offer, gameState) {
    const { theme } = gameState;
    const { aiStyle, aiParams, isPractice } = gameState.currentRound;
    const THEME_DATA = GAME_THEMES[theme];
    const userParams = isPractice ? THEME_DATA.PRACTICE_PARAMS.user : THEME_DATA.BASE_PARAMS.user;
    
    const zopaStatus = {};
    for (const key in offer) { zopaStatus[key] = isWithinZOPA(key, offer[key], userParams, aiParams); }
    const zopaCount = Object.values(zopaStatus).filter(Boolean).length;
    
    switch (aiStyle.key) {
        case 'tough': return zopaCount >= Object.keys(offer).length;
        case 'horseTrader': return zopaCount >= Object.keys(offer).length - 1;
        case 'fair': return zopaCount >= 3;
        case 'key': 
            if (theme === 'student') return zopaCount >= 3 && zopaStatus.salary && zopaStatus.duration;
            if (theme === 'contractor') return zopaCount >= 3 && zopaStatus.cost && zopaStatus.duration;
            return zopaCount >=3;
        case 'accommodating': return zopaCount >= 2;
        default: return false;
    }
}

// 【错误修正】: 将 calculateFinalScore 函式补全并放置在正确的位置
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

function generateAiResponse(offer, gameState) {
    const { theme } = gameState;
    const { aiParams, isPractice } = gameState.currentRound;
    const THEME_DATA = GAME_THEMES[theme];
    const userParams = isPractice ? THEME_DATA.PRACTICE_PARAMS.user : THEME_DATA.BASE_PARAMS.user;

    const painPoints = [];
    for (const key in offer) {
        if (!isWithinZOPA(key, offer[key], userParams, aiParams)) {
            painPoints.push({ key, userValue: offer[key] });
        }
    }

    if (painPoints.length === 0) { 
        return isPractice 
            ? `嗯，你提的這個方案我看了一下，感覺可以接受，那我們就這麼定了？<p class="en-text">Hmm, I looked at the plan you proposed. It seems acceptable. Should we finalize it?</p>`
            : `這個方案看起來有誠意，我們正在接近達成共識。但在總體利益上，我方還需要再評估一下，才能完全同意。<p class="en-text">This offer shows sincerity, and we are getting close to a consensus. However, I need to re-evaluate the overall benefits for our side before I can fully agree.</p>`; 
    }
    
    const mainPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
    const param = userParams[mainPainPoint.key];
    const { name, en_name } = param;

    if (gameState.currentRound.lastPainPoint === mainPainPoint.key) { 
        gameState.currentRound.consecutivePainPointCount = (gameState.currentRound.consecutivePainPointCount || 1) + 1;
    } else { 
        gameState.currentRound.lastPainPoint = mainPainPoint.key; 
        gameState.currentRound.consecutivePainPointCount = 1; 
    }
    
    if (gameState.currentRound.consecutivePainPointCount >= 2) {
        return `我們似乎在<strong>${name}</strong>上卡關了。這個條件對我們來說確實是個障礙，您能否在其他方面做些讓步來平衡一下？<p class="en-text">It seems we're stuck on the <strong>${en_name}</strong>. This term is a real obstacle for us. Could you perhaps make a concession elsewhere to balance it out?</p>`;
    }
    
    const studentResponses = {
        default: [ 
            `關於<strong>${name}</strong>，我覺得 ${mainPainPoint.userValue}${param.unit || ''} 對我來說有點困難，我這學期課業壓力比較大。<p class="en-text">Regarding the <strong>${en_name}</strong>, I feel that ${mainPainPoint.userValue}${param.unit || ''} is a bit difficult for me. I have a heavy workload this semester.</p>`, 
            `我不太擅長<strong>${name}</strong>這部分耶，你這邊能多承擔一些嗎？<p class="en-text">I'm not very good at the <strong>${en_name}</strong> part. Could you take on a bit more of that?</p>`
        ]
    };
    const contractorResponses = {
        cost: [ `關於<strong>${name}</strong>，您提出的 ${mainPainPoint.userValue.toLocaleString()} 元，與我們的預算差距有點大。<p class="en-text">Regarding the <strong>${en_name}</strong>, your offer of ${mainPainPoint.userValue.toLocaleString()} is a bit far from our budget.</p>` ],
        duration: [ `在<strong>${name}</strong>方面，${mainPainPoint.userValue} 天的時間對我們來說太長了，我們有嚴格的上市時程。<p class="en-text">As for the <strong>${en_name}</strong>, ${mainPainPoint.userValue} days is too long for us; we have a strict go-to-market schedule.</p>` ],
        default: [ `我們注意到在<strong>${name}</strong>這項，您提出的條件是 ${mainPainPoint.userValue}，這與我方的立場有一定距離。<p class="en-text">We've noted that on <strong>${en_name}</strong>, your proposed term of ${mainPainPoint.userValue} is some distance from our position.</p>` ]
    };

    const responses = theme === 'student' ? studentResponses : contractorResponses;
    const responseSet = responses[mainPainPoint.key] || responses.default;
    return responseSet[Math.floor(Math.random() * responseSet.length)];
}

function calculateSatisfactionScores(finalOffer, gameState) {
    const { theme } = gameState;
    const { isPractice } = gameState.currentRound;
    const THEME_DATA = GAME_THEMES[theme];
    const userParams = isPractice ? THEME_DATA.PRACTICE_PARAMS.user : THEME_DATA.BASE_PARAMS.user;
    const batna = isPractice ? THEME_DATA.PRACTICE_USER_BATNA : THEME_DATA.USER_BATNA;

    let userSatisfaction = 10.0;
    const penaltyReasons = [];
    
    const checkOverConcession = (key, offerValue, batnaValue, reason) => {
        if (!userParams[key] || batnaValue === undefined) return;
        const isHigherBetter = userParams[key].expect > userParams[key].reserve;
        if (isHigherBetter && offerValue < batnaValue) { userSatisfaction -= 2.0; penaltyReasons.push(reason); }
        if (!isHigherBetter && offerValue > batnaValue) { userSatisfaction -= 2.0; penaltyReasons.push(reason); }
    };
    
    const batnaChecks = {
        student: {
            practice: { dataCollection: '承擔了過多資料搜集工作', slides: '承擔了過多簡報製作', writing: '承擔了過多報告撰寫' },
            official: { salary: '接受的薪資低於備選 Offer', duration: '接受的實習時長長於備選 Offer', stipend: '接受的補貼低於備選 Offer' }
        },
        contractor: {
            practice: { cost: '總造價低於備選方案', duration: '工期長於備選方案' },
            official: { cost: '總造價低於備選方案', warranty: '保修期長於備選方案' }
        }
    };

    const checks = isPractice ? batnaChecks[theme].practice : batnaChecks[theme].official;
    for(const key in checks) {
        checkOverConcession(key, finalOffer[key], batna[key], checks[key]);
    }
    
    let aiSatisfaction = 0;
    const aiParams = isPractice ? THEME_DATA.PRACTICE_PARAMS.ai : THEME_DATA.BASE_PARAMS.ai;
    for (const key in finalOffer) {
        const aiExpect = aiParams[key]?.expect;
        const aiReserve = aiParams[key]?.reserve;
        if(aiExpect === undefined || aiReserve === undefined) continue;
        const range = Math.abs(aiExpect - aiReserve);
        if (range === 0) { aiSatisfaction += (10 / Object.keys(finalOffer).length); continue; }
        const progress = Math.abs(finalOffer[key] - aiReserve);
        aiSatisfaction += (progress / range) * (10 / Object.keys(finalOffer).length);
    }

    return { 
        user: Math.max(0, userSatisfaction).toFixed(1),
        ai: Math.min(10, aiSatisfaction).toFixed(1),
        penaltyReasons
    };
}

function generateReportData(gameState, finalOffer, isSuccess) {
    const { theme } = gameState;
    const { currentRound, gameHistory } = gameState;
    const { aiStyle, aiParams, stats, isPractice } = currentRound;
    const THEME_DATA = GAME_THEMES[theme];
    const userParams = isPractice ? THEME_DATA.PRACTICE_PARAMS.user : THEME_DATA.BASE_PARAMS.user;
    
    const finalZopaStatus = {};
    for (const key in finalOffer) { finalZopaStatus[key] = isWithinZOPA(key, finalOffer[key], userParams, aiParams); }
    
    const satisfaction = isSuccess ? calculateSatisfactionScores(finalOffer, gameState) : { user: '--', ai: '--', penaltyReasons: [] };

    let updatedGameHistory = [...gameHistory];
    let isGameOver = false;

    if (!isPractice) {
        const finalOfferHTML = Object.entries(finalOffer).map(([key, value]) => {
            const param = userParams[key];
            if(!param) return '';
            return `${param.name}: ${value.toLocaleString()}${param.unit || ''}<br><span class="en-text">${param.en_name}: ${value.toLocaleString()}${param.unit_en || param.unit || ''}</span>`;
        }).join('<br>');

        const currentRoundHistory = {
            styleName: aiStyle.name, en_styleName: aiStyle.en_name,
            isSuccess, satisfaction,
            offersSubmitted: stats.offers, batnaViews: stats.batnaViews,
            irrationalMoves: stats.irrationalMoves,
            finalOfferHTML: isSuccess ? finalOfferHTML : null,
        };
        updatedGameHistory.push(currentRoundHistory);
        isGameOver = updatedGameHistory.length >= Object.keys(THEME_DATA.AI_STYLES).length;
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
        reportTableHeadHTML: THEME_DATA.TEXT_SNIPPETS.reportTableHead,
        reportTableBodyHTML: Object.keys(userParams).map(key => {
            const param = userParams[key];
            const finalValue = finalOffer[key];
            const aiP = aiParams[key] || {};
            return `<tr class="border-b">
                <td class="p-3 font-medium">${param.name}<p class="en-text font-normal">${param.en_name}</p></td>
                <td class="p-3 ${finalZopaStatus[key] ? 'text-green-600 font-bold' : ''}">${finalValue.toLocaleString()}${param.unit || ''}</td>
                <td>${param.expect.toLocaleString()}${param.unit || ''}</td><td>${param.reserve.toLocaleString()}${param.unit || ''}</td>
                <td>${aiP.reserve !== undefined ? aiP.reserve.toLocaleString() : '--'}${param.unit || ''}</td><td>${aiP.expect !== undefined ? aiP.expect.toLocaleString() : '--'}${param.unit || ''}</td>
            </tr>`;
        }).join(''),
        dealZoneAnalysisHTML: Object.keys(userParams).map(key => {
            const inZopa = finalZopaStatus[key];
            return `<div><span class="font-medium">${userParams[key].name} (${userParams[key].en_name}):</span><span class="ml-2 text-sm font-semibold text-white px-2 py-1 rounded-full ${inZopa ? 'bg-green-500' : 'bg-red-500'}">${inZopa ? '在成交區間內 (In ZOPA)' : '未落在成交區間 (Outside ZOPA)'}</span></div>`;
        }).join(''),
        behaviorStatsHTML: `<li>對話輪次 (Rounds): <strong>${stats.offers}</strong> 次</li><li>查看 BATNA (BATNA Views): <strong>${stats.batnaViews}</strong> 次</li><li>非理性思考 (Irrational Moves): <strong>${stats.irrationalMoves}</strong> 次</li>`,
        satisfactionScoresHTML: `<div class="flex justify-between"><span>您的滿意度 (Your Score):</span><span class="font-bold text-lg">${satisfaction.user} / 10</span></div><div class="flex justify-between"><span>對方滿意度 (Opponent's Score):</span><span class="font-bold text-lg">${satisfaction.ai} / 10</span></div>`,
        smartTipsHTML,
        discussionQuestions: isGameOver ? THEME_DATA.TEXT_SNIPPETS.DISCUSSION_QUESTIONS : null,
        finalSummaryTableHeadHTML: isGameOver ? THEME_DATA.TEXT_SNIPPETS.finalSummaryTableHead : null,
        successModal: THEME_DATA.TEXT_SNIPPETS
    };
}

const handleAction = {
    'init': ({ payload, gameState: decodedState }) => {
        const { theme, token } = payload;
        let gameState = token ? decodeState(token) : null;

        if (!gameState && theme) {
            gameState = { theme, gameHistory: [], completedStyles: [] };
        } else if (!gameState) {
            return { error: "Invalid state: No token or theme provided for initialization." };
        }
        
        const THEME_DATA = GAME_THEMES[gameState.theme];

        if (!isPractice && gameState.completedStyles.length >= Object.keys(THEME_DATA.AI_STYLES).length) {
            return { 
                isGameOver: true, 
                gameHistory: gameState.gameHistory, 
                finalScore: calculateFinalScore(gameState.gameHistory),
                discussionQuestions: THEME_DATA.TEXT_SNIPPETS.DISCUSSION_QUESTIONS,
                finalSummaryTableHeadHTML: THEME_DATA.TEXT_SNIPPETS.finalSummaryTableHead
            };
        }

        let currentRound, scene, sliderConfig, aiStyleName, aiStyleEnName, leakedInfoHTML;
        const isPractice = !gameState.isPracticeComplete;

        if (isPractice) {
            currentRound = {
                isPractice: true,
                aiStyle: { key: 'fair', ...THEME_DATA.AI_STYLES['fair'] },
                aiParams: generateDynamicParams('fair', THEME_DATA.PRACTICE_PARAMS.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 }
            };
            scene = {
                title: THEME_DATA.TEXT_SNIPPETS.practiceSceneTitle, en_title: THEME_DATA.TEXT_SNIPPETS.en_practiceSceneTitle,
                desc: THEME_DATA.TEXT_SNIPPETS.practiceSceneDesc, en_desc: THEME_DATA.TEXT_SNIPPETS.en_practiceSceneDesc,
                userParams: THEME_DATA.PRACTICE_PARAMS.user,
                userBatnaHTML: THEME_DATA.PRACTICE_USER_BATNA_HTML,
                aiOpponent: { name: THEME_DATA.TEXT_SNIPPETS.practiceAiOpponentName, en_name: THEME_DATA.TEXT_SNIPPETS.en_practiceAiOpponentName },
                obligationTitle: THEME_DATA.TEXT_SNIPPETS.obligationTitle, en_obligationTitle: THEME_DATA.TEXT_SNIPPETS.en_obligationTitle,
                obligationDefs: THEME_DATA.OBLIGATION_DEFS,
            };
            aiStyleName = '練習對手';
            aiStyleEnName = 'Practice Opponent';
            leakedInfoHTML = '本次為練習輪，部分資訊已揭露以利您熟悉操作。<p class="en-text">This is a practice round. Some information is revealed to help you get familiar with the controls.</p>';
        } else {
            const availableStyles = Object.keys(THEME_DATA.AI_STYLES).filter(k => !gameState.completedStyles.includes(k));
            const randomStyleKey = availableStyles[Math.floor(Math.random() * availableStyles.length)];
            
            currentRound = {
                isPractice: false,
                aiStyle: { key: randomStyleKey, ...THEME_DATA.AI_STYLES[randomStyleKey] },
                aiParams: generateDynamicParams(randomStyleKey, THEME_DATA.BASE_PARAMS.ai),
                stats: { offers: 0, batnaViews: 0, irrationalMoves: 0 }
            };
            scene = {
                title: THEME_DATA.TEXT_SNIPPETS.officialSceneTitle, en_title: THEME_DATA.TEXT_SNIPPETS.en_officialSceneTitle,
                desc: THEME_DATA.TEXT_SNIPPETS.officialSceneDesc, en_desc: THEME_DATA.TEXT_SNIPPETS.en_officialSceneDesc,
                userParams: THEME_DATA.BASE_PARAMS.user,
                userBatnaHTML: THEME_DATA.OFFICIAL_USER_BATNA_HTML,
                aiOpponent: { name: THEME_DATA.TEXT_SNIPPETS.officialAiOpponentName, en_name: THEME_DATA.TEXT_SNIPPETS.en_officialAiOpponentName },
                obligationTitle: THEME_DATA.TEXT_SNIPPETS.obligationTitle, en_obligationTitle: THEME_DATA.TEXT_SNIPPETS.en_obligationTitle,
                obligationDefs: THEME_DATA.OBLIGATION_DEFS,
            };
            aiStyleName = currentRound.aiStyle.name;
            aiStyleEnName = currentRound.aiStyle.en_name;
            leakedInfoHTML = '情報顯示，對方在某些方面有特別的考量...<p class="en-text">Intel shows the other party has special considerations on some issues...</p>';
        }

        sliderConfig = {};
        const baseParamsForSlider = isPractice ? THEME_DATA.PRACTICE_PARAMS : THEME_DATA.BASE_PARAMS;
        Object.keys(scene.userParams).forEach(key => {
            const userP = scene.userParams[key];
            const aiP = baseParamsForSlider.ai[key];
            const allValues = [userP.expect, userP.reserve, aiP.expect, aiP.reserve].filter(v => v !== undefined);
            const min = Math.min(...allValues);
            const max = Math.max(...allValues);
            let step = 1;
            if (key.includes('cost') || key.includes('salary') || key.includes('stipend')) step = (max - min) / 100;
            if (key.includes('prepayment') || key.includes('Collection') || key.includes('slides') || key.includes('writing')) step = 5;

            sliderConfig[key] = { min: Math.floor(min*0.9), max: Math.ceil(max*1.1), step: Math.max(1, Math.round(step)) };
        });

        gameState.currentRound = currentRound;
        
        return {
            isGameOver: false, 
            isPractice: currentRound.isPractice, 
            roundNum: gameState.gameHistory.length + 1,
            scene, 
            sliderConfig,
            aiStyleName, 
            aiStyleEnName,
            leakedInfoHTML,
            initialOffer: Object.fromEntries(Object.keys(scene.userParams).map(key => [key, scene.userParams[key].expect])),
            token: encodeState(gameState)
        };
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
            gameState.currentRound.aiResponse = generateAiResponse(offer, gameState)
            return { isDeal: false, aiResponseHTML: gameState.currentRound.aiResponse, token: encodeState(gameState) };
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
        
        const gameState = token ? decodeState(token) : null;
        
        const result = handleAction[action]({ payload, gameState });
        
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
