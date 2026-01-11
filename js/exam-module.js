/**
 * 考研数学一模拟试卷 - 考试模块
 * 从 考研数学一模拟题.html 提取
 * Phase 14 代码封装重构
 *
 * 依赖：
 * - ai-adapter.js (AIModelAdapter, AI_PROVIDERS, callAI, isAIConfigured)
 */

// ==================== 题目数据 ====================

const examQuestions = [
    // 选择题 (8题, 每题4分)
    {
        type: 'choice',
        subject: 'calculus',
        question: '设函数 $f(x)$ 在 $x=0$ 处连续，且 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$，则 $f(0)$ 等于',
        options: ['A. 0', 'B. 1', 'C. -1', 'D. 不存在'],
        answer: 'A',
        explanation: '因为 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$ 存在且有限，所以 $\\lim_{x \\to 0} f(x) = \\lim_{x \\to 0} x \\cdot \\frac{f(x)}{x} = 0 \\cdot 1 = 0$。又因为 $f(x)$ 在 $x=0$ 处连续，所以 $f(0) = \\lim_{x \\to 0} f(x) = 0$。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'calculus',
        question: '设 $f(x)$ 可导，$F(x) = f(x)(1+|x|)$，则 $F(x)$ 在 $x=0$ 处可导的充要条件是',
        options: ['A. $f(0)=0$', 'B. $f\'(0)=0$', 'C. $f(0)=f\'(0)$', 'D. $f(0)+f\'(0)=0$'],
        answer: 'A',
        explanation: '$F(x) = \\begin{cases} f(x)(1+x), & x \\geq 0 \\\\ f(x)(1-x), & x < 0 \\end{cases}$。$F\'_+(0) = f(0) + f\'(0)$，$F\'_-(0) = f(0) - f\'(0)$。要使 $F(x)$ 在 $x=0$ 处可导，需要 $F\'_+(0) = F\'_-(0)$，即 $f(0)=0$。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'calculus',
        question: '设函数 $f(x,y)$ 在点 $(0,0)$ 处可微，且 $f(0,0)=0$，$f_x(0,0)=1$，$f_y(0,0)=2$，则 $\\lim_{t \\to 0} \\frac{f(t,2t)}{t}$ 等于',
        options: ['A. 3', 'B. 5', 'C. 1', 'D. 2'],
        answer: 'B',
        explanation: '由可微性，$f(t,2t) = f(0,0) + f_x(0,0) \\cdot t + f_y(0,0) \\cdot 2t + o(\\sqrt{t^2+4t^2}) = t + 4t + o(t) = 5t + o(t)$。因此 $\\lim_{t \\to 0} \\frac{f(t,2t)}{t} = \\lim_{t \\to 0} \\frac{5t + o(t)}{t} = 5$。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'linear',
        question: '设 $A$ 是 $n$ 阶矩阵，$|A|=2$，则 $|2A^*|$ 等于（其中 $A^*$ 是 $A$ 的伴随矩阵）',
        options: ['A. $2^n$', 'B. $2^{n+1}$', 'C. $2^{2n-1}$', 'D. $2^{2n}$'],
        answer: 'C',
        explanation: '$|A^*| = |A|^{n-1} = 2^{n-1}$，因此 $|2A^*| = 2^n |A^*| = 2^n \\cdot 2^{n-1} = 2^{2n-1}$。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'linear',
        question: '设 $A$ 为 $3$ 阶矩阵，$\\alpha_1, \\alpha_2, \\alpha_3$ 是线性无关的 $3$ 维列向量，若 $A\\alpha_1 = \\alpha_1 + \\alpha_2$，$A\\alpha_2 = \\alpha_2 + \\alpha_3$，$A\\alpha_3 = \\alpha_3$，则 $A$ 的特征值为',
        options: ['A. 1, 1, 1', 'B. 0, 1, 2', 'C. 1, 1, 2', 'D. 0, 0, 1'],
        answer: 'A',
        explanation: '令 $P = (\\alpha_1, \\alpha_2, \\alpha_3)$，则 $AP = (A\\alpha_1, A\\alpha_2, A\\alpha_3) = (\\alpha_1+\\alpha_2, \\alpha_2+\\alpha_3, \\alpha_3) = P \\begin{pmatrix} 1 & 0 & 0 \\\\ 1 & 1 & 0 \\\\ 0 & 1 & 1 \\end{pmatrix}$。因为 $\\alpha_1, \\alpha_2, \\alpha_3$ 线性无关，$P$ 可逆，所以 $A$ 与该上三角矩阵相似，特征值为对角线元素 1, 1, 1。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'probability',
        question: '设随机变量 $X$ 与 $Y$ 相互独立，且都服从正态分布 $N(0,1)$，则 $P\\{\\max(X,Y) \\leq 0\\}$ 等于',
        options: ['A. $\\frac{1}{4}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{1}{2}$', 'D. $\\frac{3}{4}$'],
        answer: 'A',
        explanation: '$P\\{\\max(X,Y) \\leq 0\\} = P\\{X \\leq 0, Y \\leq 0\\} = P\\{X \\leq 0\\} \\cdot P\\{Y \\leq 0\\}$（由独立性）。因为 $X \\sim N(0,1)$，$P\\{X \\leq 0\\} = \\frac{1}{2}$。同理 $P\\{Y \\leq 0\\} = \\frac{1}{2}$。所以结果为 $\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'probability',
        question: '设随机变量 $X_1, X_2, \\ldots, X_n$ 是来自总体 $N(\\mu, \\sigma^2)$ 的简单随机样本，$\\bar{X}$ 为样本均值，$S^2$ 为样本方差，则服从 $t(n-1)$ 分布的统计量是',
        options: ['A. $\\frac{\\bar{X}-\\mu}{S/\\sqrt{n}}$', 'B. $\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}}$', 'C. $\\frac{\\bar{X}}{S/\\sqrt{n}}$', 'D. $\\frac{\\bar{X}-\\mu}{S}$'],
        answer: 'A',
        explanation: '由 $t$ 分布的定义，$\\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)$。这是单样本 $t$ 检验的基础统计量。',
        score: 4
    },
    {
        type: 'choice',
        subject: 'calculus',
        question: '微分方程 $y\'\' - 2y\' + y = e^x$ 的通解为',
        options: [
            'A. $(C_1 + C_2 x + \\frac{1}{2}x^2)e^x$',
            'B. $(C_1 + C_2 x)e^x + \\frac{1}{2}x^2e^x$',
            'C. $(C_1 + C_2 x)e^x$',
            'D. $C_1e^x + C_2xe^x + x^2e^x$'
        ],
        answer: 'B',
        explanation: '特征方程为 $r^2 - 2r + 1 = 0$，即 $(r-1)^2=0$，得 $r=1$（二重根）。齐次方程通解为 $y_h = (C_1 + C_2 x)e^x$。因为 $e^x$ 对应的 $r=1$ 是二重特征根，设特解 $y^* = Ax^2 e^x$，代入原方程求得 $A = \\frac{1}{2}$。所以通解为 $(C_1 + C_2 x)e^x + \\frac{1}{2}x^2e^x$。',
        score: 4
    },

    // 填空题 (6题, 每题4分)
    {
        type: 'blank',
        subject: 'calculus',
        question: '极限 $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$ = ____',
        answer: '-1/6',
        explanation: '使用泰勒展开：$\\sin x = x - \\frac{x^3}{6} + o(x^3)$，所以 $\\sin x - x = -\\frac{x^3}{6} + o(x^3)$，因此 $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3} = -\\frac{1}{6}$。',
        score: 4
    },
    {
        type: 'blank',
        subject: 'calculus',
        question: '设 $z = e^{xy}$，则 $\\frac{\\partial^2 z}{\\partial x \\partial y}$ = ____',
        answer: 'e^(xy)(1+xy)',
        explanation: '$\\frac{\\partial z}{\\partial x} = ye^{xy}$，$\\frac{\\partial^2 z}{\\partial x \\partial y} = \\frac{\\partial}{\\partial y}(ye^{xy}) = e^{xy} + y \\cdot xe^{xy} = e^{xy}(1+xy)$。',
        score: 4
    },
    {
        type: 'blank',
        subject: 'calculus',
        question: '积分 $\\int_0^{\\pi/2} \\sin^3 x \\cos^2 x \\, dx$ = ____',
        answer: '2/15',
        explanation: '令 $u = \\cos x$，$du = -\\sin x dx$。当 $x=0$ 时 $u=1$，$x=\\pi/2$ 时 $u=0$。结果为 $\\frac{2}{15}$。',
        score: 4
    },
    {
        type: 'blank',
        subject: 'linear',
        question: '设矩阵 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 2 & 3 \\end{pmatrix}$，则 $A$ 的秩 $r(A)$ = ____',
        answer: '1',
        explanation: '观察矩阵，第二行是第一行的2倍，第三行与第一行相同，所以三行线性相关，且只有一个线性无关的行向量，因此 $r(A) = 1$。',
        score: 4
    },
    {
        type: 'blank',
        subject: 'linear',
        question: '设 $3$ 阶矩阵 $A$ 的特征值为 $1, 2, 3$，则 $|A^{-1} + E|$ = ____（$E$ 为单位矩阵）',
        answer: '12',
        explanation: '$A$ 的特征值为 $1, 2, 3$，则 $A^{-1}$ 的特征值为 $1, \\frac{1}{2}, \\frac{1}{3}$，$A^{-1}+E$ 的特征值为 $2, \\frac{3}{2}, \\frac{4}{3}$。',
        score: 4
    },
    {
        type: 'blank',
        subject: 'probability',
        question: '设随机变量 $X$ 服从参数为 $2$ 的指数分布，则 $E(X)$ = ____',
        answer: '1/2',
        explanation: '指数分布 $X \\sim Exp(\\lambda)$ 中，$\\lambda = 2$，则 $E(X) = \\frac{1}{\\lambda} = \\frac{1}{2}$。',
        score: 4
    },

    // 解答题 (9题)
    {
        type: 'solve',
        subject: 'calculus',
        question: '求极限 $\\lim_{n \\to \\infty} \\sqrt[n]{\\frac{(2n)!}{n!n^n}}$',
        answer: '4/e',
        explanation: '使用斯特林公式，最终结果为 $\\frac{4}{e}$。',
        score: 10
    },
    {
        type: 'solve',
        subject: 'calculus',
        question: '设函数 $f(x)$ 在 $[0,1]$ 上连续，在 $(0,1)$ 内可导，且 $f(0)=0$，$f(1)=1$。证明：存在 $\\xi, \\eta \\in (0,1)$，使得 $\\frac{1}{f\'(\\xi)} + \\frac{1}{f\'(\\eta)} = 2$。',
        answer: '见解析',
        explanation: '使用罗尔定理和拉格朗日中值定理证明。',
        score: 11
    },
    {
        type: 'solve',
        subject: 'calculus',
        question: '计算二重积分 $\\iint_D \\frac{x+y}{x^2+y^2} dxdy$，其中 $D$ 是由圆周 $x^2+y^2=2x$ 和 $x^2+y^2=4x$ 围成的区域。',
        answer: '3π',
        explanation: '转换为极坐标计算。',
        score: 11
    },
    {
        type: 'solve',
        subject: 'calculus',
        question: '设函数 $y=y(x)$ 由方程 $x^3 + y^3 - 3xy = 0$ 确定，求 $y$ 的极值。',
        answer: '极大值为1',
        explanation: '通过隐函数求导，令 $y\'=0$ 求解。',
        score: 11
    },
    {
        type: 'solve',
        subject: 'linear',
        question: '设矩阵 $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ -1 & 2 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix}$，求正交矩阵 $Q$ 和对角矩阵 $\\Lambda$，使得 $Q^T A Q = \\Lambda$。',
        answer: '见解析',
        explanation: '求特征值和特征向量，然后Schmidt正交化。',
        score: 12
    },
    {
        type: 'solve',
        subject: 'linear',
        question: '设向量组 $\\alpha_1=(1,1,0,0)^T, \\alpha_2=(1,0,1,1)^T, \\alpha_3=(0,1,1,1)^T$，求该向量组的秩，并求其一个最大线性无关组。',
        answer: '秩为2',
        explanation: '通过行化简矩阵求解。',
        score: 11
    },
    {
        type: 'solve',
        subject: 'probability',
        question: '设随机变量 $X$ 的概率密度函数为 $f(x) = \\begin{cases} Ae^{-2x}, & x>0 \\\\ 0, & x \\leq 0 \\end{cases}$。(1) 求常数 $A$；(2) 求 $P\\{X>1\\}$；(3) 求 $E(X)$ 和 $D(X)$。',
        answer: 'A=2',
        explanation: '由归一化条件求得 $A=2$，然后计算概率和期望、方差。',
        score: 12
    },
    {
        type: 'solve',
        subject: 'probability',
        question: '设二维随机变量 $(X,Y)$ 的联合概率密度为 $f(x,y) = \\begin{cases} 1, & 0<x<1, 0<y<x \\\\ 0, & \\text{其他} \\end{cases}$。求边缘概率密度 $f_X(x)$ 和 $f_Y(y)$，并判断 $X$ 和 $Y$ 是否独立。',
        answer: 'X和Y不独立',
        explanation: '通过积分计算边缘分布，然后判断独立性。',
        score: 12
    },
    {
        type: 'solve',
        subject: 'probability',
        question: '设 $X_1, X_2, \\ldots, X_n$ 是来自总体 $N(\\mu, \\sigma^2)$ 的简单随机样本，其中 $\\mu$ 已知，$\\sigma^2$ 未知。求 $\\sigma^2$ 的最大似然估计。',
        answer: '见解析',
        explanation: '构造似然函数，取对数后求导，得到最大似然估计。',
        score: 10
    }
];

