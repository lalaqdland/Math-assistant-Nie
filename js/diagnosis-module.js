/**
 * 弱项诊断模块 - 考研数学学习助手
 * 基于用户做题数据分析薄弱知识点
 *
 * Phase 20: 弱项诊断系统
 */

// ========== 弱项诊断模块 ==========
const diagnosisModule = {
    // 配置参数
    config: {
        minAttempts: 3,        // 最少尝试次数
        recencyDays: 30,       // 统计最近天数
        weaknessThreshold: 0.7, // 弱项准确率阈值（低于此值认为薄弱）
        topWeakPoints: 10      // 返回的弱项数量上限
    },

    /**
     * 分析用户弱项
     * @param {Object} options - 分析选项
     * @param {number} options.minAttempts - 最少尝试次数
     * @param {number} options.recencyDays - 统计最近天数
     * @param {number} options.weaknessThreshold - 弱项阈值
     * @param {number} options.topWeakPoints - 返回弱项数量
     * @returns {Object} 诊断结果
     */
    analyzeWeaknesses(options = {}) {
        const config = { ...this.config, ...options };

        // 获取知识点统计
        const knowledgeStats = dataManager.getKnowledgePointStats(
            config.minAttempts,
            config.recencyDays
        );

        // 计算弱项
        const weakPoints = this._calculateWeakPoints(knowledgeStats, config);

        // 生成诊断报告
        const diagnosis = {
            analysisDate: new Date().toISOString(),
            config: config,
            summary: {
                totalKnowledgePoints: Object.keys(knowledgeStats).length,
                weakPointsCount: weakPoints.length,
                averageAccuracy: this._calculateAverageAccuracy(knowledgeStats),
                analysisPeriod: `${config.recencyDays}天`
            },
            weakPoints: weakPoints,
            recommendations: this._generateRecommendations(weakPoints, config)
        };

        return diagnosis;
    },

    /**
     * 计算弱项知识点
     * @param {Object} knowledgeStats - 知识点统计数据
     * @param {Object} config - 配置参数
     * @returns {Array} 弱项列表
     */
    _calculateWeakPoints(knowledgeStats, config) {
        const weakPoints = [];

        for (const [kpId, stats] of Object.entries(knowledgeStats)) {
            if (stats.accuracy < config.weaknessThreshold) {
                weakPoints.push({
                    knowledgePointId: kpId,
                    accuracy: stats.accuracy,
                    totalAttempts: stats.total,
                    correctAttempts: stats.correct,
                    strength: stats.accuracy, // 0-1, 越低越弱
                    priority: this._calculatePriority(stats, config)
                });
            }
        }

        // 按优先级排序（优先级越高越需要重点练习）
        weakPoints.sort((a, b) => b.priority - a.priority);

        return weakPoints.slice(0, config.topWeakPoints);
    },

    /**
     * 计算弱项优先级
     * @param {Object} stats - 知识点统计
     * @param {Object} config - 配置参数
     * @returns {number} 优先级分数 (0-1)
     */
    _calculatePriority(stats, config) {
        const accuracyWeight = 0.7;
        const frequencyWeight = 0.3;

        // 准确率越低，优先级越高
        const accuracyScore = 1 - stats.accuracy;

        // 练习频率（尝试次数相对较多时优先级稍高）
        const frequencyScore = Math.min(stats.total / (config.minAttempts * 2), 1);

        return accuracyWeight * accuracyScore + frequencyWeight * frequencyScore;
    },

    /**
     * 计算平均准确率
     * @param {Object} knowledgeStats - 知识点统计
     * @returns {number} 平均准确率
     */
    _calculateAverageAccuracy(knowledgeStats) {
        const stats = Object.values(knowledgeStats);
        if (stats.length === 0) return 0;

        const totalAccuracy = stats.reduce((sum, stat) => sum + stat.accuracy, 0);
        return totalAccuracy / stats.length;
    },

    /**
     * 生成推荐建议
     * @param {Array} weakPoints - 弱项列表
     * @param {Object} config - 配置参数
     * @returns {Array} 推荐列表
     */
    _generateRecommendations(weakPoints, config) {
        const recommendations = [];

        if (weakPoints.length === 0) {
            recommendations.push({
                type: 'success',
                message: '🎉 恭喜！所有知识点都掌握得很好，继续保持！',
                actions: []
            });
            return recommendations;
        }

        // 主要弱项推荐
        const topWeakPoint = weakPoints[0];
        if (topWeakPoint) {
            recommendations.push({
                type: 'warning',
                message: `📊 最需要加强的是知识点 ${topWeakPoint.knowledgePointId}（准确率 ${(topWeakPoint.accuracy * 100).toFixed(1)}%）`,
                actions: [
                    {
                        text: '生成针对性练习',
                        action: 'generateFocusedPractice',
                        params: { knowledgePointIds: [topWeakPoint.knowledgePointId] }
                    }
                ]
            });
        }

        // 综合弱项推荐
        if (weakPoints.length >= 3) {
            const top3Points = weakPoints.slice(0, 3).map(wp => wp.knowledgePointId);
            recommendations.push({
                type: 'info',
                message: `🔄 建议集中练习前3个弱项知识点`,
                actions: [
                    {
                        text: '生成综合练习',
                        action: 'generateFocusedPractice',
                        params: { knowledgePointIds: top3Points }
                    }
                ]
            });
        }

        // 练习频率建议
        const avgAccuracy = weakPoints.reduce((sum, wp) => sum + wp.accuracy, 0) / weakPoints.length;
        if (avgAccuracy < 0.5) {
            recommendations.push({
                type: 'danger',
                message: '⚠️ 弱项准确率普遍偏低，建议增加练习频率',
                actions: [
                    {
                        text: '查看错题本',
                        action: 'viewWrongQuestions'
                    }
                ]
            });
        }

        return recommendations;
    },

    /**
     * 获取知识点详细信息
     * @param {string} knowledgePointId - 知识点ID
     * @returns {Object} 知识点详情
     */
    getKnowledgePointDetails(knowledgePointId) {
        const attempts = dataManager.getAttempts();
        const kpAttempts = attempts.filter(a =>
            a.knowledgePoints && a.knowledgePoints.includes(knowledgePointId)
        );

        if (kpAttempts.length === 0) {
            return null;
        }

        // 按时间排序
        kpAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const correct = kpAttempts.filter(a => a.isCorrect).length;
        const accuracy = correct / kpAttempts.length;

        // 计算趋势（最近5次vs之前）
        const recent = kpAttempts.slice(0, 5);
        const older = kpAttempts.slice(5);

        let trend = 'stable';
        if (recent.length >= 3 && older.length >= 3) {
            const recentAccuracy = recent.filter(a => a.isCorrect).length / recent.length;
            const olderAccuracy = older.filter(a => a.isCorrect).length / older.length;

            if (recentAccuracy > olderAccuracy + 0.1) {
                trend = 'improving';
            } else if (recentAccuracy < olderAccuracy - 0.1) {
                trend = 'declining';
            }
        }

        return {
            knowledgePointId,
            totalAttempts: kpAttempts.length,
            correctAttempts: correct,
            accuracy,
            trend,
            recentAttempts: recent.slice(0, 10), // 最近10次尝试
            lastAttempt: kpAttempts[0]
        };
    },

    /**
     * 生成针对性练习题目
     * @param {Array} knowledgePointIds - 知识点ID列表
     * @param {number} count - 生成题目数量
     * @returns {Array} 练习题目
     */
    generateFocusedPractice(knowledgePointIds, count = 10) {
        // 这里可以调用practice-module的相关函数
        // 暂时返回空数组，具体实现由UI层处理
        return [];
    },

    /**
     * 更新诊断配置
     * @param {Object} newConfig - 新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
};

// ========== 导出 ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = diagnosisModule;
}
