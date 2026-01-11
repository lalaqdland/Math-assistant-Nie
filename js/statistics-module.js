/**
 * 学习统计模块 - 考研数学学习助手
 * 包含统计计算、图表渲染、数据导出、报告生成等功能
 */

// ========== 统计计算函数 ==========

/**
 * 计算综合统计数据
 * @returns {Object} 统计数据对象
 */
function calculateStatistics() {
    const practiceHistory = dataManager.load('practiceHistory', []);
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const learningProgress = dataManager.load('learningProgress', {});

    // 总题数和正确数
    let totalQuestions = 0;
    let correctCount = 0;
    const dailyData = {};

    practiceHistory.forEach(record => {
        if (record.results) {
            record.results.forEach(r => {
                totalQuestions++;
                if (r.correct) correctCount++;
            });
        }
        // 按日期聚合
        const dateKey = record.date ? record.date.split('T')[0] : new Date().toISOString().split('T')[0];
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = { questions: 0, correct: 0 };
        }
        if (record.results) {
            dailyData[dateKey].questions += record.results.length;
            dailyData[dateKey].correct += record.results.filter(r => r.correct).length;
        }
    });

    // 学习天数
    const studyDays = Object.keys(dailyData).length;

    // 今日数据
    const today = new Date().toISOString().split('T')[0];
    const todayData = dailyData[today] || { questions: 0, correct: 0 };

    // 知识点掌握度
    const subjectMastery = getSubjectMastery(learningProgress);

    return {
        totalQuestions,
        correctCount,
        accuracy: totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0,
        studyDays,
        todayQuestions: todayData.questions,
        wrongCount: wrongQuestions.length,
        dailyData,
        subjectMastery
    };
}

/**
 * 获取学科掌握度
 * @param {Object} learningProgress - 学习进度数据
 * @returns {Object} 各学科掌握度百分比
 */
function getSubjectMastery(learningProgress) {
    const subjects = {
        calculus: { total: 0, learned: 0, label: '微积分' },
        linear: { total: 0, learned: 0, label: '线性代数' },
        probability: { total: 0, learned: 0, label: '概率论' }
    };

    // 从 knowledge-data.js 获取知识点分布
    if (typeof knowledgeData !== 'undefined') {
        knowledgeData.forEach(topic => {
            let subjectKey = 'calculus';
            if (topic.title.includes('线性代数') || topic.title.includes('矩阵') || topic.title.includes('行列式')) {
                subjectKey = 'linear';
            } else if (topic.title.includes('概率') || topic.title.includes('随机') || topic.title.includes('数理统计')) {
                subjectKey = 'probability';
            }

            topic.children.forEach(chapter => {
                chapter.points.forEach(point => {
                    subjects[subjectKey].total++;
                    if (learningProgress[point.id] && learningProgress[point.id].status === 'learned') {
                        subjects[subjectKey].learned++;
                    }
                });
            });
        });
    }

    return {
        calculus: subjects.calculus.total > 0 ? Math.round((subjects.calculus.learned / subjects.calculus.total) * 100) : 0,
        linear: subjects.linear.total > 0 ? Math.round((subjects.linear.learned / subjects.linear.total) * 100) : 0,
        probability: subjects.probability.total > 0 ? Math.round((subjects.probability.learned / subjects.probability.total) * 100) : 0
    };
}

/**
 * 获取每日聚合数据（最近N天）
 * @param {number} days - 天数
 * @returns {Array} 每日数据数组
 */
function getDailyAggregation(days = 30) {
    const practiceHistory = dataManager.load('practiceHistory', []);
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        let questions = 0;
        let correct = 0;

        practiceHistory.forEach(record => {
            const recordDate = record.date ? record.date.split('T')[0] : '';
            if (recordDate === dateKey && record.results) {
                questions += record.results.length;
                correct += record.results.filter(r => r.correct).length;
            }
        });

        result.push({
            date: dateKey,
            questions,
            correct,
            accuracy: questions > 0 ? ((correct / questions) * 100).toFixed(1) : 0
        });
    }

    return result;
}

/**
 * 获取错题分布
 * @returns {Object} 各学科错题数量
 */
