/**
 * 复习调度器模块 - 考研数学学习助手
 * 基于艾宾浩斯遗忘曲线实现科学复习提醒
 *
 * 复习间隔: 1, 2, 4, 7, 15, 30 天
 * 完成6次复习后标记为"长期记忆"
 */

// ========== 复习调度器 ==========
const ReviewScheduler = {
    // 存储键
    STORAGE_KEY: 'reviewQueue',

    // 艾宾浩斯复习间隔（天）
    INTERVALS: [1, 2, 4, 7, 15, 30],

    // 复习质量评分对应的间隔调整因子
    QUALITY_FACTORS: {
        0: 0.5,   // 完全忘记 - 间隔减半
        1: 0.7,   // 模糊记忆
        2: 1.0,   // 基本记住 - 标准间隔
        3: 1.2,   // 掌握良好
        4: 1.5    // 非常熟练 - 间隔延长
    },

    /**
     * 获取复习队列数据
     * @returns {Object} 复习队列
     */
    getData() {
        return dataManager.load(this.STORAGE_KEY, {
            items: {},
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        });
    },

    /**
     * 保存复习队列数据
     * @param {Object} data - 复习队列数据
     */
    saveData(data) {
        data.lastUpdated = new Date().toISOString();
        dataManager.save(this.STORAGE_KEY, data);
    },

    /**
     * 添加到复习队列
     * @param {string} itemId - 项目ID（知识点ID或错题ID）
     * @param {string} type - 类型: 'knowledge' 或 'wrongQuestion'
     * @param {string} name - 名称
     * @param {string} subject - 学科: 'calculus', 'linearAlgebra', 'probability'
     */
    addToReview(itemId, type, name, subject) {
        const data = this.getData();

        // 如果已存在，不重复添加
        if (data.items[itemId]) {
            console.log(`[ReviewScheduler] ${itemId} 已在复习队列中`);
            return false;
        }

        const today = new Date();
        const nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + this.INTERVALS[0]);

        data.items[itemId] = {
            type: type,
            name: name,
            subject: subject,
            firstLearnTime: today.toISOString(),
            reviewCount: 0,
            nextReviewDate: nextDate.toISOString().split('T')[0],
            lastReviewTime: null,
            masteryLevel: 0.3  // 初始掌握度
        };

        this.saveData(data);
        console.log(`[ReviewScheduler] 添加到复习队列: ${name}`);
        return true;
    },

    /**
     * 获取今日待复习项目
     * @returns {Array} 今日待复习项目列表
     */
    getTodayReviews() {
        const data = this.getData();
        const today = new Date().toISOString().split('T')[0];
        const reviews = [];

        for (const [itemId, item] of Object.entries(data.items)) {
            if (item.nextReviewDate <= today) {
                reviews.push({
                    id: itemId,
                    ...item,
                    isOverdue: item.nextReviewDate < today
                });
            }
        }

        // 按日期排序，过期的优先
        reviews.sort((a, b) => {
            if (a.isOverdue !== b.isOverdue) {
                return a.isOverdue ? -1 : 1;
            }
            return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
        });

        return reviews;
    },

    /**
     * 获取未来待复习项目
     * @param {number} days - 未来天数
     * @returns {Array} 未来待复习项目
     */
    getUpcomingReviews(days = 7) {
        const data = this.getData();
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);

        const todayStr = today.toISOString().split('T')[0];
        const futureStr = futureDate.toISOString().split('T')[0];

        const reviews = [];

        for (const [itemId, item] of Object.entries(data.items)) {
            if (item.nextReviewDate > todayStr && item.nextReviewDate <= futureStr) {
                reviews.push({
                    id: itemId,
                    ...item
                });
            }
        }

        return reviews.sort((a, b) =>
            new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
        );
    },

    /**
     * 完成复习
     * @param {string} itemId - 项目ID
     * @param {number} quality - 复习质量 0-4
     * @returns {Object|null} 更新后的项目信息，或null（已完成所有复习）
     */
    completeReview(itemId, quality) {
        const data = this.getData();
        const item = data.items[itemId];

        if (!item) {
            console.error(`[ReviewScheduler] 项目不存在: ${itemId}`);
            return null;
        }

        // 更新复习次数
        item.reviewCount++;
        item.lastReviewTime = new Date().toISOString();

        // 更新掌握度
        const qualityFactor = this.QUALITY_FACTORS[quality] || 1.0;
        item.masteryLevel = Math.min(1, Math.max(0,
            item.masteryLevel + (quality - 2) * 0.1
        ));

        // 检查是否完成所有复习
        if (item.reviewCount >= this.INTERVALS.length) {
            // 完成所有复习，标记为长期记忆
            delete data.items[itemId];
            this.saveData(data);

            // 记录到学习进度
            this.markAsLongTermMemory(itemId, item);

            console.log(`[ReviewScheduler] ${item.name} 已完成所有复习，进入长期记忆`);
            return { completed: true, item: item };
        }

        // 计算下次复习日期
        const baseInterval = this.INTERVALS[item.reviewCount];
        const adjustedInterval = Math.round(baseInterval * qualityFactor);

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + Math.max(1, adjustedInterval));
        item.nextReviewDate = nextDate.toISOString().split('T')[0];

        this.saveData(data);
        console.log(`[ReviewScheduler] ${item.name} 下次复习: ${item.nextReviewDate}`);

        return { completed: false, item: item };
    },

    /**
     * 标记为长期记忆
     * @param {string} itemId - 项目ID
     * @param {Object} item - 项目信息
     */
    markAsLongTermMemory(itemId, item) {
        if (item.type === 'knowledge') {
            const progress = dataManager.load('learningProgress', {});
            if (progress[itemId]) {
                progress[itemId].longTermMemory = true;
                progress[itemId].longTermMemoryDate = new Date().toISOString();
                dataManager.save('learningProgress', progress);
            }
        }
    },

    /**
     * 获取复习统计
     * @returns {Object} 统计信息
     */
    getReviewStats() {
        const data = this.getData();
        const today = new Date().toISOString().split('T')[0];

        let totalItems = 0;
        let todayCount = 0;
        let overdueCount = 0;
        let upcomingCount = 0;
        const bySubject = {
            calculus: 0,
            linearAlgebra: 0,
            probability: 0
        };
        const byType = {
            knowledge: 0,
            wrongQuestion: 0
        };

        for (const item of Object.values(data.items)) {
            totalItems++;
            bySubject[item.subject] = (bySubject[item.subject] || 0) + 1;
            byType[item.type] = (byType[item.type] || 0) + 1;

            if (item.nextReviewDate < today) {
                overdueCount++;
            } else if (item.nextReviewDate === today) {
                todayCount++;
            } else {
                upcomingCount++;
            }
        }

        return {
            totalItems,
            todayCount: todayCount + overdueCount,
            overdueCount,
            upcomingCount,
            bySubject,
            byType
        };
    },

    /**
     * 检查项目是否需要复习
     * @param {string} itemId - 项目ID
     * @returns {boolean}
     */
    needsReview(itemId) {
        const data = this.getData();
        const item = data.items[itemId];

        if (!item) return false;

        const today = new Date().toISOString().split('T')[0];
        return item.nextReviewDate <= today;
    },

    /**
     * 从复习队列中移除
     * @param {string} itemId - 项目ID
     */
    removeFromReview(itemId) {
        const data = this.getData();

        if (data.items[itemId]) {
            delete data.items[itemId];
            this.saveData(data);
            console.log(`[ReviewScheduler] 已从复习队列移除: ${itemId}`);
            return true;
        }

        return false;
    },

    /**
     * 清理过期项目（超过90天未复习的）
     */
    cleanupExpiredItems() {
        const data = this.getData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        let removedCount = 0;

        for (const [itemId, item] of Object.entries(data.items)) {
            if (item.nextReviewDate < cutoffStr) {
                delete data.items[itemId];
                removedCount++;
            }
        }

        if (removedCount > 0) {
            this.saveData(data);
            console.log(`[ReviewScheduler] 清理了 ${removedCount} 个过期项目`);
        }

        return removedCount;
    },

    /**
     * 导出复习数据
     * @returns {Object} 复习数据
     */
    exportData() {
        return {
            ...this.getData(),
            exportTime: new Date().toISOString(),
            type: 'reviewQueue'
        };
    },

    /**
     * 导入复习数据
     * @param {Object} importedData - 导入的数据
     * @returns {boolean} 是否成功
     */
    importData(importedData) {
        if (!importedData || !importedData.items) {
            console.error('[ReviewScheduler] 导入数据格式错误');
            return false;
        }

        const data = this.getData();

        // 合并导入的数据
        for (const [itemId, item] of Object.entries(importedData.items)) {
            if (!data.items[itemId]) {
                data.items[itemId] = item;
            }
        }

        this.saveData(data);
        console.log('[ReviewScheduler] 数据导入成功');
        return true;
    },

    /**
     * 获取项目信息
     * @param {string} itemId - 项目ID
     * @returns {Object|null} 项目信息
     */
    getItem(itemId) {
        const data = this.getData();
        return data.items[itemId] || null;
    },

    /**
     * 获取复习进度描述
     * @param {number} reviewCount - 已完成复习次数
     * @returns {string} 进度描述
     */
    getProgressText(reviewCount) {
        const total = this.INTERVALS.length;
        if (reviewCount >= total) {
            return '已完成';
        }
        return `${reviewCount}/${total}`;
    },

    /**
     * 获取掌握度描述
     * @param {number} masteryLevel - 掌握度 0-1
     * @returns {string} 掌握度描述
     */
    getMasteryText(masteryLevel) {
        if (masteryLevel >= 0.8) return '熟练';
        if (masteryLevel >= 0.6) return '良好';
        if (masteryLevel >= 0.4) return '一般';
        if (masteryLevel >= 0.2) return '薄弱';
        return '待加强';
    },

    /**
     * 获取学科名称
     * @param {string} subject - 学科代码
     * @returns {string} 学科名称
     */
    getSubjectName(subject) {
        const names = {
            calculus: '微积分',
            linearAlgebra: '线性代数',
            linear: '线性代数',
            probability: '概率论'
        };
        return names[subject] || subject;
    },

    /**
     * 获取学科图标
     * @param {string} subject - 学科代码
     * @returns {string} 图标
     */
    getSubjectIcon(subject) {
        const icons = {
            calculus: '📐',
            linearAlgebra: '🔢',
            linear: '🔢',
            probability: '🎲'
        };
        return icons[subject] || '📚';
    }
};

