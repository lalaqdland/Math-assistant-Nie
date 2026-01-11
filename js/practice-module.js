/**
 * 练习测试模块 - 考研数学学习助手
 * 包含专项练习、错题本、模拟考试入口等功能
 */

// ========== 预设题库 ==========
const questionBank = [
    // 选择题
    { type: 'choice', subject: 'calculus', difficulty: 'intermediate', question: '设函数 $f(x)$ 在 $x=0$ 处连续，且 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$，则 $f(0)$ 等于', options: ['A. 0', 'B. 1', 'C. -1', 'D. 不存在'], answer: 'A', explanation: '因为 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$ 存在且有限，所以 $\\lim_{x \\to 0} f(x) = 0$。又因为 $f(x)$ 在 $x=0$ 处连续，所以 $f(0) = 0$。' },
    { type: 'choice', subject: 'calculus', difficulty: 'intermediate', question: '设 $f(x)$ 可导，$F(x) = f(x)(1+|x|)$，则 $F(x)$ 在 $x=0$ 处可导的充要条件是', options: ['A. $f(0)=0$', 'B. $f\'(0)=0$', 'C. $f(0)=f\'(0)$', 'D. $f(0)+f\'(0)=0$'], answer: 'A', explanation: '$F\'_+(0) = f(0) + f\'(0)$，$F\'_-(0) = f(0) - f\'(0)$。要使 $F(x)$ 在 $x=0$ 处可导，需要 $F\'_+(0) = F\'_-(0)$，即 $f(0)=0$。' },
    { type: 'choice', subject: 'calculus', difficulty: 'advanced', question: '设函数 $f(x,y)$ 在点 $(0,0)$ 处可微，且 $f(0,0)=0$，$f_x(0,0)=1$，$f_y(0,0)=2$，则 $\\lim_{t \\to 0} \\frac{f(t,2t)}{t}$ 等于', options: ['A. 3', 'B. 5', 'C. 1', 'D. 2'], answer: 'B', explanation: '由可微性，$f(t,2t) = f_x(0,0) \\cdot t + f_y(0,0) \\cdot 2t + o(t) = 5t + o(t)$。因此极限为 5。' },
    { type: 'choice', subject: 'linear', difficulty: 'intermediate', question: '设 $A$ 是 $n$ 阶矩阵，$|A|=2$，则 $|2A^*|$ 等于（其中 $A^*$ 是 $A$ 的伴随矩阵）', options: ['A. $2^n$', 'B. $2^{n+1}$', 'C. $2^{2n-1}$', 'D. $2^{2n}$'], answer: 'C', explanation: '$|A^*| = |A|^{n-1} = 2^{n-1}$，因此 $|2A^*| = 2^n |A^*| = 2^{2n-1}$。' },
    { type: 'choice', subject: 'linear', difficulty: 'advanced', question: '设 $A$ 为 $3$ 阶矩阵，$\\alpha_1, \\alpha_2, \\alpha_3$ 是线性无关的 $3$ 维列向量，若 $A\\alpha_1 = \\alpha_1 + \\alpha_2$，$A\\alpha_2 = \\alpha_2 + \\alpha_3$，$A\\alpha_3 = \\alpha_3$，则 $A$ 的特征值为', options: ['A. 1, 1, 1', 'B. 0, 1, 2', 'C. 1, 1, 2', 'D. 0, 0, 1'], answer: 'A', explanation: '$A$ 与上三角矩阵相似，特征值为对角线元素 1, 1, 1。' },
    { type: 'choice', subject: 'probability', difficulty: 'intermediate', question: '设随机变量 $X$ 与 $Y$ 相互独立，且都服从正态分布 $N(0,1)$，则 $P\\{\\max(X,Y) \\leq 0\\}$ 等于', options: ['A. $\\frac{1}{4}$', 'B. $\\frac{1}{3}$', 'C. $\\frac{1}{2}$', 'D. $\\frac{3}{4}$'], answer: 'A', explanation: '$P\\{\\max(X,Y) \\leq 0\\} = P\\{X \\leq 0\\} \\cdot P\\{Y \\leq 0\\} = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$。' },
    { type: 'choice', subject: 'probability', difficulty: 'intermediate', question: '设随机变量 $X_1, X_2, \\ldots, X_n$ 是来自总体 $N(\\mu, \\sigma^2)$ 的简单随机样本，则服从 $t(n-1)$ 分布的统计量是', options: ['A. $\\frac{\\bar{X}-\\mu}{S/\\sqrt{n}}$', 'B. $\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}}$', 'C. $\\frac{\\bar{X}}{S/\\sqrt{n}}$', 'D. $\\frac{\\bar{X}-\\mu}{S}$'], answer: 'A', explanation: '由 $t$ 分布的定义，$\\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)$。' },
    { type: 'choice', subject: 'calculus', difficulty: 'advanced', question: '微分方程 $y\'\' - 2y\' + y = e^x$ 的通解为', options: ['A. $(C_1 + C_2 x + \\frac{1}{2}x^2)e^x$', 'B. $(C_1 + C_2 x)e^x + \\frac{1}{2}x^2e^x$', 'C. $(C_1 + C_2 x)e^x$', 'D. $C_1e^x + C_2xe^x + x^2e^x$'], answer: 'B', explanation: '特征根 $r=1$ 是二重根，齐次通解为 $(C_1 + C_2 x)e^x$，特解为 $\\frac{1}{2}x^2e^x$。' },
    // 填空题
    { type: 'blank', subject: 'calculus', difficulty: 'intermediate', question: '极限 $\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$ = ____', answer: '-1/6', explanation: '使用泰勒展开：$\\sin x = x - \\frac{x^3}{6} + o(x^3)$，结果为 $-\\frac{1}{6}$。' },
    { type: 'blank', subject: 'calculus', difficulty: 'intermediate', question: '设 $z = e^{xy}$，则 $\\frac{\\partial^2 z}{\\partial x \\partial y}$ = ____', answer: 'e^(xy)(1+xy)', explanation: '$\\frac{\\partial^2 z}{\\partial x \\partial y} = e^{xy}(1+xy)$。' },
    { type: 'blank', subject: 'calculus', difficulty: 'intermediate', question: '积分 $\\int_0^{\\pi/2} \\sin^3 x \\cos^2 x \\, dx$ = ____', answer: '2/15', explanation: '令 $u = \\cos x$，计算得 $\\frac{2}{15}$。' },
    { type: 'blank', subject: 'linear', difficulty: 'basic', question: '设矩阵 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 2 & 3 \\end{pmatrix}$，则 $A$ 的秩 $r(A)$ = ____', answer: '1', explanation: '三行线性相关，只有一个线性无关的行向量，$r(A) = 1$。' },
    { type: 'blank', subject: 'linear', difficulty: 'intermediate', question: '设 $3$ 阶矩阵 $A$ 的特征值为 $1, 2, 3$，则 $|A^{-1} + E|$ = ____', answer: '4', explanation: '$A^{-1}+E$ 的特征值为 $2, \\frac{3}{2}, \\frac{4}{3}$，行列式为 $4$。' },
    { type: 'blank', subject: 'probability', difficulty: 'basic', question: '设随机变量 $X$ 服从参数为 $2$ 的指数分布，则 $E(X)$ = ____', answer: '1/2', explanation: '指数分布 $E(X) = \\frac{1}{\\lambda} = \\frac{1}{2}$。' },
    // 解答题
    { type: 'solve', subject: 'calculus', difficulty: 'advanced', question: '求极限 $\\lim_{n \\to \\infty} \\sqrt[n]{\\frac{(2n)!}{n!n^n}}$', answer: '4/e', explanation: '使用斯特林公式，结果为 $\\frac{4}{e}$。' },
    { type: 'solve', subject: 'linear', difficulty: 'advanced', question: '设矩阵 $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ -1 & 2 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix}$，求 $A$ 的特征值。', answer: '0, 1, 3', explanation: '特征值为 $\\lambda_1 = 0, \\lambda_2 = 1, \\lambda_3 = 3$。' },
    { type: 'solve', subject: 'probability', difficulty: 'intermediate', question: '设随机变量 $X$ 的概率密度函数为 $f(x) = Ae^{-2x}$ ($x>0$)，求常数 $A$ 和 $E(X)$。', answer: 'A=2, E(X)=1/2', explanation: '由归一化条件，$A=2$；$E(X) = \\frac{1}{2}$。' }
];

