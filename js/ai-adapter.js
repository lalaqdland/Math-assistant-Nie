/**
 * AI适配器模块 - 考研数学学习助手
 * 支持多AI厂商的统一调用接口
 *
 * 使用方法:
 * 1. 在HTML中引入此文件
 * 2. 调用 initAIAdapter(provider, apiKey, modelId, baseUrl) 初始化
 * 3. 使用 callAI(messages, options) 进行AI调用
 */

// ========== AI厂商配置 ==========
const AI_PROVIDERS = {
    claude: {
        name: 'Claude (Anthropic)',
        baseUrl: 'https://api.anthropic.com',
        apiVersion: '2023-06-01',
        models: [
            { id: 'claude-sonnet-4-5-20250929', name: 'Sonnet 4.5', maxTokens: 8000 },
            { id: 'claude-opus-4-5-20251101', name: 'Opus 4.5', maxTokens: 8000 },
            { id: 'claude-sonnet-3-5-20241022', name: 'Sonnet 3.5', maxTokens: 8000 }
        ]
    },
    deepseek: {
        name: 'Deepseek',
        baseUrl: 'https://api.deepseek.com',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat', maxTokens: 4096 },
            { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', maxTokens: 4096 }
        ]
    },
    zhipu: {
        name: '智谱AI (GLM)',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        models: [
            { id: 'glm-4-plus', name: 'GLM-4 Plus', maxTokens: 8000 },
            { id: 'glm-4-flash', name: 'GLM-4 Flash', maxTokens: 4000 }
        ]
    },
    openai: {
        name: 'OpenAI兼容API',
        baseUrl: 'https://api.openai.com',
        models: [
            { id: 'custom', name: '自定义模型', maxTokens: 4096 }
        ]
    }
};

// ========== 全局变量 ==========
let currentProvider = 'claude';
let apiAdapter = null;

// 向后兼容的变量（已废弃，使用apiAdapter代替）
let apiKey = '';
let apiBaseUrl = 'https://api.anthropic.com';
let apiModel = 'claude-sonnet-4-5-20250929';

// ========== AI模型适配器类 ==========

/**
 * AIModelAdapter - 统一的AI模型适配器类
 * 支持多个AI厂商的API调用
 */
class AIModelAdapter {
    /**
     * 构造函数
     * @param {string} provider - 厂商名称: 'claude', 'deepseek', 'zhipu', 'openai'
     * @param {string} apiKey - API密钥
     * @param {string} modelId - 模型ID
     * @param {string} baseUrl - API基础URL
     */
    constructor(provider, apiKey, modelId, baseUrl) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.modelId = modelId;
        this.baseUrl = baseUrl || AI_PROVIDERS[provider]?.baseUrl;
    }

    /**
     * 统一的聊天接口
     * @param {Array} messages - 消息数组
     * @param {Object} options - 可选参数
     * @returns {Promise<string>} - AI响应文本
     */
    async chat(messages, options = {}) {
        const {
            maxTokens = 2000,
            temperature = 1.0,
            retries = 3
        } = options;

        if (this.provider === 'claude') {
            return await this.callAnthropicAPI(messages, options);
        } else {
            return await this.callOpenAICompatibleAPI(messages, options);
        }
    }

    /**
     * Claude (Anthropic) API调用
     */
    async callAnthropicAPI(messages, options = {}) {
        const { maxTokens = 2000, temperature = 1.0, retries = 3 } = options;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': AI_PROVIDERS.claude.apiVersion
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        max_tokens: maxTokens,
                        temperature: temperature,
                        messages: messages
                    })
                });

                if (!response.ok) {
                    await this.handleError(response, attempt, retries);
                    continue;
                }

                const data = await response.json();
                return data.content[0].text;

            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`网络错误: ${error.message}`);
                }
                await this.sleep(Math.pow(2, attempt - 1) * 1000);
            }
        }
    }

    /**
     * OpenAI兼容API调用 (Deepseek, 智谱AI, OpenAI等)
     */
    async callOpenAICompatibleAPI(messages, options = {}) {
        const { maxTokens = 2000, temperature = 1.0, retries = 3 } = options;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        max_tokens: maxTokens,
                        temperature: temperature,
                        messages: messages
                    })
                });

                if (!response.ok) {
                    await this.handleError(response, attempt, retries);
                    continue;
                }

                const data = await response.json();
                return data.choices[0].message.content;

            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`网络错误: ${error.message}`);
                }
                await this.sleep(Math.pow(2, attempt - 1) * 1000);
            }
        }
    }

    /**
     * 错误处理和重试逻辑
     */
    async handleError(response, attempt, maxRetries) {
        const errorData = await response.json().catch(() => ({}));

        // 401 - 认证失败,不重试
        if (response.status === 401) {
            throw new Error('API Key无效，请检查配置');
        }

        // 429 - 速率限制,使用指数退避重试
        if (response.status === 429) {
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt - 1) * 1000;
                console.log(`速率限制,${delay/1000}秒后重试... (${attempt}/${maxRetries})`);
                await this.sleep(delay);
                return;
            } else {
                throw new Error('请求过于频繁，请稍后再试');
            }
        }

        // 5xx - 服务器错误,重试
        if (response.status >= 500) {
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt - 1) * 1000;
                console.log(`服务器错误,${delay/1000}秒后重试... (${attempt}/${maxRetries})`);
                await this.sleep(delay);
                return;
            } else {
                throw new Error('API服务器错误，请稍后再试');
            }
        }

        // 其他错误
        throw new Error(errorData.error?.message || `API调用失败: ${response.status}`);
    }

    /**
     * 延迟函数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========== 公共API函数 ==========

/**
 * 初始化AI适配器
 * @param {string} provider - 厂商名称
 * @param {string} key - API密钥
 * @param {string} modelId - 模型ID
 * @param {string} baseUrl - API基础URL（可选）
 */
