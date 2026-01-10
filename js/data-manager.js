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

            // 学习规划
            studyPlans: this.load('studyPlans'),

            // 统计数据
            statistics: this.load('statistics'),

            // AI相关
            aiConversations: this.load('aiConversations'),
            aiConfig: this.load('aiConfig'),

            // 元信息
            exportTime: new Date().toISOString(),
            version: '2.0.0'
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
                        'studyPlans', 'statistics', 'aiConversations', 'aiConfig'
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
            'studyPlans', 'statistics', 'aiConversations', 'currentView'
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
