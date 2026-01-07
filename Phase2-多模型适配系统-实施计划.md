# Phase 2: 多模型适配系统 - 实施计划

> **项目**: 考研数学学习助手
> **阶段**: Phase 2 - 多模型适配系统
> **优先级**: 高 (立即开始)
> **预计时间**: 1-2天
> **预计代码量**: 400行JS

---

## 📋 需求概述

将当前仅支持Claude的API系统,升级为支持多个AI厂商的通用适配系统:
- **Claude (Anthropic)** - 保持现有实现
- **Deepseek** - 添加支持(OpenAI兼容格式)
- **智谱AI (GLM)** - 添加支持(OpenAI兼容格式)
- **其他OpenAI兼容API** - 通用适配器

---

## 🔍 现有实现分析

### 现有API架构

根据探索结果,当前实现位于[考研数学一模拟题.html](d:\Documents\Coding\Claude Code\math\考研数学一模拟题.html):

**核心函数**: `callClaudeAPI()` (行1067-1101)
- 参数: `messages` 数组, `maxTokens` (默认2000)
- 请求格式: Anthropic标准格式
- 返回: `data.content[0].text`

**配置变量** (行1059-1062):
```javascript
let apiKey = '';
let apiBaseUrl = 'https://api.anthropic.com';
let apiModel = 'claude-sonnet-4-5-20250929';
```

**使用场景**:
1. 换题功能 `refreshQuestion()` - maxTokens=2500
2. AI解析功能 `generateAIExplanation()` - maxTokens=3000

### 存在的问题

1. ❌ **无重试机制** - 429错误无法自动恢复
2. ❌ **错误处理不统一** - 测试连接函数没有复用核心API调用
3. ❌ **缺少System Prompt支持**
4. ❌ **Token管理不完善**
5. ✅ **配置持久化** - localStorage已实现

---

## 🎯 实施步骤

### Step 1: 创建AIModelAdapter类

**位置**: 在现有 `callClaudeAPI()` 函数后添加 (约行1102后)

**代码结构**:
```javascript
class AIModelAdapter {
    constructor(provider, apiKey, modelId, baseUrl) {
        this.provider = provider; // 'claude', 'deepseek', 'zhipu', 'openai'
        this.apiKey = apiKey;
        this.modelId = modelId;
        this.baseUrl = baseUrl;
    }

    // 统一的聊天接口
    async chat(messages, options = {}) {
        const { maxTokens = 2000, temperature = 1.0, retries = 3 } = options;

        // 根据provider调用不同的API
        if (this.provider === 'claude') {
            return await this.callAnthropicAPI(messages, options);
        } else {
            return await this.callOpenAICompatibleAPI(messages, options);
        }
    }

    // Claude API调用
    async callAnthropicAPI(messages, options) { ... }

    // OpenAI兼容API调用
    async callOpenAICompatibleAPI(messages, options) { ... }

    // 构建请求头
    buildHeaders() { ... }

    // 错误处理和重试
    async handleError(error, attempt, maxRetries) { ... }
}
```

**预计代码量**: 200行JS

---

### Step 2: 配置AI厂商信息

**位置**: 在全局配置区域 (约行1059-1062)

**数据结构**:
```javascript
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

// 全局变量调整
let currentProvider = 'claude';
let apiAdapter = null;
```

**预计代码量**: 80行JS

---

### Step 3: 实现统一调用接口

**重构现有 `callClaudeAPI()` 函数**:

```javascript
// 重构后的统一API调用
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

// 保持向后兼容
async function callClaudeAPI(messages, maxTokens = 2000) {
    return await callAI(messages, { maxTokens });
}
```

**添加重试逻辑**:
- 指数退避策略: 1s, 2s, 4s
- 429错误自动重试
- 超时设置: 30秒

**预计代码量**: 60行JS

---

### Step 4: 更新配置UI

**修改API配置模态框** (行807-842):

**新增内容**:
1. **厂商选择下拉框**:
```html
<div class="input-group">
    <label for="apiProvider">选择AI厂商:</label>
    <select id="apiProvider">
        <option value="claude">Claude (Anthropic)</option>
        <option value="deepseek">Deepseek</option>
        <option value="zhipu">智谱AI (GLM)</option>
        <option value="openai">其他OpenAI兼容</option>
    </select>
</div>
```

