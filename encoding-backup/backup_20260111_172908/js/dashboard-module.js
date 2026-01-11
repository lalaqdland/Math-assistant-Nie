/**
 * 首页仪表板模块 - 考研数学学习助手
 * 包含仪表板渲染、统计计算、任务管理等功能
 */

// ========== 首页/仪表板渲染 ==========

/**
 * 渲染首页仪表板
 */
function renderDashboard() {
    const container = document.getElementById('view-container');

    // 获取数据
    const examDate = new Date('2026-12-23');
    const today = new Date();
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    // 激励语句
    const motivations = [
        '每一道题都是通往成功的阶梯',
        '坚持就是胜利，今天也要加油！',
        '千里之行，始于足下',
        '学习是最好的投资',
        '今天的努力是明天的收获',
        '相信自己，你可以的！'
    ];
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];

    // 获取学习数据
    const plan = dataManager.load('studyPlan', null);
    const progress = dataManager.load('learningProgress', {});
    const knowledgeTree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());

    // 计算统计数据
    const stats = calculateDashboardStats(plan, progress, knowledgeTree);

    container.innerHTML = `
        <div class="dashboard-container">
            <!-- 欢迎区域 -->
            <div class="welcome-section">
                <div class="welcome-content">
                    <h2>🎓 欢迎回来！</h2>
                    <div class="date-info">📅 ${dateStr}</div>
                    <div class="motivation">💬 "${motivation}"</div>
                </div>
                <div class="countdown-box">
                    <div class="countdown-number">${daysLeft}</div>
                    <div class="countdown-label">天后考研</div>
                </div>
            </div>

            <!-- 统计卡片 -->
            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-icon blue">📋</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.todayTaskCount}</div>
                        <div class="stat-label">今日任务</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.todayCompletionRate}%</div>
                        <div class="stat-label">今日完成率</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🔥</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.streakDays}</div>
                        <div class="stat-label">连续学习天数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">📚</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.completedUnits}/${stats.totalUnits}</div>
                        <div class="stat-label">知识点进度</div>
                    </div>
                </div>
            </div>

            <!-- 主内容区 -->
            <div class="dashboard-main">
                <!-- 今日待复习 -->
                <div id="review-reminder-container">
                    ${typeof renderReviewReminder === 'function' ? renderReviewReminder() : ''}
                </div>

                <!-- 今日任务 -->
                <div class="today-tasks-card">
                    <div class="card-header-row">
                        <h3>📋 今日学习任务</h3>
                        <span class="task-progress-mini">${stats.todayCompletedTasks}/${stats.todayTaskCount} 已完成</span>
                    </div>
                    <div class="dashboard-task-list" id="dashboard-task-list">
                        ${renderDashboardTasks(plan)}
                    </div>
                </div>

                <!-- 学习进度与快捷入口 -->
                <div class="progress-actions-card">
                    <!-- 进度图表 -->
                    <div class="progress-charts-section">
                        <h3>📊 学习进度</h3>
                        <div class="charts-row">
                            <div class="chart-item">
                                <div class="chart-wrapper">
                                    <canvas id="chart-calculus"></canvas>
                                    <div class="chart-center-text">${stats.subjectProgress.calculus}%</div>
                                </div>
                                <div class="chart-label">微积分</div>
                            </div>
                            <div class="chart-item">
                                <div class="chart-wrapper">
                                    <canvas id="chart-linear"></canvas>
                                    <div class="chart-center-text">${stats.subjectProgress.linearAlgebra}%</div>
                                </div>
                                <div class="chart-label">线性代数</div>
                            </div>
                            <div class="chart-item">
                                <div class="chart-wrapper">
                                    <canvas id="chart-prob"></canvas>
                                    <div class="chart-center-text">${stats.subjectProgress.probability}%</div>
                                </div>
                                <div class="chart-label">概率论</div>
                            </div>
                        </div>
                    </div>

                    <!-- 快捷入口 -->
                    <div class="quick-actions-section">
                        <h3>🚀 快捷入口</h3>
                        <div class="quick-actions-grid">
                            <button class="quick-action-btn" onclick="viewManager.switchView('knowledge')">
                                <span class="action-icon">📖</span>
                                <span class="action-text">继续学习</span>
                            </button>
                            <button class="quick-action-btn" onclick="viewManager.switchView('practice')">
                                <span class="action-icon">✍️</span>
                                <span class="action-text">开始练习</span>
                            </button>
                            <button class="quick-action-btn" onclick="viewManager.switchView('plan')">
                                <span class="action-icon">📅</span>
                                <span class="action-text">学习规划</span>
                            </button>
                            <button class="quick-action-btn" onclick="viewManager.switchView('ai-tutor')">
                                <span class="action-icon">🤖</span>
                                <span class="action-text">AI助教</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 最近活动 -->
            <div class="recent-activity-card">
                <h3>📝 最近学习活动</h3>
                <div class="activity-list" id="activity-list">
                    ${renderRecentActivity(progress)}
                </div>
            </div>
        </div>
    `;

    // 初始化图表
    initDashboardCharts(stats.subjectProgress);
}