// ==================== 考试状态变量 ====================

let examUserAnswers = [];
let examAIExplanations = [];
let examCurrentMode = 'instant'; // 'instant' 或 'submit'
let examIsSubmitted = false;
let examStartTime = Date.now();
let examTimerInterval = null;

// 批量换题状态
let examBatchRefreshCancelled = false;
let examBatchRefreshInProgress = false;

// ==================== 初始化函数 ====================

/**
 * 初始化考试模块
 */
function initExamModule() {
    examUserAnswers = new Array(examQuestions.length).fill('');
    examAIExplanations = new Array(examQuestions.length).fill(null);

    loadExamFromStorage();
    renderExamQuestions();
    renderExamAnswerCard();
    startExamTimer();
    updateExamStats();

    // 绑定事件
    bindExamEvents();
}

/**
 * 绑定考试相关事件
 */
function bindExamEvents() {
    // 模式切换
    const modeSwitch = document.getElementById('examModeSwitch');
    if (modeSwitch) {
        modeSwitch.addEventListener('click', toggleExamMode);
    }

    // 提交按钮
    const submitBtn = document.getElementById('examSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitExam);
    }

    // 重置按钮
    const resetBtn = document.getElementById('examResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetExam);
    }

    // 批量换题
    const batchRefreshBtn = document.getElementById('examBatchRefreshBtn');
    if (batchRefreshBtn) {
        batchRefreshBtn.addEventListener('click', batchRefreshExamQuestions);
    }
}