function initAIAdapter(provider, key, modelId, baseUrl) {
    currentProvider = provider;
    apiKey = key;
    apiModel = modelId;
    apiBaseUrl = baseUrl || AI_PROVIDERS[provider]?.baseUrl;
    apiAdapter = new AIModelAdapter(provider, key, modelId, baseUrl);
    return apiAdapter;
}

/**
 * 统一的AI调用接口
 * @param {Array} messages - 消息数组
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} - AI响应文本
 */
async function callAI(messages, options = {}) {
    if (!apiAdapter) {
        throw new Error('请先配置AI模型');
    }

    try {
        return await apiAdapter.chat(messages, options);
    } catch (error) {
        console.error('AI调用失败:', error);
        throw error;
    }
}

/**
 * 向后兼容的Claude API调用函数
 * @param {Array} messages - 消息数组
 * @param {number} maxTokens - 最大token数
 * @returns {Promise<string>} - AI响应文本
 */
async function callClaudeAPI(messages, maxTokens = 2000) {
    if (!apiAdapter && apiKey) {
        console.warn('使用旧配置初始化apiAdapter');
        apiAdapter = new AIModelAdapter('claude', apiKey, apiModel, apiBaseUrl);
    }
    return await callAI(messages, { maxTokens });
}

/**
 * 检查AI是否已配置
 * @returns {boolean}
 */
function isAIConfigured() {
    return apiAdapter !== null;
}

/**
 * 获取当前AI配置
 * @returns {Object}
 */
function getAIConfig() {
    return {
        provider: currentProvider,
        model: apiModel,
        baseUrl: apiBaseUrl,
        isConfigured: isAIConfigured()
    };
}

// ========== UI辅助函数 ==========

/**
 * 更新模型列表下拉框
 * @param {string} provider - 厂商名称
 */
function updateModelList(provider) {
    const modelSelect = document.getElementById('apiModel');
    if (!modelSelect) return;

    const models = AI_PROVIDERS[provider]?.models || [];
    modelSelect.innerHTML = models.map(m =>
        `<option value="${m.id}">${m.name}</option>`
    ).join('');

    // 如果是OpenAI兼容,显示自定义模型输入框
    const customModelDiv = document.getElementById('customModelDiv');
    if (customModelDiv) {
        customModelDiv.style.display = provider === 'openai' ? 'block' : 'none';
    }
}

/**
 * 更新Base URL输入框
 * @param {string} provider - 厂商名称
 */
function updateBaseUrl(provider) {
    const baseUrlInput = document.getElementById('apiBaseUrl');
    if (baseUrlInput) {
        baseUrlInput.value = AI_PROVIDERS[provider]?.baseUrl || '';
    }
}

/**
 * 显示连接状态
 * @param {string} status - 状态: 'success', 'error', 'loading'
 * @param {string} message - 状态消息
 */