function getWrongDistribution() {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    const distribution = {
        '微积分': 0,
        '线性代数': 0,
        '概率论': 0
    };

    wrongQuestions.forEach(q => {
        const subject = q.subject || '微积分';
        if (subject.includes('线性') || subject.includes('矩阵')) {
            distribution['线性代数']++;
        } else if (subject.includes('概率') || subject.includes('随机')) {
            distribution['概率论']++;
        } else {
            distribution['微积分']++;
        }
    });

    return distribution;
}

/**
 * 获取知识点维度数据（用于雷达图）
 * @returns {Array} 维度数据数组
 */
function getKnowledgeDimensions() {
    const learningProgress = dataManager.load('learningProgress', {});

    // 6个维度
    const dimensions = {
        '极限与连续': { learned: 0, total: 10, practiced: 0 },
        '微分学': { learned: 0, total: 15, practiced: 0 },
        '积分学': { learned: 0, total: 12, practiced: 0 },
        '线性代数': { learned: 0, total: 10, practiced: 0 },
        '概率论': { learned: 0, total: 8, practiced: 0 },
        '数理统计': { learned: 0, total: 5, practiced: 0 }
    };

    // 统计已学习数量
    Object.values(learningProgress).forEach(p => {
        if (p.status === 'learned') {
            // 简化处理：平均分配
            const keys = Object.keys(dimensions);
            const idx = Math.floor(Math.random() * keys.length);
            dimensions[keys[idx]].learned++;
        }
    });

    // 计算掌握度百分比
    return Object.entries(dimensions).map(([name, data]) => ({
        name,
        value: data.total > 0 ? Math.min(100, Math.round((data.learned / data.total) * 100)) : 0
    }));
}

// ========== 主视图渲染 ==========

/**
 * 渲染学习统计视图
 */
