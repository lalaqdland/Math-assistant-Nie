/**
 * AI助教模块 - 考研数学学习助手
 * 包含AI对话、图片识别、对话历史管理等功能
 */

// ========== AI助教状态 ==========
let tutorState = {
    currentConversationId: null,
    messages: [],
    isLoading: false,
    selectedImage: null  // 存储选择的图片base64数据
};

// ========== 图片处理函数 ==========

/**
 * 处理图片选择
 * @param {Event} event - 文件选择事件
 */
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
    }

    // 读取图片为base64
    const reader = new FileReader();
    reader.onload = function(e) {
        tutorState.selectedImage = {
            data: e.target.result,
            type: file.type,
            name: file.name
        };

        // 显示预览
        const previewArea = document.getElementById('imagePreviewArea');
        const previewImage = document.getElementById('previewImage');
        if (previewArea && previewImage) {
            previewImage.src = e.target.result;
            previewArea.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

/**
 * 移除选择的图片
 */
function removeSelectedImage() {
    tutorState.selectedImage = null;
    const previewArea = document.getElementById('imagePreviewArea');
    const imageUpload = document.getElementById('imageUpload');
    if (previewArea) {
        previewArea.style.display = 'none';
    }
    if (imageUpload) {
        imageUpload.value = '';
    }
}

// ========== 主视图渲染 ==========

/**
 * 渲染AI助教视图
 */
function renderAITutorView() {
    const container = document.getElementById('view-container');
    const conversations = loadConversationList();

    container.innerHTML = `
        <div class="tutor-container">
            <!-- 左侧对话历史 -->
            <div class="tutor-sidebar">
                <div class="sidebar-header">
                    <h3>💬 对话历史</h3>
                    <button class="btn btn-primary btn-sm" onclick="createNewConversation()">
                        ✨ 新对话
                    </button>
                </div>
                <div class="conversation-search">
                    <input type="text" id="searchConversation" placeholder="搜索对话..." oninput="filterConversations()">
                </div>
                <div class="conversation-list" id="conversationList">
                    ${renderConversationList(conversations)}
                </div>
                <div class="sidebar-actions">
                    <button class="btn btn-secondary btn-sm" onclick="exportCurrentChat('md')">📄 导出MD</button>
                    <button class="btn btn-secondary btn-sm" onclick="exportCurrentChat('txt')">📝 导出TXT</button>
                </div>
            </div>

            <!-- 右侧聊天区域 -->
            <div class="tutor-main">
                <!-- 聊天消息区 -->
                <div class="chat-container" id="chatContainer">
                    ${renderChatMessages()}
                </div>

                <!-- 公式工具栏 -->
                <div class="formula-toolbar">
                    <div class="formula-buttons">
                        <button class="formula-btn" onclick="insertFormula('\\\\frac{}{}')" title="分数">⅟</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\sqrt{}')" title="根号">√</button>
                        <button class="formula-btn" onclick="insertFormula('^{}')" title="上标">x²</button>
                        <button class="formula-btn" onclick="insertFormula('_{}')" title="下标">x₁</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\sum_{i=1}^{n}')" title="求和">Σ</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\int_{}^{}')" title="积分">∫</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\lim_{x \\\\to }')" title="极限">lim</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\partial ')" title="偏导">∂</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\infty')" title="无穷">∞</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\alpha')" title="alpha">α</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\beta')" title="beta">β</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\lambda')" title="lambda">λ</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\pi')" title="pi">π</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\theta')" title="theta">θ</button>
                        <button class="formula-btn" onclick="insertFormula('\\\\begin{pmatrix}  \\\\\\\\  \\\\end{pmatrix}')" title="矩阵">[ ]</button>
                    </div>
                    <div class="formula-preview" id="formulaPreview">
                        <span class="preview-label">预览:</span>
                        <span class="preview-content" id="previewContent"></span>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="chat-input-container">
                    <!-- 图片预览区域 -->
                    <div class="image-preview-area" id="imagePreviewArea" style="display: none;">
                        <div class="preview-image-container">
                            <img id="previewImage" src="" alt="预览图片">
                            <button class="remove-image-btn" onclick="removeSelectedImage()">✕</button>
                        </div>
                    </div>
                    <textarea id="tutorInput"
                              class="tutor-textarea"
                              placeholder="输入数学问题... 使用 $公式$ 输入LaTeX公式，或上传题目图片"
                              rows="3"
                              oninput="updateFormulaPreview()"></textarea>
                    <div class="input-actions">
                        <div class="input-left-actions">
                            <input type="file" id="imageUpload" accept="image/*" style="display: none;" onchange="handleImageSelect(event)">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('imageUpload').click()" title="上传图片">
                                📷 上传图片
                            </button>
                            <span class="input-hint">按 Ctrl+Enter 发送 | 支持图片识别</span>
                        </div>
                        <button class="btn btn-primary" onclick="sendTutorMessage()" id="sendBtn">
                            📤 发送
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 绑定键盘事件
    const textarea = document.getElementById('tutorInput');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                sendTutorMessage();
            }
        });
    }

    // 加载当前对话或创建新对话
    if (!tutorState.currentConversationId && conversations.length > 0) {
        loadConversation(conversations[0].id);
    } else if (tutorState.currentConversationId) {
        loadConversation(tutorState.currentConversationId);
    }

    // 滚动到底部
    scrollChatToBottom();
}

// ========== 对话列表渲染 ==========

/**
 * 渲染对话历史列表
 * @param {Array} conversations - 对话列表
 * @returns {string} 列表HTML
 */
function renderConversationList(conversations) {
    if (conversations.length === 0) {
        return `<div class="no-conversations">暂无对话历史</div>`;
    }

    return conversations.map(conv => {
        const isActive = conv.id === tutorState.currentConversationId;
        const preview = conv.preview || '新对话';
        const date = new Date(conv.updatedAt).toLocaleDateString('zh-CN');

        return `
            <div class="conversation-item ${isActive ? 'active' : ''}"
                 onclick="loadConversation('${conv.id}')">
                <div class="conv-title">${conv.title || '新对话'}</div>
                <div class="conv-preview">${preview.substring(0, 30)}${preview.length > 30 ? '...' : ''}</div>
                <div class="conv-meta">
                    <span class="conv-date">${date}</span>
                    <button class="conv-delete" onclick="event.stopPropagation(); deleteConversation('${conv.id}')" title="删除">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== 聊天消息渲染 ==========

/**
 * 渲染聊天消息
 * @returns {string} 消息HTML
 */
function renderChatMessages() {
    if (tutorState.messages.length === 0) {
        return `
            <div class="chat-welcome">
                <div class="welcome-icon">🤖</div>
                <h2>你好！我是你的AI数学助教</h2>
                <p>我可以帮助你：</p>
                <ul>
                    <li>📖 解答数学概念和定理</li>
                    <li>✍️ 讲解题目解题思路</li>
                    <li>🔍 分析错题原因</li>
                    <li>💡 提供学习建议</li>
                </ul>
                <div class="quick-questions">
                    <p>快速提问:</p>
                    <button class="quick-btn" onclick="quickQuestion('什么是泰勒展开？请给出常用函数的展开式。')">泰勒展开</button>
                    <button class="quick-btn" onclick="quickQuestion('如何判断矩阵的相似对角化？')">矩阵对角化</button>
                    <button class="quick-btn" onclick="quickQuestion('请讲解全概率公式和贝叶斯公式的区别与应用。')">贝叶斯公式</button>
                </div>
            </div>
        `;
    }

    return tutorState.messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const time = new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const hasImage = msg.image && isUser;

        return `
            <div class="chat-message-wrapper ${isUser ? 'user' : 'assistant'}">
                <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
                <div class="message-bubble">
                    ${hasImage ? `<div class="message-image"><img src="${msg.image}" alt="上传的图片"></div>` : ''}
                    <div class="message-content">${formatMessageContent(msg.content)}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
    }).join('') + (tutorState.isLoading ? `
        <div class="chat-message-wrapper assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    ` : '');
}

/**
 * 格式化消息内容（处理公式和换行）
 * @param {string} content - 原始内容
 * @returns {string} 格式化后的HTML
 */
function formatMessageContent(content) {
    // 转义HTML
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 处理代码块
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="code-block">$1</pre>');

    // 处理行内代码
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 换行处理
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

// ========== 消息发送 ==========

/**
 * 发送消息给AI助教
 */
async function sendTutorMessage() {
    const input = document.getElementById('tutorInput');
    const content = input.value.trim();
    const hasImage = tutorState.selectedImage !== null;

    if (!content && !hasImage) return;
    if (tutorState.isLoading) return;

    if (!isAIConfigured()) {
        alert('请先在设置中配置AI模型');
        viewManager.switchView('settings');
        return;
    }

    // 如果没有当前对话，创建一个
    if (!tutorState.currentConversationId) {
        createNewConversation();
    }

    // 添加用户消息
    const userMessage = {
        role: 'user',
        content: content || '请分析这张图片中的数学问题',
        timestamp: new Date().toISOString(),
        image: hasImage ? tutorState.selectedImage.data : null
    };
    tutorState.messages.push(userMessage);

    // 清空输入框和图片
    input.value = '';
    const selectedImageData = tutorState.selectedImage;
    removeSelectedImage();
    updateFormulaPreview();

    // 更新UI
    tutorState.isLoading = true;
    refreshChatContainer();
    scrollChatToBottom();

    try {
        // 构建对话历史（最近10轮）
        const recentMessages = tutorState.messages.slice(-20);

        // 添加系统提示
        const systemPrompt = `你是一位专业的考研数学助教，擅长讲解高等数学、线性代数和概率论与数理统计。

你的职责是：
1. 用清晰易懂的方式解答数学问题
2. 循循善诱，引导学生思考
3. 提供详细的解题步骤
4. 使用LaTeX格式书写数学公式（用$包裹行内公式，$$包裹独立公式）
5. 针对考研数学一的考点进行讲解
6. 如果用户上传了图片，仔细分析图片中的数学内容并解答

请用中文回答，保持专业但友善的语气。`;

        // 构建消息数组（支持多模态）
        const messages = recentMessages.map((m, idx) => {
            if (idx === 0) {
                // 第一条消息附加系统提示
                if (m.image) {
                    return {
                        role: m.role,
                        content: [
                            { type: 'text', text: systemPrompt + '\n\n' + m.content },
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: selectedImageData?.type || 'image/png',
                                    data: m.image.split(',')[1]
                                }
                            }
                        ]
                    };
                } else {
                    return { role: m.role, content: systemPrompt + '\n\n' + m.content };
                }
            } else {
                if (m.image) {
                    return {
                        role: m.role,
                        content: [
                            { type: 'text', text: m.content },
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: 'image/png',
                                    data: m.image.split(',')[1]
                                }
                            }
                        ]
                    };
                } else {
                    return { role: m.role, content: m.content };
                }
            }
        });

        // 调用AI
        const response = await callAI(messages, { maxTokens: 2000, temperature: 0.7 });

        // 添加AI回复
        const assistantMessage = {
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        };
        tutorState.messages.push(assistantMessage);

        // 保存对话
        saveCurrentConversation();

    } catch (error) {
        console.error('AI调用失败:', error);
        // 添加错误提示消息
        tutorState.messages.push({
            role: 'assistant',
            content: `❌ 请求失败: ${error.message}\n\n请检查网络连接或AI配置。`,
            timestamp: new Date().toISOString()
        });
    } finally {
        tutorState.isLoading = false;
        refreshChatContainer();
        scrollChatToBottom();
        // 重新渲染MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([document.getElementById('chatContainer')]);
        }
    }
}

