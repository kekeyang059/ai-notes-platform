结构化技术需求文档 (v2.0)
1. 项目/功能概述 (Overview)
项目名称： "AI-Native Notes" (暂定)

目标： 开发一个个人使用的、具有 AI 增强功能的 Web 笔记应用。该应用整合了AI 对话、笔记、待办和番茄钟功能，通过本地存储实现数据持久化，并采用类似 Apple Notes 的三栏式简约设计风格。

2. 核心功能点 (Core Features) - (已更新)
仪表盘 (Dashboard): 应用首页，提供关键信息概览。
显示当天日期。
统计待办事项（总数、未完成、已完成）。
统计总笔记数量。
AI 对话 (AI Chat):
提供一个独立的、类似 ChatGPT 的聊天界面。
用户可以与 AI 进行连续对话。
对话历史记录需要被保存和展示。
笔记管理 (Note Management):
创建、编辑、删除笔记。
AI 功能 1 - 自动标题: 当笔记标题为空时，自动使用正文前10个字符填充。
AI 功能 2 - 文本润色: 提供按钮，调用 AI 模型优化笔记内容。
AI 功能 3 - 自动标签: 提供按钮，调用 AI 模型为笔记生成标签。
待办清单 (To-Do List):
创建、编辑、删除待办事项。
标记待办事项为“已完成”。
番茄钟 (Pomodoro Timer):
一个标准的25分钟倒计时器。
提供“开始”、“暂停”、“重置”功能。
3. 技术规格 (Technical Specifications) - (已更新)
前端 (Frontend)
页面/组件 (Pages/Components):

布局 (Layout):
ResizablePanelGroup (Shadcn): 构建三栏式布局。
Sidebar: 第一栏，用于主功能导航 (新增 "AI 对话", 仪表盘, 笔记, 待办, 番茄钟)。
AI 对话 (AIChatPage): (新增)
ChatHistory: 第二栏，展示历史对话列表，每条记录是一个对话的标题。
ChatWindow: 第三栏，主聊天窗口。
MessageList: 使用 ScrollArea 展示聊天记录（包含用户和 AI 的消息）。
MessageInput: 底部输入区域，包含一个 Input 和一个“发送” Button。
仪表盘 (DashboardPage): (无变化)
Card (Shadcn): 用于展示日期、待办统计和笔记总数。
笔记 (NotesPage): (无变化)
NoteList: 第二栏，展示笔记标题列表。
NoteEditor: 第三栏，笔记编辑器。
待办 (TodosPage): (无变化)
TodoList: 第二栏，待办事项列表。
番茄钟 (PomodoroTimer): (无变化)
TimerDisplay: 显示剩余时间。
Button (Shadcn): 控制计时器。
用户流程 (User Flow for AI Chat): (新增)

用户点击左侧导航栏的“AI 对话”图标。
中间栏加载并显示所有历史对话的标题列表（例如“对话 1”， “对话 2”...）。
用户点击“开始新对话”按钮，中间栏出现“新对话”条目，右侧内容区变为空白聊天窗口。
用户在底部输入框输入问题并发送。
应用调用 OpenRouter API，并将返回的 AI 回答呈现在聊天窗口中。
整段对话被保存到本地存储。
本地数据管理 (Backend Simulation) - (已更新)
API 接口 (模拟 - Local Storage Functions):

(新增) getChatSessions(): 获取所有对话会话。
(新增) saveChatSession(session): 保存或更新一个完整的对话会话。
(新增) deleteChatSession(sessionId): 删除一个对话会话。
getNotes(), saveNote(), deleteNote() (无变化)
getTodos(), saveTodo(), deleteTodo() (无变化)
数据模型 (Data Models):

ChatSession (对话会话模型): (新增)
<JSON>
{
  "id": "chat-session-uuid-789",
  "title": "关于Python的讨论", // 可以是对话的第一个问题，或AI生成的标题
  "createdAt": "2024-05-21T11:00:00Z",
  "messages": [
    { "role": "user", "content": "你好，我想了解一下Python的异步编程。" },
    { "role": "assistant", "content": "当然！Python的异步编程主要通过async/await关键字和asyncio库实现..." }
  ]
}
Note (笔记模型): (无变化)
Todo (待办模型): (无变化)
AI 服务集成 (AI Service Integration) - (已更新)
API 接口 (调用 OpenRouter): POST https://openrouter.ai/api/v1/chat/completions
请求体 (Body for "AI 对话"): (新增)
<JSON>
{
  "model": "deepseek/deepseek-chat",
  "messages": [
    // 这里将包含当前对话的所有历史消息
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" },
    { "role": "user", "content": "请解释一下什么是API。" }
  ]
}
请求体 (Body for "润色" & "生成标签"): (无变化)
4. 技术栈建议 (Tech Stack Suggestion)
(无变化)

框架: Next.js
UI 组件库: Shadcn/ui
样式: Tailwind CSS
数据存储: 浏览器 localStorage
状态管理 (推荐): Zustand - 随着功能增多（特别是 AI 对话需要管理会话状态），引入一个轻量级的状态管理库会让代码更清晰。它比 Redux 简单得多，非常适合初学者。
HTTP 请求: fetch API 或 axios
5. 开发步骤建议 (Development Steps) - (已更新)
这是我们新的、更完整的开发路线图。我把 AI 对话功能放在了核心功能之后，因为它相对独立。

环境搭建: (同前)
创建 Next.js 项目并集成 Shadcn。
创建 .env.local 文件并存入你的新 OpenRouter API 密钥。
静态布局与导航:
搭建三栏布局。
在第一栏放置所有功能的导航图标/链接。
核心数据层实现:
编写操作 localStorage 的所有函数 (getNotes, saveNote, getTodos, saveTodo 等)。
笔记功能开发 (无 AI):
实现笔记的增、删、改、查。
实现标题自动填充逻辑。
待办功能开发:
实现待办事项的增、删、改（标记完成）。
仪表盘开发:
创建仪表盘页面，连接数据函数并展示统计信息。
AI 对话功能开发: (新步骤)
数据层: 编写 getChatSessions, saveChatSession 等函数。
UI 布局: 创建 AI 对话页面的三栏布局（历史列表 / 聊天窗口）。
API 调用: 编写调用 OpenRouter 的函数，这次要能传递完整的对话历史 messages。
状态管理: 将当前对话的消息列表存储在组件状态中。每次发送新消息和接收回复后，更新这个状态，并调用 saveChatSession 保存到 localStorage。
集成笔记的 AI 功能:
编写用于“润色”和“生成标签”的特定 API 调用函数。
在笔记编辑器中添加按钮并绑定功能。
番茄钟开发:
创建番茄钟组件并实现其逻辑。
状态管理集成 (可选但推荐):
安装 zustand。
创建 store 来统一管理笔记列表、待办列表和对话会话，这样跨组件数据共享会更简单。
收尾与优化:
统一调整 UI/UX 细节。
添加加载状态（比如调用 AI 时显示一个 loading 动画）。
处理错误情况（比如 API 调用失败时给用户提示）。