// ==================== 渲染函数 ====================

/**
 * 渲染所有题目
 */
function renderExamQuestions() {
    const container = document.getElementById('examQuestionsContainer');
    if (!container) return;

    container.innerHTML = '';

    let choiceCount = 0, blankCount = 0, solveCount = 0;

    examQuestions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.id = `exam-question-${index}`;

        // 添加分节标题
        if (index === 0) {
            addSectionTitle(container, '一、选择题（每题4分，共32分）');
        } else if (index === 8) {
            addSectionTitle(container, '二、填空题（每题4分，共24分）');
        } else if (index === 14) {
            addSectionTitle(container, '三、解答题（共94分）');
        }

        // 题目编号
        let qNumber;
        if (q.type === 'choice') {
            choiceCount++;
            qNumber = choiceCount;
        } else if (q.type === 'blank') {
            blankCount++;
            qNumber = blankCount;
        } else {
            solveCount++;
            qNumber = solveCount;
        }

        qDiv.innerHTML = `
            <div class="question-header">
                <div class="question-title">${qNumber}. ${q.question}</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="question-refresh-btn" onclick="refreshExamQuestion(${index})" title="换一道同类型题目">
                        🔄 换题
                    </button>
                    <div class="question-score">(${q.score}分)</div>
                </div>
            </div>
            <div class="question-content" id="exam-content-${index}"></div>
            <div class="explanation" id="exam-explanation-${index}">
                <div class="explanation-title">答案与解析：</div>
                <div><strong>答案：</strong>${q.answer}</div>
                <div style="margin-top: 10px;"><strong>解析：</strong>${q.explanation}</div>
            </div>
            <div class="ai-explanation-content" id="exam-ai-explanation-${index}"></div>
        `;

        container.appendChild(qDiv);

        // 渲染题目内容
        const contentDiv = document.getElementById(`exam-content-${index}`);
        if (q.type === 'choice') {
            renderExamChoiceQuestion(contentDiv, q, index);
        } else if (q.type === 'blank') {
            renderExamBlankQuestion(contentDiv, q, index);
        } else if (q.type === 'solve') {
            renderExamSolveQuestion(contentDiv, q, index);
        }
    });

    // 渲染数学公式
    setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
        }
    }, 100);
}

