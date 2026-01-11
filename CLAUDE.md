# Claude Code 项目指令

## Skills 使用提醒

在开发过程中，请根据任务类型考虑使用以下 skills（共 8 个）：

| 场景 | Skill | 说明 |
|------|-------|------|
| 发布新版本、写 changelog | `changelog-generator` | 从 git commits 生成用户友好的 changelog |
| 整理文件、查找重复文件 | `file-organizer` | 智能文件整理，查找重复，建议目录结构 |
| 处理 PDF/Word/Excel/PPT | `document-skills` | 处理各类文档 |
| 测试 Web 应用 | `webapp-testing` | 使用 Playwright 测试本地 Web 应用 |
| 创建海报、视觉设计 | `canvas-design` | 创建 PNG/PDF 格式的视觉艺术作品 |
| 写作研究、内容创作 | `content-research-writer` | 研究、引用、大纲迭代、内容优化 |
| 会议分析 | `meeting-insights-analyzer` | 分析会议记录，提取沟通模式和改进建议 |
| 主题样式 | `theme-factory` | 为幻灯片、文档、网页等应用预设主题样式 |

## MCP 服务器配置

Claude Code 已配置以下 MCP (Model Context Protocol) 服务器：

| MCP 服务器 | 功能 | 使用场景 |
|------------|------|----------|
| `filesystem` | 文件系统访问 | 读取、写入、搜索文件和目录 |
| `chrome-devtools` | Chrome 开发者工具 | 浏览器调试、元素检查、性能分析 |
| `apify` | Apify 网页自动化 | 网页抓取、表单填写、数据提取 |
| `brave-search` | Brave 网络搜索 | 实时网页搜索、AI摘要、图片视频搜索 |

### MCP 使用方法

在对话中直接使用 MCP 功能：
- **文件操作**: "帮我读取 Documents 文件夹中的文件"
- **浏览器调试**: "打开 Chrome 开发者工具检查页面"
- **网页抓取**: "从这个网站提取数据"
- **联网搜索**: "搜索最新的JavaScript框架" 或 "帮我查找考研数学资料"

## 编程辅助 Agents

开发时可使用以下内置 agents 提升效率：

| Agent | 用途 |
|-------|------|
| `code-simplifier` | 简化和优化代码，提升可读性和可维护性 |
| `code-reviewer` | 代码审查，检查 bug、安全问题、代码质量 |
| `code-explorer` | 深度分析现有代码，理解架构和依赖 |
| `code-architect` | 设计功能架构，提供实现蓝图 |
| `feature-dev` | 引导式功能开发 |
| `frontend-design` | 创建高质量前端界面 |

## 文档同步提醒

**每次开发任务完成后，必须同步更新以下文件：**

1. **开发进度.md** - 记录当前开发进度、已完成功能、待办事项
2. **下次对话提示词.md** - 为下次对话准备上下文，包括：
   - 上次完成的工作
   - 遗留问题
   - 下一步计划

## API 密钥设置

某些MCP功能需要API密钥才能使用：

1. **Brave Search** (联网搜索):
   - 注册: https://brave.com/search/api/
   - 设置环境变量: `BRAVE_API_KEY`

2. **Apify** (网页自动化):
   - 注册: https://apify.com/
   - 设置环境变量: `APIFY_API_TOKEN`

在配置文件 `~/.config/claude-code/settings.json` 中设置密钥。

## 开发规范

- 提交代码前考虑是否需要生成 changelog
- 项目文件混乱时使用 file-organizer 整理
- 测试前端功能时优先使用 webapp-testing skill
- 完成较大改动后使用 code-simplifier 优化代码
- 重要功能开发完成后使用 code-reviewer 审查
- 需要美化界面时考虑使用 theme-factory 应用主题