// ========== UI辅助函数 ==========

/**
 * 刷新聊天容器
 */
function refreshChatContainer() {
    const container = document.getElementById('chatContainer');
    if (container) {
        container.innerHTML = renderChatMessages();
    }
}

/**
 * 滚动到底部
 */
function scrollChatToBottom() {
    const container = document.getElementById('chatContainer');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

/**
 * 插入公式
 * @param {string} formula - LaTeX公式
 */
function insertFormula(formula) {
    const textarea = document.getElementById('tutorInput');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // 如果公式不是单独符号，加上$包裹
    const insertText = formula.includes(' ') || formula.includes('{') ? `$${formula}$` : formula;

    textarea.value = text.substring(0, start) + insertText + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + insertText.length;

    updateFormulaPreview();
}

/**
 * 更新公式预览
 */
function updateFormulaPreview() {
    const textarea = document.getElementById('tutorInput');
    const previewContent = document.getElementById('previewContent');
    if (!textarea || !previewContent) return;

    const text = textarea.value;
    // 提取最后一个公式
    const formulaMatch = text.match(/\$([^$]+)\$(?!.*\$)/);

    if (formulaMatch) {
        previewContent.innerHTML = `$${formulaMatch[1]}$`;
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([previewContent]);
        }
    } else {
        previewContent.innerHTML = '<span style="color: #999;">输入 $公式$ 预览</span>';
    }
}