2. **动态模型列表**:
```html
<div class="input-group">
    <label for="apiModel">选择模型:</label>
    <select id="apiModel">
        <!-- 根据选择的厂商动态加载 -->
    </select>
    <small id="modelInfo"></small>
</div>
```

3. **Base URL自动填充**:
- 选择厂商后自动填充默认Base URL
- 允许用户修改(支持代理)

4. **自定义模型ID**:
- 仅在选择"其他OpenAI兼容"时显示
- 用于输入自定义模型ID

**事件绑定**:
```javascript
document.getElementById('apiProvider').addEventListener('change', function() {
    const provider = this.value;
    updateModelList(provider);
    updateBaseUrl(provider);
});
```

**预计代码量**: 40行HTML + 60行JS

---

### Step 5: 实现测试连接功能

**重构 `testAPIConnection()` 函数** (行1103-1149):

```javascript
async function testAPIConnection() {
    const provider = document.getElementById('apiProvider').value;
    const key = document.getElementById('apiKeyInput').value.trim();
    const baseUrl = document.getElementById('apiBaseUrl').value.trim();
    const modelId = document.getElementById('apiModel').value;

    if (!key) {
        showStatus('error', '请先输入API Key');
        return;
    }

    const testAdapter = new AIModelAdapter(provider, key, modelId, baseUrl);

    try {
        const response = await testAdapter.chat([{
            role: 'user',
            content: '测试连接'
        }], { maxTokens: 10 });

        showStatus('success', `✓ 连接成功! 模型: ${modelId}`);
    } catch (error) {
        showStatus('error', `✗ 连接失败: ${error.message}`);
    }
}
```

**预计代码量**: 已包含在Step 4

---

### Step 6: 更新配置持久化

**修改 `saveAPIConfig()` 和 `loadAPIConfig()` 函数**:

```javascript
function saveAPIConfig() {
    const provider = document.getElementById('apiProvider').value;
    const key = document.getElementById('apiKeyInput').value.trim();
    const url = document.getElementById('apiBaseUrl').value.trim();
    const model = document.getElementById('apiModel').value;

    // 保存到localStorage
    localStorage.setItem('aiProvider', provider);
    localStorage.setItem('aiApiKey', key);
    localStorage.setItem('aiBaseUrl', url);
    localStorage.setItem('aiModel', model);

    // 更新全局变量
    currentProvider = provider;
    apiAdapter = new AIModelAdapter(provider, key, model, url);

    updateAPIStatus();
    document.getElementById('apiModal').classList.remove('show');
    alert('AI配置已保存！');
}

function loadAPIConfig() {
    const provider = localStorage.getItem('aiProvider') || 'claude';
    const key = localStorage.getItem('aiApiKey');
    const url = localStorage.getItem('aiBaseUrl');
    const model = localStorage.getItem('aiModel');

    if (key) {
        document.getElementById('apiProvider').value = provider;
        document.getElementById('apiKeyInput').value = key;
        document.getElementById('apiBaseUrl').value = url || AI_PROVIDERS[provider].baseUrl;

        updateModelList(provider);
        document.getElementById('apiModel').value = model;

        // 初始化适配器
        currentProvider = provider;
        apiAdapter = new AIModelAdapter(provider, key, model, url);
    }

    updateAPIStatus();
}
```

**预计代码量**: 已包含在上述步骤

---

## 📁 需要修改的文件

### 主文件: [考研数学一模拟题.html](d:\Documents\Coding\Claude Code\math\考研数学一模拟题.html)

**修改区域**:
1. **行1059-1062**: 更新全局配置变量
2. **行1067-1101**: 重构API调用函数 (改为 `callAI()`)
3. **行1103后**: 添加 `AIModelAdapter` 类 (新增~200行)
4. **行1152-1200**: 更新配置保存/加载函数
5. **行807-842**: 更新API配置模态框UI

**保持不变**:
- 换题功能 `refreshQuestion()` - 只需将 `callClaudeAPI` 改为 `callAI`
- AI解析功能 `generateAIExplanation()` - 同上
- 其他业务逻辑

