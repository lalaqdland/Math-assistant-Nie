/**
 * 日历组件模块 - 考研数学学习助手
 * 提供月历视图，显示每日学习任务状态
 *
 * 依赖：
 * - data-manager.js (dataManager)
 * - plan-module.js (学习规划数据)
 */

// ==================== 日历组件类 ====================

/**
 * 日历组件类
 * @param {String} containerId 容器元素ID
 * @param {Object} options 配置选项
 */
class CalendarWidget {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            startDate: options.startDate || null,  // 规划开始日期
            endDate: options.endDate || null,      // 规划结束日期
            showOutOfRange: options.showOutOfRange !== false,  // 是否显示范围外日期
            ...options
        };

        // 当前显示的年月
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();  // 0-11

        // 任务数据 (dailyTasks 数组)
        this.taskData = [];

        // 任务数据映射 (date -> dayData)
        this.taskMap = new Map();

        // 日期点击回调
        this.dateClickCallback = null;

        // 选中的日期
        this.selectedDate = null;

        // 星期标题
        this.weekdays = ['日', '一', '二', '三', '四', '五', '六'];

        console.log('[CalendarWidget] 日历组件初始化');
    }

    /**
     * 设置任务数据
     * @param {Array} dailyTasks 每日任务数组
     */
    setTaskData(dailyTasks) {
        this.taskData = dailyTasks || [];
        this.taskMap.clear();

        // 构建日期->任务映射
        this.taskData.forEach(dayData => {
            if (dayData.date) {
                this.taskMap.set(dayData.date, dayData);
            }
        });

        console.log(`[CalendarWidget] 已加载 ${this.taskMap.size} 天的任务数据`);
    }

    /**
     * 设置日期点击回调
     * @param {Function} callback 回调函数 (date: string) => void
     */
    onDateClick(callback) {
        this.dateClickCallback = callback;
    }

    /**
     * 切换到指定月份
     * @param {Number} year 年份
     * @param {Number} month 月份 (0-11)
     */
    setMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        this.render();
    }

    /**
     * 上一个月
     */
    prevMonth() {
        if (this.currentMonth === 0) {
            this.currentYear--;
            this.currentMonth = 11;
        } else {
            this.currentMonth--;
        }
        this.render();
    }

    /**
     * 下一个月
     */
    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentYear++;
            this.currentMonth = 0;
        } else {
            this.currentMonth++;
        }
        this.render();
    }

    /**
     * 跳转到今天
     */
    goToToday() {
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        this.selectedDate = this.formatDate(now);
        this.render();

        // 触发点击回调
        if (this.dateClickCallback) {
            this.dateClickCallback(this.selectedDate);
        }
    }

    /**
     * 格式化日期为 YYYY-MM-DD
     * @param {Date} date 日期对象
     * @returns {String} 格式化的日期字符串
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 获取指定日期的任务状态
     * @param {String} dateStr 日期字符串 YYYY-MM-DD
     * @returns {Object} 状态对象 { hasTask, status, taskCount, completedCount }
     */
    getTaskStatus(dateStr) {
        const dayData = this.taskMap.get(dateStr);

        if (!dayData || !dayData.tasks || dayData.tasks.length === 0) {
            return { hasTask: false, status: 'none', taskCount: 0, completedCount: 0 };
        }

        const tasks = dayData.tasks;
        const taskCount = tasks.length;
        const completedCount = tasks.filter(t => t.status === 'completed').length;

        let status;
        if (completedCount === 0) {
            status = 'pending';
        } else if (completedCount === taskCount) {
            status = 'completed';
        } else {
            status = 'partial';
        }

        return { hasTask: true, status, taskCount, completedCount };
    }

    /**
     * 判断日期是否在规划范围内
     * @param {String} dateStr 日期字符串
     * @returns {Boolean}
     */
    isInRange(dateStr) {
        if (!this.options.startDate && !this.options.endDate) {
            return true;
        }

        const date = new Date(dateStr);

        if (this.options.startDate) {
            const start = new Date(this.options.startDate);
            if (date < start) return false;
        }

        if (this.options.endDate) {
            const end = new Date(this.options.endDate);
            if (date > end) return false;
        }

        return true;
    }

    /**
     * 获取月份的天数
     * @param {Number} year 年份
     * @param {Number} month 月份 (0-11)
     * @returns {Number} 天数
     */
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * 获取月份第一天是星期几
     * @param {Number} year 年份
     * @param {Number} month 月份 (0-11)
     * @returns {Number} 星期几 (0-6, 0=星期日)
     */
    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    /**
     * 渲染日历
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('[CalendarWidget] 容器不存在:', this.containerId);
            return;
        }

        const today = this.formatDate(new Date());
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                           '七月', '八月', '九月', '十月', '十一月', '十二月'];

        // 计算日历数据
        const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
        const firstDay = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);

        // 计算上月需要显示的天数
        const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);

        // 生成日历HTML
        let html = `
            <div class="calendar-widget">
                <!-- 日历头部 -->
                <div class="calendar-header">
                    <button class="calendar-nav-btn" onclick="calendarWidget.prevMonth()" title="上一个月">
                        <span>&lt;</span>
                    </button>
                    <div class="calendar-title">
                        <span class="calendar-year-month">${this.currentYear}年 ${monthNames[this.currentMonth]}</span>
                    </div>
                    <button class="calendar-nav-btn" onclick="calendarWidget.nextMonth()" title="下一个月">
                        <span>&gt;</span>
                    </button>
                    <button class="calendar-today-btn" onclick="calendarWidget.goToToday()" title="回到今天">
                        今天
                    </button>
                </div>

                <!-- 星期标题 -->
                <div class="calendar-weekdays">
                    ${this.weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
                </div>

                <!-- 日期网格 -->
                <div class="calendar-grid">
        `;

        // 填充上月的日期
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const taskStatus = this.getTaskStatus(dateStr);
            const inRange = this.isInRange(dateStr);

            html += this.renderDayCell(day, dateStr, taskStatus, today, false, inRange);
        }

        // 填充当月的日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const taskStatus = this.getTaskStatus(dateStr);
            const inRange = this.isInRange(dateStr);

            html += this.renderDayCell(day, dateStr, taskStatus, today, true, inRange);
        }

        // 填充下月的日期
        const totalCells = firstDay + daysInMonth;
        const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
        const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
        const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;

        for (let day = 1; day <= remainingCells; day++) {
            const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const taskStatus = this.getTaskStatus(dateStr);
            const inRange = this.isInRange(dateStr);

            html += this.renderDayCell(day, dateStr, taskStatus, today, false, inRange);
        }

        html += `
                </div>

                <!-- 图例 -->
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-dot pending"></span>
                        <span>待完成</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot partial"></span>
                        <span>部分完成</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot completed"></span>
                        <span>全部完成</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * 渲染单个日期单元格
     * @param {Number} day 日期数字
     * @param {String} dateStr 日期字符串
     * @param {Object} taskStatus 任务状态
     * @param {String} today 今天的日期字符串
     * @param {Boolean} isCurrentMonth 是否当前月
     * @param {Boolean} inRange 是否在规划范围内
     * @returns {String} HTML字符串
     */
    renderDayCell(day, dateStr, taskStatus, today, isCurrentMonth, inRange) {
        const classes = ['calendar-day'];

        if (!isCurrentMonth) {
            classes.push('other-month');
        }

        if (dateStr === today) {
            classes.push('today');
        }

        if (dateStr === this.selectedDate) {
            classes.push('selected');
        }

        if (!inRange && this.options.startDate) {
            classes.push('out-of-range');
        }

        if (taskStatus.hasTask) {
            classes.push('has-task');
            classes.push(`task-${taskStatus.status}`);
        }

        // 任务指示器
        let indicator = '';
        if (taskStatus.hasTask) {
            indicator = `<span class="task-indicator ${taskStatus.status}" title="${taskStatus.completedCount}/${taskStatus.taskCount} 完成"></span>`;
        }

        return `
            <div class="${classes.join(' ')}"
                 data-date="${dateStr}"
                 onclick="calendarWidget.handleDateClick('${dateStr}')">
                <span class="day-number">${day}</span>
                ${indicator}
            </div>
        `;
    }

    /**
     * 处理日期点击
     * @param {String} dateStr 日期字符串
     */
    handleDateClick(dateStr) {
        this.selectedDate = dateStr;
        this.render();  // 重新渲染以更新选中状态

        if (this.dateClickCallback) {
            this.dateClickCallback(dateStr);
        }
    }
}