// ========== 复习视图函数 ==========

/**
 * 渲染复习提醒卡片（用于仪表板）
 * @returns {string} HTML字符串
 */
function renderReviewReminder() {
    const stats = ReviewScheduler.getReviewStats();
    const todayReviews = ReviewScheduler.getTodayReviews();

    if (stats.todayCount === 0) {
        return `
            <div class="review-reminder-card">
                <div class="card-header-row">
                    <h3>🔄 今日复习</h3>
                </div>
                <div class="review-empty">
                    <div class="review-empty-icon">✨</div>
                    <div>今日没有待复习的内容</div>
                    <div style="font-size: 13px; margin-top: 5px; color: #999;">
                        继续学习，新内容会自动加入复习计划
                    </div>
                </div>
            </div>
        `;
    }

    // 只显示前5个
    const displayItems = todayReviews.slice(0, 5);

    return `
        <div class="review-reminder-card">
            <div class="card-header-row">
                <h3>🔄 今日待复习</h3>
                <span class="review-count-badge">${stats.todayCount}项</span>
            </div>
            <div class="review-list">
                ${displayItems.map(item => `
                    <div class="review-item subject-${item.subject}" onclick="goToReviewItem('${item.id}', '${item.type}')">
                        <div class="item-icon">${ReviewScheduler.getSubjectIcon(item.subject)}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-meta">
                                <span class="subject-tag">${ReviewScheduler.getSubjectName(item.subject)}</span>
                                <span class="progress-tag">复习进度: ${ReviewScheduler.getProgressText(item.reviewCount)}</span>
                            </div>
                        </div>
                        ${item.isOverdue ? '<span class="overdue-badge">逾期</span>' : ''}
                    </div>
                `).join('')}
            </div>
            ${stats.todayCount > 5 ? `<div style="text-align: center; color: #999; font-size: 13px; margin-top: 10px;">还有 ${stats.todayCount - 5} 项待复习</div>` : ''}
            <button class="btn btn-primary" onclick="startReviewSession()" style="width: 100%; margin-top: 15px;">
                🎯 开始复习
            </button>
        </div>
    `;
}