---

## 🧪 测试计划

### 测试场景

| 测试项 | 描述 | 预期结果 |
|-------|------|---------|
| **Claude连接测试** | 使用Claude API Key测试连接 | 成功连接,返回响应 |
| **Deepseek连接测试** | 使用Deepseek API Key测试连接 | 成功连接,返回响应 |
| **智谱AI连接测试** | 使用GLM API Key测试连接 | 成功连接,返回响应 |
| **无效API Key** | 使用错误的API Key | 显示401错误提示 |
| **429限流重试** | 触发速率限制 | 自动重试3次,指数退避 |
| **换题功能** | 使用不同厂商AI换题 | 正常生成新题目 |
| **AI解析功能** | 使用不同厂商AI解析 | 正常生成详细解析 |
| **配置持久化** | 切换厂商后刷新页面 | 配置保留,自动加载 |
| **模型切换** | 在同一厂商内切换模型 | 正常切换,无需重新配置 |

---

## ✅ 验收标准

### 功能验收
- [ ] 可以选择4种AI厂商(Claude, Deepseek, 智谱, OpenAI兼容)
- [ ] 每个厂商都有对应的模型列表
- [ ] 测试连接功能对所有厂商正常工作
- [ ] 换题功能可以使用任意配置的AI
- [ ] AI解析功能可以使用任意配置的AI
- [ ] 配置可以正常保存到localStorage并恢复
- [ ] 429错误会自动重试(最多3次)
- [ ] 错误提示清晰友好

### 代码质量
- [ ] 代码结构清晰,符合面向对象设计
- [ ] 向后兼容,不影响现有功能
- [ ] 注释完整,易于维护
- [ ] 无console错误

### 用户体验
- [ ] UI美观,与现有风格一致
- [ ] 交互流畅,无明显延迟
- [ ] 错误提示友好,指引用户解决问题
- [ ] 配置界面易于理解

---

## 📝 实施注意事项

### 关键技术点

1. **API格式差异处理**
   - Claude: `{ model, max_tokens, messages }` + `x-api-key` header
   - OpenAI格式: `{ model, max_tokens, messages }` + `Authorization: Bearer` header

2. **响应格式差异**
   - Claude: `data.content[0].text`
   - OpenAI: `data.choices[0].message.content`

3. **重试策略**
   - 仅对429(限流)和5xx(服务器错误)重试
   - 401(认证失败)不重试
   - 使用指数退避: 1s, 2s, 4s

4. **System Prompt支持**
   - Claude: 单独的 `system` 参数
   - OpenAI: messages数组中的 `role: 'system'`

### 潜在风险

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| API格式变化 | 高 | 使用适配器模式,易于更新 |
| 不同厂商响应时间差异大 | 中 | 统一超时设置(30s),显示加载动画 |
| localStorage容量限制 | 低 | 只存储配置,不存储大量数据 |
| 用户配置错误 | 中 | 完善的测试连接功能和错误提示 |

---

## 📊 进度追踪

| 步骤 | 状态 | 预计时间 | 实际时间 |
|-----|------|---------|---------|
| Step 1: AIModelAdapter类 | ⏸️ 待开始 | 3小时 | - |
| Step 2: 配置AI厂商信息 | ⏸️ 待开始 | 1小时 | - |
| Step 3: 统一调用接口 | ⏸️ 待开始 | 2小时 | - |
| Step 4: 更新配置UI | ⏸️ 待开始 | 2小时 | - |
| Step 5: 测试连接功能 | ⏸️ 待开始 | 1小时 | - |
| Step 6: 配置持久化 | ⏸️ 待开始 | 1小时 | - |
| 测试与调试 | ⏸️ 待开始 | 2小时 | - |

**总预计时间**: 12小时 (约1.5天)

---

## 🚀 后续步骤

完成Phase 2后,可以继续:
- **Phase 3**: 知识点学习模块 (使用新的多模型系统)
- **Phase 4**: 学习规划模块 (AI智能规划需要多模型支持)
- **Phase 7**: AI助教模块 (完全依赖多模型系统)

---

**计划制定时间**: 2025-01-07
**计划制定人**: Claude Code Assistant
