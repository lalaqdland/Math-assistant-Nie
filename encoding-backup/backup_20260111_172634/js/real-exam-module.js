/**
 * 历年真题模块 - 考研数学学习助手
 * 包含真题选择、考试模式、成绩分析等功能
 */

// ========== 真题考试状态 ==========
const realExamState = {
    currentYear: null,
    currentIndex: 0,
    answers: {},
    marked: [],
    startTime: null,
    timeUsed: 0,
    timerInterval: null,
    status: 'idle', // idle, in_progress, completed
    questions: [],  // 扁平化的题目列表
    view: 'selection' // selection, exam, result, history
};

// ========== 主视图入口 ==========

/**
 * 渲染历年真题视图
 */
function renderRealExamView() {
    const container = document.getElementById('view-container');

    // 检查是否有进行中的考试
    const savedState = loadRealExamState();
    if (savedState && savedState.status === 'in_progress') {
        // 恢复进行中的考试
        Object.assign(realExamState, savedState);
        realExamState.view = 'exam';
        renderRealExamQuestions();
        startTimer(false); // 恢复计时
        return;
    }

    // 默认显示年份选择
    realExamState.view = 'selection';
    renderYearSelection();
}

// ========== 年份选择界面 ==========

/**
 * 渲染年份选择界面
 */