// ========== 专项练习状态 ==========
let exerciseState = {
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    startTime: null,
    isFinished: false
};

// ========== 主视图渲染 ==========

/**
 * 渲染练习测试视图
 */
function renderPracticeView() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">✍️ 练习测试</div>
            </div>

            <!-- 标签页切换 -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
                <button class="practice-tab active" data-tab="exam" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                    模拟试卷
                </button>
                <button class="practice-tab" data-tab="exercise" style="padding: 10px 20px; background: #f0f0f0; color: #666; border: none; border-radius: 5px; cursor: pointer;">
                    专项练习
                </button>
                <button class="practice-tab" data-tab="wrong" style="padding: 10px 20px; background: #f0f0f0; color: #666; border: none; border-radius: 5px; cursor: pointer;">
                    错题本
                </button>
            </div>

            <!-- 标签页内容 -->
            <div id="practice-content">
                <!-- 动态加载内容 -->
            </div>
        </div>
    `;

    // 绑定标签页切换事件
    document.querySelectorAll('.practice-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新标签样式
            document.querySelectorAll('.practice-tab').forEach(t => {
                t.style.background = '#f0f0f0';
                t.style.color = '#666';
                t.classList.remove('active');
            });
            this.style.background = 'var(--primary-color)';
            this.style.color = 'white';
            this.classList.add('active');

            // 切换内容
            const tabType = this.dataset.tab;
            loadPracticeTab(tabType);
        });
    });

    // 默认加载模拟试卷
    loadPracticeTab('exam');
}

/**
 * 加载练习测试标签页内容
 * @param {string} tabType - 标签页类型 (exam/exercise/wrong)
 */
function loadPracticeTab(tabType) {
    const contentDiv = document.getElementById('practice-content');

    if (tabType === 'exam') {
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <button class="btn btn-primary" onclick="startExam()" style="font-size: 18px; padding: 15px 40px;">
                    🎯 开始模拟考试
                </button>
                <p style="margin-top: 15px; color: #666;">
                    模拟试卷包含选择题、填空题、解答题，支持AI换题和解析功能
                </p>
            </div>
        `;
    } else if (tabType === 'exercise') {
        contentDiv.innerHTML = renderExerciseFilter();
    } else if (tabType === 'wrong') {
        contentDiv.innerHTML = renderWrongBook();
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([contentDiv]);
        }
    }
}