// ========== 统计计算函数 ==========

/**
 * 计算仪表板统计数据
 * @param {Object} plan - 学习规划数据
 * @param {Object} progress - 学习进度数据
 * @param {Object} knowledgeTree - 知识点树数据
 * @returns {Object} 统计数据对象
 */
function calculateDashboardStats(plan, progress, knowledgeTree) {
    // 计算知识点统计
    let totalUnits = 0;
    let completedUnits = 0;
    const subjectProgress = { calculus: 0, linearAlgebra: 0, probability: 0 };
    const subjectTotal = { calculus: 0, linearAlgebra: 0, probability: 0 };

    for (const [subjectKey, subject] of Object.entries(knowledgeTree)) {
        for (const chapter of subject.chapters) {
            for (const unit of chapter.units) {
                totalUnits++;
                subjectTotal[subjectKey]++;
                const status = progress[unit.id]?.status;
                if (status === 'completed' || status === 'mastered') {
                    completedUnits++;
                    subjectProgress[subjectKey]++;
                }
            }
        }
    }

    // 计算各科目百分比
    for (const key of Object.keys(subjectProgress)) {
        subjectProgress[key] = subjectTotal[key] > 0
            ? Math.round((subjectProgress[key] / subjectTotal[key]) * 100)
            : 0;
    }

    // 今日任务统计
    let todayTaskCount = 0;
    let todayCompletedTasks = 0;
    if (plan && plan.dailyTasks) {
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = plan.dailyTasks.find(dt => dt.date === today);
        if (todayTasks && todayTasks.tasks) {
            todayTaskCount = todayTasks.tasks.length;
            todayCompletedTasks = todayTasks.tasks.filter(t => t.status === 'completed').length;
        }
    }

    // 连续学习天数
    const streakDays = calculateStreakDays(progress);

    return {
        totalUnits,
        completedUnits,
        subjectProgress,
        todayTaskCount,
        todayCompletedTasks,
        todayCompletionRate: todayTaskCount > 0 ? Math.round((todayCompletedTasks / todayTaskCount) * 100) : 0,
        streakDays
    };
}

/**
 * 计算连续学习天数
 * @param {Object} progress - 学习进度数据
 * @returns {number} 连续学习天数
 */
function calculateStreakDays(progress) {
    const dates = new Set();
    for (const data of Object.values(progress)) {
        if (data.lastStudied) {
            dates.add(data.lastStudied.split('T')[0]);
        }
    }

    if (dates.size === 0) return 0;

    const sortedDates = Array.from(dates).sort().reverse();
    const today = new Date().toISOString().split('T')[0];

    // 检查今天或昨天是否学习
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!dates.has(today) && !dates.has(yesterdayStr)) {
        return 0;
    }

    let streak = 0;
    let checkDate = dates.has(today) ? new Date() : yesterday;

    while (dates.has(checkDate.toISOString().split('T')[0])) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
}

// ========== 今日任务相关函数 ==========

/**
 * 渲染今日任务列表
 * @param {Object} plan - 学习规划数据
 * @returns {string} 任务列表HTML
 */