function showConnectionStatus(status, message) {
    const statusDiv = document.getElementById('connectionStatus');
    if (!statusDiv) return;

    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        loading: '#FF9800'
    };

    statusDiv.style.color = colors[status] || '#666';
    statusDiv.textContent = message;
}

/**
 * 测试API连接
 */
async function testAPIConnection() {
    const provider = document.getElementById('apiProvider')?.value || currentProvider;
    const key = document.getElementById('apiKey')?.value || apiKey;
    const modelId = provider === 'openai'
        ? (document.getElementById('customModelId')?.value || 'gpt-3.5-turbo')
        : (document.getElementById('apiModel')?.value || AI_PROVIDERS[provider]?.models[0]?.id);
    const baseUrl = document.getElementById('apiBaseUrl')?.value || AI_PROVIDERS[provider]?.baseUrl;

    if (!key) {
        showConnectionStatus('error', 'API Key 不能为空');
        return false;
    }

    showConnectionStatus('loading', '正在测试连接...');

    try {
        const testAdapter = new AIModelAdapter(provider, key, modelId, baseUrl);
        const testMessages = [{ role: 'user', content: '你好，请回复"连接成功"' }];

        await testAdapter.chat(testMessages, { maxTokens: 50 });
        showConnectionStatus('success', '连接成功！');
        return true;
    } catch (error) {
        showConnectionStatus('error', `连接失败: ${error.message}`);
        return false;
    }
}

/**
 * 保存API配置
 */
function saveAPIConfig() {
    const provider = document.getElementById('apiProvider')?.value || 'claude';
    const key = document.getElementById('apiKey')?.value || '';
    const modelId = provider === 'openai'
        ? (document.getElementById('customModelId')?.value || 'custom')
        : (document.getElementById('apiModel')?.value || AI_PROVIDERS[provider]?.models[0]?.id);
    const baseUrl = document.getElementById('apiBaseUrl')?.value || AI_PROVIDERS[provider]?.baseUrl;

    if (!key) {
        alert('请输入API Key');
        return false;
    }

    // 保存到localStorage
    const config = { provider, apiKey: key, modelId, baseUrl };
    localStorage.setItem('mathHelper_aiConfig', JSON.stringify(config));

    // 初始化适配器
    initAIAdapter(provider, key, modelId, baseUrl);

    alert('配置已保存！');
    return true;
}

/**
 * 加载API配置
 */
function loadAPIConfig() {
    try {
        const configStr = localStorage.getItem('mathHelper_aiConfig');
        if (configStr) {
            const config = JSON.parse(configStr);

            // 更新UI
            const providerSelect = document.getElementById('apiProvider');
            const keyInput = document.getElementById('apiKey');
            const modelSelect = document.getElementById('apiModel');
            const baseUrlInput = document.getElementById('apiBaseUrl');
            const customModelInput = document.getElementById('customModelId');

            if (providerSelect) providerSelect.value = config.provider;
            if (keyInput) keyInput.value = config.apiKey;
            if (baseUrlInput) baseUrlInput.value = config.baseUrl;

            // 更新模型列表
            updateModelList(config.provider);

            if (modelSelect && config.provider !== 'openai') {
                modelSelect.value = config.modelId;
            }
            if (customModelInput && config.provider === 'openai') {
                customModelInput.value = config.modelId;
            }

            // 初始化适配器
            initAIAdapter(config.provider, config.apiKey, config.modelId, config.baseUrl);

            return config;
        }

        // 尝试迁移旧配置
        const oldKey = localStorage.getItem('claude_api_key');
        if (oldKey) {
            const oldConfig = {
                provider: 'claude',
                apiKey: oldKey,
                modelId: localStorage.getItem('claude_model') || 'claude-sonnet-4-5-20250929',
                baseUrl: localStorage.getItem('claude_base_url') || 'https://api.anthropic.com'
            };

            localStorage.setItem('mathHelper_aiConfig', JSON.stringify(oldConfig));
            initAIAdapter(oldConfig.provider, oldConfig.apiKey, oldConfig.modelId, oldConfig.baseUrl);

            console.log('已从旧配置迁移');
            return oldConfig;
        }
    } catch (error) {
        console.error('加载配置失败:', error);
    }

    return null;
}

// 页面加载时自动加载配置
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', loadAPIConfig);
}