function renderYearSelection() {
    const container = document.getElementById('view-container');
    const years = getAvailableYears();

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">📝 历年真题</div>
                <button class="btn btn-secondary" onclick="renderScoreHistory()">📊 历史成绩</button>
            </div>

            <div class="real-exam-intro">
                <p>选择年份开始模拟考试，体验真实考研数学一试卷</p>
                <ul>
                    <li>📋 每套试卷包含10道选择题、6道填空题、9道解答题</li>
                    <li>⏱️ 考试时间180分钟，支持暂停和恢复</li>
                    <li>💾 答题自动保存，刷新页面可继续</li>
                </ul>
            </div>

            <div class="year-grid">
                ${years.map(year => renderYearCard(year)).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染年份卡片
 * @param {number} year - 年份
 * @returns {string} 卡片HTML
 */
function renderYearCard(year) {
    const hasData = hasExamData(year);
    const status = getYearStatus(year);
    const scoreLine = getScoreLine(year);
    const questionCount = getQuestionCount(year);

    let statusIcon, statusText, statusClass;
    switch (status) {
        case 'completed':
            statusIcon = '✅';
            statusText = '已完成';
            statusClass = 'status-completed';
            break;
        case 'in_progress':
            statusIcon = '⏳';
            statusText = '进行中';
            statusClass = 'status-progress';
            break;
        default:
            statusIcon = '📋';
            statusText = hasData ? '未开始' : '敬请期待';
            statusClass = hasData ? 'status-pending' : 'status-disabled';
    }

    return `
        <div class="year-card ${statusClass} ${!hasData ? 'disabled' : ''}"
             onclick="${hasData ? `startRealExam(${year})` : ''}">
            <div class="year-card-header">
                <span class="year-number">${year}</span>
                <span class="year-status">${statusIcon}</span>
            </div>
            <div class="year-card-body">
                <div class="year-info">
                    <span>📚 ${questionCount}道题</span>
                    <span>💯 150分</span>
                </div>
                <div class="year-score-line">
                    国家线: ${scoreLine.national}分
                </div>
            </div>
            <div class="year-card-footer">
                <span class="status-text">${statusText}</span>
            </div>
        </div>
    `;
}

/**
 * 获取年份完成状态
 * @param {number} year - 年份
 * @returns {string} 状态 (completed/in_progress/pending)
 */
function getYearStatus(year) {
    const records = dataManager.load('realExamRecords', {});
    if (records[year] && records[year].length > 0) {
        return 'completed';
    }
    const savedState = loadRealExamState();
    if (savedState && savedState.currentYear === year && savedState.status === 'in_progress') {
        return 'in_progress';
    }
    return 'pending';
}

// ========== 考试模式 ==========

/**
 * 开始真题考试
 * @param {number} year - 年份
 */
function startRealExam(year) {
    const exam = getRealExamByYear(year);
    if (!exam) {
        alert('该年份真题数据暂未录入');
        return;
    }

    // 检查是否有该年份进行中的考试
    const savedState = loadRealExamState();
    if (savedState && savedState.currentYear === year && savedState.status === 'in_progress') {
        if (confirm('检测到该年份有未完成的考试，是否继续？\n点击"取消"将重新开始。')) {
            Object.assign(realExamState, savedState);
            realExamState.view = 'exam';
            renderRealExamQuestions();
            startTimer(false);
            return;
        }
    }

    // 构建扁平化题目列表
    const questions = [];
    let index = 0;

    // 选择题
    exam.sections.choice.questions.forEach((q, i) => {
        questions.push({
            ...q,
            globalIndex: index++,
            sectionIndex: i,
            section: 'choice',
            score: exam.sections.choice.scorePerQuestion
        });
    });

    // 填空题
    exam.sections.blank.questions.forEach((q, i) => {
        questions.push({
            ...q,
            globalIndex: index++,
            sectionIndex: i,
            section: 'blank',
            score: exam.sections.blank.scorePerQuestion
        });
    });

    // 解答题
    exam.sections.solve.questions.forEach((q, i) => {
        questions.push({
            ...q,
            globalIndex: index++,
            sectionIndex: i,
            section: 'solve',
            score: exam.sections.solve.scores[i]
        });
    });

    if (questions.length === 0) {
        alert('该年份真题数据暂未录入');
        return;
    }

    // 初始化考试状态
    realExamState.currentYear = year;
    realExamState.currentIndex = 0;
    realExamState.answers = {};
    realExamState.marked = [];
    realExamState.startTime = new Date().toISOString();
    realExamState.timeUsed = 0;
    realExamState.status = 'in_progress';
    realExamState.questions = questions;
    realExamState.view = 'exam';

    saveRealExamState();
    renderRealExamQuestions();
    startTimer(true);
}

/**
 * 渲染考试界面
 */
function renderRealExamQuestions() {
    const container = document.getElementById('view-container');
    const exam = getRealExamByYear(realExamState.currentYear);
    const currentQ = realExamState.questions[realExamState.currentIndex];

    if (!currentQ) {
        renderYearSelection();
        return;
    }

    const totalQuestions = realExamState.questions.length;
    const answeredCount = Object.keys(realExamState.answers).length;

    container.innerHTML = `
        <div class="real-exam-container">
            <!-- 顶部状态栏 -->
            <div class="real-exam-header">
                <div class="exam-title">${realExamState.currentYear}年考研数学一真题</div>
                <div class="exam-timer" id="examTimer">⏱️ 03:00:00</div>
                <div class="exam-progress">进度 ${answeredCount}/${totalQuestions}</div>
                <div class="exam-actions">
                    <button class="btn btn-secondary btn-sm" onclick="pauseRealExam()">暂停</button>
                    <button class="btn btn-primary btn-sm" onclick="confirmSubmitRealExam()">交卷</button>
                </div>
            </div>

            <!-- 主内容区 -->
            <div class="real-exam-main">
                <!-- 左侧答题卡 -->
                <div class="answer-sheet">
                    <div class="sheet-title">答题卡</div>
                    ${renderAnswerSheet()}
                </div>

                <!-- 右侧题目区 -->
                <div class="question-panel">
                    ${renderCurrentQuestion(currentQ)}
                </div>
            </div>
        </div>
    `;

    updateTimerDisplay();

    // 渲染MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([container]);
    }
}

/**
 * 渲染答题卡
 * @returns {string} 答题卡HTML
 */
function renderAnswerSheet() {
    const sections = [
        { name: '选择题', type: 'choice', start: 0, count: 10 },
        { name: '填空题', type: 'blank', start: 10, count: 6 },
        { name: '解答题', type: 'solve', start: 16, count: 9 }
    ];

    let html = '';
    sections.forEach(section => {
        html += `<div class="sheet-section">
            <div class="section-name">${section.name}</div>
            <div class="sheet-grid">`;

        for (let i = 0; i < section.count; i++) {
            const globalIndex = section.start + i;
            if (globalIndex >= realExamState.questions.length) break;

            const q = realExamState.questions[globalIndex];
            const isAnswered = realExamState.answers[q.id] !== undefined;
            const isMarked = realExamState.marked.includes(q.id);
            const isCurrent = globalIndex === realExamState.currentIndex;

            let statusClass = '';
            if (isCurrent) statusClass = 'current';
            else if (isMarked) statusClass = 'marked';
            else if (isAnswered) statusClass = 'answered';

            html += `<div class="sheet-item ${statusClass}" onclick="selectRealExamQuestion(${globalIndex})">
                ${globalIndex + 1}
            </div>`;
        }

        html += `</div></div>`;
    });

    // 图例
    html += `
        <div class="sheet-legend">
            <span><i class="dot current"></i>当前</span>
            <span><i class="dot answered"></i>已答</span>
            <span><i class="dot marked"></i>标记</span>
        </div>
    `;

    return html;
}

/**
 * 渲染当前题目
 * @param {Object} question - 题目对象
 * @returns {string} 题目HTML
 */
function renderCurrentQuestion(question) {
    const isMarked = realExamState.marked.includes(question.id);
    const userAnswer = realExamState.answers[question.id] || '';

    const sectionNames = { choice: '选择题', blank: '填空题', solve: '解答题' };

    let answerHTML = '';
    if (question.type === 'choice') {
        answerHTML = question.options.map((opt, i) => {
            const letter = opt.charAt(0);
            const isSelected = userAnswer === letter;
            return `
                <label class="choice-option ${isSelected ? 'selected' : ''}"
                       onclick="saveRealExamAnswer('${question.id}', '${letter}')">
                    <input type="radio" name="answer" value="${letter}" ${isSelected ? 'checked' : ''}>
                    ${opt}
                </label>
            `;
        }).join('');
    } else if (question.type === 'blank') {
        answerHTML = `
            <input type="text" class="blank-input" id="blankAnswer"
                   value="${userAnswer}" placeholder="请输入答案"
                   onchange="saveRealExamAnswer('${question.id}', this.value)">
        `;
    } else {
        answerHTML = `
            <textarea class="solve-textarea" id="solveAnswer"
                      placeholder="请输入解答过程..."
                      onchange="saveRealExamAnswer('${question.id}', this.value)">${userAnswer}</textarea>
        `;
    }

    return `
        <div class="question-header">
            <span class="question-number">第 ${question.globalIndex + 1} 题</span>
            <span class="question-type">[${sectionNames[question.section]}]</span>
            <span class="question-score">${question.score}分</span>
        </div>
        <div class="question-content">${question.content}</div>
        <div class="answer-area">${answerHTML}</div>
        <div class="question-nav">
            <button class="btn btn-secondary" onclick="prevRealExamQuestion()"
                    ${realExamState.currentIndex === 0 ? 'disabled' : ''}>上一题</button>
            <button class="btn ${isMarked ? 'btn-warning' : 'btn-secondary'}"
                    onclick="toggleRealExamMark('${question.id}')">
                ${isMarked ? '⭐ 取消标记' : '☆ 标记'}
            </button>
            <button class="btn btn-primary" onclick="nextRealExamQuestion()"
                    ${realExamState.currentIndex === realExamState.questions.length - 1 ? 'disabled' : ''}>下一题</button>
        </div>
    `;
}

// ========== 答题操作 ==========

/**
 * 切换到指定题目
 * @param {number} index - 题目索引
 */
function selectRealExamQuestion(index) {
    if (index >= 0 && index < realExamState.questions.length) {
        realExamState.currentIndex = index;
        saveRealExamState();
        renderRealExamQuestions();
    }
}

/**
 * 上一题
 */
function prevRealExamQuestion() {
    if (realExamState.currentIndex > 0) {
        realExamState.currentIndex--;
        saveRealExamState();
        renderRealExamQuestions();
    }
}

/**
 * 下一题
 */
function nextRealExamQuestion() {
    if (realExamState.currentIndex < realExamState.questions.length - 1) {
        realExamState.currentIndex++;
        saveRealExamState();
        renderRealExamQuestions();
    }
}

/**
 * 保存答案
 * @param {string} questionId - 题目ID
 * @param {string} answer - 答案
 */
function saveRealExamAnswer(questionId, answer) {
    realExamState.answers[questionId] = answer;
    saveRealExamState();

    // 更新答题卡显示
    const sheet = document.querySelector('.answer-sheet');
    if (sheet) {
        sheet.innerHTML = renderAnswerSheet();
    }

    // 更新进度显示
    const progressEl = document.querySelector('.exam-progress');
    if (progressEl) {
        const answeredCount = Object.keys(realExamState.answers).length;
        progressEl.textContent = `进度 ${answeredCount}/${realExamState.questions.length}`;
    }
}

/**
 * 切换标记状态
 * @param {string} questionId - 题目ID
 */
function toggleRealExamMark(questionId) {
    const index = realExamState.marked.indexOf(questionId);
    if (index > -1) {
        realExamState.marked.splice(index, 1);
    } else {
        realExamState.marked.push(questionId);
    }
    saveRealExamState();
    renderRealExamQuestions();
}

// ========== 计时器 ==========

/**
 * 启动计时器
 * @param {boolean} isNew - 是否新考试
 */
function startTimer(isNew) {
    if (realExamState.timerInterval) {
        clearInterval(realExamState.timerInterval);
    }

    const exam = getRealExamByYear(realExamState.currentYear);
    const totalSeconds = exam ? exam.timeLimit * 60 : 10800; // 默认3小时

    realExamState.timerInterval = setInterval(() => {
        realExamState.timeUsed++;
        const remaining = totalSeconds - realExamState.timeUsed;

        if (remaining <= 0) {
            clearInterval(realExamState.timerInterval);
            alert('考试时间到！将自动交卷。');
            submitRealExam();
            return;
        }

        if (remaining === 1800) { // 30分钟提醒
            alert('提醒：距离考试结束还有30分钟！');
        }

        updateTimerDisplay();

        // 每30秒自动保存
        if (realExamState.timeUsed % 30 === 0) {
            saveRealExamState();
        }
    }, 1000);
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const timerEl = document.getElementById('examTimer');
    if (!timerEl) return;

    const exam = getRealExamByYear(realExamState.currentYear);
    const totalSeconds = exam ? exam.timeLimit * 60 : 10800;
    const remaining = totalSeconds - realExamState.timeUsed;

    timerEl.textContent = `⏱️ ${formatExamTime(remaining)}`;

    if (remaining < 1800) {
        timerEl.style.color = '#f44336'; // 红色警告
    }
}

/**
 * 格式化时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化时间
 */
function formatExamTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * 暂停考试
 */
function pauseRealExam() {
    if (realExamState.timerInterval) {
        clearInterval(realExamState.timerInterval);
        realExamState.timerInterval = null;
    }
    saveRealExamState();

    if (confirm('考试已暂停。是否返回年份选择？\n点击"确定"返回，点击"取消"继续考试。')) {
        realExamState.view = 'selection';
        renderYearSelection();
    } else {
        startTimer(false);
    }
}

// ========== 状态保存与恢复 ==========

/**
 * 保存考试状态
 */
function saveRealExamState() {
    const stateToSave = {
        currentYear: realExamState.currentYear,
        currentIndex: realExamState.currentIndex,
        answers: realExamState.answers,
        marked: realExamState.marked,
        startTime: realExamState.startTime,
        timeUsed: realExamState.timeUsed,
        status: realExamState.status,
        questions: realExamState.questions
    };
    dataManager.save('realExamState', stateToSave);
}

/**
 * 加载考试状态
 * @returns {Object|null} 保存的状态
 */
function loadRealExamState() {
    return dataManager.load('realExamState', null);
}

/**
 * 清除考试状态
 */
function clearRealExamState() {
    dataManager.remove('realExamState');
    realExamState.status = 'idle';
    realExamState.currentYear = null;
    realExamState.answers = {};
    realExamState.marked = [];
    realExamState.questions = [];
    if (realExamState.timerInterval) {
        clearInterval(realExamState.timerInterval);
        realExamState.timerInterval = null;
    }
}

// ========== 交卷与成绩 ==========

/**
 * 确认交卷
 */
function confirmSubmitRealExam() {
    const answeredCount = Object.keys(realExamState.answers).length;
    const totalCount = realExamState.questions.length;
    const markedCount = realExamState.marked.length;

    let message = `已答${answeredCount}/${totalCount}题。`;
    if (markedCount > 0) {
        message += `\n还有${markedCount}道标记题目未检查。`;
    }
    if (answeredCount < totalCount) {
        message += `\n还有${totalCount - answeredCount}道题目未作答。`;
    }
    message += '\n\n确定要交卷吗？';

    if (confirm(message)) {
        submitRealExam();
    }
}

/**
 * 提交考试
 */
function submitRealExam() {
    if (realExamState.timerInterval) {
        clearInterval(realExamState.timerInterval);
        realExamState.timerInterval = null;
    }

    realExamState.status = 'completed';

    // 计算成绩
    const result = calculateRealExamScore();

    // 保存成绩记录
    saveExamRecord(result);

    // 清除进行中状态
    clearRealExamState();

    // 显示成绩
    renderRealExamResult(result);
}

/**
 * 计算成绩
 * @returns {Object} 成绩结果
 */
function calculateRealExamScore() {
    let totalScore = 0;
    let maxScore = 0;
    const sectionScores = { choice: 0, blank: 0, solve: 0 };
    const sectionMax = { choice: 0, blank: 0, solve: 0 };
    const details = [];

    realExamState.questions.forEach(q => {
        maxScore += q.score;
        sectionMax[q.section] += q.score;

        const userAnswer = realExamState.answers[q.id] || '';
        let isCorrect = false;
        let earnedScore = 0;

        if (q.type === 'choice') {
            isCorrect = userAnswer.toUpperCase() === q.answer.toUpperCase();
            earnedScore = isCorrect ? q.score : 0;
        } else if (q.type === 'blank') {
            // 填空题支持多种正确答案
            const normalizedUser = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
            const acceptedAnswers = q.acceptedAnswers || [q.answer];
            isCorrect = acceptedAnswers.some(ans =>
                normalizedUser === ans.toLowerCase().replace(/\s+/g, '')
            );
            earnedScore = isCorrect ? q.score : 0;
        } else {
            // 解答题暂时不自动评分，需要人工评分
            earnedScore = 0;
            isCorrect = null; // null 表示待评分
        }

        totalScore += earnedScore;
        sectionScores[q.section] += earnedScore;

        details.push({
            id: q.id,
            section: q.section,
            globalIndex: q.globalIndex,
            score: q.score,
            earnedScore,
            isCorrect,
            userAnswer,
            correctAnswer: q.answer
        });
    });

    return {
        year: realExamState.currentYear,
        totalScore,
        maxScore,
        sectionScores,
        sectionMax,
        timeUsed: realExamState.timeUsed,
        completedAt: new Date().toISOString(),
        details
    };
}

/**
 * 保存成绩记录
 * @param {Object} result - 成绩结果
 */
function saveExamRecord(result) {
    const records = dataManager.load('realExamRecords', {});
    if (!records[result.year]) {
        records[result.year] = [];
    }
    records[result.year].push({
        score: result.totalScore,
        maxScore: result.maxScore,
        timeUsed: result.timeUsed,
        completedAt: result.completedAt,
        sectionScores: result.sectionScores
    });
    dataManager.save('realExamRecords', records);
}

/**
 * 渲染成绩结果页面
 * @param {Object} result - 成绩结果
 */
function renderRealExamResult(result) {
    const container = document.getElementById('view-container');
    const scoreLine = getScoreLine(result.year);
    const passNational = result.totalScore >= scoreLine.national;

    const timeStr = formatExamTime(result.timeUsed);

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">🎉 考试完成</div>
            </div>

            <div class="result-summary">
                <div class="result-year">${result.year}年考研数学一</div>
                <div class="result-score ${passNational ? 'pass' : 'fail'}">
                    <span class="score-value">${result.totalScore}</span>
                    <span class="score-max">/ ${result.maxScore}</span>
                </div>
                <div class="result-line">
                    国家线 ${scoreLine.national}分 |
                    ${passNational ? '✅ 已过线' : '❌ 未过线'}
                </div>
                <div class="result-time">用时: ${timeStr}</div>
            </div>

            <div class="result-sections">
                <h3>各题型得分</h3>
                <div class="section-scores">
                    <div class="section-score-item">
                        <div class="section-name">选择题</div>
                        <div class="section-score">${result.sectionScores.choice} / ${result.sectionMax.choice}</div>
                        <div class="section-bar">
                            <div class="section-bar-fill" style="width: ${(result.sectionScores.choice / result.sectionMax.choice * 100) || 0}%"></div>
                        </div>
                    </div>
                    <div class="section-score-item">
                        <div class="section-name">填空题</div>
                        <div class="section-score">${result.sectionScores.blank} / ${result.sectionMax.blank}</div>
                        <div class="section-bar">
                            <div class="section-bar-fill" style="width: ${(result.sectionScores.blank / result.sectionMax.blank * 100) || 0}%"></div>
                        </div>
                    </div>
                    <div class="section-score-item">
                        <div class="section-name">解答题</div>
                        <div class="section-score">${result.sectionScores.solve} / ${result.sectionMax.solve}</div>
                        <div class="section-bar">
                            <div class="section-bar-fill" style="width: ${(result.sectionScores.solve / result.sectionMax.solve * 100) || 0}%"></div>
                        </div>
                        <div class="section-note">（解答题需人工评分）</div>
                    </div>
                </div>
            </div>

            <div class="result-actions">
                <button class="btn btn-primary" onclick="renderYearSelection()">返回选题</button>
                <button class="btn btn-secondary" onclick="renderScoreHistory()">查看历史</button>
            </div>
        </div>
    `;
}

// ========== 历史成绩 ==========

/**
 * 渲染历史成绩页面
 */
function renderScoreHistory() {
    const container = document.getElementById('view-container');
    const records = dataManager.load('realExamRecords', {});
    const years = Object.keys(records).sort((a, b) => b - a);

    if (years.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">📊 历史成绩</div>
                    <button class="btn btn-secondary" onclick="renderYearSelection()">返回</button>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">暂无考试记录</div>
                    <button class="btn btn-primary" onclick="renderYearSelection()">开始做题</button>
                </div>
            </div>
        `;
        return;
    }

    let historyHTML = '';
    years.forEach(year => {
        const yearRecords = records[year];
        const scoreLine = getScoreLine(parseInt(year));

        historyHTML += `
            <div class="history-year">
                <div class="history-year-header">
                    <span class="year-label">${year}年</span>
                    <span class="record-count">共${yearRecords.length}次</span>
                </div>
                <div class="history-records">
                    ${yearRecords.map((r, i) => {
                        const pass = r.score >= scoreLine.national;
                        return `
                            <div class="history-record ${pass ? 'pass' : 'fail'}">
                                <span class="record-index">#${i + 1}</span>
                                <span class="record-score">${r.score}分</span>
                                <span class="record-status">${pass ? '✅' : '❌'}</span>
                                <span class="record-time">${formatExamTime(r.timeUsed)}</span>
                                <span class="record-date">${new Date(r.completedAt).toLocaleDateString()}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">📊 历史成绩</div>
                <button class="btn btn-secondary" onclick="renderYearSelection()">返回</button>
            </div>
            <div class="history-list">
                ${historyHTML}
            </div>
        </div>
    `;
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('real-exam', renderRealExamView) 注册