function renderDashboardTasks(plan) {
    if (!plan || !plan.dailyTasks) {
        return `
            <div class="no-tasks-message">
                <div class="icon">📋</div>
                <div>暂无学习规划</div>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="viewManager.switchView('plan')">
                    创建学习规划
                </button>
            </div>
        `;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayTasks = plan.dailyTasks.find(dt => dt.date === today);

    if (!todayTasks || todayTasks.tasks.length === 0) {
        return `
            <div class="no-tasks-message">
                <div class="icon">✅</div>
                <div>今日没有安排学习任务</div>
            </div>
        `;
    }

    return todayTasks.tasks.map(task => {
        const isCompleted = task.status === 'completed';
        const taskName = task.knowledgeName || task.description || '学习任务';
        const taskType = task.type === 'knowledge' ? '📖 知识点'
            : task.type === 'practice' ? '✍️ 练习'
            : '🔄 复习';

        return `
            <div class="dashboard-task-item ${isCompleted ? 'completed' : ''}"
                 onclick="toggleDashboardTask('${task.id}')">
                <div class="task-checkbox ${isCompleted ? 'checked' : ''}">
                    ${isCompleted ? '✓' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${taskName}</div>
                    <div class="task-subtitle">${taskType}</div>
                </div>
                <div class="task-duration">${task.duration}分钟</div>
            </div>
        `;
    }).join('');
}

/**
 * 切换任务完成状态
 * @param {string} taskId - 任务ID
 */
function toggleDashboardTask(taskId) {
    const plan = dataManager.load('studyPlan', null);
    if (!plan || !plan.dailyTasks) return;

    const today = new Date().toISOString().split('T')[0];
    const todayTasks = plan.dailyTasks.find(dt => dt.date === today);
    if (!todayTasks) return;

    const task = todayTasks.tasks.find(t => t.id === taskId);
    if (!task) return;

    // 切换状态
    task.status = task.status === 'completed' ? 'pending' : 'completed';

    // 保存并刷新
    dataManager.save('studyPlan', plan);
    renderDashboard();
}

// ========== 最近活动相关函数 ==========

/**
 * 渲染最近活动列表
 * @param {Object} progress - 学习进度数据
 * @returns {string} 活动列表HTML
 */
function renderRecentActivity(progress) {
    const activities = [];

    for (const [unitId, data] of Object.entries(progress)) {
        if (data.lastStudied) {
            activities.push({
                unitId,
                unitName: data.unitName || unitId,
                subject: data.subject || 'calculus',
                lastStudied: data.lastStudied,
                status: data.status
            });
        }
    }

    if (activities.length === 0) {
        return `
            <div class="no-activity-message">
                <div>暂无学习记录</div>
                <div style="margin-top: 10px;">开始学习，记录将显示在这里</div>
            </div>
        `;
    }

    // 按时间排序，取最近5个
    activities.sort((a, b) => new Date(b.lastStudied) - new Date(a.lastStudied));
    const recentActivities = activities.slice(0, 5);

    const subjectNames = {
        calculus: '微积分',
        linearAlgebra: '线代',
        probability: '概率论'
    };

    return recentActivities.map(activity => {
        const timeAgo = getTimeAgo(activity.lastStudied);
        const subjectName = subjectNames[activity.subject] || activity.subject;

        return `
            <div class="activity-item" onclick="goToKnowledge('${activity.unitId}')">
                <div class="activity-icon">📖</div>
                <div class="activity-info">
                    <div class="activity-title">${activity.unitName}</div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
                <span class="activity-badge ${activity.subject}">${subjectName}</span>
            </div>
        `;
    }).join('');
}

/**
 * 计算时间差描述
 * @param {string} dateStr - 日期字符串
 * @returns {string} 时间差描述
 */
function getTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
}

/**
 * 跳转到知识点页面
 * @param {string} unitId - 知识点ID
 */
function goToKnowledge(unitId) {
    // 保存要跳转的知识点ID
    dataManager.save('targetKnowledgeId', unitId);
    viewManager.switchView('knowledge');
}

// ========== 图表初始化 ==========

/**
 * 初始化仪表板图表
 * @param {Object} subjectProgress - 各科目进度数据
 */
function initDashboardCharts(subjectProgress) {
    const chartConfig = (progress, color) => ({
        type: 'doughnut',
        data: {
            datasets: [{
                data: [progress, 100 - progress],
                backgroundColor: [color, '#e0e0e0'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    // 微积分图表
    const ctx1 = document.getElementById('chart-calculus');
    if (ctx1) new Chart(ctx1, chartConfig(subjectProgress.calculus, '#2196F3'));

    // 线性代数图表
    const ctx2 = document.getElementById('chart-linear');
    if (ctx2) new Chart(ctx2, chartConfig(subjectProgress.linearAlgebra, '#4CAF50'));

    // 概率论图表
    const ctx3 = document.getElementById('chart-prob');
    if (ctx3) new Chart(ctx3, chartConfig(subjectProgress.probability, '#FF9800'));
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('dashboard', renderDashboard) 注册