/**
 * 添加分节标题
 */
function addSectionTitle(container, title) {
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = title;
    container.appendChild(sectionTitle);
}

/**
 * 渲染选择题
 */
function renderExamChoiceQuestion(container, question, index) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    question.options.forEach((option, i) => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'option';
        optionLabel.innerHTML = `
            <input type="radio" name="exam-question-${index}" value="${String.fromCharCode(65+i)}">
            ${option}
        `;

        optionLabel.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
            }
            examUserAnswers[index] = String.fromCharCode(65+i);
            saveExamToStorage();
            updateExamStats();
            updateExamAnswerCard();

            // 即时批改模式
            if (examCurrentMode === 'instant' && !examIsSubmitted) {
                checkExamAnswer(index);
            }

            // 更新选中样式
            document.querySelectorAll(`input[name="exam-question-${index}"]`).forEach(radio => {
                radio.parentElement.classList.remove('selected');
            });
            this.classList.add('selected');
        });

        optionsDiv.appendChild(optionLabel);
    });

    container.appendChild(optionsDiv);

    // 恢复答案
    if (examUserAnswers[index]) {
        const radio = container.querySelector(`input[value="${examUserAnswers[index]}"]`);
        if (radio) {
            radio.checked = true;
            radio.parentElement.classList.add('selected');
        }
    }
}