/**
 * 快速提问
 * @param {string} question - 问题内容
 */
function quickQuestion(question) {
    const input = document.getElementById('tutorInput');
    if (input) {
        input.value = question;
        sendTutorMessage();
    }
}

// ========== 对话历史管理 ==========

/**
 * 加载对话列表
 * @returns {Array} 对话列表
 */
function loadConversationList() {
    return dataManager.load('tutorConversations', []);
}

/**
 * 保存对话列表
 * @param {Array} conversations - 对话列表
 */
function saveConversationList(conversations) {
    dataManager.save('tutorConversations', conversations);
}

/**
 * 创建新对话
 */
function createNewConversation() {
    const newId = 'conv-' + Date.now();
    const conversations = loadConversationList();

    const newConv = {
        id: newId,
        title: '新对话',
        preview: '',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    conversations.unshift(newConv);
    saveConversationList(conversations);

    tutorState.currentConversationId = newId;
    tutorState.messages = [];

    refreshConversationList();
    refreshChatContainer();
}

/**
 * 加载对话
 * @param {string} convId - 对话ID
 */
function loadConversation(convId) {
    const conversations = loadConversationList();
    const conv = conversations.find(c => c.id === convId);

    if (conv) {
        tutorState.currentConversationId = convId;
        tutorState.messages = conv.messages || [];
        refreshConversationList();
        refreshChatContainer();
        scrollChatToBottom();

        // 重新渲染MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
            setTimeout(() => {
                MathJax.typesetPromise([document.getElementById('chatContainer')]);
            }, 100);
        }
    }
}