/**
 * 开始模拟考试
 */
function startExam() {
    // 切换到模拟考试视图
    viewManager.switchView('exam');
}

// ========== 专项练习函数 ==========

/**
 * 渲染专项练习筛选界面
 * @returns {string} 筛选界面HTML
 */
function renderExerciseFilter() {
    return `
        <div class="exercise-filter">
            <div class="filter-row">
                <div class="filter-group">
                    <label>学科：</label>
                    <select id="filterSubject" class="filter-select">
                        <option value="all">全部</option>
                        <option value="calculus">微积分</option>
                        <option value="linear">线性代数</option>
                        <option value="probability">概率论</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>难度：</label>
                    <select id="filterDifficulty" class="filter-select">
                        <option value="all">全部</option>
                        <option value="basic">基础</option>
                        <option value="intermediate">中等</option>
                        <option value="advanced">困难</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>题型：</label>
                    <select id="filterType" class="filter-select">
                        <option value="all">全部</option>
                        <option value="choice">选择题</option>
                        <option value="blank">填空题</option>
                        <option value="solve">解答题</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>题量：</label>
                    <select id="filterCount" class="filter-select">
                        <option value="5">5题</option>
                        <option value="10" selected>10题</option>
                        <option value="15">15题</option>
                        <option value="20">20题</option>
                    </select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" onclick="startExercise()">🎯 开始练习</button>
                <button class="btn btn-secondary" onclick="generateAIQuestion()">🤖 AI生成题目</button>
            </div>
            <div class="filter-info">
                <p>💡 从题库筛选或使用AI生成新题目进行练习</p>
            </div>
        </div>
    `;
}