/**
 * 渲染填空题
 */
function renderExamBlankQuestion(container, question, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'blank-input';
    input.placeholder = '请输入答案';
    input.value = examUserAnswers[index] || '';

    input.addEventListener('input', function() {
        examUserAnswers[index] = this.value.trim();
        saveExamToStorage();
        updateExamStats();
        updateExamAnswerCard();

        if (examCurrentMode === 'instant' && !examIsSubmitted && this.value.trim()) {
            checkExamAnswer(index);
        }
    });

    container.appendChild(input);
}

/**
 * 渲染解答题
 */
function renderExamSolveQuestion(container, question, index) {
    const textarea = document.createElement('textarea');
    textarea.className = 'solve-textarea';
    textarea.placeholder = '请在此输入详细解答过程...';
    textarea.value = examUserAnswers[index] || '';

    textarea.addEventListener('input', function() {
        examUserAnswers[index] = this.value.trim();
        saveExamToStorage();
        updateExamStats();
        updateExamAnswerCard();
    });

    container.appendChild(textarea);

    // 查看答案按钮
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '10px';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-answer-btn';
    viewBtn.textContent = '查看标准答案';
    viewBtn.addEventListener('click', function() {
        const explanation = document.getElementById(`exam-explanation-${index}`);
        explanation.classList.toggle('show');
        this.textContent = explanation.classList.contains('show') ? '隐藏标准答案' : '查看标准答案';
    });
    btnContainer.appendChild(viewBtn);

    container.appendChild(btnContainer);
}

/**
 * 渲染答题卡
 */
function renderExamAnswerCard() {
    const card = document.getElementById('examAnswerCard');
    if (!card) return;

    card.innerHTML = '';

    examQuestions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'card-item';
        item.textContent = index + 1;
        item.addEventListener('click', () => {
            document.getElementById(`exam-question-${index}`).scrollIntoView({ behavior: 'smooth' });
        });
        card.appendChild(item);
    });
}

/**
 * 更新答题卡状态
 */