/**
 * 保存当前对话
 */
function saveCurrentConversation() {
    if (!tutorState.currentConversationId) return;

    const conversations = loadConversationList();
    const idx = conversations.findIndex(c => c.id === tutorState.currentConversationId);

    if (idx !== -1) {
        // 生成标题（取第一条用户消息的前20字）
        const firstUserMsg = tutorState.messages.find(m => m.role === 'user');
        const title = firstUserMsg ? firstUserMsg.content.substring(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '') : '新对话';

        // 生成预览（最后一条消息）
        const lastMsg = tutorState.messages[tutorState.messages.length - 1];
        const preview = lastMsg ? lastMsg.content.substring(0, 50) : '';

        conversations[idx].title = title;
        conversations[idx].preview = preview;
        conversations[idx].messages = tutorState.messages;
        conversations[idx].updatedAt = new Date().toISOString();

        // 将最近更新的对话移到最前面
        const conv = conversations.splice(idx, 1)[0];
        conversations.unshift(conv);

        saveConversationList(conversations);
        refreshConversationList();
    }
}

/**
 * 删除对话
 * @param {string} convId - 对话ID
 */
function deleteConversation(convId) {
    if (!confirm('确定要删除这个对话吗？')) return;

    let conversations = loadConversationList();
    conversations = conversations.filter(c => c.id !== convId);
    saveConversationList(conversations);

    // 如果删除的是当前对话
    if (convId === tutorState.currentConversationId) {
        if (conversations.length > 0) {
            loadConversation(conversations[0].id);
        } else {
            tutorState.currentConversationId = null;
            tutorState.messages = [];
            refreshChatContainer();
        }
    }

    refreshConversationList();
}

/**
 * 刷新对话列表
 */
function refreshConversationList() {
    const listContainer = document.getElementById('conversationList');
    if (listContainer) {
        listContainer.innerHTML = renderConversationList(loadConversationList());
    }
}

/**
 * 搜索/筛选对话
 */
function filterConversations() {
    const searchInput = document.getElementById('searchConversation');
    const keyword = searchInput ? searchInput.value.toLowerCase() : '';

    let conversations = loadConversationList();

    if (keyword) {
        conversations = conversations.filter(conv =>
            conv.title.toLowerCase().includes(keyword) ||
            conv.preview.toLowerCase().includes(keyword) ||
            (conv.messages && conv.messages.some(m => m.content.toLowerCase().includes(keyword)))
        );
    }

    const listContainer = document.getElementById('conversationList');
    if (listContainer) {
        listContainer.innerHTML = renderConversationList(conversations);
    }
}

// ========== 导出功能 ==========

/**
 * 导出当前对话
 * @param {string} format - 导出格式 (md/txt)
 */
function exportCurrentChat(format) {
    if (tutorState.messages.length === 0) {
        alert('当前对话为空，无法导出');
        return;
    }

    const conversations = loadConversationList();
    const conv = conversations.find(c => c.id === tutorState.currentConversationId);
    const title = conv ? conv.title : '对话记录';
    const date = new Date().toISOString().split('T')[0];

    let content, filename, type;

    if (format === 'md') {
        content = `# ${title}\n\n导出时间: ${new Date().toLocaleString()}\n\n---\n\n`;
        tutorState.messages.forEach(msg => {
            const role = msg.role === 'user' ? '**👤 我**' : '**🤖 AI助教**';
            const time = new Date(msg.timestamp).toLocaleString();
            content += `${role} (${time})\n\n${msg.content}\n\n---\n\n`;
        });
        filename = `AI助教对话_${title}_${date}.md`;
        type = 'text/markdown';
    } else {
        content = `${title}\n导出时间: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;
        tutorState.messages.forEach(msg => {
            const role = msg.role === 'user' ? '[我]' : '[AI助教]';
            const time = new Date(msg.timestamp).toLocaleString();
            content += `${role} ${time}\n${msg.content}\n\n${'- '.repeat(25)}\n\n`;
        });
        filename = `AI助教对话_${title}_${date}.txt`;
        type = 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== 视图注册 ==========
// 在主页面中通过 viewManager.register('ai-tutor', renderAITutorView) 注册