/**
 * 开始专项练习
 */
function startExercise() {
    const subject = document.getElementById('filterSubject').value;
    const difficulty = document.getElementById('filterDifficulty').value;
    const type = document.getElementById('filterType').value;
    const count = parseInt(document.getElementById('filterCount').value);

    // 筛选题目
    let filtered = questionBank.filter(q => {
        if (subject !== 'all' && q.subject !== subject) return false;
        if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
        if (type !== 'all' && q.type !== type) return false;
        return true;
    });

    if (filtered.length === 0) {
        alert('没有符合条件的题目，请调整筛选条件');
        return;
    }

    // 随机选取
    filtered = shuffleArray(filtered).slice(0, Math.min(count, filtered.length));

    exerciseState = {
        questions: filtered,
        currentIndex: 0,
        userAnswers: new Array(filtered.length).fill(null),
        startTime: Date.now(),
        isFinished: false
    };

    renderExerciseQuestions();
}

/**
 * 随机打乱数组
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的新数组
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * 渲染答题界面
 */
function renderExerciseQuestions() {
    const contentDiv = document.getElementById('practice-content');
    const q = exerciseState.questions[exerciseState.currentIndex];
    const idx = exerciseState.currentIndex;
    const total = exerciseState.questions.length;

    let answerHTML = '';
    if (q.type === 'choice') {
        answerHTML = q.options.map((opt, i) => `
            <label class="exercise-option ${exerciseState.userAnswers[idx] === opt.charAt(0) ? 'selected' : ''}"
                   onclick="selectExerciseAnswer('${opt.charAt(0)}')">
                <input type="radio" name="answer" value="${opt.charAt(0)}"
                       ${exerciseState.userAnswers[idx] === opt.charAt(0) ? 'checked' : ''}>
                ${opt}
            </label>
        `).join('');
    } else if (q.type === 'blank') {
        answerHTML = `<input type="text" class="exercise-input" id="blankAnswer"
                      value="${exerciseState.userAnswers[idx] || ''}"
                      placeholder="请输入答案" onchange="saveBlankAnswer()">`;
    } else {
        answerHTML = `<textarea class="exercise-textarea" id="solveAnswer"
                      placeholder="请输入解答过程">${exerciseState.userAnswers[idx] || ''}</textarea>
                      <button class="btn btn-secondary" style="margin-top: 10px;" onclick="saveSolveAnswer()">保存答案</button>`;
    }

    const subjectNames = { calculus: '微积分', linear: '线代', probability: '概率论' };
    const difficultyNames = { basic: '基础', intermediate: '中等', advanced: '困难' };
    const typeNames = { choice: '选择题', blank: '填空题', solve: '解答题' };

    contentDiv.innerHTML = `
        <div class="exercise-container">
            <div class="exercise-header">
                <div class="exercise-progress">第 ${idx + 1} / ${total} 题</div>
                <div class="exercise-tags">
                    <span class="tag tag-${q.subject}">${subjectNames[q.subject]}</span>
                    <span class="tag tag-${q.difficulty}">${difficultyNames[q.difficulty]}</span>
                    <span class="tag">${typeNames[q.type]}</span>
                </div>
            </div>
            <div class="exercise-question">
                <div class="question-content">${q.question}</div>
                <div class="answer-area">${answerHTML}</div>
            </div>
            <div class="exercise-nav">
                <button class="btn btn-secondary" onclick="prevExerciseQuestion()" ${idx === 0 ? 'disabled' : ''}>上一题</button>
                <button class="btn btn-secondary" onclick="checkCurrentAnswer()">查看答案</button>
                ${idx < total - 1
                    ? '<button class="btn btn-primary" onclick="nextExerciseQuestion()">下一题</button>'
                    : '<button class="btn btn-success" onclick="submitExercise()">提交练习</button>'}
            </div>
            <div id="exercise-explanation" class="exercise-explanation" style="display: none;"></div>
        </div>
    `;

    // 渲染MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([contentDiv]);
    }
}