function renderStatisticsView() {
    const container = document.getElementById('view-container');
    const stats = calculateStatistics();
    const wrongDist = getWrongDistribution();

    container.innerHTML = `
        <div class="statistics-page">
            <!-- 页面标题和操作栏 -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">📈 学习统计</div>
                    <div class="report-actions">
                        <button class="btn btn-primary" onclick="generateLearningReport()">
                            📄 生成报告
                        </button>
                        <button class="btn btn-secondary" onclick="exportStatisticsJSON()">
                            📥 导出JSON
                        </button>
                        <button class="btn btn-secondary" onclick="exportStatisticsCSV()">
                            📊 导出CSV
                        </button>
                    </div>
                </div>

                <!-- 统计概览卡片 -->
                <div class="statistics-overview">
                    <div class="stat-card stat-card-primary">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.totalQuestions}</div>
                            <div class="stat-label">总练习题数</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-success">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.accuracy}%</div>
                            <div class="stat-label">总正确率</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-warning">
                        <div class="stat-icon">📅</div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.studyDays}</div>
                            <div class="stat-label">学习天数</div>
                        </div>
                    </div>
                    <div class="stat-card stat-card-danger">
                        <div class="stat-icon">❌</div>
                        <div class="stat-content">
                            <div class="stat-value">${stats.wrongCount}</div>
                            <div class="stat-label">错题数</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 图表区域 -->
            <div class="charts-grid">
                <!-- 知识点掌握雷达图 -->
                <div class="card chart-card">
                    <h3 class="chart-title">📊 知识点掌握度</h3>
                    <div class="chart-container">
                        <canvas id="mastery-radar-chart"></canvas>
                    </div>
                </div>

                <!-- 正确率趋势折线图 -->
                <div class="card chart-card">
                    <h3 class="chart-title">📈 正确率趋势（近7天）</h3>
                    <div class="chart-container">
                        <canvas id="accuracy-line-chart"></canvas>
                    </div>
                </div>

                <!-- 错题分布饼图 -->
                <div class="card chart-card">
                    <h3 class="chart-title">🥧 错题分布</h3>
                    <div class="chart-container">
                        <canvas id="wrong-pie-chart"></canvas>
                    </div>
                </div>

                <!-- 每日练习量柱状图 -->
                <div class="card chart-card">
                    <h3 class="chart-title">📊 每日练习量（近7天）</h3>
                    <div class="chart-container">
                        <canvas id="daily-bar-chart"></canvas>
                    </div>
                </div>
            </div>

            <!-- 学习热力图 -->
            <div class="card">
                <h3 class="chart-title">📅 学习热力图（近3个月）</h3>
                <div class="heatmap-container" id="cal-heatmap"></div>
                <div class="heatmap-legend">
                    <span>少</span>
                    <div class="heatmap-legend-scale">
                        <div class="legend-item" style="background: #ebedf0;"></div>
                        <div class="legend-item" style="background: #9be9a8;"></div>
                        <div class="legend-item" style="background: #40c463;"></div>
                        <div class="legend-item" style="background: #30a14e;"></div>
                        <div class="legend-item" style="background: #216e39;"></div>
                    </div>
                    <span>多</span>
                </div>
            </div>

            <!-- 学科进度 -->
            <div class="card">
                <h3 class="chart-title">📚 学科学习进度</h3>
                <div class="subject-progress-bars">
                    <div class="subject-progress-item">
                        <div class="subject-info">
                            <span class="subject-name">微积分</span>
                            <span class="subject-percent">${stats.subjectMastery.calculus}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar progress-bar-blue" style="width: ${stats.subjectMastery.calculus}%"></div>
                        </div>
                    </div>
                    <div class="subject-progress-item">
                        <div class="subject-info">
                            <span class="subject-name">线性代数</span>
                            <span class="subject-percent">${stats.subjectMastery.linear}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar progress-bar-green" style="width: ${stats.subjectMastery.linear}%"></div>
                        </div>
                    </div>
                    <div class="subject-progress-item">
                        <div class="subject-info">
                            <span class="subject-name">概率论与数理统计</span>
                            <span class="subject-percent">${stats.subjectMastery.probability}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar progress-bar-orange" style="width: ${stats.subjectMastery.probability}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 弱项诊断 -->
            <div class="card">
                <h3 class="chart-title">🔍 弱项诊断</h3>
                <div class="diagnosis-container" id="diagnosis-container">
                    <div class="diagnosis-loading">
                        <div class="loading-spinner"></div>
                        <div>正在分析弱项...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 初始化所有图表
    setTimeout(() => {
        initMasteryRadarChart();
        initAccuracyLineChart();
        initWrongPieChart();
        initDailyBarChart();
        initHeatmapCalendar();
    }, 100);

    // 渲染弱项诊断
    renderDiagnosisView();
}

// ========== 图表初始化函数 ==========

/**
 * 初始化知识点掌握度雷达图
 */
function initMasteryRadarChart() {
    const ctx = document.getElementById('mastery-radar-chart');
    if (!ctx) return;

    const dimensions = getKnowledgeDimensions();

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: dimensions.map(d => d.name),
            datasets: [{
                label: '掌握度',
                data: dimensions.map(d => d.value),
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: '#2196F3',
                borderWidth: 2,
                pointBackgroundColor: '#2196F3',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: { size: 10 }
                    },
                    pointLabels: {
                        font: { size: 11 }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

/**
 * 初始化正确率趋势折线图
 */
function initAccuracyLineChart() {
    const ctx = document.getElementById('accuracy-line-chart');
    if (!ctx) return;

    const dailyData = getDailyAggregation(7);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.map(d => d.date.slice(5)),
            datasets: [{
                label: '正确率',
                data: dailyData.map(d => parseFloat(d.accuracy)),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `正确率: ${context.raw}%`
                    }
                }
            }
        }
    });
}

/**
 * 初始化错题分布饼图
 */
function initWrongPieChart() {
    const ctx = document.getElementById('wrong-pie-chart');
    if (!ctx) return;

    const wrongDist = getWrongDistribution();
    const total = Object.values(wrongDist).reduce((a, b) => a + b, 0);

    if (total === 0) {
        ctx.parentElement.innerHTML = '<div class="empty-chart-hint">暂无错题数据</div>';
        return;
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(wrongDist),
            datasets: [{
                data: Object.values(wrongDist),
                backgroundColor: ['#2196F3', '#4CAF50', '#FF9800'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15 }
                }
            }
        }
    });
}

/**
 * 初始化每日练习量柱状图
 */
function initDailyBarChart() {
    const ctx = document.getElementById('daily-bar-chart');
    if (!ctx) return;

    const dailyData = getDailyAggregation(7);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dailyData.map(d => d.date.slice(5)),
            datasets: [{
                label: '练习题数',
                data: dailyData.map(d => d.questions),
                backgroundColor: '#9C27B0',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

/**
 * 初始化学习热力图日历
 */
function initHeatmapCalendar() {
    const container = document.getElementById('cal-heatmap');
    if (!container || typeof CalHeatmap === 'undefined') {
        if (container) {
            container.innerHTML = '<div class="empty-chart-hint">热力图库加载失败</div>';
        }
        return;
    }

    const dailyData = getDailyAggregation(90);
    const heatmapData = dailyData.map(d => ({
        date: d.date,
        value: d.questions
    })).filter(d => d.value > 0);

    const cal = new CalHeatmap();
    cal.paint({
        itemSelector: '#cal-heatmap',
        domain: {
            type: 'month',
            gutter: 4,
            label: { text: 'MM月', textAlign: 'start', position: 'top' }
        },
        subDomain: {
            type: 'day',
            radius: 2,
            width: 15,
            height: 15,
            gutter: 3
        },
        data: {
            source: heatmapData,
            x: 'date',
            y: 'value'
        },
        date: {
            start: new Date(new Date().setMonth(new Date().getMonth() - 2)),
            highlight: [new Date()]
        },
        scale: {
            color: {
                type: 'threshold',
                range: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                domain: [1, 3, 5, 10]
            }
        }
    });
}

// ========== 数据导出函数 ==========

/**
 * 导出统计数据为JSON
 */
function exportStatisticsJSON() {
    const stats = calculateStatistics();
    const dailyData = getDailyAggregation(30);
    const wrongDist = getWrongDistribution();

    const exportData = {
        overview: stats,
        dailyHistory: dailyData,
        wrongDistribution: wrongDist,
        exportTime: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习统计_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * 导出统计数据为CSV
 */
function exportStatisticsCSV() {
    const dailyData = getDailyAggregation(30);

    let csv = '日期,练习题数,正确数,正确率\n';
    dailyData.forEach(d => {
        csv += `${d.date},${d.questions},${d.correct},${d.accuracy}%\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习统计_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * 渲染弱项诊断视图
 */
function renderDiagnosisView() {
    const container = document.getElementById('diagnosis-container');

    try {
        // 分析弱项
        const diagnosis = diagnosisModule.analyzeWeaknesses();

        let html = '';

        // 诊断摘要
        html += `
            <div class="diagnosis-summary">
                <div class="diagnosis-stats">
                    <div class="stat-item">
                        <div class="stat-value">${diagnosis.summary.totalKnowledgePoints}</div>
                        <div class="stat-label">知识点总数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${diagnosis.summary.weakPointsCount}</div>
                        <div class="stat-label">弱项数量</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${(diagnosis.summary.averageAccuracy * 100).toFixed(1)}%</div>
                        <div class="stat-label">平均准确率</div>
                    </div>
                </div>
                <div class="analysis-info">
                    <small>分析周期: ${diagnosis.summary.analysisPeriod} | 最低尝试次数: ${diagnosis.config.minAttempts}</small>
                </div>
            </div>
        `;

        // 弱项列表
        if (diagnosis.weakPoints.length > 0) {
            html += `
                <div class="weak-points-section">
                    <h4>📋 弱项知识点排行</h4>
                    <div class="weak-points-list">
            `;

            diagnosis.weakPoints.forEach((point, index) => {
                const strengthClass = point.accuracy < 0.3 ? 'very-weak' :
                                    point.accuracy < 0.5 ? 'weak' :
                                    point.accuracy < 0.7 ? 'moderate' : 'mild';

                html += `
                    <div class="weak-point-item ${strengthClass}">
                        <div class="point-header">
                            <span class="point-rank">#${index + 1}</span>
                            <span class="point-id">${point.knowledgePointId}</span>
                            <span class="point-accuracy">${(point.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div class="point-details">
                            <div class="progress-bar-container">
                                <div class="progress-bar progress-bar-red" style="width: ${(point.accuracy * 100)}%"></div>
                            </div>
                            <div class="point-stats">
                                <span>尝试: ${point.totalAttempts}次</span>
                                <span>正确: ${point.correctAttempts}次</span>
                            </div>
                        </div>
                        <div class="point-actions">
                            <button class="btn btn-sm btn-outline" onclick="generateFocusedPractice('${point.knowledgePointId}')">
                                专项练习
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="viewKnowledgePointDetails('${point.knowledgePointId}')">
                                详情
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="no-weak-points">
                    <div class="success-message">
                        🎉 恭喜！未发现明显弱项，继续保持良好学习状态！
                    </div>
                </div>
            `;
        }

        // 推荐建议
        if (diagnosis.recommendations.length > 0) {
            html += `
                <div class="recommendations-section">
                    <h4>💡 学习建议</h4>
                    <div class="recommendations-list">
            `;

            diagnosis.recommendations.forEach(rec => {
                const typeClass = rec.type === 'danger' ? 'rec-danger' :
                                rec.type === 'warning' ? 'rec-warning' :
                                rec.type === 'success' ? 'rec-success' : 'rec-info';

                html += `
                    <div class="recommendation-item ${typeClass}">
                        <div class="rec-message">${rec.message}</div>
                        <div class="rec-actions">
                `;

                if (rec.actions) {
                    rec.actions.forEach(action => {
                        if (action.action === 'generateFocusedPractice') {
                            html += `<button class="btn btn-sm" onclick="generateFocusedPractice('${action.params.knowledgePointIds.join(',')}')">🔄 ${action.text}</button>`;
                        } else if (action.action === 'viewWrongQuestions') {
                            html += `<button class="btn btn-sm" onclick="viewManager.switchView('practice')">📚 ${action.text}</button>`;
                        }
                    });
                }

                html += `
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

    } catch (error) {
        console.error('诊断渲染失败:', error);
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">❌</div>
                <div>弱项诊断加载失败: ${error.message}</div>
                <button class="btn btn-primary" onclick="renderDiagnosisView()">重试</button>
            </div>
        `;
    }
}

/**
 * 生成针对性练习
 * @param {string} knowledgePointIds - 知识点ID，多个用逗号分隔
 */
function generateFocusedPractice(knowledgePointIds) {
    const ids = knowledgePointIds.split(',');

    // 切换到练习页面并设置筛选条件
    viewManager.switchView('practice');

    // 通过localStorage传递筛选条件
    dataManager.save('focusedPracticeFilter', {
        knowledgePoints: ids,
        timestamp: new Date().toISOString()
    });

    // 显示提示消息
    setTimeout(() => {
        alert(`已设置练习筛选条件：${ids.join(', ')}\n请在练习页面选择相应知识点进行针对性练习。`);
    }, 500);
}

/**
 * 查看知识点详情
 * @param {string} knowledgePointId - 知识点ID
 */
function viewKnowledgePointDetails(knowledgePointId) {
    const details = diagnosisModule.getKnowledgePointDetails(knowledgePointId);

    if (!details) {
        alert('未找到该知识点的练习记录');
        return;
    }

    // 显示详情弹窗
    const detailHTML = `
        <div class="knowledge-point-details">
            <h3>知识点详情: ${knowledgePointId}</h3>
            <div class="detail-stats">
                <div class="stat-item">
                    <div class="stat-value">${details.totalAttempts}</div>
                    <div class="stat-label">总尝试次数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${(details.accuracy * 100).toFixed(1)}%</div>
                    <div class="stat-label">准确率</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${details.trend === 'improving' ? '↗️ 上升' :
                                           details.trend === 'declining' ? '↘️ 下降' : '➡️ 稳定'}</div>
                    <div class="stat-label">趋势</div>
                </div>
            </div>
            <div class="recent-attempts">
                <h4>最近练习记录</h4>
                <div class="attempts-list">
                    ${details.recentAttempts.slice(0, 5).map(attempt => `
                        <div class="attempt-item ${attempt.isCorrect ? 'correct' : 'wrong'}">
                            <span class="attempt-time">${new Date(attempt.timestamp).toLocaleString()}</span>
                            <span class="attempt-result">${attempt.isCorrect ? '✓' : '✗'}</span>
                            <span class="attempt-answer">${attempt.userAnswer}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // 显示弹窗 (简化为新窗口)
    const detailWindow = window.open('', '_blank', 'width=600,height=400');
    detailWindow.document.write(`
        <html>
        <head><title>知识点详情 - ${knowledgePointId}</title><style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .knowledge-point-details h3 { color: #333; }
            .detail-stats { display: flex; gap: 20px; margin: 20px 0; }
            .stat-item { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #007bff; }
            .stat-label { color: #666; }
            .recent-attempts { margin-top: 30px; }
            .attempts-list { margin-top: 10px; }
            .attempt-item { padding: 8px; margin: 5px 0; border-radius: 4px; }
            .attempt-item.correct { background: #d4edda; }
            .attempt-item.wrong { background: #f8d7da; }
            .attempt-time { font-size: 12px; color: #666; }
            .attempt-result { margin: 0 10px; font-weight: bold; }
        </style></head>
        <body>${detailHTML}</body>
        </html>
    `);
}

/**
 * 生成学习报告
 */
function generateLearningReport() {
    const stats = calculateStatistics();
    const dailyData = getDailyAggregation(7);
    const wrongDist = getWrongDistribution();

    const reportHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>考研数学学习报告</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2196F3; text-align: center; }
        h2 { color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .stat-box { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-box .value { font-size: 28px; font-weight: bold; color: #2196F3; }
        .stat-box .label { color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background: #2196F3; color: white; }
        .footer { text-align: center; color: #999; margin-top: 40px; font-size: 12px; }
    </style>
</head>
<body>
    <h1>📚 考研数学学习报告</h1>
    <p style="text-align: center; color: #666;">生成时间: ${new Date().toLocaleString()}</p>

    <h2>📊 学习概览</h2>
    <div class="stats-grid">
        <div class="stat-box">
            <div class="value">${stats.totalQuestions}</div>
            <div class="label">总练习题数</div>
        </div>
        <div class="stat-box">
            <div class="value">${stats.accuracy}%</div>
            <div class="label">总正确率</div>
        </div>
        <div class="stat-box">
            <div class="value">${stats.studyDays}</div>
            <div class="label">学习天数</div>
        </div>
        <div class="stat-box">
            <div class="value">${stats.wrongCount}</div>
            <div class="label">错题数</div>
        </div>
    </div>

    <h2>📅 近7天学习记录</h2>
    <table>
        <tr><th>日期</th><th>练习题数</th><th>正确数</th><th>正确率</th></tr>
        ${dailyData.map(d => `<tr><td>${d.date}</td><td>${d.questions}</td><td>${d.correct}</td><td>${d.accuracy}%</td></tr>`).join('')}
    </table>

    <h2>📚 学科掌握度</h2>
    <table>
        <tr><th>学科</th><th>掌握度</th></tr>
        <tr><td>微积分</td><td>${stats.subjectMastery.calculus}%</td></tr>
        <tr><td>线性代数</td><td>${stats.subjectMastery.linear}%</td></tr>
        <tr><td>概率论与数理统计</td><td>${stats.subjectMastery.probability}%</td></tr>
    </table>

    <h2>❌ 错题分布</h2>
    <table>
        <tr><th>学科</th><th>错题数</th></tr>
        ${Object.entries(wrongDist).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
    </table>

    <h2>💡 学习建议</h2>
    <ul>
        ${stats.accuracy < 60 ? '<li>正确率偏低，建议加强基础概念复习</li>' : ''}
        ${stats.studyDays < 7 ? '<li>学习天数较少，建议保持每日学习习惯</li>' : ''}
        ${stats.wrongCount > 20 ? '<li>错题较多，建议定期复习错题本</li>' : ''}
        ${stats.subjectMastery.calculus < 50 ? '<li>微积分掌握度不足，建议重点强化</li>' : ''}
        ${stats.subjectMastery.linear < 50 ? '<li>线性代数掌握度不足，建议重点强化</li>' : ''}
        ${stats.subjectMastery.probability < 50 ? '<li>概率论掌握度不足，建议重点强化</li>' : ''}
        <li>坚持每日练习，持续提升!</li>
    </ul>

    <div class="footer">
        考研数学学习助手 - 自动生成报告
    </div>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习报告_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('statistics', renderStatisticsView) 注册