function updateExamAnswerCard() {
    examQuestions.forEach((q, index) => {
        const item = document.querySelectorAll('#examAnswerCard .card-item')[index];
        if (!item) return;

        item.className = 'card-item';

        if (examUserAnswers[index]) {
            item.classList.add('answered');
        }

        if (examIsSubmitted || examCurrentMode === 'instant') {
            if (examUserAnswers[index]) {
                const isCorrect = checkExamAnswerCorrect(index);
                if (q.type !== 'solve') {
                    item.classList.add(isCorrect ? 'correct' : 'wrong');
                }
            }
        }
    });
}

// ==================== 答题检查函数 ====================

/**
 * 检查答案
 */
function checkExamAnswer(index) {
    const question = examQuestions[index];
    const isCorrect = checkExamAnswerCorrect(index);

    if (question.type === 'choice') {
        const options = document.querySelectorAll(`input[name="exam-question-${index}"]`);
        options.forEach(option => {
            const label = option.parentElement;
            label.classList.remove('correct', 'wrong');

            if (option.value === question.answer) {
                label.classList.add('correct');
            } else if (option.checked && !isCorrect) {
                label.classList.add('wrong');
            }
        });

        const explanation = document.getElementById(`exam-explanation-${index}`);
        explanation.classList.add('show');
    } else if (question.type === 'blank') {
        const input = document.querySelector(`#exam-question-${index} .blank-input`);
        input.classList.remove('correct', 'wrong');
        if (examUserAnswers[index]) {
            input.classList.add(isCorrect ? 'correct' : 'wrong');
            const explanation = document.getElementById(`exam-explanation-${index}`);
            explanation.classList.add('show');
        }
    }

    updateExamAnswerCard();
}

/**
 * 检查答案是否正确
 */
function checkExamAnswerCorrect(index) {
    const question = examQuestions[index];
    const userAnswer = examUserAnswers[index];

    if (!userAnswer) return false;

    if (question.type === 'choice') {
        return userAnswer === question.answer;
    } else if (question.type === 'blank') {
        return normalizeExamAnswer(userAnswer) === normalizeExamAnswer(question.answer);
    } else {
        return false;
    }
}

/**
 * 标准化答案
 */
function normalizeExamAnswer(answer) {
    return answer.toLowerCase().replace(/\s+/g, '').replace(/\*/g, '');
}

// ==================== 模式与提交 ====================

/**
 * 切换批改模式
 */
function toggleExamMode() {
    if (examIsSubmitted) {
        alert('试卷已提交，无法切换模式。请点击"重新开始"');
        return;
    }

    examCurrentMode = examCurrentMode === 'instant' ? 'submit' : 'instant';
    const btn = document.getElementById('examModeSwitch');
    const indicator = document.getElementById('examModeIndicator');

    if (examCurrentMode === 'instant') {
        btn.textContent = '切换到提交后批改';
        indicator.textContent = '即时批改模式';
        indicator.style.background = '#4CAF50';

        examQuestions.forEach((q, index) => {
            if (examUserAnswers[index]) {
                checkExamAnswer(index);
            }
        });
    } else {
        btn.textContent = '切换到即时批改';
        indicator.textContent = '提交后批改模式';
        indicator.style.background = '#FF9800';

        document.querySelectorAll('.explanation').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.option').forEach(el => el.classList.remove('correct', 'wrong'));
        document.querySelectorAll('.blank-input').forEach(el => el.classList.remove('correct', 'wrong'));
        updateExamAnswerCard();
    }
}

/**
 * 提交试卷
 */
function submitExam() {
    if (examIsSubmitted) {
        alert('试卷已提交！');
        return;
    }

    const answeredCount = examUserAnswers.filter(a => a !== '').length;
    if (answeredCount < examQuestions.length) {
        if (!confirm(`您还有 ${examQuestions.length - answeredCount} 道题未作答，确定要提交吗？`)) {
            return;
        }
    }

    examIsSubmitted = true;
    clearInterval(examTimerInterval);

    // 计算分数
    let totalScore = 0;
    examQuestions.forEach((q, index) => {
        if (q.type !== 'solve' && checkExamAnswerCorrect(index)) {
            totalScore += q.score;
        }
    });

    // 显示所有答案解析
    document.querySelectorAll('.explanation').forEach(el => el.classList.add('show'));

    // 显示批改结果
    examQuestions.forEach((q, index) => {
        if (q.type !== 'solve') {
            checkExamAnswer(index);
        }
    });

    updateExamAnswerCard();

    // 显示成绩
    const scoreDisplay = document.getElementById('examScoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `客观题得分：${totalScore}/66分`;
    }

    alert(`提交成功！\n客观题得分：${totalScore}/66分\n解答题需人工批改\n总用时：${document.getElementById('examTimer').textContent}`);
}

