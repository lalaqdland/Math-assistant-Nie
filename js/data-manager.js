/**
 * 数据管理模块 - 考研数学学习助手
 * 提供localStorage数据的统一管理接口
 *
 * 使用方法:
 * 1. 在HTML中引入此文件
 * 2. 直接使用 dataManager.save/load/export/import 等方法
 */

// ========== 数据管理器 ==========
const dataManager = {
    // localStorage键前缀
    prefix: 'mathHelper_',

    /**
     * 保存数据到localStorage
     * @param {string} key - 数据键名
     * @param {*} data - 要保存的数据
     * @returns {boolean} - 是否保存成功
     */
    save(key, data) {
        try {
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存数据失败:', e);
            if (e.name === 'QuotaExceededError') {
                alert('数据保存失败，存储空间不足。建议导出备份后清理部分数据。');
            } else {
                alert('数据保存失败: ' + e.message);
            }
            return false;
        }
    },

    /**
     * 从localStorage加载数据
     * @param {string} key - 数据键名
     * @param {*} defaultValue - 默认值
     * @returns {*} - 加载的数据或默认值
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`${this.prefix}${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('加载数据失败:', e);
            return defaultValue;
        }
    },

    /**
     * 删除指定键的数据
     * @param {string} key - 数据键名
     */
    remove(key) {
        localStorage.removeItem(`${this.prefix}${key}`);
    },

    /**
     * 检查键是否存在
     * @param {string} key - 数据键名
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(`${this.prefix}${key}`) !== null;
    },

    /**
     * 记录题目尝试
     * @param {string} questionId - 题目ID
     * @param {string} userAnswer - 用户答案
     * @param {boolean} isCorrect - 是否正确
     * @param {string[]} knowledgePoints - 知识点ID列表
     * @param {string} source - 来源 ('exam', 'practice', 'real-exam')
     */
    recordAttempt(questionId, userAnswer, isCorrect, knowledgePoints = [], source = 'practice') {
        const attempts = this.load('questionAttempts', []);

        const attempt = {
            questionId,
            userAnswer,
            isCorrect,
            knowledgePoints: knowledgePoints || [],
            source,
            timestamp: new Date().toISOString()
        };

        attempts.push(attempt);

        // 限制历史记录数量，避免localStorage溢出
        const maxAttempts = 10000;
        if (attempts.length > maxAttempts) {
            attempts.splice(0, attempts.length - maxAttempts);
        }

        this.save('questionAttempts', attempts);
    },

    /**
     * 获取题目尝试历史
     * @param {string} questionId - 题目ID (可选，不传则返回所有)
     * @param {number} limit - 限制返回数量
     * @returns {Array} 尝试历史
     */
    getAttempts(questionId = null, limit = null) {
        const attempts = this.load('questionAttempts', []);

        let filtered = attempts;
        if (questionId) {
            filtered = attempts.filter(a => a.questionId === questionId);
        }

        // 按时间倒序
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (limit && limit > 0) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    },

    /**
     * 获取知识点掌握度统计
     * @param {number} minAttempts - 最少尝试次数
     * @param {number} days - 统计最近几天的数据 (默认30天)
     * @returns {Object} 知识点统计 {knowledgePointId: {correct: number, total: number, accuracy: number}}
     */
    getKnowledgePointStats(minAttempts = 3, days = 30) {
        const attempts = this.load('questionAttempts', []);
        const cutoffTime = new Date();
        cutoffTime.setDate(cutoffTime.getDate() - days);

        const stats = {};

        attempts.forEach(attempt => {
            // 过滤时间范围
            if (new Date(attempt.timestamp) < cutoffTime) {
                return;
            }

            // 处理知识点
            const knowledgePoints = attempt.knowledgePoints || [];
            knowledgePoints.forEach(kpId => {
                if (!stats[kpId]) {
                    stats[kpId] = { correct: 0, total: 0 };
                }
                stats[kpId].total++;
                if (attempt.isCorrect) {
                    stats[kpId].correct++;
                }
            });
        });

        // 计算准确率并过滤低频知识点
        Object.keys(stats).forEach(kpId => {
            const stat = stats[kpId];
            if (stat.total >= minAttempts) {
                stat.accuracy = stat.total > 0 ? stat.correct / stat.total : 0;
            } else {
                delete stats[kpId];
            }
        });

        return stats;
    },

    /**
     * 清除尝试历史
     * @param {number} daysToKeep - 保留最近几天的数据 (默认保留所有)
     */
    clearAttempts(daysToKeep = null) {
        if (daysToKeep === null) {
            this.remove('questionAttempts');
            return;
        }

        const attempts = this.load('questionAttempts', []);
        const cutoffTime = new Date();
        cutoffTime.setDate(cutoffTime.getDate() - daysToKeep);

        const filtered = attempts.filter(attempt =>
            new Date(attempt.timestamp) >= cutoffTime
        );

        this.save('questionAttempts', filtered);
    },

    /**
     * 导出所有数据
     * 自动下载为JSON文件
     */
    exportAllData() {
        const allData = {
            // 核心数据
            userData: this.load('userData'),
            progress: this.load('progress'),
            learningProgress: this.load('learningProgress'),
            learningNotes: this.load('learningNotes'),
            knowledgeTree: this.load('knowledgeTree'),

            // 练习相关
            wrongQuestions: this.load('wrongQuestions'),
            practiceHistory: this.load('practiceHistory'),

            // 题目尝试历史 (新增)
            questionAttempts: this.load('questionAttempts', []),

            // 学习规划
            studyPlans: this.load('studyPlans'),

            // 统计数据
            statistics: this.load('statistics'),

            // AI相关
            aiConversations: this.load('aiConversations'),
            aiConfig: this.load('aiConfig'),

            // 元信息
            exportTime: new Date().toISOString(),
            version: '3.0.0'  // 版本更新
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)],
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `考研数学学习数据_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('数据导出成功');
    },

    /**
     * 导入数据
     * @param {File} file - JSON文件
     * @returns {Promise} - 解析后的数据
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // 验证数据格式
                    if (!data.exportTime || !data.version) {
                        throw new Error('数据格式不正确，缺少必要字段');
                    }

                    // 导入各项数据
                    const keys = [
                        'userData', 'progress', 'learningProgress', 'learningNotes',
                        'knowledgeTree', 'wrongQuestions', 'practiceHistory',
                        'questionAttempts', 'studyPlans', 'statistics', 'aiConversations', 'aiConfig'
                    ];

                    keys.forEach(key => {
                        if (data[key] !== undefined && data[key] !== null) {
                            this.save(key, data[key]);
                        }
                    });

                    console.log('数据导入成功，版本:', data.version);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    },

    /**
     * 清空所有数据
     */
    clearAllData() {
        const keys = [
            'userData', 'progress', 'learningProgress', 'learningNotes',
            'knowledgeTree', 'wrongQuestions', 'practiceHistory',
            'questionAttempts', 'studyPlans', 'statistics', 'aiConversations', 'currentView'
        ];

        keys.forEach(key => {
            localStorage.removeItem(`${this.prefix}${key}`);
        });

        console.log('所有数据已清空');
    },

    /**
     * 获取存储空间使用情况
     * @returns {Object} - 使用情况统计
     */
    getStorageInfo() {
        let totalSize = 0;
        let itemCount = 0;
        const items = {};

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                const value = localStorage.getItem(key);
                const size = new Blob([value]).size;
                totalSize += size;
                itemCount++;
                items[key.replace(this.prefix, '')] = size;
            }
        }

        return {
            totalSize,          // 总大小（字节）
            totalSizeKB: (totalSize / 1024).toFixed(2),  // KB
            totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),  // MB
            itemCount,          // 数据项数量
            items               // 各项大小
        };
    }
};

// ========== 视图管理器 ==========
const viewManager = {
    currentView: 'dashboard',
    views: {},  // 由各页面注册

    /**
     * 注册视图
     * @param {string} name - 视图名称
     * @param {Function} renderFn - 渲染函数
     */
    register(name, renderFn) {
        this.views[name] = renderFn;
    },

    /**
     * 切换视图
     * @param {string} viewName - 视图名称
     */
    switchView(viewName) {
        if (!this.views[viewName]) {
            console.error(`视图 ${viewName} 不存在`);
            return;
        }

        this.currentView = viewName;
        const container = document.getElementById('view-container');

        // 显示加载动画
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <div>加载中...</div>
            </div>
        `;

        // 延迟渲染以显示加载动画
        setTimeout(() => {
            container.innerHTML = '';
            this.views[viewName]();
            this.updateActiveNav(viewName);
            this.saveCurrentView();

            // 渲染MathJax公式
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([container]).catch((err) =>
                    console.log('MathJax渲染错误:', err));
            }
        }, 100);
    },

    /**
     * 更新导航激活状态
     */
    updateActiveNav(viewName) {
        document.querySelectorAll('.nav-menu li').forEach(li => {
            li.classList.remove('active');
            if (li.dataset.view === viewName) {
                li.classList.add('active');
            }
        });
    },

    /**
     * 保存当前视图
     */
    saveCurrentView() {
        dataManager.save('currentView', this.currentView);
    },

    /**
     * 加载上次的视图
     */
    loadLastView() {
        const lastView = dataManager.load('currentView', 'dashboard');
        if (this.views[lastView]) {
            this.switchView(lastView);
        } else {
            this.switchView('dashboard');
        }
    }
};