// ==================== 日期任务详情面板 ====================

/**
 * 渲染日期任务详情面板
 * @param {String} date 日期字符串
 * @param {Object} plan 规划对象
 * @param {String} containerId 容器ID
 */
function renderDateTasksPanel(date, plan, containerId = 'date-tasks-panel') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const dayData = plan.dailyTasks.find(d => d.date === date);

    // 格式化日期显示
    const dateObj = new Date(date);
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dateDisplay = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ${weekdays[dateObj.getDay()]}`;

    // 判断是否是今天
    const today = new Date();
    const isToday = date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (!dayData || !dayData.tasks || dayData.tasks.length === 0) {
        container.innerHTML = `
            <div class="date-tasks-panel">
                <div class="panel-header">
                    <h4>${dateDisplay}${isToday ? ' <span class="today-badge">今天</span>' : ''}</h4>
                </div>
                <div class="panel-empty">
                    <span class="empty-icon">📅</span>
                    <p>这一天没有安排学习任务</p>
                </div>
            </div>
        `;
        return;
    }

    const tasks = dayData.tasks;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const totalDuration = dayData.totalDuration || tasks.reduce((sum, t) => sum + (t.duration || 0), 0);

    container.innerHTML = `
        <div class="date-tasks-panel">
            <div class="panel-header">
                <h4>${dateDisplay}${isToday ? ' <span class="today-badge">今天</span>' : ''}</h4>
                <div class="panel-stats">
                    <span class="stat-item">${completedCount}/${tasks.length} 完成</span>
                    <span class="stat-item">${totalDuration}分钟</span>
                </div>
            </div>
            <div class="panel-task-list">
                ${tasks.map(task => renderDateTaskItem(task)).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染单个任务项
 * @param {Object} task 任务对象
 * @returns {String} HTML字符串
 */
function renderDateTaskItem(task) {
    const typeIcons = {
        'knowledge': '📖',
        'practice': '✍️',
        'review': '🔄'
    };
    const typeNames = {
        'knowledge': '知识点学习',
        'practice': '练习测试',
        'review': '复习巩固'
    };
    const difficultyMap = {
        'basic': '基础',
        'intermediate': '中等',
        'advanced': '进阶'
    };
    const statusMap = {
        'pending': '待完成',
        'in_progress': '进行中',
        'completed': '已完成',
        'skipped': '已跳过'
    };

    const taskName = task.knowledgeName || task.description || '学习任务';
    const typeIcon = typeIcons[task.type] || '📋';
    const typeName = typeNames[task.type] || task.type;
    const difficulty = task.difficulty ? difficultyMap[task.difficulty] : '';
    const status = statusMap[task.status] || task.status;

    // 点击跳转逻辑
    let onclick = '';
    if (task.type === 'knowledge' && task.knowledgeId) {
        onclick = `onclick="goToKnowledge('${task.knowledgeId}')"`;
    }

    return `
        <div class="date-task-item status-${task.status}" ${onclick}>
            <div class="task-icon">${typeIcon}</div>
            <div class="task-info">
                <div class="task-name">${taskName}</div>
                <div class="task-meta">
                    <span>${typeName}</span>
                    ${difficulty ? `<span class="dot-separator">·</span><span>${difficulty}</span>` : ''}
                    <span class="dot-separator">·</span>
                    <span>${task.duration || 30}分钟</span>
                </div>
            </div>
            <div class="task-status">
                <span class="status-badge status-${task.status}">${status}</span>
            </div>
        </div>
    `;
}

/**
 * 跳转到知识点学习页面
 * @param {String} knowledgeId 知识点ID
 */
function goToKnowledge(knowledgeId) {
    if (typeof viewManager !== 'undefined' && viewManager.switchView) {
        // 保存要显示的知识点ID
        sessionStorage.setItem('targetKnowledgeId', knowledgeId);
        viewManager.switchView('knowledge');
    }
}

// ==================== 全局日历实例 ====================

// 全局日历实例（在plan-module.js中初始化）
let calendarWidget = null;

/**
 * 初始化日历组件
 * @param {Object} plan 学习规划对象
 */
function initCalendarWidget(plan) {
    if (!plan || !plan.dailyTasks) {
        console.warn('[CalendarWidget] 规划数据不完整');
        return;
    }

    calendarWidget = new CalendarWidget('plan-calendar-container', {
        startDate: plan.config?.startDate,
        endDate: plan.config?.endDate
    });

    calendarWidget.setTaskData(plan.dailyTasks);

    calendarWidget.onDateClick(date => {
        renderDateTasksPanel(date, plan);
    });

    calendarWidget.render();

    // 默认显示今天的任务
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    calendarWidget.selectedDate = todayStr;
    calendarWidget.render();
    renderDateTasksPanel(todayStr, plan);

    console.log('[CalendarWidget] 日历组件初始化完成');
}

console.log('[CalendarModule] 日历模块加载完成');
