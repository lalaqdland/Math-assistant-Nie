/**
 * 设置模块 - 考研数学学习助手
 * 包含设置视图、数据导入导出、数据清空、新手引导等功能
 */

// ========== 主视图渲染 ==========

/**
 * 渲染设置视图
 */
function renderSettingsView() {
    const container = document.getElementById('view-container');
    const settings = loadSettings();
    const storageInfo = dataManager.getStorageInfo();

    container.innerHTML = `
        <div class="settings-page">
            <!-- 学习偏好设置 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">📚 学习偏好设置</div>
                </div>
                <div class="settings-form">
                    <div class="settings-row">
                        <label>每日学习目标时长</label>
                        <select id="dailyStudyHours" onchange="saveSettings()">
                            ${[1,2,3,4,5,6,7,8].map(h =>
                                `<option value="${h}" ${settings.dailyStudyHours === h ? 'selected' : ''}>${h}小时</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="settings-row">
                        <label>考研目标分数</label>
                        <input type="number" id="targetScore" min="90" max="150"
                               value="${settings.targetScore}" onchange="saveSettings()">
                    </div>
                    <div class="settings-row">
                        <label>薄弱科目（可多选）</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="weakCalculus"
                                       ${settings.weakSubjects.includes('calculus') ? 'checked' : ''}
                                       onchange="saveSettings()">
                                微积分
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="weakLinearAlgebra"
                                       ${settings.weakSubjects.includes('linearAlgebra') ? 'checked' : ''}
                                       onchange="saveSettings()">
                                线性代数
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="weakProbability"
                                       ${settings.weakSubjects.includes('probability') ? 'checked' : ''}
                                       onchange="saveSettings()">
                                概率论
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI模型配置 -->
            <div class="card settings-card ai-config-section">
                <div class="card-header">
                    <div class="card-title">🤖 AI模型配置</div>
                </div>
                <div class="ai-config-form">
                    <div class="settings-row">
                        <label>AI厂商</label>
                        <select id="settingsAiProvider" onchange="onSettingsProviderChange()">
                            <option value="claude">Claude (Anthropic)</option>
                            <option value="deepseek">Deepseek</option>
                            <option value="zhipu">智谱AI (GLM)</option>
                            <option value="openai">OpenAI兼容API</option>
                        </select>
                    </div>
                    <div class="settings-row">
                        <label>API Key</label>
                        <input type="password" id="settingsApiKey" placeholder="请输入API Key">
                    </div>
                    <div class="settings-row">
                        <label>Base URL</label>
                        <input type="text" id="settingsBaseUrl" placeholder="API基础地址">
                    </div>
                    <div class="settings-row">
                        <label>模型</label>
                        <select id="settingsApiModel">
                            <!-- 动态填充 -->
                        </select>
                    </div>
                    <div class="settings-row" id="customModelRow" style="display: none;">
                        <label>自定义模型ID</label>
                        <input type="text" id="settingsCustomModelId" placeholder="输入自定义模型ID">
                    </div>
                    <div class="settings-row">
                        <div id="settingsConnectionStatus" class="connection-status"></div>
                    </div>
                    <div class="ai-config-buttons">
                        <button class="btn btn-secondary" onclick="testSettingsAIConnection()">
                            🔗 测试连接
                        </button>
                        <button class="btn btn-primary" onclick="saveSettingsAIConfig()">
                            💾 保存配置
                        </button>
                    </div>
                </div>
            </div>

            <!-- 存储空间使用情况 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">💾 存储空间</div>
                </div>
                <div class="storage-info">
                    <div class="storage-bar">
                        <div class="storage-used" style="width: ${Math.min((storageInfo.totalSize / (5 * 1024 * 1024)) * 100, 100).toFixed(1)}%"></div>
                    </div>
                    <div class="storage-text">
                        已使用 ${storageInfo.totalSizeKB} KB / 5 MB（${storageInfo.itemCount} 项数据）
                    </div>
                    <div class="storage-details" id="storageDetails" style="display: none;">
                        ${Object.entries(storageInfo.items).map(([key, size]) =>
                            `<div class="storage-item"><span>${getDataLabel(key)}</span><span>${(size/1024).toFixed(2)} KB</span></div>`
                        ).join('')}
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="toggleStorageDetails()">
                        查看详情
                    </button>
                </div>
            </div>

            <!-- 数据导出 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">📤 数据导出</div>
                </div>
                <div class="export-section">
                    <p class="section-desc">导出学习数据以便备份或迁移到其他设备。</p>
                    <div class="export-buttons">
                        <button class="btn btn-primary" onclick="dataManager.exportAllData()">
                            📦 导出全部数据
                        </button>
                        <button class="btn btn-secondary" onclick="exportLearningRecords()">
                            📚 导出学习记录
                        </button>
                        <button class="btn btn-secondary" onclick="exportWrongQuestions()">
                            📝 导出错题本
                        </button>
                        <button class="btn btn-secondary" onclick="exportAIConversations()">
                            💬 导出AI对话
                        </button>
                        <button class="btn btn-secondary" onclick="exportStudyPlans()">
                            📅 导出学习规划
                        </button>
                    </div>
                </div>
            </div>

            <!-- 数据导入 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">📥 数据导入</div>
                </div>
                <div class="import-section">
                    <p class="section-desc">从备份文件恢复学习数据。导入将覆盖现有同类数据。</p>
                    <input type="file" id="importFileInput" accept=".json" style="display: none;"
                           onchange="handleFileSelected(event)">
                    <button class="btn btn-warning" onclick="handleImportData()">
                        📥 选择文件导入
                    </button>
                </div>
            </div>

            <!-- 数据清空 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">🗑️ 数据清空</div>
                </div>
                <div class="clear-section">
                    <p class="section-desc warning-text">以下操作不可恢复，请谨慎操作！建议先导出备份。</p>
                    <div class="clear-buttons">
                        <button class="btn btn-outline" onclick="clearLearningRecords()">
                            清空学习记录
                        </button>
                        <button class="btn btn-outline" onclick="clearWrongQuestions()">
                            清空错题本
                        </button>
                        <button class="btn btn-outline" onclick="clearAIConversations()">
                            清空AI对话
                        </button>
                        <button class="btn btn-outline" onclick="clearStudyPlans()">
                            清空学习规划
                        </button>
                        <button class="btn btn-danger" onclick="handleClearData()">
                            ⚠️ 清空全部数据
                        </button>
                    </div>
                </div>
            </div>

            <!-- 关于 -->
            <div class="card settings-card">
                <div class="card-header">
                    <div class="card-title">ℹ️ 关于</div>
                </div>
                <div class="about-section">
                    <div class="about-info">
                        <h4>考研数学学习助手 v2.0.0</h4>
                        <p>一站式考研数学一学习平台，集知识点学习、智能规划、练习测试、AI助教于一体。</p>
                        <ul>
                            <li>📚 50+ 核心知识点覆盖微积分、线性代数、概率论</li>
                            <li>📅 智能学习规划，支持AI个性化调整</li>
                            <li>✍️ 专项练习与错题本管理</li>
                            <li>🤖 AI助教实时答疑</li>
                            <li>📊 学习统计与数据可视化</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 加载AI配置到表单
    setTimeout(loadSettingsAIConfig, 50);
}

