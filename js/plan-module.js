/**
 * 学习规划模块 - 考研数学学习助手
 * 包含基础规划生成器、AI智能规划器、规划UI等功能
 *
 * 依赖：
 * - data-manager.js (dataManager)
 * - knowledge-data.js (getDefaultKnowledgeTree)
 * - ai-adapter.js (callAI, isAIConfigured)
 */

// ==================== 全局状态 ====================
let currentPlanMode = 'basic';  // 'basic' | 'ai'
let currentPlan = null;         // 当前生成的规划

// ==================== 基础规划生成器 ====================

/**
 * 基础规划生成器类
 * 根据配置生成结构化的学习规划
 */
class BasicPlanGenerator {
    constructor(config) {
        this.config = config;
        this.knowledgeTree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
        this.progress = dataManager.load('learningProgress', {});
    }

    /**
     * 生成完整学习规划
     * @returns {Object} 完整的学习规划对象
     */
    generate() {
        console.log('[BasicPlanGenerator] 开始生成规划...');

        try {
            // 1. 计算时间分配
            const timeAllocation = this.calculateTimeAllocation();
            console.log('[BasicPlanGenerator] 时间分配:', timeAllocation);

            // 2. 划分三阶段
            const phases = this.dividePhases(timeAllocation);
            console.log('[BasicPlanGenerator] 阶段划分:', phases);

            // 3. 分配知识点到每个阶段
            const knowledgeAllocation = this.allocateKnowledge(phases);
            console.log('[BasicPlanGenerator] 知识点分配:', knowledgeAllocation);

            // 4. 生成每日任务
            const dailyTasks = this.generateDailyTasks(knowledgeAllocation, phases);
            console.log('[BasicPlanGenerator] 每日任务数量:', dailyTasks.length);

            // 5. 组装规划数据
            const plan = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                config: this.config,
                phases: phases,
                dailyTasks: dailyTasks,
                statistics: this.calculateStatistics(timeAllocation, dailyTasks),
                aiRecommendations: []
            };

            console.log('[BasicPlanGenerator] 规划生成完成');
            return plan;

        } catch (error) {
            console.error('[BasicPlanGenerator] 生成规划失败:', error);
            throw new Error(`规划生成失败: ${error.message}`);
        }
    }

    /**
     * 计算时间分配
     * @returns {Object} 时间分配信息
     */
    calculateTimeAllocation() {
        const startDate = new Date(this.config.startDate);
        const endDate = new Date(this.config.endDate);

        // 计算总天数
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // 计算工作日和周末
        let workdays = 0;
        let weekends = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekends++;
            } else {
                workdays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 计算总学习小时数
        const totalHours = totalDays * this.config.dailyStudyHours;

        return {
            totalDays,
            workdays,
            weekends,
            totalHours,
            subjectHours: {
                calculus: totalHours * this.config.subjectRatio.calculus,
                linearAlgebra: totalHours * this.config.subjectRatio.linearAlgebra,
                probability: totalHours * this.config.subjectRatio.probability
            }
        };
    }

    /**
     * 划分三阶段 (基础40% / 强化40% / 冲刺20%)
     * @param {Object} timeAllocation 时间分配信息
     * @returns {Array} 三个阶段的信息数组
     */
    dividePhases(timeAllocation) {
        const startDate = new Date(this.config.startDate);
        const endDate = new Date(this.config.endDate);
        const totalDays = timeAllocation.totalDays;

        // 基础阶段: 40%
        const basicDays = Math.floor(totalDays * 0.4);
        const basicEndDate = new Date(startDate);
        basicEndDate.setDate(basicEndDate.getDate() + basicDays - 1);

        // 强化阶段: 40%
        const reinforceDays = Math.floor(totalDays * 0.4);
        const reinforceStartDate = new Date(basicEndDate);
        reinforceStartDate.setDate(reinforceStartDate.getDate() + 1);
        const reinforceEndDate = new Date(reinforceStartDate);
        reinforceEndDate.setDate(reinforceEndDate.getDate() + reinforceDays - 1);

        // 冲刺阶段: 剩余时间
        const sprintStartDate = new Date(reinforceEndDate);
        sprintStartDate.setDate(sprintStartDate.getDate() + 1);
        const sprintDays = totalDays - basicDays - reinforceDays;

        return [
            {
                name: '基础阶段',
                description: '全面学习所有知识点，打牢基础',
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(basicEndDate),
                days: basicDays,
                progress: 0,
                goals: [
                    '完成所有基础和中等难度知识点学习',
                    '理解核心概念和公式',
                    '完成每个知识点的基础练习'
                ]
            },
            {
                name: '强化阶段',
                description: '强化重点难点，提升解题能力',
                startDate: this.formatDate(reinforceStartDate),
                endDate: this.formatDate(reinforceEndDate),
                days: reinforceDays,
                progress: 0,
                goals: [
                    '攻克高级难度知识点',
                    '提升解题速度和准确率',
                    '完成综合性练习题'
                ]
            },
            {
                name: '冲刺阶段',
                description: '真题模拟，查漏补缺',
                startDate: this.formatDate(sprintStartDate),
                endDate: this.formatDate(endDate),
                days: sprintDays,
                progress: 0,
                goals: [
                    '完成历年真题模拟',
                    '复习薄弱知识点',
                    '调整考试状态'
                ]
            }
        ];
    }

    /**
     * 分配知识点到各阶段
     * @param {Array} phases 阶段信息数组
     * @returns {Object} 知识点分配结果
     */
    allocateKnowledge(phases) {
        const allocation = {
            basic: [],      // 基础阶段学习的知识点
            reinforce: [],  // 强化阶段学习的知识点
            sprint: []      // 冲刺阶段复习的知识点
        };

        // 遍历所有知识点
        for (const [subjectKey, subject] of Object.entries(this.knowledgeTree)) {
            for (const chapter of subject.chapters) {
                for (const unit of chapter.units) {
                    const unitStatus = this.progress[unit.id]?.status;

                    // 已掌握的知识点在冲刺阶段复习
                    if (unitStatus === 'mastered' || unitStatus === 'completed') {
                        allocation.sprint.push({
                            unitId: unit.id,
                            unitName: unit.name,
                            subject: subjectKey,
                            difficulty: unit.difficulty,
                            chapterName: chapter.name
                        });
                    }
                    // 根据难度分配到基础或强化阶段
                    else if (unit.difficulty === 'basic' || unit.difficulty === 'intermediate') {
                        allocation.basic.push({
                            unitId: unit.id,
                            unitName: unit.name,
                            subject: subjectKey,
                            difficulty: unit.difficulty,
                            chapterName: chapter.name
                        });
                    } else if (unit.difficulty === 'advanced') {
                        allocation.reinforce.push({
                            unitId: unit.id,
                            unitName: unit.name,
                            subject: subjectKey,
                            difficulty: unit.difficulty,
                            chapterName: chapter.name
                        });
                    }
                }
            }
        }

        return allocation;
    }

    /**
     * 生成每日任务
     * @param {Object} knowledgeAllocation 知识点分配结果
     * @param {Array} phases 阶段信息
     * @returns {Array} 每日任务数组
     */
    generateDailyTasks(knowledgeAllocation, phases) {
        const dailyTasks = [];

        // 基础阶段任务
        const basicUnits = knowledgeAllocation.basic;
        const basicPhase = phases[0];
        if (basicUnits.length > 0) {
            this.assignTasksToPhase(
                dailyTasks,
                basicUnits,
                basicPhase.startDate,
                basicPhase.endDate
            );
        }

        // 强化阶段任务
        const reinforceUnits = knowledgeAllocation.reinforce;
        const reinforcePhase = phases[1];
        if (reinforceUnits.length > 0) {
            this.assignTasksToPhase(
                dailyTasks,
                reinforceUnits,
                reinforcePhase.startDate,
                reinforcePhase.endDate
            );
        }

        // 冲刺阶段任务 (复习 + 做题)
        const sprintPhase = phases[2];
        this.assignSprintTasks(
            dailyTasks,
            knowledgeAllocation.sprint,
            sprintPhase.startDate,
            sprintPhase.endDate
        );

        return dailyTasks;
    }

    /**
     * 分配任务到指定阶段
     * @param {Array} dailyTasks 每日任务数组
     * @param {Array} units 知识点数组
     * @param {String} startDateStr 开始日期字符串
     * @param {String} endDateStr 结束日期字符串
     */
    assignTasksToPhase(dailyTasks, units, startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // 将知识点均匀分配到这个阶段的每一天
        const unitsPerDay = Math.max(1, Math.ceil(units.length / days));
        let unitIndex = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= endDate && unitIndex < units.length) {
            const todayUnits = [];
            let todayDuration = 0;

            // 每天分配若干个知识点
            for (let i = 0; i < unitsPerDay && unitIndex < units.length; i++) {
                const unit = units[unitIndex];
                const duration = this.estimateDuration(unit.difficulty);

                // 检查是否超过每日学习时长
                if (todayDuration + duration <= this.config.dailyStudyHours * 60) {
                    todayUnits.push(unit);
                    todayDuration += duration;
                    unitIndex++;
                } else {
                    break;  // 今天的任务已满，明天继续
                }
            }

            if (todayUnits.length > 0) {
                dailyTasks.push({
                    date: this.formatDate(currentDate),
                    tasks: todayUnits.map((unit, idx) => ({
                        id: `task-${this.formatDate(currentDate)}-${idx}`,
                        type: 'knowledge',
                        knowledgeId: unit.unitId,
                        knowledgeName: unit.unitName,
                        subject: unit.subject,
                        difficulty: unit.difficulty,
                        chapterName: unit.chapterName,
                        duration: this.estimateDuration(unit.difficulty),
                        status: 'pending'
                    })),
                    totalDuration: todayDuration,
                    completedDuration: 0
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    /**
     * 分配冲刺阶段任务
     * @param {Array} dailyTasks 每日任务数组
     * @param {Array} reviewUnits 需要复习的知识点
     * @param {String} startDateStr 开始日期字符串
     * @param {String} endDateStr 结束日期字符串
     */
    assignSprintTasks(dailyTasks, reviewUnits, startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        let currentDate = new Date(startDate);
        let reviewIndex = 0;

        while (currentDate <= endDate) {
            const tasks = [];
            let todayDuration = 0;

            // 模拟考试 (隔天进行)
            const daysSinceStart = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
            if (daysSinceStart % 2 === 0) {
                tasks.push({
                    id: `task-${this.formatDate(currentDate)}-exam`,
                    type: 'practice',
                    description: '模拟考试',
                    duration: 180,  // 3小时
                    status: 'pending'
                });
                todayDuration += 180;
            } else {
                // 复习知识点
                if (reviewUnits.length > 0) {
                    const reviewUnit = reviewUnits[reviewIndex % reviewUnits.length];
                    tasks.push({
                        id: `task-${this.formatDate(currentDate)}-review`,
                        type: 'review',
                        knowledgeId: reviewUnit.unitId,
                        knowledgeName: reviewUnit.unitName,
                        subject: reviewUnit.subject,
                        description: `复习: ${reviewUnit.unitName}`,
                        duration: 60,  // 1小时复习
                        status: 'pending'
                    });
                    todayDuration += 60;
                    reviewIndex++;
                }

                // 错题复习
                tasks.push({
                    id: `task-${this.formatDate(currentDate)}-mistakes`,
                    type: 'review',
                    description: '错题复习',
                    duration: 60,
                    status: 'pending'
                });
                todayDuration += 60;
            }

            if (tasks.length > 0) {
                dailyTasks.push({
                    date: this.formatDate(currentDate),
                    tasks: tasks,
                    totalDuration: Math.min(todayDuration, this.config.dailyStudyHours * 60),
                    completedDuration: 0
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    /**
     * 估计知识点学习时长 (分钟)
     * @param {String} difficulty 难度级别
     * @returns {Number} 时长(分钟)
     */
    estimateDuration(difficulty) {
        const durationMap = {
            'basic': 60,        // 1小时
            'intermediate': 90,  // 1.5小时
            'advanced': 120     // 2小时
        };
        return durationMap[difficulty] || 60;
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
     * 计算统计数据
     * @param {Object} timeAllocation 时间分配
     * @param {Array} dailyTasks 每日任务数组
     * @returns {Object} 统计数据
     */
    calculateStatistics(timeAllocation, dailyTasks) {
        const totalUnits = this.getTotalKnowledgePoints();
        const completedUnits = Object.values(this.progress).filter(
            p => p.status === 'completed' || p.status === 'mastered'
        ).length;

        return {
            totalDays: timeAllocation.totalDays,
            workdays: timeAllocation.workdays,
            weekends: timeAllocation.weekends,
            elapsedDays: 0,
            remainingDays: timeAllocation.totalDays,
            totalKnowledgePoints: totalUnits,
            completedKnowledgePoints: completedUnits,
            completionRate: totalUnits > 0 ? completedUnits / totalUnits : 0,
            totalStudyHours: 0,
            plannedTotalHours: timeAllocation.totalHours,
            averageDailyHours: 0,
            subjectProgress: this.calculateSubjectProgress()
        };
    }

    /**
     * 获取总知识点数
     * @returns {Number} 总知识点数
     */
    getTotalKnowledgePoints() {
        let total = 0;
        for (const subject of Object.values(this.knowledgeTree)) {
            for (const chapter of subject.chapters) {
                total += chapter.units.length;
            }
        }
        return total;
    }

    /**
     * 计算各学科进度
     * @returns {Object} 学科进度对象
     */
    calculateSubjectProgress() {
        const subjects = {};

        for (const [subjectKey, subject] of Object.entries(this.knowledgeTree)) {
            let total = 0;
            let completed = 0;

            for (const chapter of subject.chapters) {
                total += chapter.units.length;
                for (const unit of chapter.units) {
                    const status = this.progress[unit.id]?.status;
                    if (status === 'completed' || status === 'mastered') {
                        completed++;
                    }
                }
            }

            subjects[subjectKey] = {
                total,
                completed,
                progress: total > 0 ? completed / total : 0
            };
        }

        return subjects;
    }
}

// ==================== AI智能规划生成器 ====================

/**
 * AI智能规划生成器类
 * 使用AI分析学习情况，生成个性化规划
 */
class AIPlanGenerator {
    constructor(config) {
        this.config = config;
        this.knowledgeTree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
        this.progress = dataManager.load('learningProgress', {});
    }

    /**
     * 生成AI智能规划
     * @returns {Object} 完整的学习规划对象
     */
    async generate() {
        console.log('[AIPlanGenerator] 开始生成AI规划...');

        try {
            // 1. 分析当前学习状况
            const analysis = this.analyzeCurrentStatus();
            console.log('[AIPlanGenerator] 学习状况分析:', analysis);

            // 2. 调用AI生成个性化规划
            const aiPlan = await this.callAIForPlan(analysis);
            console.log('[AIPlanGenerator] AI返回规划');

            // 3. 解析AI返回的规划
            const parsedPlan = this.parseAIPlan(aiPlan);
            console.log('[AIPlanGenerator] 规划解析完成');

            // 4. 生成每日任务（复用基础规划器的逻辑）
            const basicGen = new BasicPlanGenerator(this.config);
            const knowledgeAllocation = basicGen.allocateKnowledge(parsedPlan.phases);
            const dailyTasks = basicGen.generateDailyTasks(knowledgeAllocation, parsedPlan.phases);

            // 5. 组装完整规划
            const plan = {
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                config: this.config,
                phases: parsedPlan.phases,
                dailyTasks: dailyTasks,
                statistics: basicGen.calculateStatistics(
                    basicGen.calculateTimeAllocation(),
                    dailyTasks
                ),
                aiRecommendations: parsedPlan.recommendations || []
            };

            console.log('[AIPlanGenerator] AI规划生成完成');
            return plan;

        } catch (error) {
            console.error('[AIPlanGenerator] AI规划生成失败:', error);
            console.log('[AIPlanGenerator] 降级到基础规划');

            // 降级到基础规划
            const basicGen = new BasicPlanGenerator(this.config);
            return basicGen.generate();
        }
    }

    /**
     * 分析当前学习状况
     * @returns {Object} 学习状况分析结果
     */
    analyzeCurrentStatus() {
        const subjects = {
            calculus: { completed: [], learning: [], notStarted: [] },
            linearAlgebra: { completed: [], learning: [], notStarted: [] },
            probability: { completed: [], learning: [], notStarted: [] }
        };

        // 统计各科目学习情况
        for (const [subjectKey, subject] of Object.entries(this.knowledgeTree)) {
            for (const chapter of subject.chapters) {
                for (const unit of chapter.units) {
                    const status = this.progress[unit.id]?.status || 'not-started';

                    if (status === 'completed' || status === 'mastered') {
                        subjects[subjectKey].completed.push(unit.name);
                    } else if (status === 'learning') {
                        subjects[subjectKey].learning.push(unit.name);
                    } else {
                        subjects[subjectKey].notStarted.push(unit.name);
                    }
                }
            }
        }

        // 识别薄弱环节
        const weaknesses = [];
        for (const [key, data] of Object.entries(subjects)) {
            const total = data.completed.length + data.learning.length + data.notStarted.length;
            const completion = total > 0 ? data.completed.length / total : 0;

            if (completion < 0.3) {
                weaknesses.push(`${this.getSubjectName(key)}掌握不足(${Math.round(completion * 100)}%)`);
            }
        }

        return {
            subjects,
            weaknesses,
            totalCompleted: Object.values(subjects).reduce((sum, s) => sum + s.completed.length, 0),
            totalRemaining: Object.values(subjects).reduce((sum, s) => sum + s.notStarted.length, 0)
        };
    }

    /**
     * 调用AI生成规划
     * @param {Object} analysis 学习状况分析
     * @returns {String} AI返回的规划内容
     */
    async callAIForPlan(analysis) {
        const messages = [
            {
                role: 'user',
                content: `你是考研数学学习规划专家。请根据以下信息，为学生制定详细的学习规划：

**时间配置**:
- 开始日期: ${this.config.startDate}
- 结束日期: ${this.config.examDate}
- 每日学习时长: ${this.config.dailyStudyHours}小时

**当前学习情况**:
- 微积分: 已完成${analysis.subjects.calculus.completed.length}个，学习中${analysis.subjects.calculus.learning.length}个，未开始${analysis.subjects.calculus.notStarted.length}个
- 线性代数: 已完成${analysis.subjects.linearAlgebra.completed.length}个，学习中${analysis.subjects.linearAlgebra.learning.length}个，未开始${analysis.subjects.linearAlgebra.notStarted.length}个
- 概率论: 已完成${analysis.subjects.probability.completed.length}个，学习中${analysis.subjects.probability.learning.length}个，未开始${analysis.subjects.probability.notStarted.length}个

**薄弱环节**:
${analysis.weaknesses.length > 0 ? analysis.weaknesses.join('\n') : '暂无明显薄弱环节'}

请生成学习规划，包含：
1. 三个阶段（基础/强化/冲刺）的时间划分和学习重点
2. 每个阶段的具体学习建议
3. 针对薄弱环节的加强措施
4. 时间分配建议

请用JSON格式返回，格式如下：
{
  "phases": [
    {
      "name": "基础阶段",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "focus": ["重点1", "重点2"],
      "goals": ["目标1", "目标2"]
    }
  ],
  "recommendations": [
    "建议1",
    "建议2"
  ],
  "timeAllocation": {
    "calculus": 0.4,
    "linearAlgebra": 0.3,
    "probability": 0.3
  }
}`
            }
        ];

        try {
            // 检查AI配置
            if (typeof isAIConfigured === 'function' && !isAIConfigured()) {
                throw new Error('请先配置AI模型');
            }

            const response = await callAI(messages, { maxTokens: 2000 });
            return response;
        } catch (error) {
            console.error('[AIPlanGenerator] AI调用失败:', error);
            throw error;
        }
    }

    /**
     * 解析AI返回的规划
     * @param {String} aiResponse AI返回的内容
     * @returns {Object} 解析后的规划对象
     */
    parseAIPlan(aiResponse) {
        try {
            // 提取JSON (AI可能返回带说明的文本)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('无法从AI响应中提取JSON');
            }

            const plan = JSON.parse(jsonMatch[0]);

            // 验证必要字段
            if (!plan.phases || !Array.isArray(plan.phases) || plan.phases.length === 0) {
                throw new Error('规划格式不正确：缺少phases字段');
            }

            // 转换为标准格式
            return {
                phases: plan.phases.map((phase, index) => ({
                    name: phase.name || `阶段${index + 1}`,
                    description: phase.focus?.join('; ') || '',
                    startDate: phase.startDate,
                    endDate: phase.endDate,
                    days: this.calculateDays(phase.startDate, phase.endDate),
                    goals: phase.goals || [],
                    progress: 0
                })),
                recommendations: plan.recommendations || [],
                timeAllocation: plan.timeAllocation || this.config.subjectRatio
            };
        } catch (error) {
            console.error('[AIPlanGenerator] 解析AI规划失败:', error);
            throw error;
        }
    }

    /**
     * 计算两个日期之间的天数
     * @param {String} startDateStr 开始日期
     * @param {String} endDateStr 结束日期
     * @returns {Number} 天数
     */
    calculateDays(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    /**
     * 获取学科中文名称
     * @param {String} key 学科key
     * @returns {String} 中文名称
     */
    getSubjectName(key) {
        const map = {
            'calculus': '微积分',
            'linearAlgebra': '线性代数',
            'probability': '概率论'
        };
        return map[key] || key;
    }
}

// ==================== 规划UI渲染函数 ====================

/**
 * 渲染规划配置界面
 */
function renderPlanConfig() {
    const container = document.getElementById('view-container');

    // 获取默认配置
    const today = new Date().toISOString().split('T')[0];
    const examDate = '2026-12-23';

    container.innerHTML = `
        <div class="plan-config-container">
            <div class="config-section">
                <h3>⏰ 时间配置</h3>
                <div class="form-group">
                    <label>开始日期</label>
                    <input type="date" id="plan-start-date" value="${today}" class="form-input">
                </div>
                <div class="form-group">
                    <label>结束日期 (考试日期)</label>
                    <input type="date" id="plan-end-date" value="${examDate}" class="form-input">
                </div>
                <div class="form-group">
                    <label>每日学习时长 (小时)</label>
                    <input type="number" id="daily-hours" min="1" max="12" value="4" class="form-input">
                </div>
            </div>

            <div class="config-section">
                <h3>🕐 每日时间段分配</h3>
                <p class="config-tip">设置每天各时间段可用于学习的时长</p>
                <div class="time-period-config">
                    <div class="time-period-item">
                        <span class="period-icon">🌅</span>
                        <label>上午 (8:00-12:00)</label>
                        <input type="number" id="morning-hours" min="0" max="4" value="2" class="form-input-sm"> 小时
                    </div>
                    <div class="time-period-item">
                        <span class="period-icon">☀️</span>
                        <label>下午 (14:00-18:00)</label>
                        <input type="number" id="afternoon-hours" min="0" max="4" value="1" class="form-input-sm"> 小时
                    </div>
                    <div class="time-period-item">
                        <span class="period-icon">🌙</span>
                        <label>晚上 (19:00-23:00)</label>
                        <input type="number" id="evening-hours" min="0" max="4" value="1" class="form-input-sm"> 小时
                    </div>
                </div>
                <p class="config-note">提示：高难度知识点建议安排在精力充沛的上午</p>
            </div>

            <div class="config-section">
                <h3>🎯 学科时间分配</h3>
                <div class="subject-ratio">
                    <div class="ratio-item">
                        <label>微积分</label>
                        <input type="range" min="0" max="100" value="40" id="ratio-calculus" class="ratio-slider">
                        <span class="ratio-value" id="ratio-calculus-value">40%</span>
                    </div>
                    <div class="ratio-item">
                        <label>线性代数</label>
                        <input type="range" min="0" max="100" value="30" id="ratio-linear" class="ratio-slider">
                        <span class="ratio-value" id="ratio-linear-value">30%</span>
                    </div>
                    <div class="ratio-item">
                        <label>概率论</label>
                        <input type="range" min="0" max="100" value="30" id="ratio-prob" class="ratio-slider">
                        <span class="ratio-value" id="ratio-prob-value">30%</span>
                    </div>
                </div>
            </div>

            <div class="config-section">
                <h3>🤖 规划模式选择</h3>
                <div class="mode-selection">
                    <button class="mode-btn active" data-mode="basic" onclick="selectPlanMode('basic')">
                        <div class="mode-icon">📋</div>
                        <div class="mode-title">基础规划</div>
                        <div class="mode-desc">按标准算法自动分配学习任务</div>
                    </button>
                    <button class="mode-btn" data-mode="ai" onclick="selectPlanMode('ai')">
                        <div class="mode-icon">🤖</div>
                        <div class="mode-title">AI智能规划</div>
                        <div class="mode-desc">根据个人情况生成个性化学习路径</div>
                    </button>
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary btn-large" onclick="generatePlan()">
                    ✨ 生成学习规划
                </button>
            </div>
        </div>
    `;

    // 绑定滑块事件
    setupRatioSliders();
}

/**
 * 设置比例滑块事件
 */
function setupRatioSliders() {
    const sliders = ['ratio-calculus', 'ratio-linear', 'ratio-prob'];

    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueSpan = document.getElementById(`${sliderId}-value`);

        if (slider && valueSpan) {
            slider.addEventListener('input', function() {
                valueSpan.textContent = this.value + '%';
            });
        }
    });
}

/**
 * 选择规划模式
 * @param {String} mode 'basic' 或 'ai'
 */
function selectPlanMode(mode) {
    currentPlanMode = mode;

    // 更新按钮样式
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

/**
 * 生成学习规划 (主入口)
 */
async function generatePlan() {
    // 1. 获取配置
    const config = {
        startDate: document.getElementById('plan-start-date').value,
        endDate: document.getElementById('plan-end-date').value,
        examDate: document.getElementById('plan-end-date').value,
        dailyStudyHours: parseInt(document.getElementById('daily-hours').value),
        mode: currentPlanMode,
        subjectRatio: {
            calculus: parseFloat(document.getElementById('ratio-calculus').value) / 100,
            linearAlgebra: parseFloat(document.getElementById('ratio-linear').value) / 100,
            probability: parseFloat(document.getElementById('ratio-prob').value) / 100
        },
        // 新增：时间段配置
        timePeriods: {
            morning: parseInt(document.getElementById('morning-hours')?.value) || 2,
            afternoon: parseInt(document.getElementById('afternoon-hours')?.value) || 1,
            evening: parseInt(document.getElementById('evening-hours')?.value) || 1
        }
    };

    // 2. 验证配置
    if (!config.startDate || !config.endDate) {
        alert('请选择开始日期和结束日期');
        return;
    }

    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    if (startDate >= endDate) {
        alert('结束日期必须晚于开始日期');
        return;
    }

    if (config.dailyStudyHours < 1 || config.dailyStudyHours > 12) {
        alert('每日学习时长应在1-12小时之间');
        return;
    }

    // 3. 显示loading
    showPlanLoading('正在生成学习规划...');

    try {
        let plan;

        // 4. 根据模式选择生成器
        if (config.mode === 'basic') {
            const generator = new BasicPlanGenerator(config);
            plan = generator.generate();
        } else if (config.mode === 'ai') {
            const generator = new AIPlanGenerator(config);
            plan = await generator.generate();
        }

        // 5. 保存规划
        currentPlan = plan;
        savePlan(plan);

        // 6. 显示规划
        hidePlanLoading();
        renderPlanDisplay(plan);

    } catch (error) {
        hidePlanLoading();
        alert(`生成规划失败: ${error.message}`);
        console.error('生成规划失败:', error);
    }
}

/**
 * 显示loading状态
 * @param {String} message loading消息
 */
function showPlanLoading(message) {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="plan-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
}

/**
 * 隐藏loading状态
 */
function hidePlanLoading() {
    // Loading会被后续渲染替换
}

/**
 * 保存规划到localStorage
 * @param {Object} plan 规划对象
 */
function savePlan(plan) {
    plan.createdAt = plan.createdAt || new Date().toISOString();
    plan.updatedAt = new Date().toISOString();
    plan.version = plan.version || '1.0.0';

    dataManager.save('studyPlan', plan);
    console.log('[PlanModule] 规划已保存');
}

/**
 * 渲染规划展示界面
 * @param {Object} plan 规划对象
 */
function renderPlanDisplay(plan) {
    const container = document.getElementById('view-container');

    const stats = plan.statistics;
    const phases = plan.phases;

    container.innerHTML = `
        <div class="plan-display-container">
            <!-- 学习日历 -->
            <div class="plan-calendar-section">
                <div class="section-header">
                    <h3>📆 学习日历</h3>
                </div>
                <div id="plan-calendar-container"></div>
                <div id="date-tasks-panel"></div>
            </div>

            <!-- 规划概览 -->
            <div class="plan-overview">
                <div class="overview-card">
                    <div class="overview-icon">📅</div>
                    <div class="overview-content">
                        <div class="overview-label">总天数</div>
                        <div class="overview-value">${stats.totalDays}天</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon">✅</div>
                    <div class="overview-content">
                        <div class="overview-label">已完成</div>
                        <div class="overview-value">${stats.completedKnowledgePoints}/${stats.totalKnowledgePoints}</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon">⏱️</div>
                    <div class="overview-content">
                        <div class="overview-label">每日时长</div>
                        <div class="overview-value">${plan.config.dailyStudyHours}小时</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="overview-icon">📊</div>
                    <div class="overview-content">
                        <div class="overview-label">总进度</div>
                        <div class="overview-value">${Math.round(stats.completionRate * 100)}%</div>
                    </div>
                </div>
            </div>

            <!-- 三阶段时间轴 -->
            <div class="phases-timeline">
                ${phases.map((phase, index) => `
                    <div class="phase-item phase-${['basic', 'reinforce', 'sprint'][index]}">
                        <div class="phase-header">
                            <h3>${phase.name}</h3>
                            <span class="phase-duration">${phase.startDate} ~ ${phase.endDate} (${phase.days}天)</span>
                        </div>
                        <div class="phase-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${phase.progress}%"></div>
                            </div>
                            <span class="progress-text">${phase.progress}%</span>
                        </div>
                        <div class="phase-goals">
                            <h4>学习目标:</h4>
                            <ul>
                                ${phase.goals.map(goal => `<li>${goal}</li>`).join('')}
                            </ul>
                        </div>
                        ${phase.description ? `<div class="phase-description">${phase.description}</div>` : ''}
                    </div>
                `).join('')}
            </div>

            <!-- 今日任务 -->
            <div class="today-tasks-section">
                <div class="section-header">
                    <h3>📋 今日学习任务</h3>
                </div>
                <div id="today-task-list" class="task-list">
                    ${renderTodayTasks(plan)}
                </div>
            </div>

            <!-- AI调整对话 -->
            <div class="plan-chat-section">
                <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>💬 AI调整助手</h3>
                    <button class="btn btn-secondary" onclick="clearAdjustHistory()" style="padding: 5px 10px; font-size: 12px;">
                        清空对话
                    </button>
                </div>
                <div class="chat-messages" id="plan-chat-messages">
                    <div style="text-align: center; color: #999; padding: 20px;">
                        💬 向AI描述你想要的调整，例如：<br>
                        "我想把强化阶段延长一周"<br>
                        "我每天只能学习3小时"
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="plan-adjust-input"
                           placeholder="输入你的调整要求..."
                           onkeypress="if(event.key==='Enter')sendAdjustRequest()">
                    <button class="btn btn-primary" onclick="sendAdjustRequest()">
                        发送
                    </button>
                </div>
            </div>

            <!-- 规划操作按钮 -->
            <div class="plan-actions">
                <button class="btn btn-success" onclick="applyPlan()">
                    ✅ 应用规划
                </button>
                <button class="btn btn-warning" onclick="exportPlan()">
                    📥 导出规划
                </button>
                <button class="btn btn-secondary" onclick="renderPlanView()">
                    ← 返回配置
                </button>
            </div>
        </div>
    `;

    // 初始化日历组件
    setTimeout(() => {
        if (typeof initCalendarWidget === 'function') {
            initCalendarWidget(plan);
        }
    }, 100);
}

/**
 * 渲染今日任务列表
 * @param {Object} plan 规划对象
 * @returns {String} HTML字符串
 */
function renderTodayTasks(plan) {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = plan.dailyTasks.find(dt => dt.date === today);

    if (!todayTasks || todayTasks.tasks.length === 0) {
        return '<div class="empty-state-text">今日没有安排学习任务</div>';
    }

    // 获取时间段配置（如果存在）
    const timePeriods = plan.config?.timePeriods || { morning: 2, afternoon: 1, evening: 1 };

    // 按时间段分组任务
    const periodGroups = {
        morning: { name: '🌅 上午 (8:00-12:00)', tasks: [], hours: timePeriods.morning },
        afternoon: { name: '☀️ 下午 (14:00-18:00)', tasks: [], hours: timePeriods.afternoon },
        evening: { name: '🌙 晚上 (19:00-23:00)', tasks: [], hours: timePeriods.evening }
    };

    // 根据任务难度智能分配时间段
    // 高难度 -> 上午，中等 -> 下午，基础 -> 晚上
    const sortedTasks = [...todayTasks.tasks].sort((a, b) => {
        const diffOrder = { 'advanced': 0, 'intermediate': 1, 'basic': 2 };
        return (diffOrder[a.difficulty] || 1) - (diffOrder[b.difficulty] || 1);
    });

    let morningMinutes = timePeriods.morning * 60;
    let afternoonMinutes = timePeriods.afternoon * 60;
    let eveningMinutes = timePeriods.evening * 60;

    sortedTasks.forEach(task => {
        const duration = task.duration || 30;
        if (morningMinutes >= duration && (task.difficulty === 'advanced' || task.difficulty === 'intermediate')) {
            periodGroups.morning.tasks.push({...task, suggestedPeriod: 'morning'});
            morningMinutes -= duration;
        } else if (afternoonMinutes >= duration) {
            periodGroups.afternoon.tasks.push({...task, suggestedPeriod: 'afternoon'});
            afternoonMinutes -= duration;
        } else if (eveningMinutes >= duration) {
            periodGroups.evening.tasks.push({...task, suggestedPeriod: 'evening'});
            eveningMinutes -= duration;
        } else if (morningMinutes >= duration) {
            periodGroups.morning.tasks.push({...task, suggestedPeriod: 'morning'});
            morningMinutes -= duration;
        } else {
            // 无法分配，放到任意有空间的时段
            periodGroups.evening.tasks.push({...task, suggestedPeriod: 'evening'});
        }
    });

    // 渲染分组后的任务
    let html = '';
    for (const [, group] of Object.entries(periodGroups)) {
        if (group.tasks.length > 0 || group.hours > 0) {
            const totalDuration = group.tasks.reduce((sum, t) => sum + (t.duration || 30), 0);
            html += `
                <div class="time-period-group">
                    <div class="period-header">
                        <span class="period-name">${group.name}</span>
                        <span class="period-stats">${group.tasks.length}个任务 · ${totalDuration}分钟</span>
                    </div>
                    <div class="period-tasks">
                        ${group.tasks.length > 0 ? group.tasks.map(task => `
                            <div class="task-item">
                                <div class="task-info">
                                    <div class="task-name">${task.knowledgeName || task.description}</div>
                                    <div class="task-meta">
                                        ${task.type === 'knowledge' ? `📖 知识点学习` : task.type === 'practice' ? '✍️ 练习' : '🔄 复习'}
                                        · ${task.duration}分钟
                                        ${task.difficulty ? ` · ${getDifficultyText(task.difficulty)}` : ''}
                                    </div>
                                </div>
                                <div class="task-status">
                                    <span class="status-badge status-${task.status}">${getStatusText(task.status)}</span>
                                </div>
                            </div>
                        `).join('') : '<div class="no-tasks-hint">此时段暂无安排</div>'}
                    </div>
                </div>
            `;
        }
    }

    return html;
}

/**
 * 获取难度文本
 * @param {String} difficulty 难度级别
 * @returns {String} 难度文本
 */
function getDifficultyText(difficulty) {
    const map = {
        'basic': '基础',
        'intermediate': '中等',
        'advanced': '进阶'
    };
    return map[difficulty] || difficulty;
}

/**
 * 获取状态文本
 * @param {String} status 状态
 * @returns {String} 状态文本
 */
function getStatusText(status) {
    const map = {
        'pending': '待完成',
        'in_progress': '进行中',
        'completed': '已完成',
        'skipped': '已跳过'
    };
    return map[status] || status;
}

/**
 * 应用规划
 */
function applyPlan() {
    if (!currentPlan) {
        const savedPlan = dataManager.load('studyPlan', null);
        if (!savedPlan) {
            alert('未找到学习规划');
            return;
        }
        currentPlan = savedPlan;
    }

    // 标记规划为已应用
    currentPlan.applied = true;
    currentPlan.appliedAt = new Date().toISOString();
    dataManager.save('studyPlan', currentPlan);

    alert('规划已应用！将在首页显示今日任务。');

    // 跳转到首页
    if (typeof viewManager !== 'undefined' && viewManager.switchView) {
        viewManager.switchView('dashboard');
    }
}

/**
 * 导出规划为JSON
 */
function exportPlan() {
    const plan = currentPlan || dataManager.load('studyPlan', null);
    if (!plan) {
        alert('未找到学习规划');
        return;
    }

    const dataStr = JSON.stringify(plan, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `学习规划_${plan.config.startDate}_${plan.config.endDate}.json`;
    a.click();

    URL.revokeObjectURL(url);

    alert('规划已导出');
}

console.log('[PlanModule] 学习规划模块加载完成');

// ==================== AI对话调整功能 ====================

// 调整对话历史
let planAdjustHistory = [];

/**
 * 发送规划调整请求
 */
async function sendAdjustRequest() {
    const input = document.getElementById('plan-adjust-input');
    if (!input) return;

    const userMessage = input.value.trim();
    if (!userMessage) {
        alert('请输入调整要求');
        return;
    }

    // 检查AI配置
    if (typeof isAIConfigured === 'function' && !isAIConfigured()) {
        alert('请先在"设置"页面配置AI模型');
        return;
    }

    // 添加用户消息到对话历史
    planAdjustHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
    });

    // 更新UI显示用户消息
    appendChatMessage('user', userMessage);
    input.value = '';

    // 显示AI正在思考
    const thinkingId = showAIThinking();

    try {
        // 获取当前规划
        const plan = currentPlan || dataManager.load('studyPlan', null);
        if (!plan) {
            throw new Error('未找到当前规划');
        }

        // 构建调整请求
        const messages = [
            {
                role: 'user',
                content: `你是一个考研数学学习规划助手。当前用户有一个学习规划，用户希望进行调整。

**当前规划信息：**
- 开始日期: ${plan.config.startDate}
- 结束日期: ${plan.config.endDate}
- 每日学习时长: ${plan.config.dailyStudyHours}小时
- 总天数: ${plan.statistics.totalDays}天
- 三个阶段: ${plan.phases.map(p => `${p.name}(${p.days}天)`).join(', ')}

**用户的调整要求：**
${userMessage}

请根据用户的要求，给出具体的调整建议。如果是时间调整，请说明新的阶段划分。
回复要简洁明了，使用中文。`
            }
        ];

        const response = await callAI(messages, { maxTokens: 1500 });

        // 移除思考状态
        removeAIThinking(thinkingId);

        // 添加AI回复到对话历史
        planAdjustHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });

        // 显示AI回复
        appendChatMessage('ai', response);

        // 保存对话历史
        dataManager.save('planAdjustHistory', planAdjustHistory);

    } catch (error) {
        removeAIThinking(thinkingId);
        console.error('AI调整请求失败:', error);
        appendChatMessage('ai', `调整请求失败: ${error.message}`);
    }
}

/**
 * 添加聊天消息到UI
 */
function appendChatMessage(role, content) {
    const chatMessages = document.getElementById('plan-chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * 显示AI思考状态
 */
function showAIThinking() {
    const chatMessages = document.getElementById('plan-chat-messages');
    if (!chatMessages) return null;

    const id = 'thinking-' + Date.now();
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = id;
    thinkingDiv.className = 'chat-message ai';
    thinkingDiv.innerHTML = '<span class="thinking-dots">AI正在思考</span>';
    thinkingDiv.style.opacity = '0.7';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return id;
}

/**
 * 移除AI思考状态
 */
function removeAIThinking(id) {
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

/**
 * 清空调整对话
 */
function clearAdjustHistory() {
    planAdjustHistory = [];
    dataManager.remove('planAdjustHistory');

    const chatMessages = document.getElementById('plan-chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div style="text-align: center; color: #999; padding: 20px;">
                💬 向AI描述你想要的调整，例如：<br>
                "我想把强化阶段延长一周"<br>
                "我每天只能学习3小时"
            </div>
        `;
    }
}

/**
 * 加载调整对话历史
 */
function loadAdjustHistory() {
    planAdjustHistory = dataManager.load('planAdjustHistory', []);

    const chatMessages = document.getElementById('plan-chat-messages');
    if (!chatMessages) return;

    if (planAdjustHistory.length === 0) {
        chatMessages.innerHTML = `
            <div style="text-align: center; color: #999; padding: 20px;">
                💬 向AI描述你想要的调整，例如：<br>
                "我想把强化阶段延长一周"<br>
                "我每天只能学习3小时"
            </div>
        `;
    } else {
        chatMessages.innerHTML = '';
        planAdjustHistory.forEach(msg => {
            appendChatMessage(msg.role === 'user' ? 'user' : 'ai', msg.content);
        });
    }
}

// ==================== 视图注册 ====================

// 注册视图到viewManager
if (typeof viewManager !== 'undefined') {
    viewManager.register('plan', function() {
        const savedPlan = dataManager.load('studyPlan', null);
        if (savedPlan && savedPlan.applied) {
            renderPlanDisplay(savedPlan);
            // 加载调整对话历史
            setTimeout(loadAdjustHistory, 100);
        } else {
            renderPlanConfig();
        }
    });
    console.log('[PlanModule] 视图已注册到viewManager');
}