/**
 * 选择答案
 * @param {string} answer - 选择的答案
 */
function selectExerciseAnswer(answer) {
    exerciseState.userAnswers[exerciseState.currentIndex] = answer;
    renderExerciseQuestions();
}

/**
 * 保存填空答案
 */
function saveBlankAnswer() {
    const input = document.getElementById('blankAnswer');
    if (input) {
        exerciseState.userAnswers[exerciseState.currentIndex] = input.value;
    }
}

/**
 * 保存解答答案
 */
function saveSolveAnswer() {
    const textarea = document.getElementById('solveAnswer');
    if (textarea) {
        exerciseState.userAnswers[exerciseState.currentIndex] = textarea.value;
        alert('答案已保存');
    }
}

/**
 * 上一题
 */
function prevExerciseQuestion() {
    if (exerciseState.currentIndex > 0) {
        exerciseState.currentIndex--;
        renderExerciseQuestions();
    }
}

/**
 * 下一题
 */
function nextExerciseQuestion() {
    if (exerciseState.currentIndex < exerciseState.questions.length - 1) {
        exerciseState.currentIndex++;
        renderExerciseQuestions();
    }
}

/**
 * 查看当前题答案
 */
function checkCurrentAnswer() {
    const q = exerciseState.questions[exerciseState.currentIndex];
    const userAns = exerciseState.userAnswers[exerciseState.currentIndex];
    const isCorrect = normalizeExerciseAnswer(userAns) === normalizeExerciseAnswer(q.answer);

    const expDiv = document.getElementById('exercise-explanation');
    expDiv.innerHTML = `
        <div class="exp-header ${isCorrect ? 'correct' : 'wrong'}">
            ${isCorrect ? '✅ 回答正确' : '❌ 回答错误'}
        </div>
        <div class="exp-answer">
            <strong>正确答案：</strong>${q.answer}
            ${userAns ? `<br><strong>你的答案：</strong>${userAns}` : ''}
        </div>
        <div class="exp-detail">
            <strong>解析：</strong><br>${q.explanation}
        </div>
    `;
    expDiv.style.display = 'block';

    // 保存错题
    if (!isCorrect && userAns) {
        saveWrongQuestion(q, userAns);
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([expDiv]);
    }
}

/**
 * 标准化答案
 * @param {string} answer - 原始答案
 * @returns {string} 标准化后的答案
 */