/**
 * 跳转到复习项目
 * @param {string} itemId - 项目ID
 * @param {string} type - 类型
 */
function goToReviewItem(itemId, type) {
    if (type === 'knowledge') {
        // 跳转到知识点页面
        if (typeof loadKnowledgeUnit === 'function') {
            viewManager.switchView('knowledge');
            setTimeout(() => loadKnowledgeUnit(itemId), 200);
        }
    } else if (type === 'wrongQuestion') {
        // 跳转到错题本
        viewManager.switchView('practice');
        // 可以进一步定位到具体错题
    }
}

/**
 * 开始复习会话
 */
function startReviewSession() {
    const todayReviews = ReviewScheduler.getTodayReviews();

    if (todayReviews.length === 0) {
        alert('今日没有待复习的内容！');
        return;
    }

    // 从第一个开始复习
    const firstItem = todayReviews[0];
    goToReviewItem(firstItem.id, firstItem.type);
}

/**
 * 显示复习质量评估弹窗
 * @param {string} itemId - 项目ID
 * @param {string} itemName - 项目名称
 */
function showReviewQualityModal(itemId, itemName) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'review-quality-overlay';
    modal.innerHTML = `
        <div class="review-quality-modal">
            <h3>📝 复习评估</h3>
            <p>你对「${itemName}」的掌握程度如何？</p>
            <div class="quality-buttons">
                <button class="quality-btn" onclick="submitReviewQuality('${itemId}', 0)" data-quality="0">
                    😰 完全忘记
                </button>
                <button class="quality-btn" onclick="submitReviewQuality('${itemId}', 1)" data-quality="1">
                    😕 模糊记忆
                </button>
                <button class="quality-btn" onclick="submitReviewQuality('${itemId}', 2)" data-quality="2">
                    🙂 基本记住
                </button>
                <button class="quality-btn" onclick="submitReviewQuality('${itemId}', 3)" data-quality="3">
                    😊 掌握良好
                </button>
                <button class="quality-btn" onclick="submitReviewQuality('${itemId}', 4)" data-quality="4">
                    🤩 非常熟练
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * 提交复习质量评估
 * @param {string} itemId - 项目ID
 * @param {number} quality - 质量评分 0-4
 */
function submitReviewQuality(itemId, quality) {
    const result = ReviewScheduler.completeReview(itemId, quality);

    // 关闭模态框
    const modal = document.querySelector('.review-quality-overlay');
    if (modal) {
        modal.remove();
    }

    if (result) {
        if (result.completed) {
            alert(`恭喜！「${result.item.name}」已完成全部复习，进入长期记忆！🎉`);
        } else {
            const nextDate = result.item.nextReviewDate;
            alert(`复习完成！下次复习时间: ${nextDate}`);
        }

        // 刷新仪表板
        if (viewManager.currentView === 'dashboard') {
            renderDashboard();
        }
    }
}
