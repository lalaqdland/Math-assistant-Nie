/**
 * 知识点学习模块 - 考研数学学习助手
 * 包含知识点树、详情显示、AI增强等功能
 *
 * 依赖：
 * - data-manager.js (dataManager, viewManager)
 * - knowledge-data.js (getDefaultKnowledgeTree, getStatusIcon等)
 * - ai-adapter.js (callAI, isAIConfigured)
 */

// ========== 全局状态 ==========
let currentKnowledgeUnit = null;  // 当前查看的知识点ID
let knowledgeStartTime = null;    // 学习开始时间

// ========== 知识点树渲染 ==========

/**
 * 渲染知识点树
 * @param {HTMLElement} containerEl - 容器元素
 * @param {string} selectedUnitId - 当前选中的知识点ID
 */
function renderKnowledgeTree(containerEl, selectedUnitId = null) {
    const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
    const progress = dataManager.load('learningProgress', {});

    let html = '';

    for (const [subjectKey, subject] of Object.entries(tree)) {
        // 计算学科进度
        const subjectProgress = calculateSubjectProgress(subject, progress);

        html += `
            <div class="tree-subject">
                <div class="tree-subject-title" onclick="toggleSubject('${subjectKey}')">
                    <span>
                        <span class="expand-icon ${subject.expanded ? 'expanded' : ''}">▶</span>
                        ${subject.icon} ${subject.name}
                    </span>
                    <span class="badge badge-primary">${subjectProgress}%</span>
                </div>
                <div class="tree-chapters" style="display: ${subject.expanded ? 'block' : 'none'}">
        `;

        for (const chapter of subject.chapters) {
            const chapterStatusIcon = getChapterStatusIcon(chapter, progress);

            html += `
                <div class="tree-chapter">
                    <div class="tree-chapter-title" onclick="toggleChapter('${subjectKey}', '${chapter.id}')">
                        <span>
                            <span class="expand-icon ${chapter.expanded ? 'expanded' : ''}">▶</span>
                            ${chapter.name}
                        </span>
                        <span class="status-icon">${chapterStatusIcon}</span>
                    </div>
                    <div class="tree-units" style="display: ${chapter.expanded ? 'block' : 'none'}">
            `;

            for (const unit of chapter.units) {
                const isActive = unit.id === selectedUnitId;
                const unitProgress = progress[unit.id];
                const status = unitProgress?.status || 'not-started';

                html += `
                    <div class="tree-unit ${isActive ? 'active' : ''}"
                         onclick="loadKnowledgeUnit('${unit.id}')">
                        <span>${unit.name}</span>
                        <span class="status-icon">${getStatusIcon(status)}</span>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    }

    containerEl.innerHTML = html;
}

/**
 * 获取章节状态图标
 */
function getChapterStatusIcon(chapter, progress) {
    let completed = 0;
    let started = 0;
    const total = chapter.units.length;

    chapter.units.forEach(unit => {
        const status = progress[unit.id]?.status;
        if (status === 'completed' || status === 'mastered') {
            completed++;
        } else if (status === 'learning') {
            started++;
        }
    });

    if (completed === total) return '✅';
    if (completed > 0 || started > 0) return '📖';
    return '';
}

// ========== 树形导航交互 ==========

/**
 * 切换科目展开/折叠
 */
function toggleSubject(subjectKey) {
    const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
    tree[subjectKey].expanded = !tree[subjectKey].expanded;
    dataManager.save('knowledgeTree', tree);
    renderKnowledgeView();
}

/**
 * 切换章节展开/折叠
 */
function toggleChapter(subjectKey, chapterId) {
    const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
    const chapter = tree[subjectKey].chapters.find(c => c.id === chapterId);
    if (chapter) {
        chapter.expanded = !chapter.expanded;
        dataManager.save('knowledgeTree', tree);
        renderKnowledgeView();
    }
}

// ========== 知识点详情 ==========

/**
 * 加载知识点详情
 */
function loadKnowledgeUnit(unitId) {
    const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
    const progress = dataManager.load('learningProgress', {});

    // 查找知识点
    let unit = null;
    let subject = null;
    let chapter = null;

    for (const [subjectKey, subjectData] of Object.entries(tree)) {
        for (const chapterData of subjectData.chapters) {
            const foundUnit = chapterData.units.find(u => u.id === unitId);
            if (foundUnit) {
                unit = foundUnit;
                subject = subjectData;
                chapter = chapterData;
                break;
            }
        }
        if (unit) break;
    }

    if (!unit) {
        console.error('知识点不存在:', unitId);
        return;
    }

    // 更新学习状态
    if (!progress[unitId]) {
        progress[unitId] = {
            status: 'learning',
            startTime: new Date().toISOString(),
            totalTime: 0
        };
    }
    progress[unitId].lastStudyTime = new Date().toISOString();
    dataManager.save('learningProgress', progress);

    // 记录当前知识点
    currentKnowledgeUnit = unitId;
    knowledgeStartTime = Date.now();

    // 渲染详情页面
    renderKnowledgeDetail(unit, subject, chapter, progress[unitId]);

    // 重新渲染树（更新选中状态）
    const treeContainer = document.querySelector('.knowledge-tree');
    if (treeContainer) {
        renderKnowledgeTree(treeContainer, unitId);
    }

    // 渲染MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([document.querySelector('.knowledge-detail')])
            .catch(err => console.log('MathJax渲染错误:', err));
    }
}

/**
 * 渲染知识点详情
 */
function renderKnowledgeDetail(unit, subject, chapter, progress) {
    const detailContainer = document.querySelector('.knowledge-detail');
    if (!detailContainer) return;

    const notes = dataManager.load('learningNotes', {})[unit.id] || '';
    const statusIcon = getStatusIcon(progress.status);

    detailContainer.innerHTML = `
        <!-- 面包屑 -->
        <div class="breadcrumb">
            ${subject.name} > ${chapter.name} > ${unit.name}
        </div>

        <!-- 标题 -->
        <div class="unit-header">
            <h2>${unit.name}</h2>
            <div class="unit-meta">
                <span class="badge badge-primary">${getDifficultyText(unit.difficulty)}</span>
                <span class="badge badge-success">${statusIcon} ${getStatusText(progress.status)}</span>
            </div>
        </div>

        <!-- 概念讲解 -->
        <div class="concept-section">
            <h3>📖 概念讲解</h3>
            <div class="concept-content">${unit.content.concept}</div>
            <button class="btn btn-primary" onclick="expandWithAI('${unit.id}')" style="margin-top: 15px;">
                🤖 AI详细讲解
            </button>
            <div id="ai-enhanced-content" style="margin-top: 15px;"></div>
        </div>

        <!-- 重要公式 -->
        ${unit.content.formulas && unit.content.formulas.length > 0 ? `
        <div class="formula-section">
            <h3>📐 重要公式</h3>
            <div class="formula-list">
                ${unit.content.formulas.map(f => `<div>${f}</div>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- 学习要点 -->
        ${unit.content.keyPoints && unit.content.keyPoints.length > 0 ? `
        <div class="concept-section">
            <h3>💡 学习要点</h3>
            <ul class="key-points-list">
                ${unit.content.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- 典型例题 -->
        ${unit.content.examples && unit.content.examples.length > 0 ? `
        <div class="example-section">
            <h3>📝 典型例题</h3>
            <div class="examples">
                ${unit.content.examples.map(ex => `
                    <div class="example-item">
                        <strong>${ex.title}</strong>
                        <div style="margin: 10px 0;">${ex.content}</div>
                        <details>
                            <summary>查看解答</summary>
                            <div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                                ${ex.solution}
                            </div>
                        </details>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="generateMoreExamples('${unit.id}')" style="margin-top: 15px;">
                ➕ AI生成更多例题
            </button>
            <div id="ai-examples-content"></div>
        </div>
        ` : ''}

        <!-- 学习笔记 -->
        <div class="notes-section">
            <h3>✏️ 我的笔记</h3>
            <textarea id="learning-notes" placeholder="记录学习心得...">${notes}</textarea>
            <button class="btn btn-success" onclick="saveNotes('${unit.id}')" style="margin-top: 10px;">
                💾 保存笔记
            </button>
        </div>

        <!-- 学习状态控制 -->
        <div class="status-control">
            <h4>学习状态</h4>
            <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                <button class="btn btn-warning" onclick="updateStatus('${unit.id}', 'learning')">
                    🟡 学习中
                </button>
                <button class="btn btn-success" onclick="updateStatus('${unit.id}', 'completed')">
                    🟢 已完成
                </button>
                <button class="btn btn-primary" onclick="updateStatus('${unit.id}', 'mastered')">
                    ⭐ 已掌握
                </button>
            </div>
        </div>

        <!-- 相关习题 -->
        <div class="practice-section">
            <h3>✍️ 相关习题</h3>
            <p>练习巩固所学知识</p>
            <button class="btn btn-primary" onclick="gotoPractice('${unit.id}')">
                去练习 →
            </button>
        </div>
    `;
}

// ========== 学习状态管理 ==========

/**
 * 保存笔记
 */
function saveNotes(unitId) {
    const notesInput = document.getElementById('learning-notes');
    if (!notesInput) return;

    const notes = notesInput.value;
    const allNotes = dataManager.load('learningNotes', {});
    allNotes[unitId] = notes;
    dataManager.save('learningNotes', allNotes);
    alert('笔记已保存！');
}

/**
 * 更新学习状态
 */
function updateStatus(unitId, newStatus) {
    const progress = dataManager.load('learningProgress', {});
    if (!progress[unitId]) {
        progress[unitId] = {
            startTime: new Date().toISOString(),
            totalTime: 0
        };
    }
    progress[unitId].status = newStatus;
    progress[unitId].lastStudyTime = new Date().toISOString();
    dataManager.save('learningProgress', progress);

    // 如果状态为"已完成"或"已掌握"，加入复习队列
    if ((newStatus === 'completed' || newStatus === 'mastered') && typeof ReviewScheduler !== 'undefined') {
        // 查找知识点信息
        const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());
        let unitName = unitId;
        let subject = 'calculus';

        for (const [subjectKey, subjectData] of Object.entries(tree)) {
            for (const chapter of subjectData.chapters) {
                const unit = chapter.units.find(u => u.id === unitId);
                if (unit) {
                    unitName = unit.name;
                    subject = subjectKey;
                    break;
                }
            }
        }

        // 添加到复习队列
        ReviewScheduler.addToReview(unitId, 'knowledge', unitName, subject);
    }

    // 重新加载当前知识点
    loadKnowledgeUnit(unitId);

    alert(`状态已更新为: ${getStatusText(newStatus)}`);
}

/**
 * 跳转到练习
 */
function gotoPractice(unitId) {
    // 切换到练习视图
    viewManager.switchView('practice');

    // 延迟执行以确保视图加载完成
    setTimeout(() => {
        // 切换到专项练习标签页
        document.querySelectorAll('.practice-tab').forEach(tab => {
            tab.style.background = '#f0f0f0';
            tab.style.color = '#666';
            tab.classList.remove('active');
        });
        const exerciseTab = document.querySelector('.practice-tab[data-tab="exercise"]');
        if (exerciseTab) {
            exerciseTab.style.background = 'var(--primary-color)';
            exerciseTab.style.color = 'white';
            exerciseTab.classList.add('active');
        }

        // 重新渲染筛选界面
        loadPracticeTab('exercise');

        // 再次延迟以确保筛选界面渲染完成
        setTimeout(() => {
            // 设置筛选条件为指定知识点
            const knowledgePointSelect = document.getElementById('filterKnowledgePoint');
            if (knowledgePointSelect) {
                knowledgePointSelect.value = unitId;
            }

            // 开始练习
            startExercise(unitId);
        }, 100);
    }, 100);
}

// ========== AI增强功能 ==========

/**
 * AI详细讲解
 */
async function expandWithAI(unitId) {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '🤖 AI生成中...';
    btn.disabled = true;

    try {
        // 检查AI配置
        if (typeof isAIConfigured === 'function' && !isAIConfigured()) {
            alert('请先在"设置"页面配置AI模型\n\n配置完成后，AI功能将在整个系统中可用。');
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());

        // 查找知识点
        let unit = null;
        for (const subject of Object.values(tree)) {
            for (const chapter of subject.chapters) {
                unit = chapter.units.find(u => u.id === unitId);
                if (unit) break;
            }
            if (unit) break;
        }

        if (!unit) throw new Error('知识点不存在');

        // 检查缓存
        if (unit.aiEnhanced && unit.aiEnhanced.detailedExplanation) {
            displayAIEnhancedContent(unit.aiEnhanced.detailedExplanation);
            btn.textContent = '✅ 已生成';
            return;
        }

        // 调用AI
        const messages = [
            {
                role: 'user',
                content: `作为考研数学老师，请详细讲解以下知识点，要求：
1. 深入浅出，用通俗易懂的语言
2. 包含必要的数学公式（用LaTeX格式，行内公式用$...$，显示公式用$$...$$）
3. 举出实际例子帮助理解
4. 指出常见易错点

知识点标题：${unit.name}
基础概念：${unit.content.concept}

请生成详细的教学讲解。`
            }
        ];

        const response = await callAI(messages, { maxTokens: 3000 });

        // 保存到缓存
        if (!unit.aiEnhanced) unit.aiEnhanced = {};
        unit.aiEnhanced.detailedExplanation = response;
        dataManager.save('knowledgeTree', tree);

        // 显示内容
        displayAIEnhancedContent(response);
        btn.textContent = '✅ 已生成';

    } catch (error) {
        console.error('AI生成失败:', error);
        alert(`AI生成失败: ${error.message}`);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

/**
 * 显示AI增强内容
 */
function displayAIEnhancedContent(content) {
    const container = document.getElementById('ai-enhanced-content');
    if (!container) return;

    container.innerHTML = `
        <div style="background: linear-gradient(to right, #E8F4FD, #F0F8FF);
                    padding: 20px; border-radius: 8px;
                    border-left: 4px solid var(--primary-color);">
            <h4 style="color: var(--primary-color); margin-bottom: 15px;">
                🤖 AI详细讲解
            </h4>
            <div class="ai-content">${content}</div>
        </div>
    `;

    // 渲染MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(err => console.log('MathJax渲染错误:', err));
    }
}

/**
 * AI生成更多例题
 */
async function generateMoreExamples(unitId) {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '🤖 AI生成中...';
    btn.disabled = true;

    try {
        // 检查AI配置
        if (typeof isAIConfigured === 'function' && !isAIConfigured()) {
            alert('请先在"设置"页面配置AI模型\n\n配置完成后，AI功能将在整个系统中可用。');
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        const tree = dataManager.load('knowledgeTree', getDefaultKnowledgeTree());

        // 查找知识点
        let unit = null;
        for (const subject of Object.values(tree)) {
            for (const chapter of subject.chapters) {
                unit = chapter.units.find(u => u.id === unitId);
                if (unit) break;
            }
            if (unit) break;
        }

        if (!unit) throw new Error('知识点不存在');

        // 调用AI
        const messages = [
            {
                role: 'user',
                content: `作为考研数学老师，请针对以下知识点生成3道练习题，要求：
1. 难度递进（简单→中等→较难）
2. 包含完整的题目和详细解答
3. 数学公式用LaTeX格式（行内$...$，显示$$...$$）
4. 每题后标注考查要点

知识点：${unit.name}
基础内容：${unit.content.concept}

请生成3道练习题。`
            }
        ];

        const response = await callAI(messages, { maxTokens: 3000 });

        // 保存到缓存
        if (!unit.aiEnhanced) unit.aiEnhanced = {};
        if (!unit.aiEnhanced.additionalExamples) {
            unit.aiEnhanced.additionalExamples = [];
        }
        unit.aiEnhanced.additionalExamples.push({
            content: response,
            timestamp: new Date().toISOString()
        });
        dataManager.save('knowledgeTree', tree);

        // 显示内容
        const examplesContainer = document.getElementById('ai-examples-content');
        if (examplesContainer) {
            examplesContainer.innerHTML = `
                <div style="background: linear-gradient(to right, #E8F4FD, #F0F8FF);
                            padding: 20px; border-radius: 8px; margin-top: 15px;
                            border-left: 4px solid var(--success-color);">
                    <h4 style="color: var(--success-color); margin-bottom: 15px;">
                        🤖 AI生成例题
                    </h4>
                    <div class="ai-content">${response}</div>
                </div>
            `;

            // 渲染MathJax
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([examplesContainer]).catch(err => console.log('MathJax渲染错误:', err));
            }
        }

        btn.textContent = '✅ 已生成';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('AI生成失败:', error);
        alert(`AI生成失败: ${error.message}`);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ========== 视图渲染 ==========

/**
 * 渲染知识点学习视图
 */
function renderKnowledgeView() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="knowledge-container">
            <!-- 左侧知识点树 -->
            <div class="knowledge-tree">
                <!-- 树形结构将由JavaScript生成 -->
            </div>

            <!-- 右侧知识点详情 -->
            <div class="knowledge-detail">
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <div class="empty-state-text">请从左侧选择要学习的知识点</div>
                    <div class="empty-state-text" style="font-size: 14px; color: #aaa; margin-top: 10px;">
                        已包含 <strong>微积分</strong>、<strong>线性代数</strong>、<strong>概率论</strong> 三大模块的核心知识点
                    </div>
                </div>
            </div>
        </div>
    `;

    // 渲染知识点树
    const treeContainer = container.querySelector('.knowledge-tree');
    renderKnowledgeTree(treeContainer);

    // 如果有当前知识点，加载它
    if (currentKnowledgeUnit) {
        setTimeout(() => loadKnowledgeUnit(currentKnowledgeUnit), 100);
    }
}

// 注册视图
if (typeof viewManager !== 'undefined') {
    viewManager.register('knowledge', renderKnowledgeView);
}