function normalizeExerciseAnswer(answer) {
    if (!answer) return '';
    return answer.toString().trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * 提交练习
 */
function submitExercise() {
    const contentDiv = document.getElementById('practice-content');
    let correct = 0;
    const results = exerciseState.questions.map((q, i) => {
        const userAns = exerciseState.userAnswers[i];
        const isCorrect = normalizeExerciseAnswer(userAns) === normalizeExerciseAnswer(q.answer);
        if (isCorrect) correct++;
        if (!isCorrect && userAns) saveWrongQuestion(q, userAns);
        return { question: q, userAnswer: userAns, isCorrect };
    });

    const duration = Math.round((Date.now() - exerciseState.startTime) / 1000);
    const accuracy = Math.round((correct / exerciseState.questions.length) * 100);

    // 保存练习记录
    savePracticeRecord({
        date: new Date().toISOString(),
        type: 'exercise',
        questions: exerciseState.questions.length,
        correct: correct,
        accuracy: accuracy,
        duration: duration
    });

    contentDiv.innerHTML = `
        <div class="exercise-result">
            <div class="result-header">🎉 练习完成！</div>
            <div class="result-stats">
                <div class="stat-item">
                    <div class="stat-value">${correct}/${exerciseState.questions.length}</div>
                    <div class="stat-label">正确题数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value ${accuracy >= 60 ? 'good' : 'bad'}">${accuracy}%</div>
                    <div class="stat-label">正确率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatDuration(duration)}</div>
                    <div class="stat-label">用时</div>
                </div>
            </div>
            <div class="result-actions">
                <button class="btn btn-primary" onclick="loadPracticeTab('exercise')">再练一次</button>
                <button class="btn btn-secondary" onclick="loadPracticeTab('wrong')">查看错题本</button>
            </div>
        </div>
    `;
}

/**
 * 格式化时长
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时长
 */
function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return min > 0 ? `${min}分${sec}秒` : `${sec}秒`;
}

/**
 * AI生成题目
 */
async function generateAIQuestion() {
    if (!isAIConfigured()) {
        alert('请先在设置中配置AI模型');
        return;
    }

    const subject = document.getElementById('filterSubject').value;
    const difficulty = document.getElementById('filterDifficulty').value;
    const type = document.getElementById('filterType').value;

    const subjectNames = { all: '数学', calculus: '微积分', linear: '线性代数', probability: '概率论' };
    const difficultyNames = { all: '中等', basic: '基础', intermediate: '中等', advanced: '困难' };
    const typeNames = { all: '选择题', choice: '选择题', blank: '填空题', solve: '解答题' };

    const prompt = `请生成一道考研数学一${subjectNames[subject]}的${typeNames[type]}，难度为${difficultyNames[difficulty]}。

要求：
1. 题目符合考研数学一标准
2. 包含详细解析
3. 返回严格的JSON格式（不要有多余文字）:
${type === 'choice' || type === 'all' ?
`{"type":"choice","subject":"${subject === 'all' ? 'calculus' : subject}","difficulty":"${difficulty === 'all' ? 'intermediate' : difficulty}","question":"题目内容","options":["A. 选项1","B. 选项2","C. 选项3","D. 选项4"],"answer":"正确选项字母","explanation":"解析"}` :
type === 'blank' ?
`{"type":"blank","subject":"${subject === 'all' ? 'calculus' : subject}","difficulty":"${difficulty === 'all' ? 'intermediate' : difficulty}","question":"题目内容____","answer":"答案","explanation":"解析"}` :
`{"type":"solve","subject":"${subject === 'all' ? 'calculus' : subject}","difficulty":"${difficulty === 'all' ? 'intermediate' : difficulty}","question":"题目内容","answer":"答案","explanation":"解析"}`}`;

    const contentDiv = document.getElementById('practice-content');
    contentDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>AI正在生成题目...</div></div>';

    try {
        const response = await callAI([{ role: 'user', content: prompt }], { maxTokens: 2000 });
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const newQuestion = JSON.parse(jsonMatch[0]);
            exerciseState = {
                questions: [newQuestion],
                currentIndex: 0,
                userAnswers: [null],
                startTime: Date.now(),
                isFinished: false
            };
            renderExerciseQuestions();
        } else {
            throw new Error('AI返回格式错误');
        }
    } catch (error) {
        contentDiv.innerHTML = renderExerciseFilter();
        alert('AI生成题目失败: ' + error.message);
    }
}

// ========== 错题本函数 ==========

/**
 * 保存错题
 * @param {Object} question - 题目对象
 * @param {string} userAnswer - 用户答案
 */