// ========== 设置管理函数 ==========

/**
 * 获取数据项中文标签
 * @param {string} key - 数据键名
 * @returns {string} 中文标签
 */
function getDataLabel(key) {
    const labels = {
        'userData': '用户数据',
        'progress': '学习进度',
        'learningProgress': '知识点进度',
        'learningNotes': '学习笔记',
        'knowledgeTree': '知识点树',
        'wrongQuestions': '错题本',
        'practiceHistory': '练习历史',
        'studyPlans': '学习规划',
        'statistics': '统计数据',
        'aiConversations': 'AI对话',
        'aiConfig': 'AI配置',
        'currentView': '当前视图',
        'settings': '设置'
    };
    return labels[key] || key;
}

/**
 * 切换存储详情显示
 */
function toggleStorageDetails() {
    const details = document.getElementById('storageDetails');
    if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * 加载设置
 * @returns {Object} 设置对象
 */
function loadSettings() {
    return dataManager.load('settings', {
        dailyStudyHours: 4,
        targetScore: 130,
        weakSubjects: []
    });
}

/**
 * 保存设置
 */
function saveSettings() {
    const settings = {
        dailyStudyHours: parseInt(document.getElementById('dailyStudyHours')?.value) || 4,
        targetScore: parseInt(document.getElementById('targetScore')?.value) || 130,
        weakSubjects: []
    };

    if (document.getElementById('weakCalculus')?.checked) {
        settings.weakSubjects.push('calculus');
    }
    if (document.getElementById('weakLinearAlgebra')?.checked) {
        settings.weakSubjects.push('linearAlgebra');
    }
    if (document.getElementById('weakProbability')?.checked) {
        settings.weakSubjects.push('probability');
    }

    dataManager.save('settings', settings);
}

// ========== 分类导出功能 ==========

/**
 * 导出学习记录
 */
function exportLearningRecords() {
    const data = {
        progress: dataManager.load('progress'),
        learningProgress: dataManager.load('learningProgress'),
        learningNotes: dataManager.load('learningNotes'),
        exportTime: new Date().toISOString(),
        type: 'learningRecords',
        version: '2.0.0'
    };
    downloadJSON(data, '学习记录');
}

/**
 * 导出错题本
 */
function exportWrongQuestions() {
    const wrongQuestions = dataManager.load('wrongQuestions');
    if (!wrongQuestions || wrongQuestions.length === 0) {
        alert('错题本为空，无数据可导出');
        return;
    }
    const data = {
        wrongQuestions: wrongQuestions,
        exportTime: new Date().toISOString(),
        type: 'wrongQuestions',
        version: '2.0.0'
    };
    downloadJSON(data, '错题本');
}

/**
 * 导出AI对话
 */
function exportAIConversations() {
    const aiConversations = dataManager.load('aiConversations');
    if (!aiConversations || aiConversations.length === 0) {
        alert('AI对话记录为空，无数据可导出');
        return;
    }
    const data = {
        aiConversations: aiConversations,
        exportTime: new Date().toISOString(),
        type: 'aiConversations',
        version: '2.0.0'
    };
    downloadJSON(data, 'AI对话');
}

/**
 * 导出学习规划
 */
function exportStudyPlans() {
    const studyPlans = dataManager.load('studyPlans');
    if (!studyPlans) {
        alert('学习规划为空，无数据可导出');
        return;
    }
    const data = {
        studyPlans: studyPlans,
        exportTime: new Date().toISOString(),
        type: 'studyPlans',
        version: '2.0.0'
    };
    downloadJSON(data, '学习规划');
}

/**
 * 下载JSON文件的通用函数
 * @param {Object} data - 要导出的数据
 * @param {string} name - 文件名称
 */
function downloadJSON(data, name) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `考研数学${name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ========== 分类清空功能 ==========

/**
 * 清空学习记录
 */
function clearLearningRecords() {
    const count = countLearningRecords();
    if (count === 0) {
        alert('学习记录已经为空');
        return;
    }
    if (!confirm(`确定要清空学习记录吗？\n\n将删除：\n- 学习进度数据\n- 知识点学习状态\n- 学习笔记\n\n共计 ${count} 项数据\n\n此操作不可恢复！`)) {
        return;
    }
    if (!confirm('再次确认：真的要清空学习记录吗？')) {
        return;
    }
    dataManager.remove('progress');
    dataManager.remove('learningProgress');
    dataManager.remove('learningNotes');
    alert('学习记录已清空！');
    renderSettingsView();
}

/**
 * 清空错题本
 */
function clearWrongQuestions() {
    const wrongQuestions = dataManager.load('wrongQuestions', []);
    if (wrongQuestions.length === 0) {
        alert('错题本已经为空');
        return;
    }
    if (!confirm(`确定要清空错题本吗？\n\n将删除 ${wrongQuestions.length} 道错题记录\n\n此操作不可恢复！`)) {
        return;
    }
    if (!confirm('再次确认：真的要清空错题本吗？')) {
        return;
    }
    dataManager.remove('wrongQuestions');
    alert('错题本已清空！');
    renderSettingsView();
}

/**
 * 清空AI对话
 */
function clearAIConversations() {
    const conversations = dataManager.load('aiConversations', []);
    if (conversations.length === 0) {
        alert('AI对话记录已经为空');
        return;
    }
    if (!confirm(`确定要清空AI对话记录吗？\n\n将删除 ${conversations.length} 条对话\n\n此操作不可恢复！`)) {
        return;
    }
    if (!confirm('再次确认：真的要清空AI对话吗？')) {
        return;
    }
    dataManager.remove('aiConversations');
    alert('AI对话记录已清空！');
    renderSettingsView();
}

/**
 * 清空学习规划
 */
function clearStudyPlans() {
    const plans = dataManager.load('studyPlans');
    if (!plans) {
        alert('学习规划已经为空');
        return;
    }
    if (!confirm('确定要清空学习规划吗？\n\n将删除所有学习计划和每日任务\n\n此操作不可恢复！')) {
        return;
    }
    if (!confirm('再次确认：真的要清空学习规划吗？')) {
        return;
    }
    dataManager.remove('studyPlans');
    alert('学习规划已清空！');
    renderSettingsView();
}

/**
 * 统计学习记录数量
 * @returns {number} 学习记录数量
 */
function countLearningRecords() {
    let count = 0;
    if (dataManager.has('progress')) count++;
    if (dataManager.has('learningProgress')) count++;
    if (dataManager.has('learningNotes')) count++;
    return count;
}

// ========== 数据导入导出辅助函数 ==========

/**
 * 处理导入数据
 */
function handleImportData() {
    document.getElementById('importFileInput').click();
}

/**
 * 处理文件选择
 * @param {Event} event - 文件选择事件
 */
async function handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const data = await dataManager.importData(file);
        alert(`数据导入成功!\n导出时间: ${new Date(data.exportTime).toLocaleString()}`);
        location.reload(); // 重新加载页面以应用新数据
    } catch (error) {
        alert(`数据导入失败: ${error.message}`);
    }

    // 清空文件输入
    event.target.value = '';
}

/**
 * 处理清空全部数据
 */
function handleClearData() {
    if (!confirm('确定要清空所有数据吗?\n\n此操作不可恢复,建议先导出备份!')) {
        return;
    }

    if (!confirm('再次确认: 真的要清空所有学习数据吗?')) {
        return;
    }

    dataManager.clearAllData();
    alert('数据已清空!');
    location.reload();
}

// ========== AI配置功能 ==========

/**
 * 设置页面厂商切换处理
 */
function onSettingsProviderChange() {
    const provider = document.getElementById('settingsAiProvider').value;
    const modelSelect = document.getElementById('settingsApiModel');
    const baseUrlInput = document.getElementById('settingsBaseUrl');
    const customModelRow = document.getElementById('customModelRow');

    // 更新模型列表
    if (modelSelect && AI_PROVIDERS[provider]) {
        const models = AI_PROVIDERS[provider].models;
        modelSelect.innerHTML = models.map(m =>
            `<option value="${m.id}">${m.name}</option>`
        ).join('');
    }

    // 更新Base URL
    if (baseUrlInput && AI_PROVIDERS[provider]) {
        baseUrlInput.value = AI_PROVIDERS[provider].baseUrl;
    }

    // 显示/隐藏自定义模型输入
    if (customModelRow) {
        customModelRow.style.display = provider === 'openai' ? 'block' : 'none';
    }
}

/**
 * 测试设置页面的AI连接
 */
async function testSettingsAIConnection() {
    const provider = document.getElementById('settingsAiProvider').value;
    const key = document.getElementById('settingsApiKey').value.trim();
    const baseUrl = document.getElementById('settingsBaseUrl').value.trim();
    let modelId = document.getElementById('settingsApiModel').value;
    const statusDiv = document.getElementById('settingsConnectionStatus');

    if (provider === 'openai') {
        const customModel = document.getElementById('settingsCustomModelId').value.trim();
        if (customModel) modelId = customModel;
    }

    if (!key) {
        statusDiv.innerHTML = '<span style="color: #F44336;">请输入API Key</span>';
        return;
    }

    statusDiv.innerHTML = '<span style="color: #FF9800;">正在测试连接...</span>';

    try {
        const testAdapter = new AIModelAdapter(provider, key, modelId, baseUrl);
        await testAdapter.chat([{ role: 'user', content: '你好，请回复"连接成功"' }], { maxTokens: 50 });
        statusDiv.innerHTML = '<span style="color: #4CAF50;">✓ 连接成功！</span>';
    } catch (error) {
        statusDiv.innerHTML = `<span style="color: #F44336;">✗ 连接失败: ${error.message}</span>`;
    }
}

/**
 * 保存设置页面的AI配置
 */
function saveSettingsAIConfig() {
    const provider = document.getElementById('settingsAiProvider').value;
    const key = document.getElementById('settingsApiKey').value.trim();
    const baseUrl = document.getElementById('settingsBaseUrl').value.trim();
    let modelId = document.getElementById('settingsApiModel').value;

    if (provider === 'openai') {
        const customModel = document.getElementById('settingsCustomModelId').value.trim();
        if (customModel) modelId = customModel;
    }

    if (!key) {
        alert('请输入API Key');
        return;
    }

    // 保存到统一的配置键
    const config = {
        provider: provider,
        apiKey: key,
        modelId: modelId,
        baseUrl: baseUrl || AI_PROVIDERS[provider]?.baseUrl
    };
    localStorage.setItem('mathHelper_aiConfig', JSON.stringify(config));

    // 初始化适配器
    initAIAdapter(provider, key, modelId, config.baseUrl);

    // 更新AI状态
    updateAIStatus();
    hideAIBanner();

    alert('AI配置已保存！');
}

/**
 * 加载设置页面的AI配置
 */
function loadSettingsAIConfig() {
    try {
        const configStr = localStorage.getItem('mathHelper_aiConfig');
        if (configStr) {
            const config = JSON.parse(configStr);

            const providerSelect = document.getElementById('settingsAiProvider');
            const keyInput = document.getElementById('settingsApiKey');
            const baseUrlInput = document.getElementById('settingsBaseUrl');
            const modelSelect = document.getElementById('settingsApiModel');
            const customModelInput = document.getElementById('settingsCustomModelId');
            const customModelRow = document.getElementById('customModelRow');

            if (providerSelect) providerSelect.value = config.provider || 'claude';

            // 先更新模型列表
            onSettingsProviderChange();

            if (keyInput) keyInput.value = config.apiKey || '';
            if (baseUrlInput) baseUrlInput.value = config.baseUrl || '';
            if (modelSelect && config.provider !== 'openai') {
                modelSelect.value = config.modelId || '';
            }
            if (customModelInput && config.provider === 'openai') {
                customModelInput.value = config.modelId || '';
            }
            if (customModelRow) {
                customModelRow.style.display = config.provider === 'openai' ? 'block' : 'none';
            }
        } else {
            // 没有配置，初始化默认状态
            onSettingsProviderChange();
        }
    } catch (error) {
        console.error('加载AI配置失败:', error);
        onSettingsProviderChange();
    }
}

// ========== 新手引导系统 ==========

/**
 * 初始化新手引导
 */
function initOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
        showOnboarding();
    }
    // 检查AI配置状态，显示提示条
    checkAndShowAIBanner();
}

/**
 * 显示新手引导
 */
function showOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

/**
 * 关闭新手引导
 */
function closeOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    const dontShowAgain = document.getElementById('dontShowAgain');

    if (overlay) {
        overlay.style.display = 'none';
    }

    // 如果勾选了不再显示，保存状态
    if (dontShowAgain && dontShowAgain.checked) {
        localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
        // 即使没勾选，首次使用后也记录已看过
        localStorage.setItem('hasSeenOnboarding', 'true');
    }
}

/**
 * 跳转到AI设置
 */
function goToAISettings() {
    closeOnboarding();
    hideAIBanner();
    viewManager.switchView('settings');
    // 滚动到AI配置区域（延迟执行以等待视图渲染）
    setTimeout(() => {
        const aiConfigSection = document.querySelector('.ai-config-section');
        if (aiConfigSection) {
            aiConfigSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

/**
 * 检查并显示AI配置提示条
 */
function checkAndShowAIBanner() {
    const bannerDismissed = sessionStorage.getItem('aiBannerDismissed');
    if (!bannerDismissed && !isAIConfigured()) {
        showAIBanner();
    }
}

/**
 * 显示AI配置提示条
 */
function showAIBanner() {
    const banner = document.getElementById('ai-config-banner');
    if (banner) {
        banner.style.display = 'block';
    }
}

/**
 * 隐藏AI配置提示条
 */
function hideAIBanner() {
    const banner = document.getElementById('ai-config-banner');
    if (banner) {
        banner.style.display = 'none';
    }
    // 本次会话内不再显示
    sessionStorage.setItem('aiBannerDismissed', 'true');
}

/**
 * 更新AI状态指示器
 */
function updateAIStatus() {
    const statusDot = document.getElementById('aiStatusDot');
    const statusText = document.getElementById('aiStatusText');
    const indicator = document.getElementById('aiStatusIndicator');

    if (!statusDot || !statusText) return;

    const configured = isAIConfigured();

    if (configured) {
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'AI已连接';
        indicator.title = '点击进入AI设置';
    } else {
        statusDot.className = 'status-dot disconnected';
        statusText.textContent = 'AI未配置';
        indicator.title = '点击配置AI';
    }
}

/**
 * 重新显示新手引导
 */
function reopenOnboarding() {
    showOnboarding();
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('settings', renderSettingsView) 注册