/**
 * 重置试卷
 */
function resetExam() {
    if (!confirm('确定要重新开始吗？当前答案将全部清空。')) {
        return;
    }

    examUserAnswers = new Array(examQuestions.length).fill('');
    examIsSubmitted = false;
    examCurrentMode = 'instant';
    examStartTime = Date.now();

    localStorage.removeItem('examAnswers');
    localStorage.removeItem('examMode');
    localStorage.removeItem('examStartTime');

    initExamModule();
}

// ==================== 计时器与统计 ====================

/**
 * 启动计时器
 */
function startExamTimer() {
    examTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        const timer = document.getElementById('examTimer');
        if (timer) {
            timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

/**
 * 更新统计信息
 */
function updateExamStats() {
    const answeredCount = examUserAnswers.filter(a => a !== '').length;
    const countEl = document.getElementById('examAnsweredCount');
    if (countEl) {
        countEl.textContent = `${answeredCount}/23`;
    }
}

// ==================== 存储函数 ====================

/**
 * 保存到本地存储
 */
function saveExamToStorage() {
    localStorage.setItem('examAnswers', JSON.stringify(examUserAnswers));
    localStorage.setItem('examMode', examCurrentMode);
    localStorage.setItem('examStartTime', examStartTime);
}

/**
 * 从本地存储加载
 */
function loadExamFromStorage() {
    const savedAnswers = localStorage.getItem('examAnswers');
    const savedMode = localStorage.getItem('examMode');
    const savedStartTime = localStorage.getItem('examStartTime');

    if (savedAnswers) {
        examUserAnswers = JSON.parse(savedAnswers);
    }
    if (savedMode) {
        examCurrentMode = savedMode;
    }
    if (savedStartTime) {
        examStartTime = parseInt(savedStartTime);
    }
}

// ==================== AI换题功能 ====================

/**
 * 单题换题
 */
async function refreshExamQuestion(index) {
    if (!isAIConfigured()) {
        alert('请先在设置页面配置AI模型');
        return;
    }

    const question = examQuestions[index];
    const btn = event.target;

    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = '生成中...';

    try {
        const newQuestion = await generateNewQuestion(question);

        // 更新题目数据
        examQuestions[index].question = newQuestion.question;
        examQuestions[index].answer = newQuestion.answer;
        examQuestions[index].explanation = newQuestion.explanation;
        if (question.type === 'choice') {
            examQuestions[index].options = newQuestion.options;
        }

        // 清空用户答案
        examUserAnswers[index] = '';
        examAIExplanations[index] = null;

        // 重新渲染
        renderExamQuestions();
        updateExamStats();
        updateExamAnswerCard();
        saveExamToStorage();

        btn.innerHTML = '🔄 换题';
    } catch (error) {
        console.error('换题失败:', error);
        alert(`换题失败：${error.message}`);
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

/**
 * 生成新题目
 */
async function generateNewQuestion(question) {
    const subjectMap = {
        'calculus': '微积分',
        'linear': '线性代数',
        'probability': '概率论与数理统计'
    };

    let typeDesc = '';
    if (question.type === 'choice') {
        typeDesc = '选择题（包含A、B、C、D四个选项）';
    } else if (question.type === 'blank') {
        typeDesc = '填空题';
    } else {
        typeDesc = '解答题（需要详细的解题步骤）';
    }

    const prompt = `请生成一道考研数学一的${typeDesc}，学科分类为${subjectMap[question.subject] || '数学'}，难度与以下题目相当：

【原题】
${question.question}
${question.options ? '\n选项：\n' + question.options.join('\n') : ''}

【要求】
1. 题目格式与原题完全一致
2. 难度相当，知识点相似但不完全相同
3. 使用LaTeX数学公式（用$...$包裹行内公式）
4. 必须包含答案和简要解析

【输出格式】
请严格按照以下JSON格式输出：
\`\`\`json
{
  "question": "题目内容",
  ${question.type === 'choice' ? '"options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],' : ''}
  "answer": "${question.type === 'choice' ? 'A或B或C或D' : '答案内容'}",
  "explanation": "解析内容"
}
\`\`\``;

    const response = await callAI([{ role: 'user', content: prompt }], { maxTokens: 2500 });

    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
        throw new Error('AI响应格式错误');
    }

    return JSON.parse(jsonMatch[1]);
}

/**
 * 批量换题
 */
async function batchRefreshExamQuestions() {
    if (!isAIConfigured()) {
        alert('请先在设置页面配置AI模型');
        return;
    }

    if (examBatchRefreshInProgress) {
        alert('正在换题中，请稍候...');
        return;
    }

    if (!confirm('确定要更换所有题目吗？\n这将生成一套全新的试卷。')) {
        return;
    }

    examBatchRefreshInProgress = true;
    examBatchRefreshCancelled = false;

    const totalQuestions = examQuestions.length;
    let successCount = 0;

    try {
        for (let i = 0; i < totalQuestions && !examBatchRefreshCancelled; i++) {
            try {
                const newQuestion = await generateNewQuestion(examQuestions[i]);
                examQuestions[i].question = newQuestion.question;
                examQuestions[i].answer = newQuestion.answer;
                examQuestions[i].explanation = newQuestion.explanation;
                if (examQuestions[i].type === 'choice') {
                    examQuestions[i].options = newQuestion.options;
                }
                examUserAnswers[i] = '';
                successCount++;
            } catch (error) {
                console.error(`第 ${i+1} 题换题失败:`, error);
            }

            // 延迟避免速率限制
            if (i < totalQuestions - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        renderExamQuestions();
        renderExamAnswerCard();
        updateExamStats();
        saveExamToStorage();

        alert(`换题完成！成功 ${successCount}/${totalQuestions} 题`);
    } finally {
        examBatchRefreshInProgress = false;
    }
}

// ==================== 视图渲染函数 ====================

/**
 * 渲染模拟考试视图（集成到主页面）
 */
function renderExamView() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="exam-integrated-view">
            <div class="exam-header-bar">
                <div class="exam-title">
                    <h1>考研数学一模拟试卷</h1>
                    <span class="mode-indicator" id="examModeIndicator">即时批改模式</span>
                </div>
                <div class="header-controls">
                    <div class="timer" id="examTimer">00:00:00</div>
                    <button class="btn btn-primary" id="examBatchRefreshBtn">🔄 换一套题</button>
                    <button class="btn btn-secondary" id="examModeSwitch">切换到提交后批改</button>
                </div>
            </div>

            <div class="exam-main-container">
                <div class="exam-questions-area" id="examQuestionsContainer">
                    <!-- 题目将通过JavaScript动态生成 -->
                </div>

                <div class="exam-sidebar-panel">
                    <h3>📝 答题卡</h3>
                    <div class="answer-card" id="examAnswerCard">
                        <!-- 答题卡将通过JavaScript动态生成 -->
                    </div>

                    <div class="exam-stats">
                        <div class="stat-item">
                            <span>已答题数：</span>
                            <span id="examAnsweredCount">0/23</span>
                        </div>
                        <div class="stat-item">
                            <span>总分：</span>
                            <span>150分</span>
                        </div>
                        <div class="stat-item" id="examScoreItem" style="display: none;">
                            <span>得分：</span>
                            <span id="examFinalScore" style="color: #4CAF50; font-weight: bold;">--</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="exam-footer-bar">
                <button class="btn btn-secondary" id="examResetBtn">🔄 重新开始</button>
                <div class="score-display" id="examScoreDisplay"></div>
                <button class="btn btn-primary" id="examSubmitBtn">📋 提交试卷</button>
            </div>
        </div>
    `;

    // 初始化考试模块
    initExamModule();
}

// ==================== 导出函数 ====================

// 暴露全局函数供HTML调用
window.renderExamView = renderExamView;
window.initExamModule = initExamModule;
window.refreshExamQuestion = refreshExamQuestion;
window.batchRefreshExamQuestions = batchRefreshExamQuestions;
window.submitExam = submitExam;
window.resetExam = resetExam;
window.toggleExamMode = toggleExamMode;