function saveWrongQuestion(question, userAnswer) {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const qHash = JSON.stringify({ q: question.question, t: question.type });
    const existing = wrongQuestions.find(w => JSON.stringify({ q: w.question.question, t: w.question.type }) === qHash);

    let questionId;
    if (existing) {
        existing.wrongCount++;
        existing.lastWrongTime = new Date().toISOString();
        existing.userAnswer = userAnswer;
        questionId = existing.id;
    } else {
        questionId = 'wrong-' + Date.now();
        wrongQuestions.push({
            id: questionId,
            question: question,
            userAnswer: userAnswer,
            correctAnswer: question.answer,
            wrongCount: 1,
            lastWrongTime: new Date().toISOString(),
            status: 'active'
        });
    }
    dataManager.save('wrongQuestions', wrongQuestions);

    // 将错题添加到复习队列
    if (typeof ReviewScheduler !== 'undefined') {
        const shortQuestion = question.question.substring(0, 30) + (question.question.length > 30 ? '...' : '');
        ReviewScheduler.addToReview(questionId, 'wrongQuestion', shortQuestion, question.subject || 'calculus');
    }
}

/**
 * 渲染错题本
 * @returns {string} 错题本HTML
 */
function renderWrongBook() {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const showMastered = document.getElementById('showMastered')?.checked || false;
    const sortBy = document.getElementById('sortWrong')?.value || 'time';
    const filterSubject = document.getElementById('filterWrongSubject')?.value || 'all';

    let filtered = wrongQuestions.filter(w => {
        if (!showMastered && w.status === 'mastered') return false;
        if (filterSubject !== 'all' && w.question.subject !== filterSubject) return false;
        return true;
    });

    // 排序
    if (sortBy === 'time') {
        filtered.sort((a, b) => new Date(b.lastWrongTime) - new Date(a.lastWrongTime));
    } else if (sortBy === 'count') {
        filtered.sort((a, b) => b.wrongCount - a.wrongCount);
    }

    const subjectNames = { calculus: '微积分', linear: '线代', probability: '概率论' };

    if (filtered.length === 0) {
        return `
            <div class="wrong-book-header">
                ${renderWrongBookFilters()}
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">🎉</div>
                <div class="empty-state-text">暂无错题</div>
                <div class="empty-state-text" style="font-size: 14px; color: #aaa;">
                    做错的题目会自动收录到这里
                </div>
            </div>
        `;
    }

    const listHTML = filtered.map(w => {
        const preview = w.question.question.length > 80
            ? w.question.question.substring(0, 80) + '...'
            : w.question.question;
        return `
            <div class="wrong-item ${w.status === 'mastered' ? 'mastered' : ''}">
                <div class="wrong-item-content">
                    <div class="wrong-item-header">
                        <span class="tag tag-${w.question.subject}">${subjectNames[w.question.subject]}</span>
                        <span class="wrong-count">错 ${w.wrongCount} 次</span>
                    </div>
                    <div class="wrong-item-question">${preview}</div>
                    <div class="wrong-item-time">最近错误: ${new Date(w.lastWrongTime).toLocaleDateString()}</div>
                </div>
                <div class="wrong-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="redoWrongQuestion('${w.id}')">重做</button>
                    <button class="btn btn-sm btn-secondary" onclick="toggleMastered('${w.id}')">${w.status === 'mastered' ? '取消掌握' : '已掌握'}</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteWrongQuestion('${w.id}')">删除</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="wrong-book-header">
            ${renderWrongBookFilters()}
            <div class="wrong-book-actions">
                <button class="btn btn-secondary" onclick="exportWrongBook('json')">导出JSON</button>
                <button class="btn btn-secondary" onclick="exportWrongBook('md')">导出Markdown</button>
            </div>
        </div>
        <div class="wrong-book-stats">
            共 ${wrongQuestions.length} 道错题，${wrongQuestions.filter(w => w.status === 'mastered').length} 道已掌握
        </div>
        <div class="wrong-book-list">${listHTML}</div>
    `;
}

/**
 * 错题本筛选器
 * @returns {string} 筛选器HTML
 */
function renderWrongBookFilters() {
    return `
        <div class="wrong-filters">
            <select id="filterWrongSubject" class="filter-select" onchange="refreshWrongBook()">
                <option value="all">全部学科</option>
                <option value="calculus">微积分</option>
                <option value="linear">线性代数</option>
                <option value="probability">概率论</option>
            </select>
            <select id="sortWrong" class="filter-select" onchange="refreshWrongBook()">
                <option value="time">按时间排序</option>
                <option value="count">按错误次数</option>
            </select>
            <label class="checkbox-label">
                <input type="checkbox" id="showMastered" onchange="refreshWrongBook()">
                显示已掌握
            </label>
        </div>
    `;
}

/**
 * 刷新错题本
 */
function refreshWrongBook() {
    const contentDiv = document.getElementById('practice-content');
    contentDiv.innerHTML = renderWrongBook();
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([contentDiv]);
    }
}

/**
 * 重做错题
 * @param {string} id - 错题ID
 */
function redoWrongQuestion(id) {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const wrong = wrongQuestions.find(w => w.id === id);
    if (wrong) {
        exerciseState = {
            questions: [wrong.question],
            currentIndex: 0,
            userAnswers: [null],
            startTime: Date.now(),
            isFinished: false
        };
        renderExerciseQuestions();
    }
}

/**
 * 标记已掌握/取消
 * @param {string} id - 错题ID
 */
function toggleMastered(id) {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const wrong = wrongQuestions.find(w => w.id === id);
    if (wrong) {
        wrong.status = wrong.status === 'mastered' ? 'active' : 'mastered';
        dataManager.save('wrongQuestions', wrongQuestions);
        refreshWrongBook();
    }
}

/**
 * 删除错题
 * @param {string} id - 错题ID
 */
function deleteWrongQuestion(id) {
    if (!confirm('确定要删除这道错题吗？')) return;
    let wrongQuestions = dataManager.load('wrongQuestions', []);
    wrongQuestions = wrongQuestions.filter(w => w.id !== id);
    dataManager.save('wrongQuestions', wrongQuestions);
    refreshWrongBook();
}

/**
 * 导出错题本
 * @param {string} format - 导出格式 (json/md)
 */
function exportWrongBook(format) {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    if (wrongQuestions.length === 0) {
        alert('错题本为空');
        return;
    }

    let content, filename, type;
    const subjectNames = { calculus: '微积分', linear: '线性代数', probability: '概率论' };

    if (format === 'json') {
        content = JSON.stringify(wrongQuestions, null, 2);
        filename = `错题本_${new Date().toISOString().split('T')[0]}.json`;
        type = 'application/json';
    } else {
        content = `# 错题本\n\n导出时间: ${new Date().toLocaleString()}\n\n`;
        wrongQuestions.forEach((w, i) => {
            content += `## ${i + 1}. ${subjectNames[w.question.subject]} (错${w.wrongCount}次)\n\n`;
            content += `**题目:** ${w.question.question}\n\n`;
            if (w.question.options) {
                content += `**选项:**\n${w.question.options.join('\n')}\n\n`;
            }
            content += `**正确答案:** ${w.correctAnswer}\n\n`;
            content += `**你的答案:** ${w.userAnswer}\n\n`;
            content += `**解析:** ${w.question.explanation}\n\n---\n\n`;
        });
        filename = `错题本_${new Date().toISOString().split('T')[0]}.md`;
        type = 'text/markdown';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== 练习记录统计 ==========

/**
 * 保存练习记录
 * @param {Object} record - 练习记录对象
 */
function savePracticeRecord(record) {
    const history = dataManager.load('practiceHistory', []);
    history.push(record);
    dataManager.save('practiceHistory', history);
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('practice', renderPracticeView) 注册