// ========== 题库管理器 ==========
const questionBankManager = {
    storageKey: 'questionBank',

    /**
     * 获取题库数据
     * @returns {Object} 题库数据
     */
    getData() {
        return dataManager.load(this.storageKey, {
            questions: [],
            favorites: [],
            lastUpdated: null
        });
    },

    /**
     * 保存题库数据
     * @param {Object} data - 题库数据
     */
    saveData(data) {
        data.lastUpdated = new Date().toISOString();
        dataManager.save(this.storageKey, data);
    },

    /**
     * 保存单个题目
     * @param {Object} question - 题目对象
     * @returns {string} 题目ID
     */
    saveQuestion(question) {
        const data = this.getData();
        if (!question.id) {
            question.id = 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
        }
        question.createdAt = question.createdAt || new Date().toISOString();

        const existingIndex = data.questions.findIndex(q => q.id === question.id);
        if (existingIndex >= 0) {
            data.questions[existingIndex] = question;
        } else {
            data.questions.push(question);
        }

        this.saveData(data);
        return question.id;
    },

    /**
     * 批量保存题目
     * @param {Array} questions - 题目数组
     * @returns {number} 保存的题目数量
     */
    saveQuestions(questions) {
        const data = this.getData();
        let savedCount = 0;

        questions.forEach(question => {
            if (!question.id) {
                question.id = 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
            }
            question.createdAt = question.createdAt || new Date().toISOString();

            const existingIndex = data.questions.findIndex(q => q.id === question.id);
            if (existingIndex >= 0) {
                data.questions[existingIndex] = question;
            } else {
                data.questions.push(question);
            }
            savedCount++;
        });

        this.saveData(data);
        return savedCount;
    },

    /**
     * 获取题目列表（支持筛选和分页）
     * @param {Object} filter - 筛选条件
     * @param {Object} pagination - 分页参数
     * @returns {Object} { questions: [], total: number, page: number, pageSize: number }
     */
    getQuestions(filter = {}, pagination = { page: 1, pageSize: 20 }) {
        const data = this.getData();
        let questions = [...data.questions];

        // 应用筛选条件
        if (filter.subject && filter.subject !== 'all') {
            questions = questions.filter(q => q.subject === filter.subject);
        }
        if (filter.difficulty && filter.difficulty !== 'all') {
            questions = questions.filter(q => q.difficulty === filter.difficulty);
        }
        if (filter.type && filter.type !== 'all') {
            questions = questions.filter(q => q.type === filter.type);
        }
        if (filter.source && filter.source !== 'all') {
            questions = questions.filter(q => q.source === filter.source);
        }
        if (filter.favoriteOnly) {
            questions = questions.filter(q => data.favorites.includes(q.id));
        }
        if (filter.keyword) {
            const keyword = filter.keyword.toLowerCase();
            questions = questions.filter(q =>
                (q.question || q.content || '').toLowerCase().includes(keyword) ||
                (q.explanation || '').toLowerCase().includes(keyword)
            );
        }
        if (filter.knowledgePoint) {
            questions = questions.filter(q =>
                q.knowledgePoints && q.knowledgePoints.includes(filter.knowledgePoint)
            );
        }

        // 排序（默认按创建时间倒序）
        questions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        const total = questions.length;
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 20;
        const startIndex = (page - 1) * pageSize;

        return {
            questions: questions.slice(startIndex, startIndex + pageSize),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    },

    /**
     * 获取单个题目
     * @param {string} id - 题目ID
     * @returns {Object|null} 题目对象
     */
    getQuestion(id) {
        const data = this.getData();
        return data.questions.find(q => q.id === id) || null;
    },

    /**
     * 删除题目
     * @param {string} id - 题目ID
     * @returns {boolean} 是否删除成功
     */
    deleteQuestion(id) {
        const data = this.getData();
        const index = data.questions.findIndex(q => q.id === id);
        if (index >= 0) {
            data.questions.splice(index, 1);
            data.favorites = data.favorites.filter(fid => fid !== id);
            this.saveData(data);
            return true;
        }
        return false;
    },

    /**
     * 切换收藏状态
     * @param {string} id - 题目ID
     * @returns {boolean} 切换后的收藏状态
     */
    toggleFavorite(id) {
        const data = this.getData();
        const index = data.favorites.indexOf(id);
        if (index >= 0) {
            data.favorites.splice(index, 1);
            this.saveData(data);
            return false;
        } else {
            data.favorites.push(id);
            this.saveData(data);
            return true;
        }
    },

    /**
     * 检查是否收藏
     * @param {string} id - 题目ID
     * @returns {boolean} 是否已收藏
     */
    isFavorite(id) {
        const data = this.getData();
        return data.favorites.includes(id);
    },

    /**
     * 获取题库统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        const data = this.getData();
        const questions = data.questions;

        const stats = {
            total: questions.length,
            bySubject: { calculus: 0, linear: 0, probability: 0 },
            byDifficulty: { basic: 0, intermediate: 0, advanced: 0 },
            byType: { choice: 0, blank: 0, solve: 0 },
            bySource: { template: 0, ai: 0, manual: 0, imported: 0 },
            favorites: data.favorites.length
        };

        questions.forEach(q => {
            if (stats.bySubject[q.subject] !== undefined) stats.bySubject[q.subject]++;
            if (stats.byDifficulty[q.difficulty] !== undefined) stats.byDifficulty[q.difficulty]++;
            if (stats.byType[q.type] !== undefined) stats.byType[q.type]++;
            if (stats.bySource[q.source] !== undefined) stats.bySource[q.source]++;
        });

        return stats;
    },

    /**
     * 清空题库
     */
    clear() {
        this.saveData({ questions: [], favorites: [], lastUpdated: null });
    },

    /**
     * 导出题库
     * @returns {string} JSON字符串
     */
    export() {
        const data = this.getData();
        return JSON.stringify(data, null, 2);
    },

    /**
     * 导入题库
     * @param {string} jsonString - JSON字符串
     * @param {boolean} merge - 是否合并（true合并，false替换）
     * @returns {number} 导入的题目数量
     */
    import(jsonString, merge = true) {
        try {
            const importData = JSON.parse(jsonString);
            if (!importData.questions || !Array.isArray(importData.questions)) {
                throw new Error('无效的题库数据格式');
            }

            if (merge) {
                const currentData = this.getData();
                importData.questions.forEach(q => {
                    q.source = q.source || 'imported';
                    const existingIndex = currentData.questions.findIndex(cq => cq.id === q.id);
                    if (existingIndex >= 0) {
                        currentData.questions[existingIndex] = q;
                    } else {
                        currentData.questions.push(q);
                    }
                });
                this.saveData(currentData);
                return importData.questions.length;
            } else {
                importData.questions.forEach(q => q.source = q.source || 'imported');
                this.saveData(importData);
                return importData.questions.length;
            }
        } catch (e) {
            console.error('导入题库失败:', e);
            throw e;
        }
    }
};
