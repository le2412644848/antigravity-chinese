"use strict";
/**
 * Antigravity 桌面端中文语言包（Electron 壳注入层）
 * 由 utils.js 在 Hub 页面每次 dom-ready 时注入渲染进程（原生菜单/对话框见 i18n-zh-main.js）。
 * 匹配规则（按优先级）：
 *   1. MAP 全等匹配（文本去首尾空格后与原文完全一致；省略号 …/... 互通）
 *   2. DYNAMIC_MAP 拼接句式（\u0001 代表运行时插入的变量）
 *   3. REGEX_MAP 正则匹配（动态数字/时间句式）
 *   4. PREFIX_MAP 前缀匹配（带动态时间尾部的句式）
 *   5. 整句未命中时按分句逐段匹配
 * 不翻译的区域：智能体回复/思考过程的 Markdown、用户消息、代码块、编辑器、终端、会话标题。
 * 未收录文本保持原样。改完词表后可运行 node asar-tool/test.js 自检、node asar-tool/audit.js 查覆盖率。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENDERER_SCRIPT = void 0;
function agZhRenderer() {
    if (window.__agZhPack)
        return;
    window.__agZhPack = true;
    var MAP = {
        // 侧栏导航
        'New Conversation': '新建对话',
        'Conversation History': '对话历史',
        'Scheduled Tasks': '定时任务',
        'Projects': '项目',
        'No conversations yet': '暂无对话',
        'Conversations': '对话',
        'Settings': '设置',
        'Install IDE': '安装 IDE',
        // 顶栏网页自绘菜单
        'File': '文件',
        'Edit': '编辑',
        'View': '视图',
        'Window': '窗口',
        'Help': '帮助',
        // 输入区
        'Ask anything, @ to mention, / for actions': '随便问点什么，@ 提及，/ 执行操作',
        'Send message': '发送消息',
        'Record voice memo': '语音输入',
        'Add context': '添加上下文',
        'Select model': '选择模型',
        // 消息操作
        'Good response': '回答不错',
        'Bad response': '回答不佳',
        'Copy': '复制',
        'Copy code': '复制代码',
        'Thought for': '思考了',
        'Undo changes up to this point': '撤销到此处的更改',
        // 设置页导航
        'General': '通用',
        'Application': '应用',
        'Customizations': '自定义',
        'Browser': '浏览器',
        'Appearance': '外观',
        'Models': '模型',
        'Privacy': '隐私',
        'Language': '语言',
        'Theme': '主题',
        'Dark': '深色',
        'Light': '浅色',
        'System': '跟随系统',
        'Usage': '用量',
        'Billing': '账单',
        'Sign in': '登录',
        'Sign out': '退出登录',
        'Not in Project': '不在项目中',
        'Shortcuts': '快捷键',
        'Provide Feedback': '提供反馈',
        // 通用页
        'Configure agent execution, queued message delivery, and permissions.': '配置智能体执行、消息排队与权限。',
        'Execution': '执行',
        'Queued Messages': '消息排队',
        'Configure when follow-up messages are sent.': '配置后续消息的发送时机。',
        'Queue': '排队',
        'Send Immediately': '立即发送',
        'Keyboard shortcuts': '键盘快捷键',
        'Agent Settings': '智能体设置',
        'Security Preset': '安全预设',
        "Choose a predefined security preset for the agent. This controls terminal auto-execution policy, and file access policy.": '为智能体选择预设的安全方案，控制终端自动执行与文件访问策略。',
        'Controls the actions the agent can take.': '控制智能体可以执行的操作。',
        'Controls the actions the agent can take': '控制智能体可以执行的操作',
        'Tool Permissions': '工具权限',
        'Tool permissions': '工具权限',
        'Modify permissions for file, terminal, and MCP tools.': '修改文件、终端和 MCP 工具的权限。',
        'Modify permissions for file, terminal, and MCP tools': '修改文件、终端和 MCP 工具的权限',
        'Configure permissions for file, terminal, and MCP tools.': '配置文件、终端和 MCP 工具的权限。',
        'Configure permissions for file, terminal, and MCP tools': '配置文件、终端和 MCP 工具的权限',
        'Agent Behavior': '智能体行为',
        'Artifact Review Policy': '产物审查策略',
        "Specifies Agent's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.": '控制智能体请求审查产物（它为丰富对话体验而创建的文档）时的行为。',
        "Specifies Agent\u2019s behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.": '控制智能体请求审查产物（它为丰富对话体验而创建的文档）时的行为。',
        'Whether the agent asks you to review its documents.': '智能体是否会请求你审查其生成的文档。',
        'Whether the agent asks you to review its documents': '智能体是否会请求你审查其生成的文档',
        'Always Proceed': '总是继续',
        'Always proceed': '总是继续',
        'Turbo Mode': 'Turbo 模式',
        'Workspace Only': '仅工作区',
        'Workspace only': '仅工作区',
        'Full Machine': '整台机器',
        'Learn more about': '了解更多：',
        'File Permissions': '文件权限',
        'File Access Rules': '文件访问规则',
        'Configure allowed and denied paths for file reads and writes.': '配置文件读写的允许与禁止路径。',
        'Network Permissions': '网络权限',
        'Network Access Rules': '网络访问规则',
        'Configure allowed and denied URLs for reading.': '配置允许与禁止读取的 URL。',
        'Terminal & Tooling Permissions': '终端与工具权限',
        'Terminal Commands': '终端命令',
        'Configure allowed terminal commands.': '配置允许使用的终端命令。',
        'Commands Outside Sandbox': '沙箱外命令',
        'Configure allowed commands outside the sandbox.': '配置沙箱外允许执行的命令。',
        'MCP Tools': 'MCP 工具',
        'Configure external tools via Model Context Protocol.': '通过 Model Context Protocol 配置外部工具。',
        'Interrupt the agent and send immediately.': '打断智能体并立即发送。',
        'Queue until after the current turn.': '排队至当前回合结束后发送。',
        // 应用页
        'Manage Antigravity app settings.': '管理 Antigravity 应用设置。',
        'Prevent Sleep': '阻止休眠',
        'Prevent the computer from sleeping while the app is running.': '应用运行期间阻止电脑休眠。',
        'Keep In Menu Bar': '常驻菜单栏',
        'Keep the app accessible from the menu bar and running in the background when all windows are closed.': '关闭所有窗口后仍可从菜单栏访问，并在后台保持运行。',
        'Remote Control': '远程控制',
        'Enable Remote Control': '启用远程控制',
        'Work with local agents from another device.': '在另一台设备上操控本机的智能体。',
        'Notifications': '通知',
        'Notification Settings': '通知设置',
        "To modify notification settings, open your operating system's system preferences.": '修改通知设置需要打开操作系统的系统设置。',
        "To modify notification settings, open your operating system\u2019s system preferences.": '修改通知设置需要打开操作系统的系统设置。',
        'Open System Preferences': '打开系统设置',
        'Advanced Settings': '高级设置',
        // 外观页
        "Configure the agent's visual theme and display preferences.": '配置智能体的视觉主题与显示偏好。',
        "Configure the agent\u2019s visual theme and display preferences.": '配置智能体的视觉主题与显示偏好。',
        'Chat Settings': '聊天设置',
        'Verbosed Agent Chat': '显示思考过程',
        'Display and preserve intermediate thinking steps.': '显示并保留中间思考步骤。',
        'Conversation Width': '对话宽度',
        'Configure the maximum width of the conversation panel.': '配置对话面板的最大宽度。',
        'Default': '默认',
        'Narrow': '窄',
        'Wide': '宽',
        'Light Theme': '浅色主题',
        'Dark Theme': '深色主题',
        'Preset': '预设',
        'Default Light': '默认浅色',
        'Default Dark': '默认深色',
        'Background': '背景',
        'Foreground': '前景',
        'Accent': '强调色',
        // 模型与用量页
        'Models & Usage': '模型与用量',
        'Manage your model quota and credits.': '管理你的模型额度和积分。',
        'Plan': '方案',
        'Upgrade': '升级',
        'Your Plan: Google AI Pro': '你的方案：Google AI Pro',
        'You can upgrade to a Google AI Ultra plan to receive higher rate limits.': '升级到 Google AI Ultra 方案可获得更高的用量上限。',
        'Model Credits': '模型积分',
        'Model Quota': '模型额度',
        'Enable AI Credit Overages': '启用 AI 积分超额使用',
        "When toggled on, Antigravity will use your AI credits to fulfill model requests once you're out of model quota. Antigravity will always use your model quota first before using AI credits.": '开启后，模型额度用尽时 Antigravity 会改用 AI 积分完成模型请求。Antigravity 总是先用模型额度，再消耗 AI 积分。',
        "When toggled on, Antigravity will use your AI credits to fulfill model requests once you\u2019re out of model quota. Antigravity will always use your model quota first before using AI credits.": '开启后，模型额度用尽时 Antigravity 会改用 AI 积分完成模型请求。Antigravity 总是先用模型额度，再消耗 AI 积分。',
        'Gemini Models': 'Gemini 模型',
        'Weekly Limit Remaining': '每周剩余额度',
        'Five Hour Limit Remaining': '5 小时剩余额度',
        'Claude and GPT models': 'Claude 和 GPT 模型',
        // 自定义页
        'Configure default behaviors, skills, and MCP servers.': '配置默认行为、技能与 MCP 服务器。',
        'Learn more.': '了解更多。',
        'Token Usage': 'Token 用量',
        'The breakdown below shows token usage from customizations like skills, rules, and MCP. If the budget is exceeded, large customizations will be truncated automatically.': '下方明细展示技能、规则、MCP 等自定义内容的 Token 用量；超出预算时，较大的自定义内容会被自动截断。',
        'Rules': '规则',
        'Skills': '技能',
        'Global': '全局',
        'Installed MCP Servers': '已安装的 MCP 服务器',
        'Add MCP': '添加 MCP',
        'Open MCP Config': '打开 MCP 配置',
        'No MCP servers installed': '尚未安装 MCP 服务器',
        'Use Add MCP to browse the store, or add a custom server via the MCP config.': '点击「添加 MCP」浏览商店，或通过 MCP 配置文件添加自定义服务器。',
        'Plugins': '插件',
        'Build With Google Plugins': 'Build With Google 插件',
        'Browse and enable plugins from the Build With Google catalog.': '浏览并启用 Build With Google 目录中的插件。',
        'Customize': '自定义',
        // 浏览器页
        'Browser Settings': '浏览器设置',
        'Browser settings have moved': '浏览器设置已迁移',
        'Browser settings have moved to the Browser section of General settings.': '浏览器设置已移至「通用」设置中的「浏览器」板块。',
        'Browser settings have moved to the Browser section of General settings': '浏览器设置已移至「通用」设置中的「浏览器」板块',
        'Go to General settings': '前往通用设置',
        'Go to General settings.': '前往通用设置。',
        'Configure the browser subagent. It requires': '配置浏览器子智能体。需要',
        'to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.': '已安装。在对话输入框输入 /browser 即可调用浏览器子智能体。',
        'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
        'Controls whether the agent can run custom JavaScript to automate complex browser actions.': '控制智能体能否运行自定义 JavaScript 来自动化复杂的浏览器操作。',
        'Request Review': '请求审查',
        'Actuation Permissions': '操作权限',
        'Browser Actuation Rules': '浏览器操作规则',
        'Configure allowed and denied URLs for browser actuation.': '配置允许与禁止浏览器操作的 URL。',
        // 浏览器页（句子被链接拆开的片段）
        'The browser subagent can be invoked by typing /browser in the conversation input box.': '在对话输入框输入 /browser 即可调用浏览器子智能体。',
        'to be installed.': '已安装。',
        // 顶栏菜单
        'Command Palette': '命令面板',
        'Create Project': '新建项目',
        'Reset Zoom': '实际大小',
        'Zoom In': '放大',
        'Zoom Out': '缩小',
        'Maximize': '最大化',
        'Minimize': '最小化',
        // 快捷键页
        'LAYOUT CONTROLS': '布局控制',
        'CONVERSATION': '对话',
        'NAVIGATION': '导航',
        'RECOMMENDED': '推荐',
        'Keyboard shortcuts for quick navigation and control.': '用于快速导航和操作的键盘快捷键。',
        'Toggle Terminal': '切换终端',
        'Toggle Auxiliary Pane': '切换辅助面板',
        'Add to Chat/Quote': '添加到对话/引用',
        'Find in Pane': '在面板中查找',
        'Toggle Voice Recording': '开始/停止语音输入',
        'Toggle Model Selector': '切换模型选择器',
        'Focus Input': '聚焦输入框',
        'Open Settings': '打开设置',
        'Next Pane Tab': '下一个面板标签页',
        'Previous Pane Tab': '上一个面板标签页',
        'Select Next Conversation': '选择下一个对话',
        'Select Previous Conversation': '选择上一个对话',
        'Open Conversation Picker': '打开对话选择器',
        'File Picker': '文件选择器',
        'Open File Search': '打开文件搜索',
        // 提供反馈页
        'Feedback Type': '反馈类型',
        'Bug Report': '缺陷报告',
        'Feature Request': '功能建议',
        'Auth and Billing': '登录与账单',
        'General Feedback': '一般反馈',
        'Description': '描述',
        'Please describe the issue in detail. The more actionable your feedback, the quicker our team can address your request. Some helpful information includes:': '请详细描述遇到的问题。反馈越具体，团队就能越快处理。可以提供以下信息：',
        'Steps to reproduce the issue': '复现问题的步骤',
        'Expected behavior': '预期行为',
        'Actual behavior': '实际行为',
        'Any error messages': '相关报错信息',
        'Any relevant information': '其他相关信息',
        'Steps to Reproduce': '复现步骤',
        'Describe the bug you encountered...': '描述你遇到的问题…',
        'Please list the steps to reproduce the issue': '请列出复现问题的步骤',
        'Attach a screenshot (optional)': '附加截图（可选）',
        'Attach Antigravity server logs': '附加 Antigravity 服务端日志',
        'Submit': '提交',
        'We recommend attaching logs. Attaching logs will help the Antigravity team act on and prioritize your feedback.': '建议附加日志，便于 Antigravity 团队处理你的反馈并排定优先级。',
        // 权限规则子页面（终端/沙箱/MCP/网络/文件）
        'Allow/deny specific terminal commands.': '允许或禁止特定的终端命令。',
        'Allow/deny agent command execution outside the sandbox.': '允许或禁止智能体在沙箱外执行命令。',
        'External tools the agent can call via Model Context Protocol.': '智能体可通过 Model Context Protocol 调用的外部工具。',
        'Allow/deny agent read access to specific URLs or domains.': '允许或禁止智能体读取特定网址或域名。',
        'Read URLs': '可读取的 URL',
        'Allow/deny agent write access to specific files or directories.': '允许或禁止智能体写入特定文件或目录。',
        'File Writes': '文件写入',
        'Allow/deny agent read access to specific files or directories.': '允许或禁止智能体读取特定文件或目录。',
        'File Reads': '文件读取',
        'Remove': '移除',
        // 账户页
        'Account': '账户',
        'Manage your plan, credentials, and general preferences.': '管理你的方案、凭据与常规偏好。',
        'When toggled on, Antigravity collects usage data to help Google enhance performance and features.': '开启后，Antigravity 会收集使用数据，帮助 Google 改进性能与功能。',
        'Enable Telemetry': '启用遥测',
        'Receive product updates, tips, and promotions from Google Antigravity via email.': '通过电子邮件接收 Google Antigravity 的产品更新、技巧与推广信息。',
        'Marketing Emails': '营销邮件',
        'Email': '邮箱',
        'Sign Out': '退出登录',
        'By using this app, you agree to its': '使用本应用即表示你同意其',
        'Terms of Service': '服务条款',
        // 定时任务页
        'No scheduled tasks configured.': '尚未配置定时任务。',
        'Search tasks...': '搜索任务…',
        'Add scheduled task': '添加定时任务',
        'New': '新建',
        // 对话历史页
        'Outside of Project': '不在项目中',
        'More Actions': '更多操作',
        'Search conversations...': '搜索对话…',
        // 模型页补充
        'Verbose Agent Chat': '显示思考过程',
        'Verbosed Agent Chat': '显示思考过程',
        'Your Plan:': '你的方案：',
        'Refresh quota and credits data': '刷新额度与积分数据',
        '% of the customization budget is available.': '% 的自定义预算可用。',
        // 自定义页补充
        'Refresh MCP servers': '刷新 MCP 服务器',
        'Copy path': '复制路径',
        'Learn more': '了解更多',
        // 通用-安全预设下拉选项
        'Turbo mode': 'Turbo 模式',
        'Requires manual review for all terminal commands and file accesses outside of the working folders.': '对工作文件夹之外的所有终端命令和文件访问都需要人工审查。',
        'Full machine': '整台机器',
        'All terminal commands require review. The agent can read or write to any file in the machine.': '所有终端命令都需要审查。智能体可以读写机器上的任何文件。',
        'Disables all safety barriers for maximal iteration velocity.': '禁用所有安全屏障，实现最大迭代速度。',
        'Custom': '自定义',
        'Manually customize individual settings.': '手动自定义各项设置。',
        // 浏览器-JS策略下拉选项
        'Disabled': '已禁用',
        'Block all browser JavaScript execution.': '阻止所有浏览器 JavaScript 执行。',
        'Prompt for approval before running browser scripts.': '运行浏览器脚本前先请求批准。',
        'Allow full browser script execution without prompting.': '允许完整浏览器脚本执行而不提示。',
        // 浏览器操作权限编辑页
        'Browser Actuation Permissions': '浏览器操作权限',
        'Execute URLs': '执行 URL',
        'Allow/deny agent browser actuation access to specific URLs.': '允许/禁止智能体的浏览器操作访问特定 URL。',
        'Allow': '允许',
        'Deny': '禁止',
        'Add': '添加',
        '+ Add': '+ 添加',
        'e.g., https://example.com': '例如 https://example.com',
        // Build With Google 插件页
        'Build with Antigravity Plugins': 'Build with Antigravity 插件',
        'Refresh': '刷新',
        'Plugins are packaged collections of skills and MCPs to help the Agent in Antigravity work with Google developer products. You can always change your choices in Settings.': '插件是打包的技能与 MCP 集合，帮助 Antigravity 中的智能体配合 Google 开发者产品工作。你可以随时在设置中更改选择。',
        'Download': '下载',
        'Hide breakdown': '收起明细',
        'Dart and Flutter': 'Dart 与 Flutter',
        'Core tools and knowledge required to develop for Android': 'Android 开发所需的核心工具与知识',
        'Keep your coding agent up to date with the latest web best practices.': '让你的编码智能体掌握最新的 Web 最佳实践。',
        'Using the Antigravity Python SDK to build AI agents': '使用 Antigravity Python SDK 构建 AI 智能体',
        'Curated collection of agent skills for science.': '精选的科学领域智能体技能集。',
        "Prototype, build & run modern apps users love with Firebase's backend, AI, and operational infrastructure.": '借助 Firebase 的后端、AI 与运维基础设施，构建并运行用户喜爱的现代应用。',
        "Prototype, build & run modern apps users love with Firebase\u2019s backend, AI, and operational infrastructure.": '借助 Firebase 的后端、AI 与运维基础设施，构建并运行用户喜爱的现代应用。',
        'Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer': '使用 Chrome DevTools 与 Puppeteer 在 Chrome 中实现可靠的自动化、深度调试与性能分析',
        // Add MCP 商店页
        'Add MCP Servers': '添加 MCP 服务器',
        'Search MCP servers by name': '按名称搜索 MCP 服务器',
        // 导航
        'Back': '返回',
        // 新建定时任务弹窗
        'New Scheduled Task': '新建定时任务',
        'Name': '名称',
        'Enter scheduled task name...': '输入定时任务名称…',
        'Schedule': '计划',
        'Daily': '每天',
        'Weekly': '每周',
        'Weekdays': '工作日',
        'Monthly': '每月',
        'Hourly': '每小时',
        'around': '前后',
        'Prompt': '提示词',
        'Enter a prompt for the agent to run...': '输入要让智能体运行的提示词…',
        'All scheduled tasks run as Flash.': '所有定时任务都以 Flash 模型运行。',
        'Add Scheduled Task': '添加定时任务',
        // 应用菜单 / 应用页高级设置
        'Check for Updates': '检查更新',
        'Automatic Check for Updates': '自动检查更新',
        'Automatically prompt you to restart the app when a new update is available. When disabled, you can check for updates manually from the app menu.': '有新版本可用时自动提示重启应用。禁用后，你可以从应用菜单手动检查更新。',
        // 消息排队快捷键弹层
        'Enter Queues after the turn': '回合结束后排队',
        'Alt+Enter Sends immediately': 'Alt+Enter 立即发送',
        'Alt+Enter On empty prompt, sends next in queue': 'Alt+Enter 提示词为空时，发送队列中的下一条',
        // 安全预设悬浮说明
        'A high-risk mode that disables all safety barriers. The agent operates with full system access, auto-executes all terminal commands, and reads or writes to all local files without review prompts.': '一种禁用所有安全屏障的高风险模式。智能体将以完整系统权限运行，自动执行所有终端命令，并在无需审查提示的情况下读写所有本地文件。',
        // 文件权限下拉(小写选项)
        'allow': '允许',
        'ask': '询问',
        'deny': '禁止',
        // 产物审查策略下拉
        'Always Ask': '总是询问',
        'Never Ask': '从不询问',
        // 插件市场条目描述
        'Skills providing tailored instructions for happy path Dart and Flutter development workflows.': '为顺畅的 Dart 与 Flutter 开发工作流提供定制指令的技能集。',
        'Build and prototype location-aware applications with Google Maps Platform. Integrate interactive maps, search and inspect Places details, calculate optimal routes.': '使用 Google Maps Platform 构建和原型化位置感知应用。集成交互式地图、搜索和查看地点详情、计算最优路线。',
        'Specialized suite of skills for data engineers and database practitioners on Google Cloud': '面向 Google Cloud 上数据工程师和数据库从业者的专项技能套件',
        'Build applications with the Gemini Interactions API and Live API, including text generation, multi-turn chat, streaming, function calling, managed agents, and real-time audio/video.': '使用 Gemini Interactions API 与 Live API 构建应用，包括文本生成、多轮对话、流式输出、函数调用、托管智能体与实时音视频。',
        // 插件页说明(被加粗的 Antigravity 拆成三段,按实际节点拆开翻)
        'Plugins are packaged collections of skills and MCPs to help the Agent in': '插件是打包的技能与 MCP 集合，帮助',
        'work with Google developer products. You can always change your choices in Settings.': '配合 Google 开发者产品工作。你可以随时在设置中更改选择。',
        // 模型选择器
        'Select Model': '选择模型',
        'Model': '模型',
        'View Usage': '查看用量',
        'Fast': '快',
        'Medium': '中',
        'Low': '低',
        'High': '高',
        // 输入区 + 菜单 / 模型档位提示
        'Add Context': '添加上下文',
        'Media': '媒体',
        'Mentions': '提及',
        'Actions': '操作',
        'Limited time': '限时',
        // 对话辅助面板
        'Subagents': '子智能体',
        'Files Changed': '已更改文件',
        'Artifacts': '产物',
        'Uploads': '上传',
        'Background Tasks': '后台任务',
        'Terminals': '终端',
        'Skills Used': '已用技能',
        // 辅助面板空状态
        'No subagents': '没有子智能体',
        'No file changes': '没有文件更改',
        'No artifacts generated': '没有生成产物',
        'No background tasks': '没有后台任务',
        // 终端范围下拉(单数)
        'Conversation': '对话',
        'Project': '项目',
        // 审查面板
        'Review': '审查',
        'View Split Diff': '分栏对比',
        'Collapse All': '全部折叠',
        'No changes to review': '没有可审查的更改',
        // 按钮提示(带快捷键的整串)
        'Send message Enter': '发送消息 Enter',
        'Record Audio': '录音',
        // 新建对话下拉 / 项目菜单
        'New Project': '新建项目',
        'Quick Start': '快速开始',
        'No Project': '无项目',
        'Select a folder.': '选择一个文件夹。',
        // 显示选项(分组/排序/副标题)
        'Group By': '分组方式',
        'Workspace': '工作区',
        'Status': '状态',
        'None': '无',
        'Sort Conversations': '对话排序',
        'Last Updated': '最近更新',
        'Last Prompt': '最近提问',
        'Alphabetical (A-Z)': '按字母 (A-Z)',
        'Date Added': '添加日期',
        'Subtitles': '副标题',
        'Worktree': '工作树',
        'No Subtitle': '无副标题',
        'Filter': '筛选',
        'Project Settings': '项目设置',
        // "对话"设置页
        'Agent settings and permissions for conversations outside of projects.': '项目外对话的智能体设置与权限。',
        'Inherit General': '继承通用',
        'Inherits your General settings when working in this project.': '在此项目中工作时继承你的通用设置。',
        'Last 7 days': '最近 7 天',
        'Scheduled': '已排期',
        'Instantly create a new project and folder to start building.': '立即创建新项目和文件夹，开始构建。',
        // 对话条目菜单/弹窗
        'Delete Conversation': '删除对话',
        'Are you sure you want to delete this conversation? This action cannot be undone.': '确定要删除这个对话吗？此操作无法撤销。',
        'Pinned Conversations': '置顶对话',
        'Unpin': '取消置顶',
        'Mark Unread': '标记为未读',
        'Conversation Name': '对话名称',
        'Conversation ID': '对话 ID',
        'Project Name': '项目名称',
        'This chat is archived.': '此对话已归档。',
        'Restore': '恢复',
        // 悬停提示
        'Archive conversation': '归档对话',
        'Archive Conversation': '归档对话',
        'Pin': '置顶',
        'Idle': '空闲',
        'Pin conversation': '置顶对话',
        'More options': '更多选项',
        'More actions': '更多操作',
        'Create New Project': '新建项目',
        'Display Options': '显示选项',
        'New Conversation in Project': '在项目中新建对话',
        'Toggle Sidebar': '切换侧栏',
        'Go Back': '后退',
        'Go Forward': '前进',
        'Project options': '项目选项',
        // 通用操作
        'Cancel': '取消',
        'Save': '保存',
        'Delete': '删除',
        'Rename': '重命名',
        'Archive': '归档',
        'Close': '关闭',
        'Search': '搜索',
        'Loading...': '加载中…',
        'Today': '今天',
        'Yesterday': '昨天',
        'Open': '打开',
        // 补充汉化（设置增强、高级选项、Tab补全、Git审查、智能体操作卡片等）
        'Outside of folders file access policy': '工作文件夹外文件访问策略',
        'Configures how the agent tries to access files outside of its working folders.': '配置文件访问策略，控制智能体如何访问工作文件夹外部的文件。',
        'Terminal Command Auto Execution': '终端命令自动执行',
        'Controls whether terminal commands require your approval before running.': '控制终端命令在运行前是否需要你的批准。',
        'Proceed in Sandbox': '沙箱内直接运行',
        'Require Review': '需要审查',
        'Disabled by organization policy': '已被组织策略禁用',
        'managed by your organization': '由你的组织管理',
        'Strict Mode': '严格模式',
        'Enforce settings that prevent the agent from autonomously running targeted exploits and require human review for all agent actions. Visit antigravity.google/docs/strict-mode for details.': '强制启用高安全性设置，防止智能体自主执行潜在危险操作，并对所有操作要求人工审查。详情请访问 antigravity.google/docs/strict-mode。',
        'Agent Non-Workspace File Access': '智能体工作区外文件访问',
        'Allow the agent to automatically view and edit files outside the current workspace. Use with caution: this gives the agent access to additional potentially-relevant information, but also allows the agent to access credential files, secrets, and other files outside of the workspace that could be targeted in prompt injection attacks or other exploits by malicious actors.': '允许智能体自动查看和编辑当前工作区以外的文件。请谨慎使用：这使智能体能获取更多潜在相关信息，但也允许其访问工作区外的凭据、密钥等敏感文件，可能遭受提示词注入等恶意利用。',
        'Command Setup Script': '命令初始化脚本',
        'A shell setup script run before every command the agent executes.': '在智能体执行每条命令前运行的 Shell 初始化脚本。',
        'A shell setup script run before every command the agent executes in this project. Overrides the global script.': '在智能体执行此项目中的每条命令前运行的 Shell 初始化脚本，会覆盖全局脚本。',
        'Enable Terminal Sandbox': '启用终端沙箱',
        'Run terminal commands with sandbox restrictions.': '在沙箱限制下运行终端命令。',
        'Sandbox Allow Network': '沙箱允许网络访问',
        'Allow sandboxed commands to make network requests.': '允许沙箱内的命令发起网络请求。',
        'Enable Shell Integration': '启用 Shell 集成',
        'Use the IDE\'s shell integration to detect and report terminal command execution. When disabled, the agent uses its own shell. Restart the application for this to take effect.': '使用 IDE 的 Shell 集成来检测并上报终端命令执行情况。禁用后智能体将使用自带的 Shell，重启应用后生效。',
        'Enable Sounds for Agent': '启用智能体提示音',
        'Play a sound when the agent finishes generating a response.': '智能体完成生成回答时播放提示音。',
        'Enable Notifications for Agent': '启用智能体通知',
        'Show browser notifications when your action is needed or execution finishes.': '需要你操作或执行完成时显示浏览器通知。',
        'Auto-Expand Changes Overview': '自动展开更改概览',
        'Automatically expand the Changes Overview toolbar when the agent finishes generating a response.': '智能体完成生成回答时自动展开更改概览工具栏。',
        'Auto-Open Edited Files': '自动打开已编辑文件',
        'Open files in the background if the agent creates or edits them': '当智能体创建或编辑文件时在后台打开这些文件',
        'Open Agent on Reload': '重新加载时打开智能体',
        'Open the agent panel on window reload': '窗口重新加载时打开智能体面板',
        'Knowledge': '知识库',
        'Let the agent access its knowledge base to inform its responses and automatically generate knowledge items in the background. Turning this off prevents the agent from accessing existing knowledge items, but doesn\'t delete them.': '允许智能体访问知识库以辅助回答，并在后台自动生成知识条目。关闭此项会阻止智能体访问已有知识条目，但不会将其删除。',
        'Let the agent access past conversations to inform its responses.': '允许智能体访问历史对话以辅助回答。',
        'Allow List Terminal Commands': '白名单终端命令',
        'The agent auto-executes commands matched by an allow list entry.': '智能体将自动执行与白名单条目匹配的命令。',
        'Deny List Terminal Commands': '黑名单终端命令',
        'The agent asks for permission before executing commands matched by a deny list entry.': '智能体在执行与黑名单条目匹配的命令前会请求权限。',
        'Agent Auto-Fix Lints': '智能体自动修复代码检查错误',
        'Give the agent awareness of lint errors created by its edits so it can fix them without explicit prompting.': '让智能体感知其编辑产生的 lint 错误，无需明确提示即可自动修复。',
        'Review Policy': '审查策略',
        'Agent always asks for review.': '智能体总是请求审查。',
        'Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.': '智能体从不请求审查。这能最大化智能体的自主性，但也有接触不安全或注入产物内容的最高风险。',
        'The agent never asks for confirmation before executing terminal commands (except those in the Deny list). This provides the agent with the maximum ability to operate over long periods without intervention, but also has the highest risk of the agent executing an unsafe terminal command.': '智能体执行终端命令前从不请求确认（黑名单除外）。这为智能体提供了最强的长时间无干预运行能力，但执行不安全命令的风险也最高。',
        'The agent always asks for confirmation before executing terminal commands (except those in the Allow list).': '智能体执行终端命令前总是请求确认（白名单除外）。',
        'Terminal command automatically proceeds if the command runs inside the sandbox. Otherwise, it requests review.': '命令若在沙箱内运行则自动继续，否则请求审查。',
        'GitHub': 'GitHub',
        'Configure GitHub access policies.': '配置 GitHub 访问策略。',
        'Enter tool name or server...': '输入工具名称或服务器…',
        'Suggestions in Editor': '编辑器内建议',
        'Show suggestions when typing in the editor': '在编辑器中键入时显示代码建议',
        'Tab to Jump': 'Tab 跳转',
        'Predict the location of your next edit and navigate you there with a tab keypress.': '预测下一次编辑的位置，按 Tab 键即可直接跳转。',
        'Tab to Import': 'Tab 导入',
        'Quickly add and update imports with a tab keypress.': '按 Tab 键快速添加和更新 import 导入语句。',
        'Tab Speed': 'Tab 补全速度',
        'Set the speed of tab suggestions': '设置 Tab 补全建议的显示速度',
        'Highlight After Accept': '采纳后高亮显示',
        'Highlight newly inserted text after accepting a Tab completion.': '采纳 Tab 补全后高亮显示新插入的文本。',
        'Tab Gitignore Access': 'Tab 访问 .gitignore 文件',
        'Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.': '允许 Tab 补全查看和编辑 .gitignore 中的文件。若你的 .gitignore 列出了包含凭据、密钥或其他敏感信息的文件，请谨慎使用。',
        'Suggestions': '建议',
        'Slow': '慢',
        'Enable Browser Tools': '启用浏览器工具',
        'Let the agent use browser tools to open URLs, read web pages, and interact with browser content. This gives the agent access to important (and often critical) knowledge and methods of validation, but any browser integration does increase exposure to external malicious parties for security exploits.': '允许智能体使用浏览器工具打开 URL、读取网页并与网页内容交互。这让智能体能获取重要且关键的知识与验证手段，但任何浏览器集成都会增加遭受外部恶意安全攻击的风险。',
        'Chrome Binary Path': 'Chrome 可执行文件路径',
        'Path to the Chrome/Chromium executable. Leave empty for auto-detection.': 'Chrome/Chromium 可执行文件的路径。留空则自动检测。',
        'Absolute path to the Chrome/Chromium executable': 'Chrome/Chromium 可执行文件的绝对路径',
        'Browser User Profile Path': '浏览器用户配置文件路径',
        'Custom path for the browser user profile directory. Leave empty for default (~/.gemini/antigravity-browser-profile).': '浏览器用户配置目录的自定义路径。留空则使用默认路径（~/.gemini/antigravity-browser-profile）。',
        'Browser CDP Port': '浏览器 CDP 端口',
        'Port number for Chrome DevTools Protocol remote debugging. Leave empty for default (9222).': '用于 Chrome DevTools Protocol 远程调试的端口号。留空则使用默认值 (9222)。',
        'Show Selection Actions': '显示选中文本操作',
        'Show "Edit" and "Chat" buttons when selecting text in the editor.': '在编辑器中选中文本时显示“编辑”和“聊天”按钮。',
        'Include Jetski Default Customizations': '包含内置默认自定义项',
        'Include default customizations, such as default skills.': '包含默认自定义项，例如默认技能。',
        'Enable Personal Customizations': '启用个人自定义项',
        'Layer your personal customizations (skills, rules, etc.) from your config on top of workspace customizations.': '将个人配置中的自定义项（技能、规则等）叠加到工作区自定义项之上。',
        'Default Customizations': '默认自定义项',
        'Personal Customizations': '个人自定义项',
        'Customize Global Skills': '自定义全局技能',
        'Custom Agents': '自定义智能体',
        'MCP Servers': 'MCP 服务器',
        'Delete MCP Server': '删除 MCP 服务器',
        'Add MCP Server': '添加 MCP 服务器',
        'Add MCP server': '添加 MCP 服务器',
        'MCP Install Error:': 'MCP 安装错误：',
        'MCP Configuration Error:': 'MCP 配置错误：',
        'Copy config file path': '复制配置文件路径',
        'UI Extensions': 'UI 扩展',
        'UI extensions': 'UI 扩展',
        'Hooks': '钩子',
        'Plugin details': '插件详情',
        'Show more results': '显示更多结果',
        'Describe the plugin you want and let the agent build it': '描述你需要的插件，让智能体为你构建',
        'Browse': '浏览',
        'View Installed': '查看已安装',
        'Search customizations...': '搜索自定义项…',
        'Provide feedback': '提供反馈',
        'Copy conversation markdown': '复制对话 Markdown',
        'Archive this conversation': '归档此对话',
        'Find in conversation': '在对话中查找',
        'Accept Step': '接受步骤',
        'Reject Step': '拒绝步骤',
        'Start Voice Recording': '开始语音输入',
        'Stop Voice Recording': '停止语音输入',
        'Toggle File Viewer': '切换文件查看器',
        'Toggle Editor': '切换编辑器',
        'Open Launchpad': '打开启动台',
        'Toggle Project Selector': '切换项目选择器',
        'Toggle Environment Selector': '切换环境选择器',
        'New Editor Window': '新建编辑器窗口',
        'Close Tab': '关闭标签页',
        'Open Workspace': '打开工作区',
        'Continue Response': '继续生成回答',
        'Split Terminal': '拆分终端',
        'Split Conversation Vertically': '垂直拆分对话',
        'Split Conversation Horizontally': '水平拆分对话',
        'Equalize Split Panes': '等宽等高拆分面板',
        'Close Terminal Tab': '关闭终端标签页',
        'New Terminal Tab': '新建终端标签页',
        'Open Command Palette': '打开命令面板',
        'Open Workspace Selector': '打开工作区选择器',
        'Add to Chat': '添加到对话',
        'Go Back in Pane': '在面板中后退',
        'Go Forward in Pane': '在面板中前进',
        'Open Commit Graph': '打开提交图谱',
        'Open Conversation History': '打开对话历史',
        'Open Keyboard Shortcuts': '打开键盘快捷键',
        'Open Conversation': '打开对话',
        'Mark as Read': '标记为已读',
        'Mark as Unread': '标记为未读',
        'Archive / Restore': '归档 / 恢复',
        'Terminal: Add to Chat': '终端：添加到对话',
        'Restart Main Language Server': '重启主语言服务',
        'Download Diagnostics': '下载诊断信息',
        'Previous Aux Pane Tab': '上一个辅助面板标签',
        'Next Aux Pane Tab': '下一个辅助面板标签',
        'Collapse All Folders': '折叠所有文件夹',
        'Expand All Folders': '展开所有文件夹',
        'Proceed with Plan': '按计划继续',
        'Open in Preview Pane': '在预览面板中打开',
        'Open with External Browser': '用外部浏览器打开',
        'Create fork in current workspace': '在当前工作区分叉',
        'Create fork in shared workspace': '在共享工作区分叉',
        'Create fork in new workspace': '在新工作区分叉',
        'Failed to fork conversation': '分叉对话失败',
        'Confirm Undo': '确认撤销',
        'Send Now': '立即发送',
        'Undo': '撤销',
        'Always Allow': '总是允许',
        'Always allow': '总是允许',
        'Allow Once': '仅允许一次',
        'Allow once': '仅允许一次',
        'Ask first': '先询问',
        'Always run': '总是运行',
        'Capture screenshot': '截取屏幕截图',
        'Capture console logs': '抓取控制台日志',
        'Click to copy full command': '点击复制完整命令',
        'Output': '输出',
        'Logs': '日志',
        'Errors': '错误',
        'Stop Subagent': '停止子智能体',
        'Input required': '需要输入',
        'Run command': '运行命令',
        'File access': '文件访问',
        'Open URL': '打开 URL',
        'Read URL': '读取 URL',
        'MCP tool': 'MCP 工具',
        'Run JS': '运行 JS',
        'Approval': '审批',
        'Other (write your answer)': '其他（输入你的回答）',
        'Conversation unavailable': '对话不可用',
        'Mark all as read': '全部标记为已读',
        'Move to Group': '移动到分组',
        'Group name': '分组名称',
        'Fork': '分叉',
        'Split Right': '向右分栏',
        'Split Down': '向下分栏',
        'Replace With New': '替换为新建',
        'Commit': '提交',
        'Commit succeeded': '提交成功',
        'Failed to Commit': '提交失败',
        'Failed to Generate Commit Message': '生成提交信息失败',
        'Push': '推送',
        'Push succeeded': '推送成功',
        'Failed to Push': '推送失败',
        'Include unstaged changes': '包含未暂存的更改',
        'Unstage change': '取消暂存更改',
        'Stage change': '暂存更改',
        'Discard': '放弃',
        'Discard unstaged changes': '放弃未暂存的更改',
        'Added (Staged)': '已添加（暂存）',
        'Untracked (Unstaged)': '未跟踪（未暂存）',
        'Modified': '已修改',
        'Deleted': '已删除',
        'Renamed': '已重命名',
        'Copied': '已复制',
        'Files': '文件',
        'Recent Files': '最近文件',
        'Inline Actions': '浮动操作卡片',
        'Add inline comment': '添加行内评论',
        'Edit comment': '编辑评论',
        'Delete comment': '删除评论',
        'Copy Content': '复制内容',
        'Paste': '粘贴',
        'No Model Selected': '未选择模型',
        // ===== 技能全文与拆解节点完全补全 =====
        'Provides a comprehensive guide, quick reference, and sitemap for Google Antigravity (AGY), including the Antigravity CLI (agy), Antigravity 2.0, Antigravity IDE, Python SDK, slash commands, keybindings, and customizations (skills, rules, MCP, sidecars). Activate this skill when the user asks questions about how to use, configure, or customize Antigravity, AGY, the agy CLI, the Antigravity IDE, or Antigravity 2.0.': '提供 Google Antigravity (AGY) 的全面指南、速查手册与功能索引，涵盖 CLI (agy)、Antigravity 2.0、IDE、Python SDK、斜杠命令、快捷键及自定义项（技能、规则、MCP、Sidecar）。',
        'Interactive guide to design and create a scheduled background automation. Use this skill when the user wants to create an automated or recurring scheduled task (e.g. "summarize my emails every morning", "every Monday send me a to-do list"). Also triggered by the /automation slash command.': '设计并创建定时后台自动化任务的交互式指南。当需要创建自动化或定期计划任务时使用，亦可通过 /automation 斜杠命令触发。',
        'How to render rich interactive HTML widgets inline in the chat or as standalone artifacts. Use this skill when you want to show the user diagrams, data visualizations, interactive controls, educational walkthroughs, or any rich visual content beyond plain text and markdown.': '如何在对话中内嵌渲染丰富的交互式 HTML 小组件或独立产物，适用于展示图表、数据可视化、交互式控件或丰富视觉内容。',
        'Remove signs of AI-generated writing from text. Use when editing or reviewing text to make it sound more natural and human-like.': '消除文本中由 AI 生成的痕迹。在编辑或审阅文本时使用，使其听起来更加自然、更像人类书写。',
        'Automatically migrate legacy workflows to modern skills across global and workspace configurations. Scans for existing workflows, creates target SKILL.md files, and safely archives old workflow files.': '自动将旧版工作流迁移至跨全局与工作区配置的现代技能体系。扫描现有工作流，生成目标 SKILL.md 文件并安全归档旧文件。',
        'Guidelines for interacting with GitHub and request permissions from the user when commands fail due to restrictions in the agent environment.': '与 GitHub 交互的指导规范，以及当命令因智能体环境限制而失败时向用户申请权限的规则。',
        'How to manage and create plugins — namespaced bundles of skills, agents, rules, MCP servers and hooks that install, enable and disable as a single unit. Use this skill when the user wants to enable, disable, install or uninstall a plugin, when they want to create a new plugin, or when a new customization should be packaged into a plugin rather than left loose. Also triggered by the /plugin slash command. Don\'t use for the underlying customization system itself — discovery roots, loading priority, or authoring a standalone skill, agent, rule, hook or MCP server outside a plugin; see the customizations guide skill for those.': '如何管理和创建插件（技能、智能体、规则、MCP 服务器和钩子的命名空间集合）。',
        'Build, package, run, and debug UI extensions for Antigravity: interactive web panels that render in the side pane, served by a Node.js sidecar using the built-in Sidecar SDK.': '为 Antigravity 构建、打包、运行和调试界面扩展：由 Node.js Sidecar 通过内置 SDK 提供的侧边栏交互式 Web 面板。',
        'Discover UI plugin panels relevant to the current task and surface a one-click pill in chat to open (toggle) them in the side pane. Use when a running UI plugin\'s panel would help with what the user is doing, or right after the user enables a new UI plugin pane and a shortcut to open it is handy.': '发现与当前任务相关的界面插件面板，并在对话中提供一键切换按钮以便在侧边栏中打开它们。',
        'to have the agent generate a plan': '让智能体生成执行方案',
        'plan': '方案',
        'when working in this project': '在当前项目中生效',
        'when working in this workspace': '在当前工作区中生效',
        // ===== 截图深层未汉化补全 =====
        'Google Developer Knowledge': 'Google 开发者知识库',
        'Search and retrieve official documentation acr...': '跨 Google 平台搜索并检索官方开发文档...',
        'Search and retrieve official documentation across Google developer platforms.': '跨 Google 平台搜索并检索官方开发文档。',
        'Google Maps Platform': 'Google 地图平台',
        'Integration skill and tools for Google Maps Pl...': '用于 Google 地图平台集成的技能与工具...',
        'Integration skill and tools for Google Maps Platform.': '用于 Google 地图平台集成的技能与工具。',
        'Data Agent Kit': '数据智能体套件 (Data Agent Kit)',
        'This plugin provides a specialized suite of skill...': '本插件提供用于数据处理和分析的专业技能套件...',
        'This plugin provides a specialized suite of skills for data analysis.': '本插件提供用于数据分析的专业技能套件。',
        'Official plugin for Dart and Flutter that installs...': 'Dart 与 Flutter 官方插件，用于安装开发环境并提供辅助...',
        'Official plugin for Dart and Flutter that installs development tooling.': 'Dart 与 Flutter 官方插件，用于安装开发环境并提供辅助。',
        'See less': '收起',
        '- See less': '- 收起',
        'Create': '创建',
        '+ Create': '+ 创建',
        'Find skills, agents, and more in the Marketplace.': '在插件市场中发现技能、智能体及更多内容。',
        'Browse the Marketplace': '浏览插件市场',
        'All': '全部',
        'Provides a comprehensive guide, quick reference, and sitemap for Google Antigravity.': '提供 Google Antigravity 的全面使用指南、速查手册与功能索引。',
        'Provides a comprehensive guide, quick reference, and sitemap for Google Antigravi...': '提供 Google Antigravity 的全面使用指南、速查手册与功能索引...',
        'Interactive guide to design and create a scheduled background automation. Use this skill ...': '设计并创建定时后台自动化任务的交互式指南...',
        'Interactive guide to design and create a scheduled background automation.': '设计并创建定时后台自动化任务的交互式指南。',
        'How to render rich interactive HTML widgets inline in the chat or as standalone artifact...': '如何在对话中内嵌渲染丰富的交互式 HTML 小组件或独立产物...',
        'How to render rich interactive HTML widgets inline in the chat or as standalone artifacts.': '如何在对话中内嵌渲染丰富的交互式 HTML 小组件或独立产物。',
        'Remove signs of AI-generated writing from text. Use when editing or reviewing text to ma...': '消除文本中由 AI 生成的机械感痕迹，润色文本使其更加自然、贴近人类书写...',
        'Remove signs of AI-generated writing from text.': '消除文本中由 AI 生成的痕迹，润色文本使其更自然。',
        'Automatically migrate legacy workflows to modern skills across global and works...': '自动将旧版工作流迁移至跨全局与工作区的新版技能体系...',
        'Automatically migrate legacy workflows to modern skills across global and workspace scopes.': '自动将旧版工作流迁移至跨全局与工作区的新版技能体系。',
        'Guidelines for interacting with GitHub and request permissions from the user w...': '与 GitHub 交互的指导规范及在必要时向用户请求权限的规则...',
        'Guidelines for interacting with GitHub and request permissions from the user when necessary.': '与 GitHub 交互的指导规范及在必要时向用户请求权限的规则。',
        'How to manage and create plugins — namespaced bundles of skills, agents, rules, MCP server...': '如何管理与创建插件（技能、智能体、规则与 MCP 服务器的命名空间集合）...',
        'How to manage and create plugins — namespaced bundles of skills, agents, rules, MCP servers...': '如何管理与创建插件（技能、智能体、规则与 MCP 服务器的命名空间集合）...',
        'Build, package, run, and debug UI extensions for Antigravity: interactive web panels that ...': '为 Antigravity 构建、打包、运行并调试界面扩展（交互式 Web 面板）...',
        'Build, package, run, and debug UI extensions for Antigravity.': '为 Antigravity 构建、打包、运行并调试界面扩展。',
        'Discover UI plugin panels relevant to the current task and surface a one-click pill...': '发现与当前任务相关的界面插件面板并提供一键式启动胶囊按钮...',
        'Discover UI plugin panels relevant to the current task and surface a one-click pill.': '发现与当前任务相关的界面插件面板并提供一键式启动胶囊按钮。',
        'No custom agents yet.': '暂无自定义智能体。',
        'and select': '并选择',
        'to have the agent generate a plan.': '让智能体生成执行方案。',
        'Inherit Global': '继承全局设置',
        'Inherits your Global Permissions when working in this project.': '在此项目中工作时，继承你的全局权限配置。',
        'Inherits your Global Permissions when working in this workspace.': '在此工作区中工作时，继承你的全局权限配置。',
        'Also includes': '同时包含',
        'when working in this project.': '在当前项目中生效。',
        'when working in this workspace.': '在当前工作区中生效。',
        // ===== 交互提示与状态补全 =====
        'Success, Continuing...': '执行成功，继续中...',
        'Failed to load plugins. Please try again.': '加载插件失败，请重试。',
        'Failed to load more plugins. Please try again.': '加载更多插件失败，请重试。',
        'No workspace window available': '没有可用的工作区窗口',
        'No description available.': '暂无描述。',
        'Failed to load video': '视频加载失败',
        'Failed to load image': '图片加载失败',
        'Click to disable tool': '点击禁用工具',
        'Click to enable tool': '点击启用工具',
        'Failed to toggle plugin. Please try again.': '切换插件状态失败，请重试。',
        'No plugins available.': '暂无可用插件。',
        'No results found': '未找到结果',
        'No answer provided': '未提供回答',
        'No quota information available.': '暂无配额信息。',
        'Failed to load diff.': '加载差异对比失败。',
        'No license available for this project and location': '当前项目与地区暂无可用授权许可',
        'Failed to load trajectory': '加载轨迹失败',
        'No Match Found': '未找到匹配项',
        'No update service found': '未找到更新服务',
        'Are you sure you want to delete': '确定要删除吗',
        'Could not read MCP config file': '无法读取 MCP 配置文件',
        'Could not determine MCP config file path': '无法确定 MCP 配置文件路径',
        'Failed to execute': '执行失败',
        'Failed to resolve folder': '解析文件夹失败',
        // ===== 自定义/技能市场页面补全 =====
        'Installed': '已安装',
        'See more': '查看更多',
        'See 5 more': '查看更多 5 项',
        'See 4 more': '查看更多 4 项',
        'See 3 more': '查看更多 3 项',
        'See 2 more': '查看更多 2 项',
        'See 1 more': '查看更多 1 项',
        'Google Workspace': 'Google Workspace',
        'Connect to Google Workspace, including Docs, Sheets, Slides, Drive, and Calendar.': '连接至 Google Workspace，包括文档、表格、幻灯片、云盘和日历。',
        'Build with Google': '基于 Google 平台构建',
        'Build on Google\'s developer platforms, including Android, Chrome, Gemini, and Google Cloud.': '基于 Google 开发者平台构建，包括 Android、Chrome、Gemini 与 Google Cloud。',
        'Build on Google’s developer platforms, including Android, Chrome, Gemini, and Google Cloud.': '基于 Google 开发者平台构建，包括 Android、Chrome、Gemini 与 Google Cloud。',
        'Read, draft, and edit docs.': '读取、起草和编辑文档。',
        'Read, write, and format spreadsheets.': '读取、编写和格式化电子表格。',
        'Read, edit, and export presentations.': '读取、编辑和导出演示文稿。',
        'Search, upload, download, and share files.': '搜索、上传、下载和共享文件。',
        'Google Calendar': 'Google 日历',
        'Check availability, schedule events, and RSVP.': '查看空闲时段、安排活动日程和回复活动邀请。',
        'Gemini API': 'Gemini API',
        'Build applications with the Gemini Interaction...': '使用 Gemini 交互模型与 API 构建智能应用...',
        'Build applications with the Gemini Interaction API and SDKs.': '使用 Gemini 交互 API 与 SDK 构建智能应用。',
        'Prototype, build & run modern apps that users love with Firebase.': '借助 Firebase 后端构建并运行用户喜爱的现代应用。',
        'Prototype, build & run modern apps that user...': '借助 Firebase 后端构建并运行现代应用...',
        'Curated collection of agent skills for science t...': '精选的科学计算与研究领域智能体技能集...',
        'Curated collection of agent skills for science tasks.': '精选的科学计算与研究领域智能体技能集。',
        'Google Antigravity SDK': 'Google Antigravity SDK',
        'Using the Google Antigravity Python SDK to b...': '使用 Google Antigravity Python SDK 构建智能体...',
        'Using the Google Antigravity Python SDK to build AI agents.': '使用 Google Antigravity Python SDK 构建 AI 智能体。',
        // ===== 补全的全新汉化词条 (v2.21+ 深度适配) =====
        'Code Search': '代码搜索',
        'Copy Path': '复制路径',
        'Terminal': '终端',
        'Open in Code Search': '在代码搜索中打开',
        'Automations': '自动化',
        'Commands': '命令',
        'Agent Edits': '智能体修改',
        'Auto (detected)': '自动（已检测）',
        'Enter file or directory path...': '输入文件或目录路径...',
        'Enter URL pattern...': '输入 URL 规则...',
        'Select All': '全选',
        'Local': '本地',
        'Changes': '更改',
        'Documents': '文档',
        'Update Available': '有可用更新',
        'Toggle Overview Panel': '切换概览面板',
        'New Window': '新建窗口',
        'New Tab': '新建标签页',
        'Search Conversations': '搜索对话',
        'Quote Selection': '引用所选内容',
        'Refresh gcert Credentials': '刷新 gcert 凭据',
        'Copy Conversation Markdown': '复制对话 Markdown',
        'Archive This Conversation': '归档此对话',
        'Pin This Conversation': '置顶此对话',
        'Unpin This Conversation': '取消置顶此对话',
        'Find in Conversation': '在对话中查找',
        'Toggle Between Light/Dark Themes': '切换浅色/深色主题',
        'Remove from Group': '从分组中移除',
        'Autonomous Mode': '自主模式',
        'Navigation': '导航',
        'Advanced': '高级',
        'Explain and Fix in Current Conversation': '在当前对话中解释并修复',
        'Reload': '重新加载',
        'Group By Workspace': '按工作区归类',
        'Agents': '智能体',
        'Overview': '概览',
        'Marketplace': '插件市场',
        'Google Drive': '谷歌云盘',
        'Agent terminated due to error': '智能体因错误终止',
        'See Plans': '查看方案',
        'Select branch': '选择分支',
        'Staged Changes': '已暂存更改',
        'Branch Changes': '分支更改',
        'Getting scripts...': '正在获取脚本...',
        'Screenshot': '屏幕截图',
        'No documents': '暂无文档',
        'No uploads': '暂无上传',
        'Export as PDF': '导出为 PDF',
        'Open in Notebook View': '在笔记本视图中打开',
        'Custom View': '自定义视图',
        'Blocked': '已阻止',
        'In Progress': '进行中',
        'Search workspaces...': '搜索工作区...',
        'New Group': '新建分组',
        'Device Name': '设备名称',
        'Enter device name...': '输入设备名称...',
        'Open in Remote Control': '在远程控制中打开',
        'Read Files': '读取文件',
        'Write Files': '写入文件',
        'Enter command (e.g., git, blaze)...': '输入命令（如 git、blaze）...',
        'Enable Sandbox Mode (Preview)': '启用沙盒模式（预览）',
        'Restricts agent tools to a secure, isolated local sandbox.': '将智能体工具限制在安全隔离的本地沙盒中。',
        'Permission Preset': '权限预设',
        'Manage Hooks': '管理钩子',
        'Copy error to clipboard': '复制错误信息到剪贴板',
        'Open in preview': '在预览中打开',
        'Cancel Task': '取消任务',
        'Goals': '目标',
        'Links': '链接',
        'Modified Files': '已修改文件',
        'Archive project': '归档项目',
        'Copy value': '复制值',
        'Previous match (Shift+Enter)': '上一个匹配项 (Shift+Enter)',
        'Next match (Enter)': '下一个匹配项 (Enter)',
        'Clear search (Esc)': '清除搜索 (Esc)',
        'Steps': '步骤',
        'Tokens': 'Token 统计',
        'Start Snapshot': '开始快照',
        'End Snapshot': '结束快照',
        'Switch Roles': '切换角色',
        'Enable Notifications': '启用通知',
        'Standalone': '独立模式',
        'Comment on Selection': '对所选内容发表评论',
        'Complete Onboarding Step': '完成新手入门步骤',
        'Open Folder': '打开文件夹',
        'Rename This Conversation': '重命名此对话',
        'Move to New Group': '移动到新分组',
        'Open Trajectory Debug View': '打开轨迹调试视图',
        'Copy Conversation ID': '复制对话 ID',
        'Copy Trajectory ID': '复制轨迹 ID',
        'Chief of Staff': '幕僚长',
        'Comments': '评论',
        'Copy Image': '复制图片',
        'Every command requires approval.': '每条命令都需要审批。',
        'Ask before sensitive operations.': '在敏感操作前先询问。',
        'Vetted (Preview)': '审查模式（预览）',
        'Security agent decides if commands run.': '由安全智能体决定命令是否运行。',
        'Auto (Preview)': '自动模式（预览）',
        'Automatically decide if commands run.': '自动决定命令是否运行。',
        'Turbo': '极速模式',
        'Run all commands without restrictions.': '无限制运行所有命令。',
        'Context Menus': '右键菜单',
        'Quota': '配额',
        'Updater': '检查更新',
        'Choose between the Default and Project 4K experience.': '在默认体验与 Project 4K 体验之间进行选择。',
        'Confirm Window Reload': '确认重新加载窗口',
        'Enable Demo Mode (Beta)': '启用演示模式 (Beta)',
        'Continue': '继续',
        'Use the IDE': '使用 IDE',
        'Agent Host Address': '智能体主机地址',
        'Custom Context Menus': '自定义右键菜单',
        'Replace the default browser right-click menu with quick actions.': '用快捷操作替换默认浏览器右键菜单。',
        'Markdown Artifact Width': 'Markdown 产物宽度',
        'Configure the default width of markdown artifacts.': '配置 Markdown 产物的默认显示宽度。',
        'Manage your conversations from the companion website.': '在配套网页端管理你的对话。',
        'Nickname': '昵称',
        'Default Workspace VCS': '默认工作区版本控制系统',
        'Default Cog Repository': '默认 Cog 仓库',
        'Default Cog Branch / Ref': '默认 Cog 分支 / 引用',
        'Sync JJ Worktrees to Head': '将 JJ 工作树同步至 Head',
        'Sync newly created JJ worktrees to head when starting a conversation.': '开启对话时将新建的 JJ 工作树同步至 head。',
        'Use full VCS clones for Best of N': '在多路优选（Best of N）中使用完整版本库克隆',
        'Use full Git clones for Best of N': '在多路优选（Best of N）中使用完整 Git 克隆',
        'Before': '之前',
        'After': '之后',
        'Open in new tab': '在新标签页中打开',
        'Click to view or edit comment': '点击查看或编辑评论',
        'Open in external browser': '在外部浏览器中打开',
        'Open in Preview Tab': '在预览标签页中打开',
        'Embedded web preview': '内嵌网页预览',
        'Open in Built-in Browser': '在内置浏览器中打开',
        'Explore the plugin marketplace': '浏览插件市场',
        'Tip': '提示',
        'CitC Workspace': 'CitC 工作区',
        'Cog Workspace': 'Cog 工作区',
        'ABFS Workspace (Alpha)': 'ABFS 工作区 (Alpha)',
        'New Workspace': '新建工作区',
        'Group By Project': '按项目归类',
        'Sidebar grouped by workspace': '侧边栏按工作区归类',
        'Sidebar grouped by project': '侧边栏按项目归类',
        'Updated sidebar grouping': '已更新侧边栏归类方式',
        'Create a Plugin with the Agent': '使用智能体创建插件',
        'Built In': '内置',
        'Workspaces': '工作区',
        'Folders these agents can access.': '这些智能体可以访问的文件夹。',
        'Access grants': '访问授权',
        'Commands and files these agents can use.': '这些智能体可以使用的命令和文件。',
        'Delete Task': '删除任务',
        'UI Plugins': '界面插件',
        'Delete Skill': '删除技能',
        'Ready': '就绪',
        'Pending': '等待中',
        'Enter authorization code...': '输入授权码...',
        'Skills & Rules': '技能与规则',
        'Copy Config File Path': '复制配置文件路径',
        'See more results': '查看更多结果',
        'Copy command': '复制命令',
        'MCP servers': 'MCP 服务器',
        'Setup required': '需要配置',
        'Amend succeeded': '追加提交成功',
        'Amend': '追加提交 (Amend)',
        'Failed to Amend': '追加提交失败',
        'Import AI Studio Project': '导入 AI Studio 项目',
        'Type absolute path or navigate folders...': '输入绝对路径或浏览文件夹...',
        'Dev mode: Localhost server automatically detected': '开发者模式：已自动检测到本地服务器',
        'Google Docs': 'Google 文档',
        'Google Sheets': 'Google 表格',
        'Google Slides': 'Google 幻灯片',
        'Open Preview': '打开预览',
        'Open preview in embedded pane': '在内嵌面板中打开预览',
        'Standalone Terminals': '独立终端',
        'Failed to create terminal': '创建终端失败',
        'Best-of-N Started': '多路优选已开始',
        'Best-of-N Ended': '多路优选已结束',
        'Full Error': '完整错误信息',
        'Mention Page': '提及页面',
        'view full search results': '查看完整搜索结果',
        'View Page': '查看页面',
        'Revert file changes': '撤销文件更改',
        'Undo To Here': '撤销至此处',
        'Fork warning': '分叉提醒',
        'Drag to resize, double-click to reset': '拖拽调整大小，双击重置',
        'Previous question': '上一题',
        'Next question': '下一题',
        'Why are you opting out?': '为什么要退出？',
        '(Optional) Tell us more...': '（可选）告诉我们更多信息...',
        'Too many surveys': '问卷调查太频繁',
        'The current trigger rate is too high.': '目前的触发频率过高。',
        'Prompt too simple': '提示词太简单',
        'This prompt is straightforward and does not need alternative comparisons.': '该提示词十分直接，不需要多方案对比。',
        'Not suitable for Best-of-N': '不适合多路优选',
        'This request is not well-suited for parallel Best-of-N generation.': '该请求不适合进行并行的多路优选生成。',
        'In a rush': '赶时间',
        'I prefer an immediate single response to prioritize productivity right now.': '我希望立即得到单个回答以提高当前的效率。',
        'Why are you opting out of auto-triggered Best-of-N?': '为什么退出自动触发的多路优选？',
        '(Optional) Tell us more or type your reason...': '（可选）告诉我们更多信息或输入原因...',
        'Copy debug info': '复制调试信息',
        'Verification required': '需要验证',
        'Complete verification': '完成验证',
        'Action required': '需要操作',
        'Insufficient AI Credits': 'AI 算力额度不足',
        'Purchase Credits': '购买额度',
        'Model quota reached': '已达模型配额上限',
        'Select another model': '选择其他模型',
        'Baseline model quota reached': '已达基准模型配额上限',
        'Enable Overages': '启用超额用量',
        'No Models Available': '没有可用模型',
        'Select Model to Send Message': '选择模型以发送消息',
        'Global Permission Settings': '全局权限设置',
        'Click to copy URL': '点击复制链接',
        'Could not create project': '无法创建项目',
        'Workspace setup warning': '工作区配置提醒',
        'Custom agents are not available in Best of N mode.': '自定义智能体在多路优选模式下不可用。',
        'Failed to start Best of N mode': '启动多路优选模式失败',
        'Failed to start conversation': '启动对话失败',
        'Failed to proceed': '继续执行失败',
        'Failed to continue': '继续失败',
        'Failed to create worktree': '创建工作树失败',
        'Failed to create CitC clone workspace': '创建 CitC 克隆工作区失败',
        'Configure Worktree Branches': '配置工作树分支',
        'New worktree': '新建工作树',
        'New Worktree': '新建工作树',
        'Configure Branches': '配置分支',
        'Disabled. Open the plugin page to finish setup.': '已禁用。打开插件页面完成配置。',
        'Copy full URL to clipboard': '复制完整 URL 到剪贴板',
        'Copy Link': '复制链接',
        'Table options': '表格选项',
        'Inline Widget': '行内小组件',
        'Manifest Changes': '清单更改',
        'Uncommitted': '未提交',
        'Branch': '分支',
        'Telemetry is disabled in Settings': '遥测已在设置中禁用',
        'Run in your current workspace': '在当前工作区中运行',
        'Run in a new worktree': '在新建工作树中运行',
        'CitC Clone': 'CitC 克隆',
        'Clone current workspace into a new independent workspace': '将当前工作区克隆为一个新的独立工作区',
        'Chief of Staff voice mode is active': '幕僚长语音模式已激活',
        'Screen Recording': '屏幕录制',
        'Mention': '提及',
        'Console logs': '控制台日志',
        'Ask a quick question without interrupting the main conversation.': '快速提问，不打断主对话流程。',
        'Failed to stop agent': '停止智能体失败',
        'Ask every time': '每次都询问',
        'Copy File Path': '复制文件路径',
        'Copy File Name': '复制文件名',
        'Cancel All Tasks': '取消所有任务',
        'Stop All Subagents': '停止所有子智能体',
        'Export Artifact': '导出产物',
        'Open in new window': '在新窗口中打开',
        'Antigravity Interactive HTML': 'Antigravity 交互式 HTML',
        'Find': '查找',
        'Open File': '打开文件',
        'Preview': '预览',
        'Search tabs, files, plugins, subagents, artifacts, tasks...': '搜索标签、文件、插件、子智能体、产物、任务...',
        'Close tab': '关闭标签页',
        'Close other tabs': '关闭其他标签页',
        'Close tabs to the right': '关闭右侧标签页',
        'Recent files': '最近文件',
        'Search file contents...': '搜索文件内容...',
        'See all': '查看全部',
        'Search for commands...': '搜索命令...',
        'Search for conversations...': '搜索对话...',
        'Search projects...': '搜索项目...',
        'Failed to create workspace.': '创建工作区失败。',
        'Add recent remote workspace': '添加最近的远程工作区',
        'Administrator access (UAC)': '管理员权限 (UAC)',
        'Remove From Split': '从分栏中移除',
        'View Debug': '查看调试信息',
        'Share Conversation (Preview)': '分享对话（预览）',
        'Conversation Archived': '对话已归档',
        'Failed to rename conversation': '重命名对话失败',
        'Failed to delete conversation': '删除对话失败',
        'Failed to stop conversation': '停止对话失败',
        'Delete Permanently': '永久删除',
        'Stop': '停止',
        'No conversations found': '未找到相关对话',
        'Gemini Enterprise': 'Gemini 企业版',
        'Pay as you go': '按用量计费',
        'Use theme to be imported with settings': '使用随设置导入的主题',
        'Managed by Enterprise Gateway': '由企业网关托管',
        'Not Signed In': '未登录',
        'App version': '应用版本',
        'Remote Control link': '远程控制链接',
        'Local Windows environment': '本地 Windows 环境',
        'Configure the agent': '配置智能体',
        'Search flags': '搜索功能开关',
        'No matching flags': '未找到匹配的开关',
        'Electron (Desktop)': 'Electron（桌面端）',
        'Electron (Gemini App)': 'Electron（Gemini 应用）',
        'Electron (Android Desktop)': 'Electron（安卓桌面）',
        'Web (desktop)': 'Web（桌面网页）',
        'Web (desktop, PWA)': 'Web（桌面 PWA）',
        'Web (desktop, remote control)': 'Web（桌面远程控制）',
        'Web (mobile)': 'Web（手机网页）',
        'Override feature environment': '覆盖特性运行环境',
        'Operating System': '操作系统',
        'Simulate running on a different OS.': '模拟在不同的操作系统上运行。',
        'Host Environment': '宿主环境',
        'Simulate running as a different binary (Hub or the IDE/editor).': '模拟以不同程序运行（Hub 或 IDE/编辑器）。',
        'User Type': '用户类型',
        'Simulate a different user cohort (Google, External, Enterprise).': '模拟不同用户群体（谷歌内部、外部用户、企业用户）。',
        'Workspace URI query parameter': '工作区 URI 查询参数',
        'Select or enter a workspace URI': '选择或输入工作区 URI',
        'Developer': '开发者',
        'Editor Settings': '编辑器设置',
        'Configure editor-specific behaviors and shortcuts.': '配置编辑器专有的行为与快捷键。',
        'Marketplace Item URL': '插件市场项目 URL',
        'Marketplace Gallery URL': '插件市场主页 URL',
        'Selection Actions': '选区操作',
        'UI Actions': '界面操作',
        'Regroup Google3 Chats': '重新整理 Google3 对话',
        'Manage your notification preferences.': '管理你的通知偏好。',
        'Layout Controls': '布局控制',
        'Choose the experience that fits how you work.': '选择适合你工作方式的界面体验。',
        'Tab': 'Tab 键',
        'Configure tab completion, suggestions, and navigation behavior.': '配置 Tab 补全、建议与导航行为。',
        'Configure workspace-specific permissions, resources, and customizations.': '配置当前工作区专有的权限、资源和自定义项。',
        'Workspace File Access': '工作区文件访问',
        'Paths the agent can read inside this workspace.': '智能体在此工作区中可读取的路径。',
        'Paths the agent can modify inside this workspace.': '智能体在此工作区中可修改的路径。',
        'Workspace Command Access': '工作区命令访问',
        'Terminal commands the agent can execute in this workspace.': '智能体在此工作区中可执行的终端命令。',
        'Commands the agent can run outside the sandbox in this workspace.': '智能体在此工作区中可在沙盒外运行的命令。',
        'Workspace Web Access': '工作区网络访问',
        'URLs the agent can read or open in this workspace.': '智能体在此工作区中可读取或打开的 URL。',
        'URLs the agent can actuate on in this workspace.': '智能体在此工作区中可操作的 URL。',
        'Organization Allowed Domains (Read-Only)': '组织允许的域名（只读）',
        'Plan Review Policy': '方案审查策略',
        'Global Permissions': '全局权限',
        'Permission Settings': '权限设置',
        'Local Permissions': '本地权限',
        'Permissions': '权限',
        'When enabled, sandboxed commands are allowed to make network requests.': '启用后，沙盒中的命令被允许发起网络请求。',
        'Allows the agent to access files outside of your current workspace.': '允许智能体访问当前工作区之外的文件。',
        'Open files in the background if Agent creates or edits them': '当智能体创建或修改文件时在后台静默打开',
        'Open Agent panel on window reload': '窗口重新加载时自动打开智能体面板',
        'Paths the agent can read.': '智能体可以读取的路径。',
        'Paths the agent can modify.': '智能体可以修改的路径。',
        'Terminal commands the agent can execute.': '智能体可以执行的终端命令。',
        'Commands the agent can run outside the sandbox.': '智能体可在沙盒外运行的命令。',
        'URLs the agent can read or open in the browser.': '智能体在浏览器中可读取或打开的 URL。',
        'URLs the agent can actuate on using the browser.': '智能体使用浏览器时可操作的 URL。',
        'Workspace Creation': '工作区创建',
        'Best of N': '多路优选 (Best of N)',
        'All tools (*)': '所有工具 (*)',
        'Hook will trigger if any tool is executed.': '执行任意工具时都将触发钩子。',
        'Delete Hook': '删除钩子',
        'Add Hook Card': '添加钩子卡片',
        'Delete Handler': '删除处理器',
        'New hook name': '新钩子名称',
        'Manage Skills': '管理技能',
        'Refresh skills paths': '刷新技能路径',
        'Skill Custom Paths': '技能自定义路径',
        'Enter directory path...': '输入目录路径...',
        'Configure hooks that run on agent lifecycle events.': '配置在智能体生命周期事件中运行的钩子。',
        'Creating Cloud Project': '正在创建云项目',
        'Creating Chat Bot': '正在创建聊天机器人',
        'Installing Chat Bot': '正在安装聊天机器人',
        'Creating Sidecar': '正在创建 Sidecar',
        'Completed': '已完成',
        'Setup': '安装设置',
        'Bot Name': '机器人名称',
        'Enter bot name (optional)': '输入机器人名称（可选）',
        'Avatar URL': '头像 URL',
        'Enter avatar URL (optional)': '输入头像 URL（可选）',
        'Paste code here': '在此粘贴代码',
        'Enable Chat': '启用聊天',
        'CitC Workspace Type': 'CitC 工作区类型',
        'Filter repositories...': '筛选仓库...',
        'Open folder': '打开文件夹',
        'Failed to save project': '保存项目失败',
        'Google3 Configuration': 'Google3 配置',
        'Danger Zone': '危险区域',
        'Trajectory Debug View': '轨迹调试视图',
        'Command Center': '命令中心',
        'Close Settings': '关闭设置',
        'Rename Conversation': '重命名对话',
        'Conversation name': '对话名称',
        'Open side-by-side view': '打开双栏并排视图',
        'Review pending conversations': '审查挂起的对话',
        'Address CLs needing attention': '处理需要关注的变更列表 (CL)',
        'Generate personalized rules': '生成个性化规则',
        'Discover helpful skills & plugins': '发现实用的技能与插件',
        'Conversation copied as Markdown to clipboard': '对话内容已作为 Markdown 复制到剪贴板',
        'Close split view and go to forked conversation': '关闭分栏视图并跳转到分叉后的对话',
        'New Agent Script': '新建智能体脚本',
        'Search GoB repositories...': '搜索 GoB 仓库...',
        'Enter project name...': '输入项目名称...',
        'Unmount workspace': '卸载工作区',
        'Delete workspace': '删除工作区',
        'Delete ABFS Workspace': '删除 ABFS 工作区',
        'Group Actions': '分组操作',
        'Google3 projects are deprecated. Learn more': 'Google3 项目已弃用。了解更多',
        'Failed to archive workspace': '归档工作区失败',
        'Workspace archived successfully': '工作区归档成功',
        'Rename Group': '重命名分组',
        'No links': '暂无链接',
        'Clear': '清除',
        'Sent to Chief of Staff': '已发送至幕僚长',
        'Chief of Staff voice message failed': '幕僚长语音消息发送失败',
        'Chief of Staff voice mode stopped': '幕僚长语音模式已停止',
        'Dismiss service announcement': '忽略服务公告',
        'About': '关于',
        'Toggle Fullscreen': '切换全屏',
        'Prompt to run when triggered...': '触发时执行的提示词...',
        'Failed to create automation.': '创建自动化任务失败。',
        'New Automation': '新建自动化',
        'Prompt to execute on schedule...': '定时执行的提示词...',
        'Type': '类型',
        'Command': '命令',
        'Uptime': '运行时间',
        'Open project settings': '打开项目设置',
        'Workspace CL Status': '工作区 CL 状态',
        'Updates to your sidebar': '侧边栏更新',
        'Current workspace': '当前工作区',
        'Archive Workspace': '归档工作区',
        'Settings Unavailable': '设置不可用',
        'Copy this subtree JSON': '复制此子树 JSON',
        'Copy raw string value': '复制原始字符串',
        'Copy thinking': '复制思考过程',
        'Copy output': '复制输出',
        'Copy section content': '复制小节内容',
        'Copy description': '复制描述',
        'Copy schema JSON': '复制 Schema JSON',
        'Copy trajectory ID': '复制轨迹 ID',
        'System Prompt': '系统提示词 (System Prompt)',
        'Execution ID': '执行 ID',
        'Execution Metadata': '执行元数据',
        'Cascade Config': 'Cascade 配置',
        'System Instruction': '系统指令',
        'Generator Metadata': '生成器元数据',
        'Time to First Token (TTFT)': '首字延迟 (TTFT)',
        'Streaming Generation': '流式生成',
        'Tool Call Generation': '工具调用生成',
        'Queue Wait': '排队等待',
        'Tool Execution': '工具执行',
        'Step Type': '步骤类型',
        'Step Details': '步骤详情',
        'No step data available': '暂无步骤数据',
        'Trajectory ID': '轨迹 ID',
        'Open in Trajectory Dashboard': '在轨迹仪表盘中打开',
        'Cascade ID': 'Cascade ID',
        'Trajectory Metadata': '轨迹元数据',
        'No trajectory metadata available': '暂无轨迹元数据',
        'Search steps...': '搜索步骤...',
        'Click to go there, drag to select a range, drag an edge to resize': '点击定位，拖拽选择范围，拖动边缘调整大小',
        'By phase': '按阶段',
        'By step type': '按步骤类型',
        'Zoom out': '缩小',
        'Zoom in': '放大',
        'Fit the whole trajectory': '适应整个轨迹',
        'How long a quiet interval must be before it collapses': '空闲间隔折叠阈值',
        'What the step bars are coloured by': '步骤条着色依据',
        'One lane per kind of step, or one per step type': '按步骤类别或步骤类型单道显示',
        'Double-click to reset panel sizes': '双击重置面板尺寸',
        'Search by name or Cascade ID...': '按名称或 Cascade ID 搜索...',
        'View child subagents': '查看子智能体',
        'Side-by-side layout': '双栏并排布局',
        'Stacked layout': '堆叠布局',
        'Variant Name': '变体名称',
        'Search conversations (by name or Cascade ID)': '搜索对话（按名称或 Cascade ID）',
        'Search across files...': '跨文件搜索...',
        'Installed Skills': '已安装技能',
        'Copy email address': '复制邮箱地址',
        'Reset State': '重置状态',
        'Notification Preferences': '通知偏好',
        'Open Preferences': '打开偏好设置',
        'Open Folder (Interactive)': '打开文件夹（交互式）',
        'Got it': '知道了',
        'GitHub Personal Access Token': 'GitHub 个人访问令牌',
        'GitHub Policies': 'GitHub 策略',
        'GitHub Permissions': 'GitHub 权限',
        'Manage fine-grained permissions for GitHub.': '管理 GitHub 的细粒度权限。',
        'Determines the markup language of the output.': '决定输出结果的标记语言。',
        'Target text in PDF...': '在 PDF 中定位文本...',
        'Write a comment...': '写下评论...',
        'Toggle Thumbnails': '切换缩略图',
        'Download PDF': '下载 PDF',
        'Previous Page': '上一页',
        'Next Page': '下一页',
        'Previous match': '上一个匹配项',
        'Next match': '下一个匹配项',
        'Clear Search': '清除搜索',
        'Open Search': '打开搜索',
        'Zoom out (-)': '缩小 (-)',
        'Reset zoom (0)': '重置缩放 (0)',
        'Zoom in (+)': '放大 (+)',
        'Download SVG': '下载 SVG',
        'Close (Esc)': '关闭 (Esc)',
        'Team of subagents to do long running work': '由子智能体团队协作执行耗时较长的任务',
        'Sunday': '星期日',
        'Monday': '星期一',
        'Tuesday': '星期二',
        'Wednesday': '星期三',
        'Thursday': '星期四',
        'Friday': '星期五',
        'Saturday': '星期六',
        // ==== 自动补充词条（2026-10-28 44.5.1 设置/浏览器/用量等）====
        "Sound": "声音",
        "Volume": "音量",
        "Chime volume": "提示音音量",
        "Built-in Browser": "内置浏览器",
        "External Browser": "外部浏览器",
        "Open Links In": "链接打开方式",
        "Enable agent sounds": "启用智能体提示音",
        "Enable agent notifications": "启用智能体通知",
        "Show system notifications when your action is needed or the agent finishes.": "当需要你操作或智能体完成时显示系统通知。",
        "Play a sound when your action is needed or the agent finishes.": "当需要你操作或智能体完成时播放提示音。",
        "Set the volume of agent sounds.": "设置智能体提示音的音量。",
        "Choose where links open by default when clicked.": "选择点击链接时默认的打开位置。",
        "Configure link opening and built-in browser preferences.": "配置链接打开方式与内置浏览器偏好。",
        "Built-in Browser Requires Isolated Web App (IWA)": "内置浏览器需要隔离式 Web 应用 (IWA)",
        "Install and launch the Jetski Isolated Web App in three steps to embed pages with full browser capabilities.": "只需三步即可安装并启动 Jetski 隔离式 Web 应用，以完整浏览器能力嵌入网页。",
        "Antigravity would like to use the browser.": "Antigravity 希望使用浏览器。",
        "Open in External Browser": "在外部浏览器中打开",
        "Open Link in External Browser": "在外部浏览器中打开链接",
        "Open Link in New Tab": "在新标签页中打开链接",
        "Open Conversation in New Tab": "在新标签页中打开对话",
        "Open Image in New Tab": "在新标签页中打开图片",
        "Copy Image Address": "复制图片地址",
        "Copy Link Address": "复制链接地址",
        "Copy Message": "复制消息",
        "Open in New Window": "在新窗口中打开",
        "Open in Side Panel": "在侧边面板中打开",
        "Open in side pane": "在侧边窗格中打开",
        "Open in": "打开方式",
        "Open Tabs": "已打开的标签页",
        "Close Other Tabs": "关闭其他标签页",
        "Close Tabs to the Right": "关闭右侧标签页",
        "Reopen Closed Tab": "重新打开已关闭的标签页",
        "View site information": "查看网站信息",
        "Connection is secure": "连接安全",
        "Your information (for example, passwords or credit card numbers) is private when it is sent to this site.": "你的信息（例如密码或信用卡号）在发送到此网站时是私密的。",
        "View network request": "查看网络请求",
        "View network requests": "查看网络请求",
        "No browser pages open": "没有打开的浏览器页面",
        "No internet. Agent features may not work.": "无网络连接。智能体功能可能无法使用。",
        "Browser actions": "浏览器操作",
        "Browser Subagent": "浏览器子智能体",
        "Capture Console Logs": "捕获控制台日志",
        "Capture Screenshot": "截取屏幕截图",
        "Browser tools (browser_.*)": "浏览器工具 (browser_.*)",
        "Weekly limit": "每周额度",
        "5h limit": "5 小时额度",
        "Notice": "提示",
        "AI Credits Used to Generate Response": "生成回复消耗的 AI 额度",
        "Select Billing Model": "选择计费模式",
        "Pay As You Go": "按量付费",
        "Pricing is based on public API pricing": "定价基于公开 API 价格",
        "Account connected.": "账户已连接。",
        "Apps connected to your account": "已连接到账户的应用",
        "Connect an account so the agent can use this app.": "连接账户以便智能体使用此应用。",
        "Continue with Google": "使用 Google 继续",
        "Continue with Google Cloud": "使用 Google Cloud 继续",
        "Business Account Sign In": "企业账户登录",
        "Sign in required": "需要登录",
        "Sign in required.": "需要登录。",
        "Sign-in required": "需要登录",
        "Log in to use the agent": "登录以使用智能体",
        "To use the agent, please login": "要使用智能体，请登录",
        "Log back in": "重新登录",
        "Authentication Required": "需要身份验证",
        "Authentication expired": "身份验证已过期",
        "Authorization Required": "需要授权",
        "Authenticating...": "正在验证...",
        "Set up authentication": "设置身份验证",
        "Go to Accounts": "前往账户",
        "Sign in to finish setting up this plugin.": "登录以完成此插件的设置。",
        "Enable the plugin to sign in.": "启用插件以登录。",
        "There was an error with your authentication. To log in, click": "你的身份验证出现错误。要登录，请点击",
        "Your session has expired. Please log back in to continue.": "你的会话已过期，请重新登录以继续。",
        "There was an unexpected issue setting up your account.": "设置你的账户时出现意外问题。",
        "We'll tailor the experience to you.": "我们将为你量身定制体验。",
        "Use Google Sans instead of the default Inter typeface": "使用 Google Sans 替代默认的 Inter 字体",
        "Use the experimental visual themes instead of standard presets": "使用实验性视觉主题替代标准预设",
        "Enable New Themes": "启用新主题",
        "Themes": "主题",
        "Google Sans": "Google Sans",
        "Contrast": "对比度",
        "Permission Details": "权限详情",
        "Permission": "权限",
        "Read access": "读取权限",
        "Read files": "读取文件",
        "Write files": "写入文件",
        "Read URL rejected": "读取 URL 被拒绝",
        "Read resource:": "读取资源：",
        "List resources:": "列出资源：",
        "Denied Sites": "已拒绝的网站",
        "Open allowlist": "打开允许列表",
        "Access rules": "访问规则",
        "Execution Identity": "执行身份",
        "Unsandboxed commands": "非沙箱命令",
        "Confirm the command is safe to run outside of the sandbox with full network and disk access.": "确认该命令可在沙箱外以完整网络和磁盘访问权限安全运行。",
        "Allow creating issues and grant access to specific issues.": "允许创建议题并授予特定议题的访问权限。",
        "Allow opening pull requests and grant access to specific PRs.": "允许发起拉取请求并授予特定 PR 的访问权限。",
        "Allow reading workflow runs (list, view, watch) across the whole repository.": "允许读取整个仓库的工作流运行（列出、查看、监视）。",
        "Grant create, update, or delete access to specific branches.": "授予对特定分支的创建、更新或删除权限。",
        "Grant read access to workflow runs and allow dispatching workflows on specific files and refs.": "授予工作流运行的读取权限，并允许对特定文件和引用触发工作流。",
        "Read access to code, refs, commits, and other repository contents.": "对代码、引用、提交及其他仓库内容的读取权限。",
        "Enable fine-grained GitHub permissions and define the org, repository, and resource-level access the agent is allowed to use.": "启用细粒度 GitHub 权限，并定义智能体可使用的组织、仓库和资源级访问权限。",
        "These MCP allowlist rules are enforced by your organization's administrator.": "这些 MCP 允许列表规则由你所在组织的管理员强制执行。",
        "These allowed domain rules are set by your organization's administrator and cannot be removed.": "这些允许的域名规则由你所在组织的管理员设置，无法移除。",
        "By default, agents work in folders you choose and ask before sensitive changes. Adjust this anytime in Settings.": "默认情况下，智能体在你选择的文件夹中工作，并在敏感更改前询问你。可随时在设置中调整。",
        "Autonomous mode active: the agent works independently and does not ask questions or request new permissions.": "自主模式已启用：智能体独立工作，不提问也不申请新权限。",
        "Conversation Log": "对话记录",
        "Session Summary": "会话摘要",
        "Move Conversation Up": "上移对话",
        "Move Conversation Down": "下移对话",
        "Mark All as Read": "全部标为已读",
        "Mark This Conversation as Read": "将此对话标为已读",
        "Mark This Conversation as Unread": "将此对话标为未读",
        "Couldn't mark conversations as read": "无法将对话标为已读",
        "Only Archived": "仅已归档",
        "Only Unread": "仅未读",
        "Archived Only": "仅已归档",
        "New conversation": "新建对话",
        "Conversation 1": "对话 1",
        "Conversation 2": "对话 2",
        "Conversation 3": "对话 3",
        "Fork conversation in this folder": "在此文件夹中复刻对话",
        "Fork in New Workspace": "在新工作区中复刻",
        "Fork in Shared Workspace": "在共享工作区中复刻",
        "This conversation is also open in another app. Sending messages from both may cause conflicts.": "此对话也在另一个应用中打开。同时发送消息可能导致冲突。",
        "This conversation is not on disk. Delete it to remove it from your sidebar.": "此对话不在磁盘上。删除即可从侧边栏移除。",
        "The conversation could not be loaded because its data was not found.": "无法加载此对话，因为未找到其数据。",
        "Side Question:": "侧边提问：",
        "Sent Message": "已发送消息",
        "Sent!": "已发送！",
        "Cancel Sending Message": "取消发送消息",
        "Cancel Generation": "取消生成",
        "Waiting for your input": "等待你的输入",
        "Needs Attention": "需要关注",
        "Needs attention": "需要关注",
        "Blocked, needs input": "已阻塞，需要输入",
        "Subagent ended": "子智能体已结束",
        "Stop subagent": "停止子智能体",
        "Pick a suggestion below to get started, or ask me anything.": "选择下方建议开始，或直接向我提问。",
        "Here's how you and your agents work together": "这是你和智能体协作的方式",
        "Getting started with Google Antigravity": "Google Antigravity 入门",
        "Customizations & Skills": "自定义与技能",
        "Active Skills": "已启用技能",
        "Skills are instructions that extend what Agent can do.": "技能是扩展智能体能力的指令。",
        "Search and discover customizations to extend your Agent's capabilities.": "搜索并发现自定义项，以扩展智能体的能力。",
        "Find plugins - bundles of skills, agents, MCP servers, UI extensions and more, and install them in one click.": "查找插件——技能、智能体、MCP 服务器、UI 扩展等的集合，一键安装。",
        "Explore other marketplace customizations": "浏览市场上的其他自定义项",
        "Each plugin can be managed on its own.": "每个插件都可独立管理。",
        "Replacing removes the currently installed plugin and installs the new one in its place.": "替换会移除当前已安装的插件，并安装新的插件替代它。",
        "Plugin update required": "需要更新插件",
        "Plugin Operation Error:": "插件操作错误：",
        "Encountered an error while running the plugin.": "运行插件时遇到错误。",
        "This plugin requires authentication before the agent can use its tools.": "此插件需要身份验证后智能体才能使用其工具。",
        "This extension has no declared permissions requiring user input.": "此扩展没有需要用户输入的已声明权限。",
        "This bundle has no plugins yet.": "此包还没有插件。",
        "No Plugins Available": "无可用插件",
        "No extensions available": "无可用扩展",
        "No skills available": "无可用技能",
        "No skills loaded.": "未加载技能。",
        "No customizations match your search.": "没有符合你搜索的自定义项。",
        "No matching customizations found.": "未找到匹配的自定义项。",
        "No matching plugins found.": "未找到匹配的插件。",
        "There are no customizations enabled.": "未启用任何自定义项。",
        "Loading installed plugins...": "正在加载已安装的插件...",
        "Loading available plugins...": "正在加载可用插件...",
        "Loading customizations...": "正在加载自定义项...",
        "Loading skills...": "正在加载技能...",
        "Loading plugins...": "正在加载插件...",
        "Loading models...": "正在加载模型...",
        "Loading MCP servers...": "正在加载 MCP 服务器...",
        "Loading conversations...": "正在加载对话...",
        "Loading hooks...": "正在加载钩子...",
        "Loading worktrees...": "正在加载工作树...",
        "Loading licenses...": "正在加载许可证...",
        "Loading trajectory...": "正在加载轨迹...",
        "Loading subagent...": "正在加载子智能体...",
        "Loading events...": "正在加载事件...",
        "Loading apps...": "正在加载应用...",
        "Loading media...": "正在加载媒体...",
        "Loading logs...": "正在加载日志...",
        "Loading Browser recording...": "正在加载浏览器录制...",
        "Agent Hooks Configuration": "智能体钩子配置",
        "Hook will only trigger if the tool name matches run_command or view_file.": "仅当工具名匹配 run_command 或 view_file 时钩子才会触发。",
        "Hook will only trigger if the tool name matches run_command.": "仅当工具名匹配 run_command 时钩子才会触发。",
        "Hook will only trigger if the tool name starts with browser_.": "仅当工具名以 browser_ 开头时钩子才会触发。",
        "Enter the configuration values this MCP server needs. Saving restarts the server with them.": "输入此 MCP 服务器所需的配置值。保存后会以这些值重启服务器。",
        "Search for MCP servers to add to your configuration": "搜索要添加到配置中的 MCP 服务器",
        "MCP Authentication Error:": "MCP 身份验证错误：",
        "MCP Restart Error:": "MCP 重启错误：",
        "MCP tools": "MCP 工具",
        "Context Providers": "上下文提供方",
        "Agent Script Command Configuration": "智能体脚本命令配置",
        "Agent Market Search Results": "智能体市场搜索结果",
        "Searching Agent Market...": "正在搜索智能体市场...",
        "This project uses Firebase. Do you want to download the Firebase skill?": "此项目使用 Firebase。是否下载 Firebase 技能？",
        "Workspace Name": "工作区名称",
        "Workspace URI Switcher": "工作区 URI 切换器",
        "Select workspace": "选择工作区",
        "Select Environment": "选择环境",
        "Select License": "选择许可证",
        "Select your license": "选择你的许可证",
        "Select Project": "选择项目",
        "Choose a License": "选择许可证",
        "Choose Region": "选择区域",
        "Enter Google Cloud Project Details": "输入 Google Cloud 项目详情",
        "Provide Google Cloud Project": "提供 Google Cloud 项目",
        "Use Google Cloud project instead": "改用 Google Cloud 项目",
        "Your Antigravity use will be associated with provided project.": "你的 Antigravity 使用将与所提供的项目关联。",
        "New Remote Project": "新建远程项目",
        "New Workspace (Do not use for PII/NTK data)": "新建工作区（请勿用于 PII/NTK 数据）",
        "CitC Workspace (Do not use for PII/NTK data)": "CitC 工作区（请勿用于 PII/NTK 数据）",
        "Cog Workspace (Do not use for PII/NTK data)": "Cog 工作区（请勿用于 PII/NTK 数据）",
        "Enter workspace name (e.g., my-cog-feature)": "输入工作区名称（例如 my-cog-feature）",
        "Enter workspace name (e.g., my-feature)": "输入工作区名称（例如 my-feature）",
        "Google3 projects are being deprecated. Select a CitC workspace instead.": "Google3 项目即将弃用。请改用 CitC 工作区。",
        "Google3 projects are deprecated": "Google3 项目已弃用",
        "Google3 chats will be regrouped into their workspaces in the sidebar.": "Google3 对话将在侧边栏中重新归入其工作区。",
        "New conversations in CitC will be grouped by distinct workspace.": "CitC 中的新对话将按不同工作区分组。",
        "New Fig Workspace": "新建 Fig 工作区",
        "New Fig Share?": "新建 Fig 共享？",
        "Failed to open created workspace": "无法打开已创建的工作区",
        "Failed to create cloud project": "无法创建云项目",
        "Could not create Cog workspace": "无法创建 Cog 工作区",
        "Remount workspace": "重新挂载工作区",
        "Keeps working in this folder. Nothing is copied.": "继续在此文件夹中工作，不会复制任何内容。",
        "Local Checkout": "本地检出",
        "Remote branches": "远程分支",
        "Previous Worktrees": "之前的工作树",
        "No previous worktrees": "没有之前的工作树",
        "No workspaces found": "未找到工作区",
        "No workspaces open.": "没有打开的工作区。",
        "No projects created": "尚未创建项目",
        "No project selected or project management not available.": "未选择项目，或项目管理不可用。",
        "Show temporary and forked workspaces": "显示临时和复刻的工作区",
        "Files and resources in cloud workspaces": "云工作区中的文件和资源",
        "Stored and mounted in your cloud environment": "存储并挂载在你的云环境中",
        "Uploaded files and connected resources are mounted in your cloud environment.": "上传的文件和已连接的资源会挂载到你的云环境中。",
        "Runs in the cloud": "在云端运行",
        "Runs on this computer": "在本机运行",
        "Runs on": "运行于",
        "Remote Control Instances": "远程控制实例",
        "Continue your work from another device with Remote Control. Scan the QR code or open the link below.": "通过远程控制从另一台设备继续你的工作。扫描二维码或打开下方链接。",
        "The app is currently connected to a WSL distro. Reopening locally relaunches it directly on Windows.": "应用当前连接到 WSL 发行版。在本地重新打开会直接在 Windows 上重新启动它。",
        "Run the app against a Linux environment. Connecting relaunches the app into the selected WSL distro.": "在 Linux 环境中运行应用。连接后会将应用重启进入所选的 WSL 发行版。",
        "Windows Subsystem for Linux": "适用于 Linux 的 Windows 子系统",
        "Remote Agents Data": "远程智能体数据",
        "Delete All Remote Agents Data": "删除所有远程智能体数据",
        "Delete All Remote Agents Data?": "删除所有远程智能体数据？",
        "Manage and delete your data anytime": "随时管理和删除你的数据",
        "Couldn't delete your data. Try again.": "无法删除你的数据，请重试。",
        "Developer-only tools. These settings are stored locally in this browser and do not affect other users.": "仅开发者工具。这些设置存储在此浏览器本地，不影响其他用户。",
        "These settings can only be changed on the computer running the app, not from a remote session.": "这些设置只能在运行应用的电脑上更改，无法在远程会话中更改。",
        "Add Shortcut": "添加快捷方式",
        "Edit Shortcut": "编辑快捷方式",
        "Remove Shortcut": "移除快捷方式",
        "Add screenshot to conversation": "向对话添加截图",
        "Upload Files": "上传文件",
        "Download File": "下载文件",
        "Paste auth code": "粘贴授权码",
        "Paste code": "粘贴代码",
        "Press keys...": "按下按键...",
        "Send feedback as": "反馈身份",
        "Reset All to Defaults": "全部重置为默认值",
        "Reset to Default": "重置为默认值",
        "Remove from Split": "从分屏中移除",
        "Toggle Maximize Auxiliary Pane": "切换最大化辅助面板",
        "Mute Live Chat Mic": "静音实时聊天麦克风",
        "Kill Terminal": "终止终端",
        "New Terminal": "新建终端",
        "Creating terminal...": "正在创建终端...",
        "Background Commands": "后台命令",
        "Background Task Output": "后台任务输出",
        "No background commands": "没有后台命令",
        "Task Logs": "任务日志",
        "Task not found": "未找到任务",
        "Tool Calls": "工具调用",
        "Tool Output": "工具输出",
        "Tool arguments": "工具参数",
        "Code Change Summary": "代码变更摘要",
        "Modified files:": "已修改的文件：",
        "Code search is not available.": "代码搜索不可用。",
        "File not found": "未找到文件",
        "File explorer": "文件浏览器",
        "Full output written to": "完整输出写入",
        "Found references to": "找到对以下内容的引用",
        "No results": "无结果",
        "No results found.": "未找到结果。",
        "No matching results": "无匹配结果",
        "No files or folders found": "未找到文件或文件夹",
        "No repositories found. Type to enter a custom path.": "未找到仓库。输入以填写自定义路径。",
        "No resources available": "无可用资源",
        "Filter resources...": "筛选资源...",
        "Not available": "不可用",
        "Unknown error": "未知错误",
        "Error Details:": "错误详情：",
        "Error:": "错误：",
        "Error Loading Models": "加载模型出错",
        "Error fetching MCP prompt": "获取 MCP 提示时出错",
        "Error loading Browser recording": "加载浏览器录制时出错",
        "Error rendering playback": "渲染回放时出错",
        "Failed to load resources": "无法加载资源",
        "Failed to load comments": "无法加载评论",
        "Failed to get annotations": "无法获取标注",
        "Failed to get all annotations": "无法获取全部标注",
        "Failed to fetch diffs": "无法获取差异",
        "Failed to render diagram": "无法渲染图表",
        "Failed to render math": "无法渲染数学公式",
        "Failed to revert conversation": "无法还原对话",
        "Failed to refresh credentials": "无法刷新凭据",
        "Failed to inspect license for this project": "无法检查此项目的许可证",
        "Failed to parse settings. Fix and restart.": "无法解析设置。请修复后重启。",
        "Failed to upload HTML artifact to Drive": "无法将 HTML 制品上传到云端硬盘",
        "Failed to validate the saved GitHub token.": "无法验证已保存的 GitHub 令牌。",
        "Render failed": "渲染失败",
        "Rendering playback": "正在渲染回放",
        "Playback available": "回放可用",
        "Preview unavailable": "预览不可用",
        "Preview is not available for this file type.": "此文件类型不支持预览。",
        "Inline PDF preview is not available in this environment.": "此环境不支持内联 PDF 预览。",
        "Invalid Media": "媒体无效",
        "Binary file not shown": "未显示二进制文件",
        "Some non-image binary content was truncated.": "部分非图像二进制内容已被截断。",
        "Image rendering blocked (strict mode enabled)": "图像渲染被阻止（已启用严格模式）",
        "An unexpected error occurred during creation": "创建过程中发生意外错误",
        "An error occurred while submitting your feedback. Please try again.": "提交反馈时出错，请重试。",
        "Thank you! Your feedback has been submitted successfully.": "谢谢！你的反馈已成功提交。",
        "Too many requests, please try again in a bit!": "请求过多，请稍后再试！",
        "Your changes were not saved. Please try again.": "你的更改未保存，请重试。",
        "Method not found": "未找到方法",
        "User cancelled agent execution.": "用户取消了智能体执行。",
        "Aborted due to condition callback returning false.": "因条件回调返回 false 而中止。",
        "Best of N mode is not available": "Best of N 模式不可用",
        "No model specified for Battle Mode, falling back to use current selected model": "未为对战模式指定模型，将回退使用当前所选模型",
        "No models are available for your current project or account. Please check your project settings and IAM permissions.": "当前项目或账户没有可用模型。请检查你的项目设置和 IAM 权限。",
        "No models available": "无可用模型",
        "Select a model using the model selector in the input box": "使用输入框中的模型选择器选择模型",
        "Model Label": "模型标签",
        "Model URL": "模型 URL",
        "Models Tab": "模型标签页",
        "Model Summarization Failed": "模型摘要失败",
        "Custom Flags": "自定义标志",
        "Feature Environment Override": "功能环境覆盖",
        "When enabled, the values below replace the auto-detected OS, host, and user type used for feature gating.": "启用后，下方数值将替代用于功能门控的自动检测操作系统、主机和用户类型。",
        "When enabled, the agent will include default customizations, including default skills.": "启用后，智能体将包含默认自定义项，包括默认技能。",
        "Simulate a different host (Electron, desktop or mobile Web, Extension, remote control, or installed PWA).": "模拟不同的宿主（Electron、桌面或移动网页、扩展、远程控制或已安装的 PWA）。",
        "WIF Config": "WIF 配置",
        "Host Endpoint": "主机端点",
        "Voice": "语音",
        "Voice Mode": "语音模式",
        "Voice engine": "语音引擎",
        "How loud Jetski's voice is.": "Jetski 语音的音量大小。",
        "The voice Jetski speaks with.": "Jetski 说话使用的音色。",
        "Input device for voice mode.": "语音模式的输入设备。",
        "Type any voice server address.": "输入任意语音服务器地址。",
        "Voice recording is unavailable while the Chief of Staff mic is on": "当幕僚长麦克风开启时无法录音",
        "Unable to resolve audio source URL": "无法解析音频源 URL",
        "Talker + Narrator (relay)": "讲述者 + 旁白（中继）",
        "One live model talks and hands real lookups to Jetski.": "一个实时模型负责对话，并将真实查询交给 Jetski。",
        "Trigger multiple response variants from the same prompt.": "从同一提示触发多个回复变体。",
        "Number of responses": "回复数量",
        "Pairs (arm order may be shuffled)": "配对（分支顺序可能被打乱）",
        "Pick order sets the harness for each response; the rest run control.": "选择顺序决定每个回复的测试框架，其余作为对照。",
        "For Turn": "用于轮次",
        "Harness per Response": "每个回复的测试框架",
        "Knowledge Generation": "知识生成",
        "Document Answers": "文档回答",
        "Image Answers": "图像回答",
        "User Intent": "用户意图",
        "Side Pane UI Available": "侧边窗格 UI 可用",
        "UI view does not exist.": "UI 视图不存在。",
        "Sidebar Updates": "侧边栏更新",
        "Pinned Actions": "固定的操作",
        "Auto Pin": "自动固定",
        "Sort By": "排序方式",
        "Last Used": "最近使用",
        "Recent Events": "最近事件",
        "No events recorded.": "未记录任何事件。",
        "Empty log": "日志为空",
        "Console Telemetry": "控制台遥测",
        "Print telemetry to the console": "将遥测打印到控制台",
        "Enable telemetry in Settings before changing per-conversation telemetry.": "在更改每个对话的遥测前，请先在设置中启用遥测。",
        "New: Per-Conversation Telemetry": "新功能：按对话遥测",
        "Security Notice & Data Use": "安全提示与数据使用",
        "Terms of Service & Data Use": "服务条款与数据使用",
        "Terms and Privacy:": "条款与隐私：",
        "Don't enter corp passwords": "请勿输入公司密码",
        "Don't show this for 2 days": "2 天内不再显示",
        "Drag to select a region to comment": "拖动以选择要评论的区域",
        "Select text in the artifact to add a comment": "在制品中选择文本以添加评论",
        "Artifact Comments": "制品评论",
        "Artifact updated by agent": "制品已由智能体更新",
        "File Comments": "文件评论",
        "File Diff Comments": "文件差异评论",
        "Add them to allow future interactions": "添加它们以允许今后的交互",
        "The Agent attempted to interact with some sites that are not allowlisted": "智能体尝试与一些不在允许列表中的网站交互",
        "The agent was prevented from accessing some sites": "智能体被阻止访问某些网站",
        "View archived in the sidebar (![filter](icon://filter_list) menu).": "在侧边栏中查看已归档（![filter](icon://filter_list) 菜单）。",
        "View could not be opened": "无法打开视图",
        "This chat's environment is paused": "此对话的环境已暂停",
        "This page is going away soon": "此页面即将下线",
        "This may take a few minutes": "这可能需要几分钟",
        "This migration may mess up your settings, chats, and sidebar.": "此迁移可能会打乱你的设置、对话和侧边栏。",
        "Taking longer than usual to load": "加载时间比平时更长",
        "Resume it to load this file.": "恢复它即可加载此文件。",
        "Resume it to open a new terminal. Anything that was running in this one has stopped.": "恢复它以打开新终端。此前在此终端中运行的所有内容都已停止。",
        "We opened a popup for you to authorize adding the bot to your chat. Please copy the code from it and paste it below:": "我们已弹出窗口供你授权将机器人添加到聊天。请从中复制代码并粘贴到下方：",
        "Join the Google Chat space": "加入 Google Chat 空间",
        "Ask questions, report issues, and discuss features": "提问、报告问题并讨论功能",
        "Click to view more": "点击查看更多",
        "Debug bundle uploaded!": "调试包已上传！",
        "Download the bundle manually and share it instead:": "改为手动下载该包并分享：",
        "Change VCS in General settings, under Advanced": "在「通用」设置的「高级」中更改 VCS",
        "VCS used when creating a new workspace, including workspaces generated based off your initial prompt.": "创建新工作区时使用的 VCS，包括基于初始提示生成的工作区。",
        "Optional branch or ref used when creating a new Cog workspace (defaults to main if unset).": "创建新 Cog 工作区时使用的可选分支或引用（未设置时默认为 main）。",
        "A label for this computer when you connect from another device. Changing it reconnects.": "从其他设备连接时用于标识此电脑的标签。更改后会重新连接。",
        "A nickname for identifying this application in the companion website. Changing this will restart the connection.": "在配套网站中标识此应用的昵称。更改后会重启连接。",
        "Default (Mendel)": "默认 (Mendel)",
        "Extension (Cider)": "扩展 (Cider)",
        "Extension (Eclipse)": "扩展 (Eclipse)",
        "Extension (VS Code)": "扩展 (VS Code)",
        "Extension (Visual Studio)": "扩展 (Visual Studio)",
        "Python Script": "Python 脚本",
        "Python Coming Soon": "Python 即将推出",
        "Text attachment": "文本附件",
        "Issued to": "颁发给",
        "Other License": "其他许可证",
        "Currently installed": "当前已安装",
        "Open Jetski Corp": "打开 Jetski Corp",
        "Core AI Systems is hiring!": "核心 AI 系统正在招聘！",
        "Google (internal)": "Google（内部）",
        "Automatically reproduce bugs, trace causes, test fixes.": "自动复现缺陷、追踪原因并验证修复。",
        "Ask about your code or any topic, get clear answers.": "就代码或任何话题提问，获得清晰的回答。",
        "Draft documents, emails, and notes that sound like you.": "起草听起来像你本人风格的文件、邮件和笔记。",
        "Research, writing, and everyday tasks, without code.": "研究、写作和日常任务，无需代码。",
        "Hand off a feature and come back to working code.": "交付一项功能，回来即可获得可用的代码。",
        "Debug and fix": "调试并修复",
        "Build new features": "构建新功能",
        "Build with one agent or a team": "用单个智能体或团队构建",
        "Research anything": "研究任何内容",
        "General work": "通用工作",
        "Write and edit docs": "撰写和编辑文档",
        "Describe what you want. Your agent plans and builds it, and brings in other agents when needed.": "描述你的需求。你的智能体将规划并构建它，并在需要时引入其他智能体。",
        "Comment on the plan before your agent starts, and get a walkthrough when it finishes.": "在智能体开始前对方案发表评论，并在完成后获得讲解。",
        "Review plans and walkthroughs": "审查方案与讲解",
        "Set the rules, define the boundaries.": "制定规则，划定边界。",
        "The full developer experience with code and tooling.": "带代码与工具链的完整开发者体验。",
        "Ask the agent to diagnose and fix this server": "请智能体诊断并修复此服务器",
        "Chief of Staff Dashboard": "幕僚长仪表盘",
        "Chief of Staff canvas": "幕僚长画布",
        "Welcome to your Chief of Staff": "欢迎使用你的幕僚长",
        "Active Tasks & Conversations:": "活跃任务与对话：",
        "New models have been enabled for you!": "已为你启用新模型！",
        "Refreshed credentials for all automations.": "已刷新所有自动化的凭据。",
        "Needs re-auth": "需要重新授权",
        "Needs reconnect": "需要重新连接",
        "Disabled. Open Details to finish setup or enable.": "已禁用。打开「详情」完成设置或启用。",
        "Can't open the Drive link?": "无法打开云端硬盘链接？",
        "Connected Google Drive and GitHub resources": "已连接的 Google 云端硬盘与 GitHub 资源",
        "Install or enable the Google Drive plugin in Customizations to search files with @drive: or paste Drive links": "在「自定义」中安装或启用 Google 云端硬盘插件，以便用 @drive: 搜索文件或粘贴云端硬盘链接",
        "Files modified by the agent in this conversation": "智能体在此对话中修改的文件",
        "The branch was pushed to GitLab.": "分支已推送到 GitLab。",
        "The change was pushed to Gerrit.": "更改已推送到 Gerrit。",
        "The remote shared a link for this push.": "远程为此推送分享了一个链接。",
        "Created a new branch on GitHub.": "已在 GitHub 上创建新分支。",
        "Created a new branch on Origin.": "已在 Origin 上创建新分支。",
        "Pull requests": "拉取请求",
        "Issue creation": "议题创建",
        "Workflow runs": "工作流运行",
        "True changes vs the parent workspace": "与父工作区相比的真实更改",
        "Staged index changes and working tree changes": "已暂存的索引更改与工作树更改",
        "No build files are updated.": "未更新任何构建文件。",
        "Cron expression e.g. 0 */6 * * *": "Cron 表达式，例如 0 */6 * * *",
        "Sends after agent finishes working": "智能体完成工作后发送",
        "Turn on a flag you don't have": "开启你没有的标志",
        "This sidecar runs from a path that is not officially supported. Make sure your code is in a trusted location in google3.": "此 sidecar 从非官方支持的路径运行。请确保你的代码位于 google3 中的可信位置。",
        "Sidecar feature is not available.": "Sidecar 功能不可用。",
        "Jetski Chat": "Jetski 对话",
        "Jetski Chat configuration is not available in the current environment.": "当前环境不支持 Jetski 对话配置。",
        "Jetski and Cider are now more closely integrated:": "Jetski 与 Cider 现已更紧密地集成：",
        "Welcome to Cider with Jetski": "欢迎使用搭载 Jetski 的 Cider",
        "A fast Talker acks; Jetski answers; a Narrator reads it out.": "讲述者快速确认；Jetski 作答；旁白朗读出来。",
        "Flash Lite": "Flash 轻量版",
        "Flash": "Flash",
        // ==== 自动补充词条（2026-10-28 设置描述/面板操作）====
        "Configure global allowed and denied resource permissions.": "配置全局允许与禁止的资源权限。",
        "Configure link opening and side panel preview preferences.": "配置链接打开方式与侧边栏预览偏好。",
        "Modify permissions for file and terminal tools.": "修改文件与终端工具的权限。",
        "Allow Gemini to notify you when the agent needs your attention or completes a task.": "允许 Gemini 在智能体需要你关注或完成任务时通知你。",
        "Choose whether to be notified when the agent needs your attention or completes a task.": "选择是否在智能体需要你关注或完成任务时收到通知。",
        "Choose Jetski's Voice": "选择 Jetski 的语音",
        "Enable Recommended Skills": "启用推荐技能",
        "Enable recommended skills": "启用推荐技能",
        "Enable Sandbox Mode": "启用沙箱模式",
        "Enable Text Selection": "启用文本选择",
        "Enter Fullscreen": "进入全屏",
        "Enter command...": "输入命令...",
        "Enter target...": "输入目标...",
        "Enter your feedback here...": "在此输入你的反馈...",
        "Grant permission": "授予权限",
        "Manage License": "管理许可证",
        "Manage Permissions": "管理权限",
        "Managed by plugin": "由插件管理",
        "Manager Error:": "管理器错误：",
        "Open Antigravity IDE": "打开 Antigravity IDE",
        "Open Browser Setup": "打开浏览器设置",
        "Open IDE": "打开 IDE",
        "Open Project Picker": "打开项目选择器",
        "Open System Browser": "打开系统浏览器",
        "Open Terminal": "打开终端",
        "Open extracted DOM in editor": "在编辑器中打开提取的 DOM",
        "Open in Antigravity IDE": "在 Antigravity IDE 中打开",
        "Open in Cider": "在 Cider 中打开",
        "Open in Critique": "在 Critique 中打开",
        "Open in Hub": "在 Hub 中打开",
        "Open in Jetski IWA": "在 Jetski IWA 中打开",
        "Open in New Tab": "在新标签页中打开",
        "Open in Side Pane": "在侧边窗格中打开",
        "Open in Sponge": "在 Sponge 中打开",
        "Open plugin page": "打开插件页面",
        "Open search in external browser": "在外部浏览器中打开搜索",
        "Open settings menu": "打开设置菜单",
        "Open the page in system browser": "在系统浏览器中打开该页面",
        "Required": "必填",
        "Requires a GitHub repository": "需要 GitHub 仓库",
        "Requires manual confirmation.": "需要手动确认。",
        "Select Agent": "选择智能体",
        "Select Default Branch": "选择默认分支",
        "Select Folder(s)": "选择文件夹",
        "Select Google Drive files or folders": "选择 Google 云端硬盘文件或文件夹",
        "Select Workspace": "选择工作区",
        "Select Worktree": "选择工作树",
        "Select a model to send message": "选择模型以发送消息",
        "Select a workspace to save agent scripts to your workspace.": "选择工作区以将智能体脚本保存到你的工作区。",
        "Select an option": "选择一个选项",
        "Select category to search...": "选择要搜索的类别...",
        "Select text in the PDF and click + Add to start commenting.": "在 PDF 中选择文本并点击 + 添加 开始评论。",
        "Select workspace to send message": "选择工作区以发送消息",
        "Select...": "选择...",
        "Selected Option in Browser": "浏览器中已选选项",
        "Selecting Option in Browser": "正在选择浏览器中的选项",
        "Set Project Name": "设置项目名称",
        "Show All": "显示全部",
        "Show Error": "显示错误",
        "Show Remote Control QR code": "显示远程控制二维码",
        "Show Thumbnail Sidebar": "显示缩略图侧边栏",
        "Show Whitespace Changes": "显示空白字符变更",
        "Show all resources": "显示所有资源",
        "Show full command": "显示完整命令",
        "Show in File Explorer": "在文件资源管理器中显示",
        "Show in File Manager": "在文件管理器中显示",
        "Show in Sidebar": "在侧边栏中显示",
        "Show more": "显示更多",
        "Show more results on Agent Market": "在智能体市场显示更多结果",
        "Show or Hide Extensions": "显示或隐藏扩展",
        "Show token": "显示令牌",
        "Edit Comment": "编辑评论",
        "Edit Conversation Title": "编辑对话标题",
        "Edit Custom Model": "编辑自定义模型",
        "Edit Model": "编辑模型",
        "Edit permission target": "编辑权限目标",
        "Edit task title": "编辑任务标题",
        "Edit title": "编辑标题",
        "The agent has a question for you:": "智能体有一个问题问你：",
        "The agent has questions for you:": "智能体有一些问题问你：",
        "The agent has encountered an internal error.": "智能体遇到内部错误。",
        "The agent is waiting for your input.": "智能体正在等待你的输入。",
        "The agent works with autonomy-enhancing features and does not ask questions or request new permissions.": "智能体在自主增强功能下工作，不提问也不申请新权限。",
        "The agent made no code changes, but other files may still be affected if your workspace changed for other reasons (e.g. a sync) in the meantime.": "智能体未修改任何代码，但若期间你的工作区因其他原因（例如同步）发生变化，其他文件仍可能受影响。",
        "This API only accepts integers": "此 API 只接受整数",
        "This API only accepts positive integers": "此 API 只接受正整数",
        "This Google Cloud project is not supported. Input a different project, or sign in with another account.": "不支持此 Google Cloud 项目。请输入其他项目，或使用其他账户登录。",
        "This MCP server can no longer be configured.": "此 MCP 服务器已无法再配置。",
        "This automation is currently stopped. Events and stdout streams will appear here once started.": "此自动化当前已停止。启动后事件与标准输出流将显示在此处。",
        "This cannot be undone.": "此操作无法撤销。",
        "This client was started with no custom flags.": "此客户端启动时未使用任何自定义标志。",
        "This command ran in the sandbox.": "此命令在沙箱中运行。",
        "This conversation is in a different workspace.": "此对话位于另一个工作区。",
        "This error is likely temporary. You can prompt the model to try again after some time.": "此错误可能是暂时的。你可以稍后提示模型重试。",
        "This extension is currently stopped. Events and stdout streams will appear here once started.": "此扩展当前已停止。启动后事件与标准输出流将显示在此处。",
        "This is a CitC workspace (Fig share)": "这是一个 CitC 工作区（Fig 共享）",
        "This operation was aborted": "此操作已中止",
        "This page is blocked in the built-in browser by your organization's Context-Aware Access policy.": "此页面被贵组织的上下文感知访问策略在内置浏览器中阻止。",
        "This page is taking longer than expected to load, or it may be blocking embedded views (via X-Frame-Options or CSP). We'll keep waiting, or you can open it directly in a new tab.": "此页面加载时间比预期更长，或正在阻止内嵌视图（通过 X-Frame-Options 或 CSP）。我们会继续等待，你也可以直接在新标签页中打开。",
        "This project is associated with a different workspace.": "此项目关联到另一个工作区。",
        "This skill came from the marketplace, so you can add it again whenever you need it.": "此技能来自市场，你随时可以再次添加。",
        "This skill is installed in your workspace": "此技能已安装到你的工作区",
        "This undo action will not make any code changes.": "此撤销操作不会做任何代码更改。",
        "This will permanently delete": "这将永久删除",
        "Use Add MCP to browse the store.": "使用「添加 MCP」浏览商店。",
        "Use Business Account": "使用企业账户",
        "Use Global Settings": "使用全局设置",
        "Use my conversation history to tell me which skills and plugins would be helpful for me.": "利用我的对话历史告诉我哪些技能和插件对我有帮助。",
        "Use the default color.": "使用默认颜色。",
        "Configure MCP Server": "配置 MCP 服务器",
        "Configured servers": "已配置的服务器",
            // —— 官方 44.9.1 补充词条（审计补译） ——
        "Remote": "远程",
        "Extensions": "扩展",
        "Extension": "扩展",
        "This Computer": "本机",
        "This computer": "本机",
        "Environment": "环境",
        "Environments": "环境",
        "Connectors": "连接器",
        "Connections": "连接",
        "Skill": "技能",
        "Agent": "智能体",
        "Message": "消息",
        "Messages": "消息",
        "Session": "会话",
        "Sessions": "会话",
        "Task": "任务",
        "Tasks": "任务",
        "Folder": "文件夹",
        "Folders": "文件夹",
        "Server": "服务器",
        "Servers": "服务器",
        "Accounts": "账户",
        "Members": "成员",
        "Organizations": "组织",
        "Repositories": "仓库",
        "Repository": "仓库",
        "Issues": "议题",
        "Pull Requests": "拉取请求",
        "Pull request creation": "拉取请求创建",
        "Comment": "评论",
        "Connected": "已连接",
        "Connect": "连接",
        "Disconnect": "断开连接",
        "Not connected": "未连接",
        "Not configured": "未配置",
        "Display": "显示",
        "Downloads": "下载",
        "Enable": "启用",
        "Enabled": "已启用",
        "Disable": "禁用",
        "Forward": "前进",
        "Goal": "目标",
        "Helpers": "辅助",
        "Hold": "按住",
        "Machine": "机器",
        "Microphone": "麦克风",
        "More": "更多",
        "Other": "其他",
        "Share": "分享",
        "Split": "拆分",
        "System default": "系统默认",
        "Telemetry": "遥测",
        "Trigger": "触发器",
        "Triggered": "已触发",
        "Version": "版本",
        "Unknown": "未知",
        "Cut": "剪切",
        "Quote": "引用",
        "Thinking": "思考中",
        "Thinking...": "思考中…",
        "Loading": "加载中",
        "Starting": "启动中",
        "Running": "运行中",
        "Stopped": "已停止",
        "Still running": "仍在运行",
        "Submitting...": "提交中…",
        "Refreshing...": "刷新中…",
        "Capturing": "捕获中",
        "Offline": "离线",
        "Online": "在线",
        "Local only": "仅本地",
        "Remote only": "仅远程",
        "Not Found": "未找到",
        "Something went wrong": "出错了",
        "Something went wrong!": "出错了！",
        "Permanently delete": "永久删除",
        "Reload this window.": "重新加载此窗口。",
        "Open in tab": "在标签页中打开",
        "Open in Tab": "在标签页中打开",
        "Open link": "打开链接",
        "Copy link": "复制链接",
        "Link copied to clipboard.": "链接已复制到剪贴板。",
        "Copied to clipboard": "已复制到剪贴板",
        "Path copied!": "路径已复制！",
        "View Diff": "查看差异",
        "Open Diff": "打开差异",
        "Find References": "查找引用",
        "Go to": "转到",
        "Navigate to": "导航到",
        "Enter to Send": "回车发送",
        "Send reply": "发送回复",
        "Send Message": "发送消息",
        "Queue Message": "排队消息",
        "Message this chat": "给此对话发消息",
        "Fork Conversation": "派生对话",
        "Promote to conversation": "提升为对话",
        "New Conversation Button": "新建对话按钮",
        "New Side Question": "新建侧边提问",
        "Delete Side Question": "删除侧边提问",
        "Side Question": "侧边提问",
        "Side Questions": "侧边提问",
        "Side Panel": "侧边面板",
        "Toggle Side Panel": "切换侧边面板",
        "Toggle Maximize Side Panel": "切换最大化侧边面板",
        "Previous Side Panel Tab": "上一个侧边面板标签",
        "Next Side Panel Tab": "下一个侧边面板标签",
        "Screen Reader Mode": "屏幕阅读器模式",
        "Interface Layout": "界面布局",
        "Terminal Placement": "终端位置",
        "Fit Mode": "适配模式",
        "Fit to Page": "适应页面",
        "Fit to Width": "适应宽度",
        "Hide Whitespace Changes": "隐藏空白变更",
        "Toggle Word Wrap (Alt+Z)": "切换自动换行 (Alt+Z)",
        "Keep Open": "保持打开",
        "Valid until": "有效期至",
        "Auto": "自动",
        "Optional": "可选",
        "Recent": "最近",
        "Details": "详情",
        "Options": "选项",
        "Scope": "范围",
        "Target": "目标",
        "Source": "来源",
        "Host": "主机",
        "Font": "字体",
        "Font Size": "字体大小",
        "Zoom": "缩放",
        "Download files": "下载文件",
        "Browser downloads": "浏览器下载",
        "Download Location": "下载位置",
        "Browsing History": "浏览历史",
        "Add Model": "添加模型",
        "Change model": "切换模型",
        "Choose a Subscription": "选择订阅",
        "Set up": "设置",
        "Install": "安装",
        "Chat": "对话",
        "Chat Input": "对话输入框",
        "Chat Layout": "对话布局",
        "Voice mode": "语音模式",
        "Voice speed": "语音速度",
        "Voice transcript": "语音转写",
        "Start Voice mode": "开始语音模式",
        "End Voice mode": "结束语音模式",
        "Browser Use": "浏览器操作",
        "Browser Task": "浏览器任务",
        "Background Task": "后台任务",
        "Project Agent": "项目智能体",
        "Project General": "项目通用",
        "Project Folders": "项目文件夹",
        "Custom schedule": "自定义计划",
        "Run Now": "立即运行",
        "Sign In": "登录",
        "Sign in again": "重新登录",
        "Try again": "重试",
        "Show less": "收起",
        "Clear search": "清除搜索",
        "Untitled Conversation": "未命名对话",
        "Waiting for your approval": "等待你的批准",
        "You said": "你说",
        "More Plugins": "更多插件",
        "No matching": "无匹配",
        "by Google": "由 Google 提供",
        "Connect GitHub": "连接 GitHub",
        "Good Response": "回答不错",
        "Bad Response": "回答不佳",
        "Error ID:": "错误 ID：",
        "Agent ID:": "智能体 ID：",
        "Trajectory ID:": "轨迹 ID：",
        "Project ID:": "项目 ID：",
        "Cache:": "缓存：",
        "Timeout:": "超时：",
        "Command:": "命令：",
        "Alt text:": "替代文本：",
        "Image URL:": "图片 URL：",
        "Page title:": "页面标题：",
        "Used for:": "用于：",
        "Signed in as": "登录身份",
        "Forked from": "派生自",
        "Modified in": "修改于",
        "Runs as": "运行身份",
        "Back to": "返回",
        "How often": "频率",
        "Repeat every": "重复间隔",
        "Repeat unit": "重复单位",
        "Next run": "下次运行",
        "Last run": "上次运行",
        "No runs yet": "暂无运行记录",
        "No active terminals": "无活动终端",
        "Nothing is running right now": "当前没有正在运行的内容",
        "Archived": "已归档",
        "Enterprise": "企业版",
        "Security": "安全",
        "Accessibility": "无障碍",
        "Subscription": "订阅",
        "Instructions": "说明",
        "Protocol": "协议",
        "Proceed": "继续",
        "Authenticate": "认证",
        "Configure": "配置",
        "Get API key": "获取 API 密钥",
        "Code Preview": "代码预览",
        "Web Preview": "网页预览",
        "Stop Editing": "停止编辑",
        "Stop Recording": "停止录制",
        "Recordings": "录音",
        "Switch mic": "切换麦克风",
        "Thumbnails": "缩略图",
        "Decorations": "装饰",
        "Conditions": "条件",
        "Contents": "内容",
        "Generations": "生成记录",
        "Coordinators": "协调器",
        "Critique": "评审",
        "Excluded": "已排除",
        "External": "外部",
        "Buganizer": "Buganizer",
        "Every hour": "每小时",
        "Every day": "每天",
        "Every weekday": "每个工作日",
        "Every week": "每周",
            // —— 高频短词补充（第二批） ——
        "Skip": "跳过",
        "Dismiss": "忽略",
        "Retry": "重试",
        "Next": "下一步",
        "Done": "完成",
        "Confirm": "确认",
        "Reset": "重置",
        "Apply": "应用",
        "Duplicate": "复制",
        "Export": "导出",
        "Import": "导入",
        "Log in": "登录",
        "Log In": "登录",
        "Log out": "退出登录",
        "Open In": "打开方式",
        "Replace with New": "替换为新内容",
        "Replace with": "替换为",
        "Undo to Here": "撤销到此处",
        "unknown error": "未知错误",
        "Unknown Error": "未知错误",
        "Tip:": "提示：",
        "Output:": "输出：",
        "Input:": "输入：",
        "Error": "错误",
        "Warning": "警告",
        "Warning:": "警告：",
        "Info:": "信息：",
        "Details:": "详情：",
        "Definition:": "定义：",
        "Payload:": "载荷：",
        "Matcher:": "匹配器：",
        "Domains:": "域名：",
        "Location:": "位置：",
        "Source:": "来源：",
        "Scopes:": "范围：",
        "Event:": "事件：",
        "License:": "许可证：",
        "ID:": "ID：",
        "Author:": "作者：",
        "Owner": "所有者",
        "Author": "作者",
        "Time": "时间",
        "When": "时间",
        "Where": "位置",
        "Title:": "标题：",
        "Number of hours": "小时数",
        "On a schedule": "按计划",
        "Not scheduled": "未安排",
        "Change schedule": "更改计划",
        "Custom Order": "自定义顺序",
        "Select": "选择",
        "Select all in": "全选于",
        "Show": "显示",
        "Seek": "定位",
        "Run": "运行",
        "Runs": "运行记录",
        "Sent": "已发送",
        "Untitled": "未命名",
        "Visit": "访问",
        "Website": "网站",
        "Windows": "Windows",
        "Linux": "Linux",
        "MacOS": "macOS",
        "Europe": "欧洲",
        "United States": "美国",
        "Google": "Google",
        "Google3": "Google3",
        "Jetski": "Jetski",
        "Labs": "实验室",
        "Pro": "专业版",
        "Drive": "云端硬盘",
        "Google Chat": "Google Chat",
        "Google One Referral": "Google One 推荐",
        "Gemini Flash Next": "Gemini Flash Next",
        "Bundles": "捆绑包",
        "Bytes": "字节",
        "Card": "卡片",
        "Count": "数量",
        "Fields": "字段",
        "Events": "事件",
        "Sources": "来源",
        "Scopes": "范围",
        "Target Tools:": "目标工具：",
        "Payload": "载荷",
        "Filter files...": "筛选文件…",
        "Filter rows...": "筛选行…",
        "Search branches": "搜索分支",
        "Search connectors": "搜索连接器",
        "Search Google Drive": "搜索 Google 云端硬盘",
        "Search conversations with": "搜索与以下对象的对话：",
        "e.g., /path/to/file": "例如 /path/to/file",
        "e.g., chromium/src": "例如 chromium/src",
        "e.g., curl": "例如 curl",
        "e.g., example.com": "例如 example.com",
        "e.g., npm test": "例如 npm test",
        "e.g. Release helper": "例如 Release helper",
        "e.g. work": "例如 work",
        "gh auth login": "gh auth login",
        "http://localhost:8080": "http://localhost:8080",
        "quick pick": "快速选择",
        "Added": "已添加",
        "Block": "屏蔽",
        "Backoff": "退避",
        "Clicking": "点击",
        "Creating...": "创建中…",
        "End": "结束",
        "Shift": "Shift",
        "This": "此",
        "An": "一个",
        "For": "用于",
        "From": "来自",
        "To update:": "更新方法：",
        "No": "否",
        "No sign-in needed": "无需登录",
        "Wait for": "等待",
        "Waiting for user input": "等待用户输入",
        "Runs remotely": "远程运行",
        "Run visibility": "运行可见性",
        "Unauthenticated": "未认证",
        "Untracked": "未跟踪",
        "Unknown Notebook": "未知笔记本",
        "Multi-select": "多选",
        "Mute Voice Mic": "静音麦克风",
        "Mute Voice Speaker": "静音扬声器",
        "Remove from list": "从列表中移除",
        "Switch IDE Workspace": "切换 IDE 工作区",
        "Save audio recordings": "保存录音",
        "Submit comment": "提交评论",
        "Use Advanced SSO Config": "使用高级 SSO 配置",
        "Start it again.": "重新开始。",
        "Stay up to date.": "保持最新。",
        "You are in control": "由你掌控",
        "Optimized for you": "为你优化",
        "Other sign-in options": "其他登录方式",
        "Paste authorization code": "粘贴授权码",
        "Get Anything Done with": "用其完成任何事：",
        "Built to help, not hurt": "旨在帮助，而非伤害",
        "Announcements and tips": "公告与提示",
        "App update required": "需要更新应用",
        "Conversation Unarchived": "对话已取消归档",
        "Conversation limit reached": "已达对话数量上限",
        "Context usage": "上下文用量",
        "Conversation Steps": "对话步骤",
        "Generation Steps (": "生成步骤 (",
        "Trajectory Stats": "轨迹统计",
        "Cookie and site data": "Cookie 与站点数据",
        "Cookies and site data": "Cookie 与站点数据",
        "Certificate details": "证书详情",
        "Empty directory": "空目录",
        "Failed to read file": "读取文件失败",
        "Failed to export artifact": "导出产物失败",
        "Failed to load some diffs": "部分差异加载失败",
        "Error while editing": "编辑时出错",
        "Error while viewing": "查看时出错",
        "Custom Agent Error:": "自定义智能体错误：",
        "Current parameter:": "当前参数：",
        "Invalid embed:": "无效嵌入：",
        "Unable to load PDF:": "无法加载 PDF：",
        "Mermaid diagram": "Mermaid 图表",
        "Notebook cell output": "笔记本单元格输出",
        "Loading Notebook View...": "正在加载笔记本视图…",
        "No token data available.": "暂无令牌数据。",
        "No events recorded": "暂无事件记录",
        "No instances yet.": "暂无实例。",
        "No instructions.": "无说明。",
        "No handlers configured for": "尚未为其配置处理器：",
        "No coordinators": "暂无协调器",
        "No environments found": "未找到环境",
        "No project selected": "未选择项目",
        "Nothing said yet": "暂无内容",
        "Fallback Summary Used": "使用了回退摘要",
        "Inspected commit": "已检查提交",
        "Issued by": "签发者",
        "Generated image preview": "生成的图片预览",
        "Selected element preview": "所选元素预览",
        "Selected region": "所选区域",
        "User uploaded image": "用户上传的图片",
        "Plan upgrade required": "需要升级方案",
        "Remote agents are busy": "远程智能体正忙",
        "Remote Projects": "远程项目",
        "More cloud environments": "更多云环境",
        "Coordinator settings": "协调器设置",
        "New Coordinator": "新建协调器",
        "Link Settings": "链接设置",
        "Customize Sections": "自定义分区",
        "Page contents": "页面内容",
        "Show in folder": "在文件夹中显示",
        "Open in full conversation": "在完整对话中打开",
        "Open Blame in Code Search": "在代码搜索中打开 Blame",
        "Close Tabs to the Left": "关闭左侧标签页",
        "Cancel Step": "取消步骤",
        "Cancel download": "取消下载",
        "Cancel Render Page Failed": "取消渲染页面失败",
        "Snooze for 24 Hours": "暂停 24 小时",
        "Password Prompt Blocked": "密码提示已阻止",
        "MCP Servers Disabled": "MCP 服务器已禁用",
        "Resolving permissions...": "正在解析权限…",
        "Setup script failed.": "安装脚本失败。",
        "Launching the browser...": "正在启动浏览器…",
        "Reads": "读取",
        "Uploaded to Google Drive": "已上传至 Google 云端硬盘",
        "What's in this bundle": "此捆绑包的内容",
        "When something happens": "当某事发生时",
        "Where it runs": "运行位置",
        "Valid CEL": "有效 CEL",
        "CEL Reference": "CEL 参考",
        "CEL Expression Reference": "CEL 表达式参考",
        "GitHub Repositories": "GitHub 仓库",
        "Developer: Reset NUX": "开发者：重置新手引导",
        "Create a project first.": "请先创建一个项目。",
        "Captured DOM tree for": "已捕获 DOM 树：",
        "Commented on:": "评论于：",
        "Admin escalation": "管理员权限提升",
        "Agent can": "智能体可以",
        "Agent can run": "智能体可以运行",
        "Agents created by": "由以下对象创建的智能体：",
        "All Workspaces": "所有工作区",
        "Ask /btw": "询问 /btw",
        "Authenticated as": "认证身份",
        "Available for": "适用于",
        "Add All": "全部添加",
        "Plugin": "插件",
        "Hook": "钩子",
        "Rule": "规则",
            // —— 通用 UI 短语与问候片段 ——
        "Welcome back,": "欢迎回来，",
        "Welcome back.": "欢迎回来。",
        "Where should we pick up?": "我们从哪里继续？",
        "Good to see you,": "很高兴见到你，",
        "Good to see you.": "很高兴见到你。",
        "What's next?": "接下来做什么？",
        "Hey there,": "嗨，",
        "Hey there.": "嗨。",
        "what should we build today?": "今天想做点什么？",
        "What should we build today?": "今天想做点什么？",
        "Welcome to": "欢迎使用",
        "Removed": "已移除",
        "Created": "已创建",
        "Updated": "已更新",
        "Saved": "已保存",
        "Opened": "已打开",
        "Closed": "已关闭",
        "Saving...": "保存中…",
        "Deleting...": "删除中…",
        "Uploading...": "上传中…",
        "Downloading...": "下载中…",
        "Generating...": "生成中…",
        "Searching...": "搜索中…",
        "Connecting...": "连接中…",
        "Reconnecting...": "重新连接中…",
        "Working...": "处理中…",
        "Please wait...": "请稍候…",
        "Read more": "阅读更多",
        "Show all": "显示全部",
        "No items": "无项目",
        "No data": "无数据",
        "Not supported": "不支持",
        "Not set": "未设置",
        "Not started": "未开始",
        "Failed": "失败",
        "In progress": "进行中",
        "Cancelled": "已取消",
        "Canceled": "已取消",
        "Recommended": "推荐",
        "Basic": "基础",
        "Privacy Policy": "隐私政策",
        "Documentation": "文档",
        "Community": "社区",
        "Feedback": "反馈",
        "Send feedback": "发送反馈",
        "Report a bug": "报告问题",
        "Report issue": "报告问题",
        "Sign up": "注册",
        "Create account": "创建账户",
        "Switch account": "切换账户",
        "Add account": "添加账户",
        "Manage accounts": "管理账户",
        "Profile": "个人资料",
        "Preferences": "偏好设置",
        "Workspace settings": "工作区设置",
        "Project settings": "项目设置",
        "Account settings": "账户设置",
        "Model settings": "模型设置",
        "Default model": "默认模型",
        "Select a model": "选择模型",
        "Select a folder": "选择文件夹",
        "Select a project": "选择项目",
        "Select a workspace": "选择工作区",
        "Open file": "打开文件",
        "Open project": "打开项目",
        "New folder": "新建文件夹",
        "New file": "新建文件",
        "New project": "新建项目",
        "New task": "新建任务",
        "New chat": "新建对话",
        "New automation": "新建自动化",
        "Delete forever": "永久删除",
        "Move to trash": "移到回收站",
        "Clear all": "全部清除",
        "Saving": "保存中",
        "Finish": "完成",
        "Start": "开始",
        "Pause": "暂停",
        "Resume": "恢复",
        "Restart": "重启",
        "Redo": "重做",
        "Sort": "排序",
        "Summary": "摘要",
        "Activity": "活动",
        "History": "历史",
        "Editor": "编辑器",
        "Team": "团队",
        "Organization": "组织",
        "Limits": "限额",
        "Free": "免费",
        "Trial": "试用",
        "Expired": "已过期",
        "Active": "活跃",
        "Inactive": "未激活",
            // —— JSX 片段与项目/权限设置补充 ——
        "when working": "，适用于",
        "in this project": "当前项目",
        "in these conversations": "这些对话",
        "in this workspace": "当前工作区",
        "in all projects": "所有项目",
        "This project was created for": "此项目专为",
        "automation.": "自动化而创建。",
        "automation. ": "自动化而创建。",
        "an": "一个",
        "the": "该",
        "Manage project folders, agent settings, and permissions.": "管理项目文件夹、智能体设置与权限。",
        "No folders added yet.": "尚未添加文件夹。",
        "Add Folder": "添加文件夹",
        "Add Resource": "添加资源",
        "Give Feedback": "提供反馈",
        "Network Access": "网络访问",
        "Permission Presets": "权限预设",
        "Inherit Global Settings": "继承全局设置",
        "Outside of project": "不在项目中",
            // —— 独立标点片段（React 拆句场景） ——
        ".": "。",
        ",": "，",
        ":": "：",
        ";": "；",
            // —— 通用设置页补充 ——
        "Knowledge Work": "知识工作",
        "Software Engineering": "软件工程",
        "Simplified interface for research, writing, and everyday tasks.": "面向研究、写作和日常任务的简化界面。",
        "Full interface for coding, developer tools, and managing agents.": "面向编码、开发者工具和智能体管理的完整界面。",
        "Configure global allow and deny resource permissions.": "配置全局允许与禁止的资源权限。",
        "Permissions to modify files, terminal, and MCP tools.": "修改文件、终端和 MCP 工具的权限。",
        "Configure allowed and denied URLs.": "配置允许与禁止读取的 URL。",
        "Message Queue": "消息排队",
        "Send now": "立即发送",
        "Configure the send timing of queued messages.": "配置后续消息的发送时机。",
        "Type / and select a plan to have the agent generate an execution plan.": "输入 / 并选择一个方案，让智能体生成执行方案。",
        "Created in": "创建于",
        "projects": "个项目",
        "items": "项",
        "files": "个文件",
        "folders": "个文件夹",
        "sessions": "个会话",
        "messages": "条消息",
        "tasks": "个任务",
        "agents": "个智能体",
        "plugins": "个插件",
        "skills": "个技能",
        "results": "个结果",
        "models": "个模型",
        "runs": "次运行",
        "steps": "个步骤",
        "tokens": "个令牌",
        "changes": "处更改",
        "characters": "个字符",
        "lines": "行",
            // —— 输入框/置顶/语音模式 ——
        "Message input": "消息输入框",
        "Unpin conversation": "取消置顶对话",
        "Voice Mode Capabilities And Differences": "语音模式能力与差异",
            // —— 审计补充：按钮/操作/提示/长句（第 3 批） ——
        "New tab": "新建标签页",
        "All runs": "全部运行",
        "Try Again": "重试",
        "Full Logs": "完整日志",
        "View Logs": "查看日志",
        "Full View": "完整视图",
        "Next card": "下一张卡片",
        "Previous card": "上一张卡片",
        "Add files": "添加文件",
        "Text input": "文本输入",
        "View plans": "查看方案",
        "Go to Home": "返回主页",
        "Accept all": "全部接受",
        "Add filter": "添加筛选",
        "Delete all": "全部删除",
        "Create New": "新建",
        "Match case": "区分大小写",
        "Reload app": "重新加载应用",
        "Zoom Level": "缩放级别",
        "Add Handler": "添加处理器",
        "Get started": "开始使用",
        "Submit code": "提交代码",
        "Close Panel": "关闭面板",
        "Add trigger": "添加触发器",
        "Check again": "重新检查",
        "Address bar": "地址栏",
        "Cancel step": "取消步骤",
        "Filter rows": "筛选行",
        "No branches": "无分支",
        "Dismiss Tip": "忽略提示",
        "Use Existing": "使用现有",
        "See Activity": "查看活动",
        "Make default": "设为默认",
        "Accounts tab": "账户标签页",
        "Chat anyways": "仍然对话",
        "Drag to move": "拖动以移动",
        "Add schedule": "添加计划",
        "Voice volume": "语音音量",
        "Remove audio": "移除音频",
        "Clear filter": "清除筛选",
        "Copy Command": "复制命令",
        "Filter files": "筛选文件",
        "Back to home": "返回主页",
        "When it runs": "运行时间",
        "Current Page": "当前页面",
        "Cleared Count": "已清除数量",
        "Reload Window": "重新加载窗口",
        "Send Feedback": "发送反馈",
        "File Explorer": "文件资源管理器",
        "Billing model": "计费模式",
        "Dismiss error": "忽略错误",
        "Media actions": "媒体操作",
        "Browser steps": "浏览器步骤",
        "Sidecar error": "Sidecar 错误",
        "View comments": "查看评论",
        "Create plugin": "创建插件",
        "Agent options": "智能体选项",
        "Close Sidebar": "关闭侧边栏",
        "Remove policy": "移除策略",
        "Workflow refs": "工作流引用",
        "Back to safety": "返回安全页面",
        "Merge Conflict": "合并冲突",
        "Close (Escape)": "关闭 (Esc)",
        "Reopen Locally": "在本地重新打开",
        "Sign in needed": "需要登录",
        "Fix with Agent": "用智能体修复",
        "Proceed Anyway": "仍然继续",
        "Toggle sidebar": "切换侧边栏",
        "Keyboard input": "键盘输入",
        "Confirm & Save": "确认并保存",
        "Only Scheduled": "仅已排期",
        "Stop execution": "停止执行",
        "Reply to /help": "回复 /help",
        "Search results": "搜索结果",
        "Remove trigger": "移除触发器",
        "Workflow files": "工作流文件",
        "Restart sign-in": "重新开始登录",
        "Open Appearance": "打开外观设置",
        "Delete Terminal": "删除终端",
        "Match Case (Aa)": "区分大小写 (Aa)",
        "Delete All Data": "删除所有数据",
        "Invite a Friend": "邀请好友",
        "Start Extension": "启动扩展",
        "About embedding": "关于嵌入",
        "Close downloads": "关闭下载",
        "Remove resource": "移除资源",
        "Command Shift A": "Command Shift A",
        "Plugin metadata": "插件元数据",
        "Queued messages": "排队中的消息",
        "New coordinator": "新建协调器",
        "Reset to preset": "重置为预设",
        "Scroll position": "滚动位置",
        "Open Source Code": "打开源代码",
        "Enable Best-of-2": "启用 Best-of-2",
        "Sign In with SSO": "使用 SSO 登录",
        "Untitled project": "未命名项目",
        "Cancel recording": "取消录制",
        "Search shortcuts": "搜索快捷键",
        "Close references": "关闭引用",
        "Close Logs Modal": "关闭日志弹窗",
        "Toggle file diff": "切换文件差异",
        "Clear row filter": "清除行筛选",
        "Match whole word": "全字匹配",
        "Coordinator name": "协调器名称",
        "Coordinator goal": "协调器目标",
        "Project location": "项目位置",
        "No matching files": "无匹配文件",
        "Clear file filter": "清除文件筛选",
        "Untrusted sidecar": "不受信任的 Sidecar",
        "Insert in Terminal": "插入到终端",
        "Next Match (Enter)": "下一个匹配 (Enter)",
        "Migrate with Agent": "用智能体迁移",
        "Create Coordinator": "创建协调器",
        "Stop Side Question": "停止侧边提问",
        "Running (Dev only)": "运行中（仅开发）",
        "Click to Open Docs": "点击打开文档",
        "Create with Prompt": "用提示词创建",
        "Save Configuration": "保存配置",
        "No logs available.": "暂无日志。",
        "Shiki worker error": "Shiki 工作线程错误",
        "Available licenses": "可用许可证",
        "Signed-in accounts": "已登录账户",
        "Markdown view mode": "Markdown 视图模式",
        "Insert in terminal": "插入到终端",
        "Next side question": "下一个侧边提问",
        "Marketplace notice": "市场通知",
        "Conversation turns": "对话回合",
        "Click to open docs": "点击打开文档",
        "Dismiss suggestion": "忽略建议",
        "Stop side question": "停止侧边提问",
        "Get More AI Credits": "获取更多 AI 积分",
        "Upload Debug Bundle": "上传调试包",
        "Remove from history": "从历史记录中移除",
        "Paste a code instead": "改为粘贴授权码",
        "An error was thrown.": "抛出了一个错误。",
        "Where should it run?": "在哪里运行？",
        "View or edit comment": "查看或编辑评论",
        "Voice engine address": "语音引擎地址",
        "Cancel questionnaire": "取消问卷",
        "Dismiss notification": "忽略通知",
        "Delete side question": "删除侧边提问",
        "Customizations views": "自定义视图",
        "More toolbar actions": "更多工具栏操作",
        "Embedding Limitations": "嵌入限制",
        "Select CitC workspace": "选择 CitC 工作区",
        "At mention code block": "@ 提及代码块",
        "File path breadcrumbs": "文件路径面包屑",
        "Resize terminal panes": "调整终端窗格大小",
        "Reason for opting out": "退出原因",
        "Toggle Terminal Panel": "切换终端面板",
        "Summarizing call…": "正在总结通话…",
        "Work in a New Worktree": "在新的工作树中工作",
        "Custom flag to turn on": "要开启的自定义标志",
        "Use regular expression": "使用正则表达式",
        "Conversation Telemetry": "对话遥测",
        "Previous side question": "上一个侧边提问",
        "Minimize side question": "最小化侧边提问",
        "Active environment: os=": "活动环境：os=",
        "Starting terminal…": "正在启动终端…",
        "Refresh all credentials": "刷新所有凭据",
        "Address bar suggestions": "地址栏建议",
        "Deny setting up browser": "拒绝设置浏览器",
        "Next: Review Permissions": "下一步：审查权限",
        "Delete repository policy": "删除仓库策略",
        "Connecting to terminal...": "正在连接终端…",
        "What counts as a document": "什么算作文档",
        "Having trouble signing in?": "登录遇到问题？",
        "Pick a model to change it.": "选择一个模型即可更改。",
        "Copy gh auth login command": "复制 gh auth login 命令",
        "Inspect element to comment": "检查元素以添加评论",
        "Workspace URI to switch to": "要切换到的的工作区 URI",
        "Resize side question panel": "调整侧边提问面板大小",
        "Workspace mismatch actions": "工作区不匹配操作",
        "Dismiss microphone warning": "忽略麦克风警告",
        "Search for content to open": "搜索要打开的内容",
        "Delete organization policy": "删除组织策略",
        "Clear cookies and site data": "清除 Cookie 与站点数据",
        "Image preview not available": "图片预览不可用",
        "For corp passwords (such as": "对于企业密码（例如",
        "Use Regular Expression (.*)": "使用正则表达式 (.*)",
        "Finalizing transcription...": "正在完成转写…",
        "Confirm Browser Interaction": "确认浏览器操作",
        "Error while editing notebook": "编辑笔记本时出错",
        "Error while reading notebook": "读取笔记本时出错",
        "Previous Match (Shift+Enter)": "上一个匹配 (Shift+Enter)",
        "Process exited with an error": "进程异常退出",
        "Toggle Google Cloud projects": "切换 Google Cloud 项目",
        "Workspace folder suggestions": "工作区文件夹建议",
        "Indexed CEL helper functions": "已索引的 CEL 辅助函数",
        "Validating setup script…": "正在校验安装脚本…",
        "Keeps your checkout untouched": "保持你的检出内容不变",
        "Set at least one scope filter": "请至少设置一个范围筛选",
        "This sidecar failed to start.": "此 Sidecar 启动失败。",
        "Dismiss text selection notice": "忽略文本选择提示",
        "Setup script ran successfully.": "安装脚本运行成功。",
        "Toggle checkerboard background": "切换棋盘格背景",
        "Sending transcribed message...": "正在发送转写消息…",
        "Your connection is not private": "你的连接不是私密的",
        "Browser Configuration Required": "需要配置浏览器",
        "Dismiss artifact update notice": "忽略产物更新提示",
        "Available CEL helper functions": "可用的 CEL 辅助函数",
        "Continue with different account": "使用其他账户继续",
        "Reset all shortcuts to defaults": "将所有快捷键重置为默认",
        "Get started with Remote Control": "开始使用远程控制",
        "Connecting to language server...": "正在连接语言服务器…",
        "Sign in with a different account": "使用其他账户登录",
        "Fetched network request for page.": "已获取页面网络请求。",
        "Could not create blob from canvas": "无法从画布创建 blob",
        "Fetched network requests for page.": "已获取页面网络请求。",
        "File Tree Component is not loaded.": "文件树组件未加载。",
        "Finish signing in in your browser.": "请在浏览器中完成登录。",
        "Select the latest snapshot from the": "选择最新的快照：",
        "Did restarting the desktop app help?": "重启桌面应用后是否解决？",
        "Google Picker API failed to initialize": "Google Picker API 初始化失败",
        "Available CEL field tokens and helpers": "可用的 CEL 字段令牌与辅助函数",
        "Cancel Questionnaire and Stop the Agent": "取消问卷并停止智能体",
        "A project with this name already exists.": "已存在同名项目。",
        "Creating projects for your conversations": "为你的对话创建项目",
        "Attaching logs requires an email address": "附加日志需要电子邮箱地址",
        "Missing a repository? Configure on GitHub": "缺少仓库？在 GitHub 上配置",
        "Confirmation required to execute this step": "执行此步骤需要确认",
        "One last thing before getting started…": "开始前还有最后一件事…",
        "No active terminals. Click + to create one.": "没有活动的终端。点击 + 新建一个。",
        "Toggle this on to allow creating new issues.": "开启后允许创建新议题。",
        "Any error messages seen when trying to log in": "尝试登录时看到的任何错误信息",
        "Google API client (gapi) failed to initialize": "Google API 客户端 (gapi) 初始化失败",
        "You can also add or remove each plugin below.": "你也可以在下方添加或移除每个插件。",
        "This link wants to open an app on your device.": "此链接想要在你的设备上打开一个应用。",
        "How this feature would help you and other users": "此功能对你和其他用户有何帮助",
        "No keyboard shortcuts found matching your filter.": "未找到匹配筛选条件的键盘快捷键。",
        "Toggle this on to enable read access on contents.": "开启后允许读取内容。",
        "Toggle this on to allow creating new pull requests.": "开启后允许创建新的拉取请求。",
        "No rate card for this model; showing comparable rates.": "此模型没有费率卡；显示可比较的费率。",
        "A few things to know, and a couple settings to review.": "有几件事需要了解，还有几项设置需要确认。",
        "Page was short enough to be read as a single document.": "页面足够短，可作为单个文档读取。",
        "Scrollbar shadow to indicate that the view is scrolled.": "用于指示视图已滚动的滚动条阴影。",
        "A comma-separated list like org-a, org-b, or * for all.": "以逗号分隔的列表，如 org-a, org-b，或 * 表示全部。",
        "No matching project folders. Apply to use the custom URI.": "没有匹配的项目文件夹。申请后才能使用自定义 URI。",
        "A comma-separated list like repo-a, repo-b, or * for all.": "以逗号分隔的列表，如 repo-a, repo-b，或 * 表示全部。",
        "Copy the folder elsewhere first if you might want it back.": "如果之后可能需要它，请先把文件夹复制到别处。",
        "Ask a side question without interrupting the main conversation": "在不打断主对话的情况下提出侧边问题",
        "Your administrator has disabled MCP servers for this workspace.": "你的管理员已为此工作区禁用 MCP 服务器。",
        "Typing your corp password here may trigger a Password Alert reset.": "在此输入企业密码可能会触发密码警报重置。",
        "Let's tailor the experience for you. What best describes your work?": "让我们为你量身定制体验。哪项最符合你的工作？",
        "A snapshot was saved before running. To restore your previous output:": "运行前已保存快照。要恢复之前的输出：",
        "Please sign in using the Antigravity sidebar panel to view this page.": "请使用 Antigravity 侧边面板登录以查看此页面。",
        "Contact your administrator to set up Gemini Enterprise for this project": "请联系管理员为此项目设置 Gemini Enterprise",
        "Use this if your admin gave you a WIF config. Paste it below to sign in.": "如果你的管理员提供了 WIF 配置，请使用此项。在下方粘贴以登录。",
        "Browser is currently being operated by this conversation in another Hub window": "浏览器当前正被此对话在另一个 Hub 窗口中操作",
        "Run a prompt on a schedule, like a morning summary of yesterday's changes. Runs show up here.": "按计划运行提示词，例如每天早晨汇总昨天的更改。运行记录会显示在此处。",
        "Install this plugin to see the commands it adds, along with its skills, agents and MCP servers.": "安装此插件以查看它新增的命令，以及它的技能、智能体和 MCP 服务器。",
        "Waiting for tool permission approval — click Open in full conversation (↗) to approve": "等待工具权限批准 — 点击“在完整对话中打开”(↗) 以批准",
        "This conversation grew too large, so the history before this point may be missing or incomplete.": "此对话变得过大，因此此处之前的历史可能缺失或不完整。",
        "Google Chrome": "Google Chrome",
            // —— 主题样式与工具栏描述 ——
        "Style to use for write accesses.": "写入访问所使用的样式。",
        "Style for all symbol declarations.": "所有符号声明所使用的样式。",
        "Style to use for symbols that are async.": "异步符号所使用的样式。",
        "Style to use for symbols that are static.": "静态符号所使用的样式。",
        "Style to use for symbols that are abstract.": "抽象符号所使用的样式。",
        "Style to use for symbols that are read-only.": "只读符号所使用的样式。",
        "Style to use for references in documentation.": "文档中引用所使用的样式。",
        "Style to use for symbols that are deprecated.": "已弃用符号所使用的样式。",
        "Toolbar background when holding the mouse over actions": "鼠标按住操作时的工具栏背景色",
        "Toolbar outline when hovering over actions using the mouse": "鼠标悬停操作时的工具栏轮廓色",
        "Toolbar background when hovering over actions using the mouse": "鼠标悬停操作时的工具栏背景色",
        "Guide line for the chart.": "图表参考线。",
        "Please use quickInputList.focusBackground instead": "请改用 quickInputList.focusBackground",
            // —— AI 积分 ——
        "Available AI Credits: 0": "可用 AI 积分：0",
        "Available AI Credits": "可用 AI 积分",
            // —— 设置页（应用/外观/浏览器/语音/远程控制）与长句补译 ——
        "Choose how much detail is shown during a conversation.": "选择对话中显示多少细节。",
        "Verbose": "详细",
        "Strong": "高对比",
        "Dark preview": "深色预览",
        "Light preview": "浅色预览",
        "Manage Antigravity application settings.": "管理 Antigravity 应用设置。",
        "Scan the code to open this device in": "扫描二维码在以下位置打开此设备：",
        ", or": "，或",
        "copy link": "复制链接",
        "copy link.": "复制链接。",
        "Configure built-in browser, link opening, and browser subagent preferences.": "配置内置浏览器、链接打开方式与浏览器子智能体偏好。",
        "Folder where files downloaded in the built-in browser are saved.": "内置浏览器下载文件的保存位置。",
        "Clear visited URLs and autocomplete suggestions from the built-in browser.": "清除内置浏览器的访问记录与自动补全建议。",
        "Configure allowed and denied URLs for the browser subagent. It runs in the built-in browser, so no separate browser install is needed.": "为浏览器子智能体配置允许与禁止的 URL。它运行在内置浏览器中，无需单独安装浏览器。",
        "Browser Actions Rules": "浏览器操作规则",
        "Change...": "更改…",
        "The voice used in Voice mode. Powered by Gemini Live.": "语音模式使用的声音。由 Gemini Live 提供支持。",
        "Input device for voice mode and dictation.": "语音模式与听写使用的输入设备。",
        "How loud Antigravity's voice is.": "Antigravity 语音的音量。",
        "Type a voice variant name, such as rev27.": "输入语音变体名称，例如 rev27。",
        "Whatever the voice-engine-addr flag serves you.": "由 voice-engine-addr 标志提供的内容。",
        "Daily environment time used": "每日环境使用时长",
        "No message text": "无消息文本",
        "Write a message": "写一条消息",
        "Search filters…": "搜索筛选…",
        "Search triggers…": "搜索触发器…",
        "What should it do?": "它应该做什么？",
        "When should it run?": "何时运行？",
        "What should the agent do on each run?": "每次运行时智能体应该做什么？",
        "What should the agent do on each run? For example: summarize new bugs assigned to me and anything that changed overnight.": "每次运行时智能体应该做什么？例如：汇总分配给我的新缺陷，以及夜间发生的任何变化。",
        "For example: Morning bug summary": "例如：早晨缺陷汇总",
        "For example: every morning, summarize new bugs assigned to me and anything that changed overnight.": "例如：每天早上汇总分配给我的新缺陷，以及夜间发生的任何变化。",
        "What should this coordinator accomplish?": "这个协调器要完成什么？",
        "Choose where terminal sessions appear.": "选择终端会话的显示位置。",
        "Choose icon and color": "选择图标与颜色",
        "Context and Quota Indicator": "上下文与额度指示器",
        "Show how full the context window is next to the send button. Click it for a breakdown and to see your model quota.": "在发送按钮旁显示上下文窗口的占用情况。点击可查看明细与模型额度。",
        "Delete all recordings?": "删除所有录音？",
        "Only stored on your machine.": "仅存储在你的机器上。",
        "Share your referral link with friends": "与朋友分享你的推荐链接",
        "Remove from history (Shift+Delete)": "从历史记录中移除 (Shift+Delete)",
        "E.g. locations/global/workforcePools...": "例如 locations/global/workforcePools...",
        "Enter a URL (e.g. http://localhost:8080)": "输入 URL（例如 http://localhost:8080）",
        "Web (mobile, PWA)": "网页（移动端、PWA）",
        "Web (mobile, remote control)": "网页（移动端、远程控制）",
        "Web (mobile, remote control, PWA)": "网页（移动端、远程控制、PWA）",
        "Web (desktop, remote control, PWA)": "网页（桌面端、远程控制、PWA）",
        "Extension (Antigravity IDE)": "扩展（Antigravity IDE）",
        "Project 4K": "Project 4K",
        "Project 4K interface without developer tooling.": "不含开发者工具的 Project 4K 界面。",
        "The full developer experience.": "完整的开发者体验。",
        "Legal Help": "法律帮助",
        "Google Privacy Policy": "Google 隐私政策",
        "Developer: Reset Onboarding": "开发者：重置新手引导",
        "Developer-only tools. These settings do not affect other users.": "仅开发者可用的工具。这些设置不会影响其他用户。",
        "This page isn’t working": "此页面无法正常工作",
        "This site can’t be reached": "无法访问此网站",
        "Failed to send side question": "发送侧边提问失败",
        "Couldn't edit queued message": "无法编辑排队中的消息",
        "Too many environments running": "运行中的环境过多",
        "Failed to start side question": "启动侧边提问失败",
        "Cancel Render Thumbnail Failed": "取消渲染缩略图失败",
        "Failed to create remote project": "创建远程项目失败",
        "Daily conversation limit reached": "已达每日对话上限",
        "No plugin loads from this folder.": "此文件夹不会加载任何插件。",
        "Couldn't load Google Drive link title": "无法加载 Google 云端硬盘链接标题",
        "Account connection was not completed.": "账户连接未完成。",
        "Failed to approve browser interaction": "批准浏览器操作失败",
        "It was already sent or couldn't be removed from the queue.": "它已发送，或无法从队列中移除。",
        "Controls permissions for remote conversations.": "控制远程对话的权限。",
        "Allow/deny agent browser file downloads from specific sites.": "允许/禁止智能体从特定站点下载浏览器文件。",
        "Match when the principal belongs to the specified MDB group.": "当主体属于指定的 MDB 组时匹配。",
        "Match when any modified file path starts with the given depot prefix.": "当任一被修改的文件路径以给定的 depot 前缀开头时匹配。",
        "Match when push_def equals or is a child of the given PushDef prefix.": "当 push_def 等于或属于给定 PushDef 前缀的子级时匹配。",
        "Match when the issue component equals or is under the given Buganizer component ID.": "当议题组件等于或位于给定 Buganizer 组件 ID 之下时匹配。",
        "Get notified when the agent needs your attention or completes a task.": "当智能体需要你关注或完成任务时收到通知。",
        "Send messages with the keyboard's Enter key instead of starting a new line.": "使用回车键发送消息，而不是换行。",
        "Ignore events emitted by automated review or robot accounts (groupagent-*).": "忽略自动评审或机器人账户（groupagent-*）发出的事件。",
        "Ignore events triggered by the automation owner to avoid self-trigger loops.": "忽略由自动化所有者触发的事件，以避免自触发循环。",
        "Which workspace the New Conversation button and keyboard shortcut start you in.": "“新建对话”按钮和快捷键让你从哪个工作区开始。",
        "Optimize the interface and terminal output for screen readers.": "为屏幕阅读器优化界面和终端输出。",
        "Download this site as an app to get notified when the agent needs your attention or completes a task.": "将此站点下载为应用，以便在智能体需要你关注或完成任务时收到通知。",
        "Select the workspace type that will be used for new conversations started with the New Workspace option.": "选择使用“新建工作区”选项开启新对话时采用的工作区类型。",
        "Specifies the agent's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.": "指定智能体在请求审查产物时的行为；产物是它为提供更丰富的对话体验而创建的文档。",
        "Grant the selected actions on the listed issue numbers — a comma-separated list like 1, 2, 3, or * for all.": "对列出的议题编号授予所选操作 —— 逗号分隔的列表，如 1, 2, 3，或 * 表示全部。",
        "Grant the selected actions on the listed pull request numbers — a comma-separated list like 1, 2, 3, or * for all.": "对列出的拉取请求编号授予所选操作 —— 逗号分隔的列表，如 1, 2, 3，或 * 表示全部。",
        "Grant the selected actions on the listed branch names — a comma-separated list like main, dev, prod (glob patterns like fix-* allowed), or * for all.": "对列出的分支名授予所选操作 —— 逗号分隔的列表，如 main, dev, prod（允许 fix-* 之类的通配模式），或 * 表示全部。",
        "Artifacts like Google Docs, PDFs, Office documents (Word, Excel, PowerPoint), etc. Everything else the agent creates is under Artifacts.": "产物如 Google 文档、PDF、Office 文档（Word、Excel、PowerPoint）等。智能体创建的其他内容都在“产物”下。",
        "Remove individual uploaded files or connected resources in Project Settings, or delete a project or conversation to remove its stored files.": "在项目设置中移除单独上传的文件或已连接的资源，或删除项目/对话以移除其存储的文件。",
        "Uploaded project files and in-chat attachments are stored on Google servers and mounted into your cloud sandbox so your agent can read and work with them.": "上传的项目文件和对话内附件存储在 Google 服务器上，并挂载到你的云沙箱中，以便智能体读取和处理。",
        "Git-on-Borg repository used when creating a new Cog workspace from your initial prompt (e.g., chromium/src or android/platform/superproject).": "从初始提示词创建新的 Cog 工作区时使用的 Git-on-Borg 仓库（例如 chromium/src 或 android/platform/superproject）。",
        "Logs each telemetry event to the browser's DevTools console as it fires, with the click or key that caused it. Stays on across reloads until you turn it off.": "每次遥测事件触发时，连同引发它的点击或按键一起记录到浏览器 DevTools 控制台。在关闭前会一直保持开启。",
        "Render display math flush left.": "渲染独立公式时左对齐。",
        "Render display math in leqno style (left-justified tags).": "以 leqno 样式渲染独立公式（标签左对齐）。",
        "Sign in to an app once and your agent can use it on any device. Open an app to see the account it uses or to disconnect it.": "登录一次应用后，智能体即可在任意设备上使用它。打开应用可查看其使用的账户或断开连接。",
        "Attackers might be able to see the images you're looking at on this site and trick you by modifying them.": "攻击者可能看到你在此站点查看的图片，并通过修改它们来欺骗你。",
        "You should not enter any sensitive information on this site (for example, passwords or credit cards), because it could be stolen by attackers.": "你不应在此站点输入任何敏感信息（例如密码或信用卡），因为它可能被攻击者窃取。",
            // —— 媒体播放控制 ——
        "Back 5s (←)": "后退 5 秒 (←)",
        "Forward 5s (→)": "前进 5 秒 (→)",
            // —— 远程控制扫码片段 ——
        "Scan the code to open this device in Remote Control, or": "扫描二维码在远程控制中打开此设备，或",
            // —— 省略号变体与浏览历史 ——
        "Change…": "更改…",
        "Change": "更改",
            // —— Markdown 渲染说明 ——
        "Trust the input, enabling all HTML features such as \\url.": "信任输入内容，启用所有 HTML 特性（例如 \\url）。",
        "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.": "以独立公式模式渲染数学公式，即使用 display 样式（例如 \\int 和 \\sum 会变大），并在页面中单独一行居中显示。",
            // —— 2.34.0 补充词条（audit.js 审计补译） ——
        "Agent can scroll on browser pages to access more content.": "智能体可以在浏览器页面中滚动以获取更多内容。",
        "Agent can retrieve console logs from the browser and return it for further processing.": "智能体可以获取浏览器控制台日志并返回以供进一步处理。",
        "Approve": "批准",
        "Accept": "接受",
        "Decline": "拒绝",
        "Reject": "拒绝",
        "Reject all": "全部拒绝",
        "Deny with note": "拒绝并附说明",
        "Add note": "添加说明",
        "Customize Sidebar": "自定义侧栏",
        "Sidebar": "侧栏",
        "In chat": "在对话中",
        "Manage": "管理",
        "MCP": "MCP",
        "MCP error": "MCP 错误",
        "MCP server error": "MCP 服务器错误",
        "Reconnect": "重新连接",
        "Review contents": "查看内容",
        "Add anyway": "仍然添加",
        "Artifact": "产物",
        "Commands outside sandbox": "沙箱外命令",
        "Enable sandbox mode": "启用沙箱模式",
        "Enable terminal sandbox": "启用终端沙箱",
        "Connect to SSH Host…": "连接到 SSH 主机…",
        "SSH Host…": "SSH 主机…",
        "SSH Host": "SSH 主机",
        "SSH host": "SSH 主机",
        "SSH Config": "SSH 配置",
        "SSH config:": "SSH 配置：",
        "Stop SSH Server…": "停止 SSH 服务器…",
        "Hidden hosts": "已隐藏的主机",
        "No hosts in": "没有主机：",
        "Couldn't load your SSH hosts": "无法加载你的 SSH 主机",
        "Couldn't load your SSH hosts. You can still type one.": "无法加载你的 SSH 主机，你仍可以手动输入。",
        "Enter [user@]host[:port], or pick a host from your SSH config.": "输入 [用户@]主机[:端口]，或从 SSH 配置中选择主机。",
        "Controls how much time and quota the model spends reasoning before responding. Higher effort improves accuracy on hard problems, at the cost of slower responses and higher quota use.": "控制模型在回答前用于推理的时间和额度。投入越高，难题的准确率越高，但响应更慢、额度消耗更多。",
        "Thinking effort": "思考强度",
        "Curated sets of plugins for common workflows and roles.": "为常见工作流和角色精选的插件组合。",
        "Discard comment draft": "放弃评论草稿",
        "Resume comment draft": "继续编辑评论草稿",
        "Resume 1 comment draft": "继续编辑 1 条评论草稿",
        "Unsent draft": "未发送的草稿",
        "1 Draft": "1 份草稿",
        "FAQ": "常见问题",
        "Filter and Sort": "筛选与排序",
        "Filters": "筛选",
        "Filter agents": "筛选智能体",
        "Filter plugins": "筛选插件",
        "Finish signing in to": "完成登录：",
        "Idle Conversations": "空闲对话",
        "Keybinding Scheme": "快捷键方案",
        "VS Code Default": "VS Code 默认",
        "VS Code Keyboard Shortcuts": "VS Code 键盘快捷方式",
        "Antigravity (AGY) Style": "Antigravity (AGY) 风格",
        "Choose between non-colliding VS Code defaults or standalone Antigravity chords.": "在不冲突的 VS Code 默认快捷键与独立的 Antigravity 组合键之间选择。",
        "Manage your keybinding scheme and customize shortcuts in VS Code.": "在 VS Code 中管理快捷键方案并自定义快捷方式。",
        "All active Antigravity shortcuts and user keybinding overrides are managed directly by VS Code.": "所有生效的 Antigravity 快捷键及用户自定义按键均直接由 VS Code 管理。",
        "Customize Shortcuts": "自定义快捷键",
        "Inspect live bindings or record custom key chords filtered to": "查看当前按键绑定或录制自定义组合键，筛选范围：",
        "Last Activity": "最近活动",
        "Layout": "布局",
        "OK": "确定",
        "Orchestrator": "编排器",
        "Orchestrator Model": "编排器模型",
        "Orchestrator Settings": "编排器设置",
        "Executor Model": "执行器模型",
        "Main Agent": "主智能体",
        "Choose the models Orchestrator uses. A larger, smarter orchestrator model with a faster, cheaper executor gives high quality for fewer tokens.": "选择编排器使用的模型。搭配更大更聪明的编排器模型与更快更便宜的执行器模型，可以用更少的 token 获得高质量结果。",
        "Plans the work, makes design decisions, and reviews the result. Pick a top-tier model. You can also pick one per conversation from the Orchestrator row in the model menu.": "负责规划工作、做出设计决策并审查结果。请选择顶级模型。也可以在模型菜单的“编排器”一行为每个对话单独选择。",
        "Carries out the plan: searches, edits, builds, and tests. Pick a faster, cheaper model.": "负责执行计划：搜索、编辑、构建与测试。请选择更快、更便宜的模型。",
        "Raw": "原始",
        "Show Automation Conversations": "显示自动化对话",
        "Show Plugin Conversations": "显示插件对话",
        "Show or Hide Plugins": "显示或隐藏插件",
        "Only Automations": "仅自动化",
        "Stop all agents": "停止所有智能体",
        "Stop this agent": "停止此智能体",
        "Stop Task": "停止任务",
        "Interrupt Agent": "中断智能体",
        "Pause this agent; it keeps its place and streams. Resume to continue.": "暂停此智能体，它会保留当前进度与输出流，恢复后继续。",
        "Resume this agent where it paused": "从暂停处恢复此智能体",
        "Terminal command auto execution": "终端命令自动执行",
        "Terminal commands": "终端命令",
        "Terminal window": "终端窗口",
        "Add Terminal": "添加终端",
        "Attach terminal output": "附加终端输出",
        "in a terminal": "在终端中",
        "Toggle Virtual Machine": "切换虚拟机",
        "Unread": "未读",
        "Pinned": "已置顶",
        "Pin / Unpin Conversation": "置顶 / 取消置顶对话",
        "Verify that these licenses were provided by your administrator and that you trust the project ID before proceeding. Account activity and data may be logged by your organization.": "继续之前，请确认这些许可证由你的管理员提供，并且你信任该项目 ID。你的组织可能会记录账号活动和数据。",
        ", then reopen this dialog.": "，然后重新打开此对话框。",
        ", then turn it on.": "，然后将其开启。",
        ", always on.": "，始终开启。",
        "? This action cannot be undone.": "吗？此操作无法撤销。",
        "? This removes it from your config directory.": "吗？这会将其从你的配置目录中移除。",
        "? This will remove it from your MCP configuration.": "吗？这会将其从你的 MCP 配置中移除。",
        ". Reload the window if a change does not take effect.": "。如果更改未生效，请重新加载窗口。",
        ". You can control this from your settings at any point.": "。你可以随时在设置中更改。",
        ". Your use is subject to the": "。你的使用须遵守",
        ". It is not visible in the agent's sandbox and is shared across all your projects.": "。它在智能体沙箱中不可见，并在你的所有项目之间共享。",
        ". If it isn't in the list, drag it in from the small window next to System Settings.": "。如果它不在列表中，请从“系统设置”旁的小窗口中把它拖进去。",
        ". For non-corp passwords or SSH passphrases, allow the next prompt and re-run your command.": "。对于非公司密码或 SSH 口令，请允许下一次提示并重新运行命令。",
        ". To add another account, go to the": "。如需添加其他账号，请前往",
        "(empty)": "（空）",
        "(excluding product analytics data)": "（不含产品分析数据）",
        "(for example, passwords, messages, or credit cards).": "（例如密码、消息或信用卡信息）。",
        "· estimated": "· 估算",
        "• Aggregate cost across all subagents": "• 汇总所有子智能体的成本",
        "• Includes nested subagent costs": "• 包含嵌套子智能体的成本",
        "cumulative total for the conversation up to this point": "截至目前该对话的累计总量",
        "+ Add branch policy": "+ 添加分支策略",
        "+ Add Hook": "+ 添加钩子",
        "+ Add issue policy": "+ 添加议题策略",
        "+ Add Organization policy": "+ 添加组织策略",
        "+ Add pull request policy": "+ 添加拉取请求策略",
        "+ Add Repository policy": "+ 添加仓库策略",
        "+ Add workflow run policy": "+ 添加工作流运行策略",
        "Each rule lets the agent run the listed workflow files on the listed refs — each a comma-separated list like ci.yml, deploy.yml and main, dev (glob patterns like fix-* allowed), or * for all. Both fields must be set for a rule to grant anything.": "每条规则允许智能体在所列引用上运行所列工作流文件——两者均为逗号分隔的列表，如 ci.yml, deploy.yml 与 main, dev（支持 fix-* 这样的通配符），或用 * 表示全部。两个字段都填写后规则才会生效。",
        "e.g. ci.yml,deploy.yml or *": "例如 ci.yml,deploy.yml 或 *",
        "e.g. main,dev or *": "例如 main,dev 或 *",
        "e.g. google or *": "例如 google 或 *",
        "Grant repository access": "授予仓库访问权限",
        "Validated with GitHub and stored in": "已通过 GitHub 验证并保存在",
        "GitHub: not signed in": "GitHub：未登录",
        "Create a token": "创建令牌",
        "⚠️ Failed to render LaTeX:": "⚠️ LaTeX 渲染失败：",
        "⚠️ Failed to render Mermaid diagram:": "⚠️ Mermaid 图表渲染失败：",
        "7 days": "7 天",
        "14 days": "14 天",
        "21 days": "21 天",
        "Days": "天",
        "Any time": "任意时间",
        "Day of the month": "每月几号",
        "Day of the week": "星期几",
        "2x playback speed": "2 倍速播放",
        "A chunk is a section of the page. Long pages are chunked so that only the sections that are relevant to your query are read.": "分块是页面的一个片段。长页面会被分块，只读取与你的问题相关的部分。",
        "Long pages like this one will be broken down into outlines and read as needed. Read more at our": "像这样的长页面会被拆分为大纲并按需读取。详情请参阅我们的",
        "A group with this name already exists.": "已存在同名分组。",
        "already exists.": "已存在。",
        "already exists for this": "已存在于此",
        "A new version is available.": "有新版本可用。",
        "Access restricted": "访问受限",
        "Blocked by organization policy": "已被组织策略阻止",
        "Add New Handler to": "添加新的处理程序到",
        "Handler #": "处理程序 #",
        "AI coding agents are known to have certain security risks, including autonomous code execution, data exfiltration, prompt injection and supply chain risks. Ensure that you monitor and verify all actions taken by the agent.": "AI 编程智能体存在一定的安全风险，包括自主执行代码、数据外泄、提示词注入和供应链风险。请务必监控并核实智能体执行的所有操作。",
        "AI Credits are used when you've exceeded your model quota. Keep track of your current AI Credits in the": "超出模型额度后将使用 AI 积分。你可以在以下位置查看当前 AI 积分：",
        "All agents": "所有智能体",
        "Allow Google to collect and use your Interactions data, subject to the": "允许 Google 收集并使用你的交互数据，须遵守",
        "Allow Next Non-Corp Prompt": "允许下一次非公司密码提示",
        "Allowed Domains": "允许的域名",
        "Credentials are only sent to the domains listed.": "凭据仅会发送到所列域名。",
        "Always open": "始终打开",
        "An agent is using the built-in browser. Clearing its data signs the agent out of sites and may interrupt its task.": "有智能体正在使用内置浏览器。清除其数据会使智能体退出各网站的登录，并可能中断其任务。",
        "and add it again.": "并重新添加。",
        "Are you sure you want to delete the": "确定要删除",
        "Are you sure you want to delete this side question? This action cannot be undone.": "确定要删除这个旁路提问吗？此操作无法撤销。",
        "This side question isn't available in this conversation.": "此旁路提问在当前对话中不可用。",
        "Side Question Selection": "旁路提问选区",
        "Insert into main conversation": "插入到主对话",
        "The main conversation's input isn't available right now.": "主对话的输入框当前不可用。",
        "Ask to retry": "请求重试",
        "At Mention Code Block": "@ 提及代码块",
        "at ref": "位于引用",
        "Attackers might be trying to steal your information from": "攻击者可能正试图窃取你在以下网站的信息：",
        "Authorization code": "授权码",
        "Paste the code shown after you sign in.": "粘贴登录后显示的代码。",
        "Sign in in your browser, then paste the authorization code shown on the callback page.": "在浏览器中登录，然后粘贴回调页面上显示的授权码。",
        "Trouble signing in? Enter authorization code": "登录遇到问题？输入授权码",
        "Waiting for you to finish signing in…": "正在等待你完成登录…",
        "Sign-in failed:": "登录失败：",
        "Not signed in": "未登录",
        "Auto-assignment not configured": "未配置自动分配",
        "Automated safeguards help to protect your conversations from insecure or unsafe content. That being said, users should be aware of potential agentic risks, including data exfiltration.": "自动防护机制有助于保护你的对话免受不安全内容的影响。尽管如此，用户仍应注意潜在的智能体风险，包括数据外泄。",
        "automation and can only be deleted by deleting that automation.": "自动化，只能通过删除该自动化来删除。",
        "Avoid uploading highly sensitive data and verify actions taken by your agent. Make sure you have the": "请避免上传高度敏感的数据，并核实智能体执行的操作。请确保你拥有",
        "necessary rights": "必要的权利",
        "Background tasks and terminals agents left running, across all conversations.": "所有对话中智能体留下仍在运行的后台任务和终端。",
        "Bot": "机器人",
        "Browse Connectors": "浏览连接器",
        "Browse MCP resources": "浏览 MCP 资源",
        "Browse rules": "浏览规则",
        "View MCP servers": "查看 MCP 服务器",
        "Browser control is gated in remote sessions.": "远程会话中的浏览器控制受到限制。",
        "Browsing Data": "浏览数据",
        "Browsing history": "浏览历史",
        "Visited URLs and autocomplete suggestions.": "访问过的网址和自动补全建议。",
        "Cookies and other site data": "Cookie 及其他网站数据",
        "Cookies by Site": "按网站管理 Cookie",
        "Sites with cookies": "存有 Cookie 的网站",
        "No sites have cookies in the built-in browser.": "内置浏览器中没有网站存有 Cookie。",
        "Search sites": "搜索网站",
        "Search sites...": "搜索网站...",
        "Cookies the built-in browser stores for each site. Deleting a site's cookies usually signs you out of it. Other site data (local storage, IndexedDB, cache) is cleared only by Browsing Data → Clear.": "内置浏览器为每个网站保存的 Cookie。删除某网站的 Cookie 通常会使你退出该网站。其他网站数据（本地存储、IndexedDB、缓存）只能通过“浏览数据 → 清除”来清理。",
        "Cookies, site storage and cache. Signs you out of all sites in the built-in browser and reloads its open tabs.": "Cookie、网站存储与缓存。会使你退出内置浏览器中的所有网站，并重新加载已打开的标签页。",
        "Clear Browsing Data?": "清除浏览数据？",
        "Clear history, cookies and site data from the built-in browser, or manage cookies for each site.": "清除内置浏览器的历史记录、Cookie 和网站数据，或按网站管理 Cookie。",
        "Choose what to clear from the built-in browser. It can't be undone.": "选择要从内置浏览器中清除的内容。此操作无法撤销。",
        "Clearing cookies and site data for": "正在清除以下网站的 Cookie 和数据：",
        "Could not clear site data for": "无法清除以下网站的数据：",
        "Site data cleared for": "已清除以下网站的数据：",
        "Couldn't clear browsing data. Try again.": "无法清除浏览数据，请重试。",
        "Couldn't delete cookies for": "无法删除以下网站的 Cookie：",
        "Couldn't load cookies.": "无法加载 Cookie。",
        "Category": "类别",
        "Check that the microphone is unmuted and the right input device is selected.": "请检查麦克风是否未静音，并已选择正确的输入设备。",
        "Voice dictation unavailable": "语音听写不可用",
        "Stop transcription": "停止转写",
        "Voices": "音色",
        "Checking…": "正在检查…",
        "Installing": "正在安装",
        "Installed separately": "单独安装",
        "Searching": "正在搜索",
        "Stopping…": "正在停止…",
        "Zipping": "正在压缩",
        "Resolving link…": "正在解析链接…",
        "Starting the conversation…": "正在开始对话…",
        "Importing shared conversation...": "正在导入共享的对话...",
        "Choose File…": "选择文件…",
        "Choose which key sends a message in the chat composer.": "选择在对话输入框中用哪个键发送消息。",
        "Enter to send": "Enter 发送",
        "Enter always submits. This adds a second shortcut.": "Enter 始终会提交，这里是额外添加的第二个快捷键。",
        "Submit Prompt (Alternate to Enter)": "提交提示（Enter 的替代键）",
        "Messages now send immediately. Configure in": "现在消息会立即发送。可在以下位置配置：",
        "Instead of queueing, try asking the agent to do something after the current task.": "与其排队，不如让智能体在当前任务完成后再做某件事。",
        "Code": "代码",
        "Color": "颜色",
        "Icon": "图标",
        "Command prompt": "命令提示",
        "Command setup script": "命令初始化脚本",
        "Comments (": "评论 (",
        "No comments yet": "暂无评论",
        "Reply": "回复",
        "Computer": "电脑",
        "Configure allowed and denied URLs for the browser subagent (invoked with /browser). Requires": "为浏览器子智能体（通过 /browser 调用）配置允许和禁止的网址。需要",
        "Connect your account to browse": "连接你的账号以浏览",
        "Continue Task →": "继续任务 →",
        "Conversation is not open in this Hub window": "该对话未在此 Hub 窗口中打开",
        "Copy as Markdown": "复制为 Markdown",
        "Could not load": "无法加载",
        "Could not load the app view:": "无法加载应用视图：",
        "Couldn't connect": "无法连接",
        "Couldn't connect to": "无法连接到",
        "Couldn't search files": "无法搜索文件",
        "Couldn't start the coordinator:": "无法启动协调器：",
        "Couldn't switch accounts:": "无法切换账号：",
        "To switch accounts, sign out in the": "如需切换账号，请在以下位置退出登录：",
        "Custom models are only supported on Linux machines.": "自定义模型仅支持 Linux 机器。",
        "Customize your experience across the agent, plugins, and product from the settings and marketplace. We won’t show you ads or let advertisers influence what": "通过设置和市场自定义你在智能体、插件和产品中的体验。我们不会向你展示广告，也不会让广告商影响",
        "Default workspace VCS": "默认工作区版本控制系统",
        "Disabling or removing this bundle doesn't affect it.": "停用或移除此捆绑包不会影响它。",
        "No bundles available.": "没有可用的捆绑包。",
        "Review bundle before adding": "添加前查看捆绑包",
        "Disk is full. Search will no longer match in conversation bodies until you clear up space and restart.": "磁盘已满。在你清理空间并重启之前，搜索将无法匹配对话正文。",
        "Docs, Sheets, Slides, and folders": "文档、表格、幻灯片和文件夹",
        "Empty table": "空表格",
        "Enable Browser Agent": "启用浏览器智能体",
        "Enable this plugin to manage its accounts.": "启用此插件以管理其账号。",
        "Services this plugin connects to on your behalf.": "此插件代表你连接的服务。",
        "Suggested plugin:": "推荐插件：",
        "UI plugins": "界面插件",
        "No plugins available": "没有可用的插件",
        "Plugins Options": "插件选项",
        "Plugins are packaged collections of skills and MCPs to help the Agent": "插件是打包好的技能与 MCP 集合，用于帮助智能体",
        "Entering your corp password in the web terminal triggers a Chrome Password Alert (Watchword) forced password reset, so this prompt was automatically cancelled.": "在网页终端中输入公司密码会触发 Chrome 密码警报（Watchword）强制重置密码，因此已自动取消此提示。",
        "Expand": "展开",
        "Expired · Action not taken": "已过期 · 未执行操作",
        "Failed to clone project locally": "无法在本地克隆项目",
        "Failed to open MCP config file": "无法打开 MCP 配置文件",
        "Failed to send command input": "无法发送命令输入",
        "Failed to unarchive local project": "无法取消归档本地项目",
        "File access rules": "文件访问规则",
        "Network access rules": "网络访问规则",
        "File reads": "文件读取",
        "File writes": "文件写入",
        "Files to edit:": "要编辑的文件：",
        "Files, folders, and repositories you connect are accessible to your agent in this project, including during background or scheduled runs.": "你连接的文件、文件夹和仓库可供本项目中的智能体访问，包括后台运行或定时运行期间。",
        "Here's how uploaded files, attachments, and connected resources work in your cloud environment": "以下是上传文件、附件及已连接资源在云端环境中的工作方式",
        "Flags come from Mendel experiments and from the host app. Overrides are local to this browser and change how every feature gated on the flag resolves. Some features are only read at startup — reload the window if a change does not take effect.": "标志来自 Mendel 实验和宿主应用。覆盖值仅对当前浏览器生效，并会改变所有受该标志控制的功能。部分功能只在启动时读取——如果更改未生效，请重新加载窗口。",
        "Not referenced by any feature (": "未被任何功能引用 (",
        "Preview disabled (experiment off)": "预览已停用（实验未开启）",
        "Try out early-stage features before they ship. These may be changed or removed at any time. These features are experimental, and we make no guarantees about performance or functionality.": "抢先体验尚未正式发布的早期功能。这些功能随时可能更改或移除，属于实验性质，我们不对其性能或功能作任何保证。",
        "For Antigravity Business consumption options, see": "关于 Antigravity 商业版的用量方案，请参阅",
        "Force": "强制",
        "from AI Studio": "来自 AI Studio",
        "Go to the machine you are controlling and quit Antigravity. It installs pending updates the next time it starts.": "请前往被控制的机器并退出 Antigravity，它会在下次启动时安装待处理的更新。",
        "Google Antigravity Terms of Service": "Google Antigravity 服务条款",
        "Privacy Notice": "隐私声明",
        "Prohibited Use Policy": "禁止使用政策",
        "Google Cloud Project ID": "Google Cloud 项目 ID",
        "Hide": "隐藏",
        "in Browser": "在浏览器中",
        "In System Settings, click": "在“系统设置”中，点击",
        "In System Settings, turn on": "在“系统设置”中，开启",
        "in the top menu.": "（位于顶部菜单）。",
        "Include at least one positive": "至少包含一个正向条件",
        "Input Box": "输入框",
        "Intended primarily for previewing local development servers (e.g.,": "主要用于预览本地开发服务器（例如",
        "Jump to Next Prompt": "跳到下一条提示",
        "Jump to Previous Prompt": "跳到上一条提示",
        "learn more": "了解更多",
        "Learn more by visiting our": "了解更多，请访问我们的",
        "troubleshooting guide": "故障排查指南",
        "Let the agent open URLs, read web pages, and interact with browser content. This gives the agent access to important (and often critical) knowledge and methods of validation, but any browser integration does increase exposure to external malicious parties for security exploits.": "允许智能体打开网址、阅读网页并与浏览器内容交互。这让智能体能够获取重要（且往往关键）的知识与验证手段，但任何浏览器集成都会增加被外部恶意方利用安全漏洞的风险。",
        "links without asking": "链接，无需询问",
        "Manual Order": "手动排序",
        "Many external websites (such as Google Search, GitHub, or Wikipedia) restrict iframe embedding via": "许多外部网站（如 Google 搜索、GitHub 或维基百科）会通过以下方式限制 iframe 嵌入：",
        "This page is taking longer than expected to load, or it may be blocking embedded views (via X-Frame-Options or CSP).": "此页面加载时间超出预期，或者它可能阻止了嵌入式视图（通过 X-Frame-Options 或 CSP）。",
        "Match Whole Word (ab)": "全字匹配 (ab)",
        "Move Down": "下移",
        "Move Up": "上移",
        "Needs Input": "需要输入",
        "New conversation button": "新建对话按钮",
        "No compatible devices found.": "未找到兼容的设备。",
        "No content available for this resource": "此资源没有可用内容",
        "No longer available": "已不可用",
        "No matching resources found.": "未找到匹配的资源。",
        "No recent downloads": "最近没有下载",
        "No sign-in required. This app is ready to use.": "无需登录，此应用可以直接使用。",
        "No sites match “": "没有匹配的网站：“",
        "Only applies when grouped by status": "仅在按状态分组时生效",
        "Open Google Chrome on the machine running Antigravity.": "在运行 Antigravity 的机器上打开 Google Chrome。",
        "Open on another device": "在其他设备上打开",
        "Open on phone": "在手机上打开",
        "Pick up this remote conversation on your phone or in any browser. Scan the QR code or open the link below.": "在手机或任意浏览器中继续这个远程对话。扫描二维码或打开下方链接。",
        "Optional boolean filter": "可选的布尔筛选条件",
        "Organization MCP Allowlist (Read-Only)": "组织 MCP 允许列表（只读）",
        "Page": "页",
        "Parsing error:": "解析错误：",
        "Permanently delete your remote conversations, projects, scheduled tasks, connected plugins and settings. Data in the desktop app and your Google account are not affected.": "永久删除你的远程对话、项目、定时任务、已连接插件和设置。桌面应用中的数据和你的 Google 账号不受影响。",
        "This permanently deletes all of your Remote Agents conversations, projects, scheduled tasks, connected plugins and settings, and stops any running remote agents. It can't be undone. Data in the desktop app and your Google account are not affected, and you can keep using Remote Agents afterwards.": "这会永久删除你所有的远程智能体对话、项目、定时任务、已连接插件和设置，并停止所有正在运行的远程智能体。此操作无法撤销。桌面应用中的数据和你的 Google 账号不受影响，之后你仍可继续使用远程智能体。",
        "Permission approval scope": "权限批准范围",
        "Permission preset": "权限预设",
        "Security preset": "安全预设",
        "Runtime permission": "运行时权限",
        "Please describe the feature you'd like to see. The more detailed the requirements, the easier it will be for our team to incorporate your ideas. Some helpful information includes:": "请描述你希望看到的功能。需求越详细，我们的团队就越容易采纳你的想法。以下信息会有所帮助：",
        "Please describe your auth or billing issue. More details will help our support team resolve your issue quicker. Some helpful information includes:": "请描述你遇到的登录或计费问题。提供更多细节可以帮助支持团队更快解决问题。以下信息会有所帮助：",
        "Use this form if you cannot connect to Remote Control. If your instance is already connected and you are experiencing issues in the browser, report directly from the Remote Control web page so that relevant logs are included. Some helpful information includes:": "如果无法连接远程控制，请使用此表单。如果你的实例已连接、但在浏览器中遇到问题，请直接在远程控制网页上反馈，以便附带相关日志。以下信息会有所帮助：",
        "What functionality you expect your account tier to have available that is missing": "你认为你的账号等级应有但缺失的功能",
        "What is missing in your workflow": "你的工作流中缺少什么",
        "What quota or feature is being incorrectly limited": "哪些额度或功能被错误地限制了",
        "What you would like to see to address this gap in your workflow": "你希望通过什么来弥补工作流中的这一不足",
        "Whether it never connects or is intermittent/flaky": "是完全无法连接，还是时断时续/不稳定",
        "Please verify your account to continue using": "请验证你的账号以继续使用",
        "Please verify your account, then sign in again to continue. Learn more by visiting our": "请验证你的账号，然后重新登录以继续。了解更多，请访问我们的",
        "Sorry, this account is ineligible to use": "抱歉，此账号不符合使用条件：",
        "Press": "按",
        "Previous": "上一个",
        "Previous chats live under a deprecated Google3 Project": "以前的对话位于已弃用的 Google3 项目下",
        "Proceed to": "继续前往",
        "Readme": "自述文件",
        "References": "引用",
        "Relaunch ↻": "重新启动 ↻",
        "Reopen ↗": "重新打开 ↗",
        "Settings ↗": "设置 ↗",
        "Remote Control isn't active on this instance. Enable it in": "此实例未启用远程控制。请在以下位置启用：",
        "Stream and control": "串流与控制",
        "Remove from Recent": "从最近使用中移除",
        "Repo": "仓库",
        "Resources": "资源",
        "Response actions": "回复操作",
        "Sample GDoc": "Sample GDoc",
        "Screen locked: agents can't use this Mac until you unlock it": "屏幕已锁定：解锁前智能体无法使用这台 Mac",
        "Screenshot must be under 10 MB": "截图必须小于 10 MB",
        "Search conversations": "搜索对话",
        "Search failed": "搜索失败",
        "Section header:": "章节标题：",
        "See all (": "查看全部 (",
        "Select one or more options": "选择一个或多个选项",
        "Send": "发送",
        "Set up my environment": "设置我的环境",
        "Settings -": "设置 -",
        "Show 10": "显示 10 项",
        "Show 5": "显示 5 项",
        "Show Details": "显示详情",
        "Show more (": "显示更多 (",
        "Show submitted (": "显示已提交 (",
        "Sign up for newsletters, tips and tricks, and other notifications about": "订阅新闻通讯、使用技巧及其他相关通知：",
        "Skipped": "已跳过",
        "Start Best-of-": "开始多路优选：",
        "Successfully imported project:": "已成功导入项目：",
        "Switch To": "切换到",
        "Switch to This Computer": "切换到这台电脑",
        "System default app": "系统默认应用",
        "Telemetry is turned off for your account.": "你的账号已关闭遥测。",
        "Tell the agent what to do instead...": "告诉智能体改为做什么...",
        "Text Selection": "文本选择",
        "Text selection is paused for smoother viewing. Search, comments, and annotations still work. Use the toolbar text button when selection is needed.": "为了更流畅的浏览，已暂停文本选择。搜索、评论和批注仍可使用。需要选择文本时，请使用工具栏中的文本按钮。",
        "The agent will wait for you to install the browser extension.": "智能体会等待你安装浏览器扩展。",
        "The breakdown below shows token usage from customizations like rules, skills, and MCP. If a budget is exceeded, large rules are demoted to path pointers and large customizations are excluded automatically.": "下方明细显示了规则、技能和 MCP 等自定义项的 token 用量。如果超出预算，大型规则会被降级为路径指针，大型自定义项会被自动排除。",
        "The conversation was compacted to fit within the context window.": "对话已被压缩以适应上下文窗口。",
        "The conversation was compacted while generating this response.": "生成此回复时对话已被压缩。",
        "The Hub sent an unexpected response.": "Hub 返回了意外的响应。",
        "There are currently no Build with": "目前还没有 Build with",
        "to add to Agent": "以添加到智能体",
        "to exit": "以退出",
        "to upload": "以上传",
        "Toggle Word Wrap": "切换自动换行",
        "tokens (": "token (",
        "Tree": "树",
        "Unknown Option:": "未知选项：",
        "Use": "使用",
        "Use Default": "使用默认值",
        "UTC": "UTC",
        "Validate": "验证",
        "View archived in the sidebar (![tune](icon://tune) Customize Sidebar).": "可在侧栏中查看已归档内容（![tune](icon://tune) 自定义侧栏）。",
        "Waiting for the agents’ windows…": "正在等待智能体的窗口…",
        "Web (desktop, remote agents, PWA)": "网页（桌面端、远程智能体、PWA）",
        "Web (desktop, remote agents)": "网页（桌面端、远程智能体）",
        "Web (mobile, remote agents, PWA)": "网页（移动端、远程智能体、PWA）",
        "Web (mobile, remote agents)": "网页（移动端、远程智能体）",
        "Web search prioritized results from": "网页搜索优先显示来自以下来源的结果：",
        "When Turbo mode is on, the agent will automatically capture screenshots in the Browser without explicit user input. You can toggle this setting in Antigravity's settings.": "开启 Turbo 模式后，智能体会在浏览器中自动截图，无需用户明确操作。你可以在 Antigravity 设置中切换此选项。",
        "Workflows are changing on October 19th—stay tuned for updates. You can use the agent to migrate your workflows.": "工作流将于 10 月 19 日起发生变化，敬请关注后续更新。你可以让智能体帮你迁移工作流。",
        "Working directory:": "工作目录：",
        "Working Directory:": "工作目录：",
        "You can prompt the model to try again or start a new conversation if the error persists.": "你可以让模型重试；如果错误持续出现，请开始新的对话。",
        "Your agent’s ability to execute commands is also controlled by enterprise security policies.": "智能体执行命令的能力还受企业安全策略控制。",
        "Eye": "眼睛",
        "Flask": "烧瓶",
        "Gauge": "仪表盘",
        "Radar": "雷达",
        "Robot": "机器人",
        "Shield": "盾牌",
        "Sliders": "滑块",
        "Sparkles": "闪光",
        "Speedometer": "速度表",
        "Wrench": "扳手",
        "Finder": "访达",
        "Select Sidebar Item 1": "选择侧栏第 1 项",
        "Select Sidebar Item 2": "选择侧栏第 2 项",
        "Select Sidebar Item 3": "选择侧栏第 3 项",
        "Select Sidebar Item 4": "选择侧栏第 4 项",
        "Select Sidebar Item 5": "选择侧栏第 5 项",
        "Select Sidebar Item 6": "选择侧栏第 6 项",
        "Select Sidebar Item 7": "选择侧栏第 7 项",
        "Select Sidebar Item 8": "选择侧栏第 8 项",
        "Select Sidebar Item 9": "选择侧栏第 9 项",
        "Boolean AND, OR, and negation": "布尔与、或、非",
        "Equality and list membership (e.g.": "相等判断与列表成员判断（例如",
        "Substring or list check (e.g.": "子串或列表检查（例如",
        "Match when the principal equals any listed username or belongs to any listed mdb/ group.": "当主体等于所列任一用户名或属于所列任一 mdb/ 组时匹配。",
        "— narrow matched events by status, priority, or event details": "——按状态、优先级或事件详情缩小匹配的事件范围",
        "Gruvbox Material": "Gruvbox Material",
        "One Dark Pro": "One Dark Pro",
        "One Light": "One Light",
        "Solarized Dark": "Solarized Dark",
        "Solarized Light": "Solarized Light",
        "Tokyo Night": "Tokyo Night",
        "PID": "PID",
        "CSP": "CSP",
        "X-Frame-Options": "X-Frame-Options",
        "GMT": "GMT",
        "Hub": "Hub",
        ", choose": "，选择",
        ", click": "，点击",
        ", then": "，然后",
        ", open Chrome": "，打开 Chrome",
        "), use an external SSH session": "），请使用外部 SSH 会话",
        ". If a page fails to load, use the": "。如果页面加载失败，请使用",
        ". Active workspace URI:": "。当前工作区 URI：",
        ". Applying or clearing reloads the window. Suggestions come from your recent workspaces and the folders of your existing projects and their environments": "。应用或清除会重新加载窗口。建议来自你最近的工作区以及现有项目及其环境所在的文件夹",
        "(Specific to this client's truncation and pagination)": "（特定于此客户端的截断与分页方式）",
        "— specify at least one user, team, component, or resource (joined with": "——至少指定一个用户、团队、组件或资源（连接方式：",
        // 2.34.0 对话步骤行：前缀动词（步骤行由「前缀 + 内容」两个独立元素组成）与步骤组摘要
        "Ran": "运行了",
        "Analyzed": "分析了",
        "Analyzing": "正在分析",
        "Edited": "编辑了",
        "edited": "编辑了",
        "Editing": "正在编辑",
        "Creating": "正在创建",
        "Read": "读取",
        "Reading": "正在读取",
        "Searched": "搜索了",
        "Explored": "探索了",
        "Exploring": "正在探索",
        "Viewed": "查看了",
        "Viewing": "正在查看",
        "Scrolled": "滚动了",
        "Clicked": "点击了",
        "Fetched": "获取了",
        "Browsed": "浏览了",
        "Listed": "列出了",
        "Rejected": "已拒绝",
        "Interrupted": "已中断",
        "Working": "工作中",
        "Thought Process": "思考过程",
        "Running command": "正在运行命令",
        "Analyzed Task Log": "分析了任务日志",
        "Analyzing Task Log": "正在分析任务日志",
        "Used MCP tool": "使用了 MCP 工具",
        "Generic Tool": "通用工具",
        "Unknown file edit": "未知的文件编辑",
        "No browser pages open": "没有打开的浏览器页面",
        "Explored files": "探索了文件",
        "Explored file": "探索了文件",
        "Explored artifacts": "探索了产物",
        "Explored artifact": "探索了产物",
        "Ran command": "运行了命令",
        "Ran commands": "运行了命令",
        "ran command": "运行了命令",
        "ran commands": "运行了命令",
        "Edited files": "编辑了文件",
        "Edited file": "编辑了文件",
        "edited files": "编辑了文件",
        "edited file": "编辑了文件",
        "Edited artifacts": "编辑了产物",
        "Edited artifact": "编辑了产物",
        "edited artifacts": "编辑了产物",
        "edited artifact": "编辑了产物",
    };
    // 动态句式（正则，$1 引用捕获组）
    var REGEX_MAP = [
        [/^\+?\s*See (\d+) more$/i, '查看更多 $1 项'],
        [/^Show (\d+) more(\.\.\.)?$/, '再显示 $1 项'],
        [/^\+\s*(\d+) more \(Show all\)$/, '+$1 项（显示全部）'],
        [/^Show (.+) \((\d+)\)$/, '显示 $1 ($2)'],
        [/^Show (\d+) breakdowns?$/, '展开 $1 条明细'],
        [/^([\d.]+)% of the customization budget is available\.$/, '$1% 的自定义预算可用。'],
        [/^See all \((\d+)\)$/, '查看全部 ($1)'],
        [/^Media \(Yesterday (.+)\)$/, '媒体 (昨天 $1)'],
        [/^Media \(Today (.+)\)$/, '媒体 (今天 $1)'],
        [/^Media \((.+)\)$/, '媒体 ($1)'],
        [/^(\d+)s$/, '$1 秒'],
        [/^(\d+)m$/, '$1 分钟'],
        [/^(\d+)h$/, '$1 小时'],
        [/^(\d+)d$/, '$1 天'],
        [/^(\d+)w$/, '$1 周'],
        [/^(\d+)mo$/, '$1 个月'],
        [/^(\d+)y$/, '$1 年'],
        [/^just now$/, '刚刚'],
        [/^(\d+) seconds? ago$/, '$1 秒前'],
        [/^(\d+) minutes? ago$/, '$1 分钟前'],
        [/^(\d+) hours? ago$/, '$1 小时前'],
        [/^(\d+) days? ago$/, '$1 天前'],
        [/^(\d+) weeks? ago$/, '$1 周前'],
        [/^(\d+) months? ago$/, '$1 个月前'],
        [/^(\d+) years? ago$/, '$1 年前'],
        [/^in (\d+) seconds?$/, '$1 秒后'],
        [/^in (\d+) minutes?$/, '$1 分钟后'],
        [/^in (\d+) hours?$/, '$1 小时后'],
        [/^in (\d+) days?$/, '$1 天后'],
        [/^(\d+) seconds? left$/, '剩余 $1 秒'],
        [/^(\d+) minutes? left$/, '剩余 $1 分钟'],
        [/^(\d+) hours? left$/, '剩余 $1 小时'],
        [/^Last run$/, '上次运行'],
        [/^Every (\d+) minutes?$/, '每 $1 分钟'],
        [/^Every (\d+) hours?$/, '每 $1 小时'],
        [/^Every hour at :(\d+)$/, '每小时的第 $1 分钟'],
        [/^Every hour$/, '每小时'],
        [/^Every (day|weekday|week)$/, '每$1'],
        [/^Proceed with implementation plan and (\d+) comments?$/, '按实施计划继续（附 $1 条评论）'],
        [/^(\d+) messages? in queue$/, '队列中有 $1 条消息'],
        [/^(\d{1,2}):(\d{2})\s*([AP])\.?M\.?$/i, function (m, h, mi, ap) { return (ap.toUpperCase() === 'A' ? '上午 ' : '下午 ') + h + ':' + mi; }],
    ];
    // 动态时间句式（前缀匹配，尾部时间自动美化）
    var PREFIX_MAP = [
        { p: 'You have used some of your weekly limit, it will fully refresh in ', t: '你已使用部分每周额度，将在 ', s: '后完全重置。' },
        { p: 'You have used some of your 5-hour limit, it will fully refresh in ', t: '你已使用部分 5 小时额度，将在 ', s: '后完全重置。' },
        { p: 'Your Plan: ', t: '你的方案：', s: '' },
        { p: 'Send feedback as ', t: '以 ', s: ' 身份发送反馈' },
        { p: 'Version ', t: '版本 ', s: '' },
        { p: 'Updated ', t: '更新于 ', s: '' },
        { p: 'Models within this group: ', t: '该分组包含的模型：', s: '' },
        { p: 'Next run ', t: '下次运行 ', s: '' },
        { p: 'Resets in ', t: '将在 ', s: '后重置' },
        { p: 'Every hour at :', t: '每小时的第 ', s: ' 分钟' },
        { p: 'Every hour, ', t: '每小时，', s: '' },
        { p: 'Every hour', t: '每小时', s: '' },
        { p: 'Every weekday at ', t: '每个工作日 ', s: '' },
        { p: 'Every weekday', t: '每个工作日', s: '' },
        { p: 'Every day at ', t: '每天 ', s: '' },
        { p: 'Every day', t: '每天', s: '' },
        { p: 'Every week at ', t: '每周 ', s: '' },
        { p: 'Every week', t: '每周', s: '' },
        { p: 'Monthly on the ', t: '每月 ', s: '' },
        { p: 'Daily at ', t: '每天 ', s: '' },
        { p: 'Weekly at ', t: '每周 ', s: '' },
        { p: 'Yesterday ', t: '昨天 ', s: '' },
        { p: 'Today ', t: '今天 ', s: '' },
        { p: 'Tomorrow ', t: '明天 ', s: '' },
    ];
    // 拼接句式（模板字符串）：\u0001 代表运行时插入的变量
    function agEscRe(x) {
        var out = '';
        for (var i = 0; i < x.length; i++) {
            var c = x.charAt(i);
            if ('.*+?^$()[]{}|\\'.indexOf(c) >= 0)
                out += '\\';
            out += c;
        }
        return out;
    }
    var DYNAMIC_MAP = [
        ['Available AI Credits: ', '可用 AI 积分：'],
        ['AI Credits: ', 'AI 积分：'],
        ["Also includes Global Permissions when working in this project. Learn more.", "同时包含全局权限，在当前项目中生效。了解更多。"],
        ["Also includes Global Permissions when working in these conversations. Learn more.", "同时包含全局权限，在这些对话中生效。了解更多。"],
        ["Also includes Global Permissions when working in this project.", "同时包含全局权限，在当前项目中生效。"],
        ["Also includes Global Permissions when working in these conversations.", "同时包含全局权限，在这些对话中生效。"],
        ['Welcome back. Where should we pick up?', '欢迎回来。我们从哪里继续？'],
        ['Hey there, what should we build today?', '嗨，今天想做点什么？'],
        ["Good to see you. What's next?", '很高兴见到你。接下来做什么？'],
        ['Welcome back, \u0001. Where should we pick up?', '欢迎回来，\u0001。我们从哪里继续？'],
        ['Hey \u0001, what should we build today?', '嗨，\u0001，今天想做点什么？'],
        ["Good to see you, \u0001. What's next?", '很高兴见到你，\u0001。接下来做什么？'],
        ['Welcome to \u0001!', '欢迎使用 \u0001！'],
        ['Copied \u0001 to clipboard', '已复制 \u0001 到剪贴板'],
        ['Copied \u0001', '已复制 \u0001'],
        ['Removed \u0001', '已移除 \u0001'],
        ['Renamed \u0001', '已重命名 \u0001'],
        ['Deleted \u0001', '已删除 \u0001'],
        ['Created \u0001', '已创建 \u0001'],
        ['Updated \u0001', '已更新 \u0001'],
        ['Saved \u0001', '已保存 \u0001'],
        ['Created automation "\u0001".', '已创建自动化“\u0001”。'],
        ['Created automation \u0001', '已创建自动化 \u0001'],
        ['Deleted automation \u0001', '已删除自动化 \u0001'],
        ['Agent finished: \u0001', '智能体已完成：\u0001'],
        ['Agent needs permission to act on \u0001', '智能体需要获得对 \u0001 执行操作的权限'],
        ['Running for \u0001', '运行了 \u0001'],
        ['Worked for \u0001', '工作了 \u0001'],
        ['Failed to save "\u0001"', '保存“\u0001”失败'],
        ['Failed to save \u0001', '保存 \u0001 失败'],
        ['Failed to load trajectory: \u0001', '加载轨迹失败：\u0001'],
        ['Failed to load \u0001', '加载 \u0001 失败'],
        ['Failed to read \u0001', '读取 \u0001 失败'],
        ['Failed to write \u0001', '写入 \u0001 失败'],
        ['Failed to delete \u0001', '删除 \u0001 失败'],
        ['Failed to update \u0001', '更新 \u0001 失败'],
        ['Failed to start "\u0001".', '启动“\u0001”失败。'],
        ['Error while running: \u0001', '运行时出错：\u0001'],
        ['Error while running \u0001', '运行 \u0001 时出错'],
        ['Branch \u0001 no longer exists', '分支 \u0001 已不存在'],
        ['Search Google for "\u0001"', '在 Google 上搜索“\u0001”'],
        ['Search for "\u0001" in the Marketplace', '在市场中搜索“\u0001”'],
        ['No MCP servers found for "\u0001"', '未找到“\u0001”的 MCP 服务器'],
        ['No apps found for "\u0001".', '未找到“\u0001”的应用。'],
        ['No plugins found for "\u0001".', '未找到“\u0001”的插件。'],
        ['No connectors match "\u0001"', '没有匹配“\u0001”的连接器'],
        ['No \u0001 configured.', '未配置 \u0001。'],
        ['No \u0001 matching your search', '没有匹配你搜索的 \u0001'],
        ['Select \u0001 Theme', '选择 \u0001 主题'],
        ['Select model with \u0001', '选择模型（\u0001）'],
        ['Select model, current: \u0001', '选择模型，当前：\u0001'],
        ['Select project, current: \u0001', '选择项目，当前：\u0001'],
        ['Resource not found: \u0001', '未找到资源：\u0001'],
        ['Automatically create a new \u0001 workspace when the conversation starts', '对话开始时自动新建 \u0001 工作区'],
        ['Compare responses from \u0001 models side-by-side to find the best result.', '并排比较来自 \u0001 个模型的回答，找出最佳结果。'],
        ['Connect an account for \u0001 so the agent can run automations.', '为 \u0001 连接账户，以便智能体运行自动化。'],
        ['Help us improve \u0001.', '帮助我们改进 \u0001。'],
        ['Generated image: "\u0001"', '已生成图片：“\u0001”'],
        ['Attachment error: \u0001', '附件错误：\u0001'],
        ['Further action is required to use \u0001', '使用 \u0001 需要进一步操作'],
        ['On top of those defaults, \u0001 requests the access below.', '在上述默认权限之外，\u0001 请求以下访问权限。'],
        ['No more older messages, showing \u0001 of \u0001', '没有更早的消息了，显示 \u0001 / \u0001'],
        ['Unable to search @\u0001', '无法搜索 @\u0001'],
        ['Auth code for \u0001', '\u0001 的授权码'],
        ['Agent permissions preset: \u0001, \u0001', '智能体权限预设：\u0001，\u0001'],
        ['Agent permissions preset selector, current: \u0001', '智能体权限预设选择器，当前：\u0001'],
        ['Searching for \u0001', '正在搜索 \u0001'],
        ['Opening \u0001', '正在打开 \u0001'],
        ['Downloading \u0001', '正在下载 \u0001'],
        ['Uploading \u0001', '正在上传 \u0001'],
        ['Loading \u0001', '正在加载 \u0001'],
        ['Saving \u0001', '正在保存 \u0001'],
        // —— 2.34.0 补充（第三项：1 = 插入值原样保留，不做时间/量词美化，用于路径、命令、名称等；2 = 插入值是界面名词，仅按 MAP 精确翻译） ——
        ['Thought for \u0001s', '思考了 \u0001 秒', 1],
        ['Thinking for \u0001s', '已思考 \u0001 秒', 1],
        ['Still thinking, \u0001 seconds', '仍在思考，已 \u0001 秒', 1],
        ['Using browser \u00b7 \u0001 (\u0001s)', '正在使用浏览器 · \u0001（\u0001 秒）', 1],
        ['Using browser \u00b7 \u0001', '正在使用浏览器 · \u0001', 1],
        ['Using browser (\u0001s)', '正在使用浏览器（\u0001 秒）', 1],
        ['Searched for "\u0001"', '搜索了“\u0001”', 1],
        ['Searched for files: \u0001', '搜索了文件：\u0001', 1],
        ['Code search: "\u0001"', '代码搜索：“\u0001”', 1],
        ['Internal search: "\u0001"', '内部搜索：“\u0001”', 1],
        ['Listed directory \u0001', '列出了目录 \u0001', 1],
        ['Browser task: "\u0001"', '浏览器任务：“\u0001”', 1],
        ['Opened browser: \u0001', '打开了浏览器：\u0001', 1],
        ['Searched web: "\u0001"', '搜索了网页：“\u0001”', 1],
        ['Invoked subagent: \u0001', '调用了子智能体：\u0001', 1],
        ['Ran command: \u0001 (`\u0001`)', '运行了命令：\u0001（`\u0001`）', 1],
        ['Ran command: `\u0001`', '运行了命令：`\u0001`', 1],
        ['Used tool: \u0001', '使用了工具：\u0001', 1],
        ['Waiting for command completion (up to \u0001 seconds)', '正在等待命令完成（最多 \u0001 秒）', 1],
        ['Waiting for \u0001 timers', '正在等待 \u0001 个计时器', 1],
        ['Waiting for \u0001', '正在等待 \u0001', 1],
        ['Wants to run: \u0001', '想要运行：\u0001', 1],
        ['Showing latest \u0001 browser steps', '显示最近 \u0001 个浏览器步骤', 1],
        ['Model unavailable, retrying in \u0001s\u0001', '模型不可用，\u0001 秒后重试\u0001', 1],
        ['Model unavailable, retrying\u0001', '模型不可用，正在重试\u0001', 1],
        ['Connecting to \u0001\u2026', '正在连接到 \u0001\u2026', 1],
        ['Connected to \u0001', '已连接到 \u0001', 1],
        ['Process exited with code \u0001.', '进程已退出，退出码 \u0001。', 1],
        ['Exited with code \u0001.', '已退出，退出码 \u0001。', 1],
        ['Timed out (\u0001ms)', '已超时（\u0001 毫秒）', 1],
        ['Error while \u0001', '执行 \u0001 时出错', 1],
        ['Unfold lines \u0001-\u0001', '展开第 \u0001-\u0001 行', 1],
        ['Fold lines \u0001-\u0001', '折叠第 \u0001-\u0001 行', 1],
        ['Save rule to always allow \u0001?', '保存规则以始终允许 \u0001？', 1],
        ['Sign in to use \u0001!', '登录以使用 \u0001！', 1],
        ['Sign in to \u0001 remotely', '远程登录 \u0001', 1],
        ['Sign in to \u0001', '登录 \u0001', 1],
        ['Sign in from the \u0001 panel.', '请在 \u0001 面板中登录。', 1],
        ['Failed to create directory \u0001: \u0001', '创建目录 \u0001 失败：\u0001', 1],
        ['Failed to create project: \u0001', '创建项目失败：\u0001', 1],
        ['Failed to create \u0001', '创建 \u0001 失败', 1],
        ['Add bundle \u0001', '添加捆绑包 \u0001', 1],
        ['\u0001 is no longer available. Runs use \u0001 instead.', '\u0001 已不可用，运行将改用 \u0001。', 1],
        ['Failed to open workspace: \u0001', '打开工作区失败：\u0001', 1],
        ['More actions for \u0001', '\u0001 的更多操作', 2],
        ['More options for \u0001', '\u0001 的更多选项', 2],
        ['More for \u0001', '\u0001 的更多内容', 1],
        ['\u0001 Sends immediately', '\u0001 立即发送', 1],
        ['\u0001 Queues after the turn', '\u0001 本轮结束后排队发送', 1],
        ['\u0001 On empty prompt, sends next in queue', '\u0001 输入为空时发送队列中的下一条', 1],
        ['Exceeded the customization token budget (\u0001 tokens) and was excluded from context.', '超出自定义项 token 预算（\u0001 个 token），已从上下文中排除。', 1],
        ['Exceeded the rules token budget. Full rule content (\u0001 tokens) was replaced with a lightweight file-path pointer in context.', '超出规则 token 预算。完整规则内容（\u0001 个 token）在上下文中已替换为轻量的文件路径指针。', 1],
        ['All tools in this MCP server (\u0001 tokens) exceeded the customization budget and were excluded from context.', '此 MCP 服务器的所有工具（\u0001 个 token）超出自定义预算，已从上下文中排除。', 1],
        ['Cannot add folder: "\u0001" is not a valid folder location.', '无法添加文件夹：“\u0001”不是有效的文件夹位置。', 1],
        ['Playback speed \u0001x', '播放速度 \u0001x', 1],
        ['Enlarged media: \u0001', '放大的媒体：\u0001', 1],
        ['Open in \u0001', '在 \u0001 中打开', 2],
        ['Total media size exceeds \u0001MB limit', '媒体总大小超过 \u0001MB 上限', 1],
        ['Microphone blocked. Allow in \u0001.', '麦克风已被阻止，请在 \u0001 中允许。', 1],
        ['Microphone access for \u0001 was denied. Quit and reopen the app to be asked again.', '\u0001 的麦克风访问被拒绝。退出并重新打开应用后会再次询问。', 1],
        ["Microphone access for \u0001 wasn't allowed.", '\u0001 未获得麦克风访问权限。', 1],
        ["File exceeds the \u0001MB display limit (\u0001MB), so it can't be opened or downloaded here.", '文件超过 \u0001MB 的显示上限（\u0001MB），无法在此打开或下载。', 1],
        ['The preview did not respond on port \u0001.', '预览在端口 \u0001 上没有响应。', 1],
        ['Nothing is running on port \u0001', '端口 \u0001 上没有运行任何服务', 1],
        ['Resume the conversation to start its workspace again, then start the server on port \u0001 and retry.', '请恢复对话以重新启动其工作区，然后在端口 \u0001 上启动服务器并重试。', 1],
        ['No server is listening on port \u0001 inside the remote workspace. Start it, or ask the agent to, then retry.', '远程工作区内的端口 \u0001 上没有服务器在监听。请自行启动或让智能体启动后重试。', 1],
        ['The browser blocked the download of \u0001', '浏览器阻止了 \u0001 的下载', 1],
        ['An embedded page at \u0001 wants to connect to \u0001', '位于 \u0001 的嵌入页面想要连接到 \u0001', 1],
        ['An embedded page on this page wants to connect to \u0001', '此页面中的嵌入页面想要连接到 \u0001', 1],
        ['This page wants to connect to \u0001', '此页面想要连接到 \u0001', 1],
        ['An embedded page at \u0001 says', '位于 \u0001 的嵌入页面提示', 1],
        ['Check if there is a typo in \u0001, or open the page in your external browser.', '请检查 \u0001 是否有拼写错误，或在外部浏览器中打开该页面。', 1],
        ['The certificate was rejected (\u0001).', '证书被拒绝（\u0001）。', 1],
        ['When toggled on, \u0001 collects usage data to help Google enhance performance and features.', '开启后，\u0001 会收集使用数据，帮助 Google 改进性能和功能。', 1],
        ['Receive product updates, tips, and promotions from Google \u0001 via email.', '通过电子邮件接收 Google \u0001 的产品更新、技巧和促销信息。', 1],
        ["When toggled on, \u0001 will use your AI credits to fulfill model requests once you're out of model quota. \u0001 will always use your model quota first before using AI credits.", '开启后，模型额度用完时 \u0001 将使用你的 AI 积分来完成模型请求。\u0001 总是会先使用模型额度，再使用 AI 积分。', 1],
        ['Delete cookies for \u0001', '删除 \u0001 的 Cookie', 1],
        ['Honors standard VS Code shortcuts without collisions (e.g. \u0001).', '遵循标准 VS Code 快捷键且不冲突（例如 \u0001）。', 1],
        ['Uses standalone Antigravity chords (e.g. \u0001', '使用独立的 Antigravity 组合键（例如 \u0001', 1],
        ['Conflicts with "\u0001" (press Enter to replace)', '与“\u0001”冲突（按 Enter 替换）', 1],
        ['Conflicts with "\u0001" (\u0001)', '与“\u0001”冲突（\u0001）', 1],
        ['Conflicts with "\u0001"', '与“\u0001”冲突', 1],
        ['Recording shortcut for \u0001. Press keys to bind, Enter to save, Escape to cancel.', '正在为 \u0001 录制快捷键。按下要绑定的按键，Enter 保存，Escape 取消。', 1],
        ['Remove shortcut \u0001 for \u0001', '移除快捷键 \u0001（\u0001）', 1],
        ['Add shortcut for \u0001', '为 \u0001 添加快捷键', 1],
        ['Failed to remove agent: \u0001', '移除智能体失败：\u0001', 1],
        ['Failed to remove plugin: \u0001', '移除插件失败：\u0001', 1],
        ['Failed to toggle plugin: \u0001', '切换插件失败：\u0001', 1],
        ['Build with \u0001 Plugins', 'Build with \u0001 插件', 1],
        ['Error submitting auth code: \u0001', '提交授权码出错：\u0001', 1],
        ['Error disconnecting MCP server: \u0001', '断开 MCP 服务器出错：\u0001', 1],
        ['Error installing MCP server: \u0001', '安装 MCP 服务器出错：\u0001', 1],
        ['Error toggling MCP server: \u0001', '切换 MCP 服务器出错：\u0001', 1],
        ['Error deleting MCP server: \u0001', '删除 MCP 服务器出错：\u0001', 1],
        ['Error restarting MCP server: \u0001', '重启 MCP 服务器出错：\u0001', 1],
        ['Error refreshing MCP servers: \u0001', '刷新 MCP 服务器出错：\u0001', 1],
        ['No installation command found for MCP server "\u0001".', '未找到 MCP 服务器“\u0001”的安装命令。', 1],
        ['Error toggling tool: \u0001', '切换工具出错：\u0001', 1],
        ['Are you sure you want to delete the hook "\u0001"?', '确定要删除钩子“\u0001”吗？', 1],
        ['Please fill in all required fields: \u0001', '请填写所有必填字段：\u0001', 1],
        ['Secret for a new \u0001 account', '新 \u0001 账号的密钥', 1],
        ['New secret for \u0001', '\u0001 的新密钥', 1],
        ['Secret for \u0001', '\u0001 的密钥', 1],
        ['Label for \u0001', '\u0001 的标签', 1],
        ['Authorization code for \u0001', '\u0001 的授权码', 1],
        ['Failed to resolve folder: \u0001 (\u0001)', '解析文件夹失败：\u0001（\u0001）', 1],
        ['Agent settings and permissions for conversations outside of \u0001.', '\u0001 之外对话的智能体设置与权限。', 1],
        ['Settings for conversations outside of \u0001.', '\u0001 之外对话的设置。', 1],
        ['Started voice chat \u00b7 \u0001', '已开始语音对话 · \u0001', 1],
        ['Stopped voice chat \u00b7 \u0001', '已结束语音对话 · \u0001', 1],
        ['Recording exceeds 15MB limit (\u0001MB)', '录音超过 15MB 上限（\u0001MB）', 1],
        ['Could not attach folder "\u0001": \u0001', '无法附加文件夹“\u0001”：\u0001', 1],
        ['Could not attach image: \u0001', '无法附加图片：\u0001', 1],
        ['Could not read \u0001.', '无法读取 \u0001。', 1],
        ['Could not open folder: \u0001', '无法打开文件夹：\u0001', 1],
        ["You're signing in on \u0001. Your sign-in stays on that machine.", '你正在 \u0001 上登录，登录状态只保留在那台机器上。', 1],
        ["This window's agents, files, and terminals are on \u0001.", '此窗口的智能体、文件和终端位于 \u0001 上。', 1],
        ['Amended commit on \u0001.', '已在 \u0001 上修订提交。', 1],
        ['Your quota for \u0001 will reset on \u0001. Switch to another available model to continue.', '你的 \u0001 额度将于 \u0001 重置。请切换到其他可用模型以继续。', 1],
        ['Your quota for \u0001 has been reached. Switch to another available model to continue.', '你的 \u0001 额度已用完。请切换到其他可用模型以继续。', 1],
        ['You need \u0001 AI Credits to send messages. To continue using \u0001 now, purchase more AI Credits.', '发送消息需要 \u0001 AI 积分。如需立即继续使用 \u0001，请购买更多 AI 积分。', 1],
        ["Your plan's baseline quota will refresh on \u0001.", '你的方案基础额度将于 \u0001 刷新。', 1],
        ['Failed to fetch directory contents: \u0001', '获取目录内容失败：\u0001', 1],
        ['The folder \u201c\u0001\u201d does not exist. Would you like to create it?', '文件夹“\u0001”不存在，要创建吗？', 1],
        ['Failed to unarchive project: \u0001', '取消归档项目失败：\u0001', 1],
        ['Failed to select workspace: \u0001', '选择工作区失败：\u0001', 1],
        ['Failed to archive \u0001', '归档 \u0001 失败', 1],
        ['Go to slide \u0001', '转到第 \u0001 张幻灯片', 1],
        ['Open conversation \u0001', '打开对话 \u0001', 1],
        ['Open the \u0001 plugin', '打开 \u0001 插件', 1],
        ['Open image \u0001 of \u0001', '打开第 \u0001 张图片（共 \u0001 张）', 1],
        ['View Diff for \u0001', '查看 \u0001 的差异', 1],
        ['Failed to send interaction: \u0001', '发送交互失败：\u0001', 1],
        ['Message from \u0001', '来自 \u0001 的消息', 1],
        ['Minimum length is \u0001', '最小长度为 \u0001', 1],
        ['Maximum length is \u0001', '最大长度为 \u0001', 1],
        ['Input must match \u0001', '输入必须匹配 \u0001', 1],
        ['Minimum value is \u0001', '最小值为 \u0001', 1],
        ['Maximum value is \u0001', '最大值为 \u0001', 1],
        ['Select at least \u0001 items', '至少选择 \u0001 项', 1],
        ['Select at most \u0001 items', '最多选择 \u0001 项', 1],
        ['App view for \u0001', '\u0001 的应用视图', 1],
        ['Rejected sending \u0001 to command', '已拒绝向命令发送 \u0001', 1],
        ['Suggested sending \u0001 to command', '建议向命令发送 \u0001', 1],
        ['Error sending \u0001 to command', '向命令发送 \u0001 时出错', 1],
        ['Generating with \u0001 \ud83c\udf4c', '正在使用 \u0001 \ud83c\udf4c 生成', 1],
        ['Generated with \u0001 \ud83c\udf4c', '已使用 \u0001 \ud83c\udf4c 生成', 1],
        ['Generate with \u0001 \ud83c\udf4c', '使用 \u0001 \ud83c\udf4c 生成', 1],
        ['Side question (conversation \u0001): \u0001', '旁路提问（对话 \u0001）：\u0001', 1],
        ['Side question failed: \u0001', '旁路提问失败：\u0001', 1],
        ['Delete side question: \u0001', '删除旁路提问：\u0001', 1],
        ['Edit side question title: \u0001', '编辑旁路提问标题：\u0001', 1],
        ['Cost summary: \u0001', '成本汇总：\u0001', 1],
        ['Set up \u0001', '设置 \u0001', 1],
        ['Review permissions for \u0001', '查看 \u0001 的权限', 1],
        ['Sort and filter conversations (\u0001 active)', '排序和筛选对话（\u0001 项生效）', 1],
        ['Trajectory not found (\u0001).', '未找到轨迹（\u0001）。', 1],
        ['Showing first \u0001 references', '显示前 \u0001 条引用', 1],
        ['Edit comment: \u0001', '编辑评论：\u0001', 1],
        ['Artifact image \u0001', '产物图片 \u0001', 1],
        ['Sent response: \u0001', '已发送回复：\u0001', 1],
        ['Failed to send response: \u0001', '发送回复失败：\u0001', 1],
        ['Please retry: \u0001', '请重试：\u0001', 1],
        ['Send all (\u0001)', '全部发送（\u0001）', 1],
        ['Cancel Questionnaire and Stop the Agent (\u0001)', '取消问卷并停止智能体（\u0001）', 1],
        ['Conflicts with your configured Ask permission: \u0001', '与你配置的“询问”权限冲突：\u0001', 1],
        ['Requires manual confirmation: \u0001', '需要手动确认：\u0001', 1],
        ['Install folder "\u0001" is already in use', '安装文件夹“\u0001”已被占用', 1],
        ['\u0001, all already installed. Adding the bundle installs plugins it gains later.', '\u0001，均已安装。添加此捆绑包后，它之后新增的插件也会自动安装。', 1],
        ['Signed in: \u0001', '已登录：\u0001', 1],
        ['Fix with Agent: \u0001', '让智能体修复：\u0001', 1],
        ['Account this MCP server uses: \u0001', '此 MCP 服务器使用的账号：\u0001', 1],
        ['Unnamed skill \u0001', '未命名技能 \u0001', 1],
        ['Error restarting \u0001: \u0001', '重启 \u0001 出错：\u0001', 1],
        ['Error updating agent: \u0001', '更新智能体出错：\u0001', 1],
        ['Searching as \u0001', '以 \u0001 身份搜索', 1],
        ['Invalid notebook JSON: \u0001', '笔记本 JSON 无效：\u0001', 1],
        ['Preview unavailable \u2014 \u0001', '预览不可用 — \u0001', 1],
        ['Side panel \u0001', '侧面板 \u0001', 1],
        ['Aux pane \u0001', '辅助面板 \u0001', 1],
        ['Move to Group: \u0001', '移动到分组：\u0001', 1],
        ['Forked from \u0001', '派生自 \u0001', 1],
        ['Where the agent runs, current: \u0001 (\u0001)', '智能体运行位置，当前：\u0001（\u0001）', 1],
        ['Where the agent runs, current: \u0001', '智能体运行位置，当前：\u0001', 1],
        ['No matching \u0001', '没有匹配的 \u0001', 1],
        ['No remote \u0001', '没有远程 \u0001', 1],
        ['Uses your local clone, \u0001', '使用你的本地克隆，\u0001', 1],
        ['Remove context from \u0001', '从 \u0001 移除上下文', 1],
        ['No connectors match \u201c\u0001\u201d', '没有匹配“\u0001”的连接器', 1],
        ["Browser tools run on \u0001, the SSH host this window is connected to, and Chrome there isn't accepting remote debugging. Complete these steps on \u0001, not on this computer:", '浏览器工具运行在 \u0001 上（此窗口所连接的 SSH 主机），而那里的 Chrome 未接受远程调试。请在 \u0001 上而不是这台电脑上完成以下步骤：', 1],
        ['Open Google Chrome on \u0001.', '在 \u0001 上打开 Google Chrome。', 1],
        ['Using default \u0001 name', '使用默认 \u0001 名称', 1],
        ['Detached at \u0001', '已分离于 \u0001', 1],
        ['Checked out in \u0001', '已检出到 \u0001', 1],
        ['Work locally on \u0001', '在本地 \u0001 上工作', 1],
        ['Worktree from \u0001', '基于 \u0001 的工作树', 1],
        ['Work in \u0001', '在 \u0001 中工作', 1],
        ['System default (\u0001)', '系统默认（\u0001）', 1],
        ['No audio from \u0001', '\u0001 没有音频输入', 1],
        ['Message queued. \u0001 messages in queue.', '消息已加入队列，队列中共 \u0001 条消息。', 1],
        ['Send now: \u0001', '立即发送：\u0001', 1],
        ['Upload error: \u0001', '上传出错：\u0001', 1],
        ['Retrying transcription (attempt \u0001)\u2026', '正在重试转写（第 \u0001 次）\u2026', 1],
        ['Adding plugins from \u0001', '正在从 \u0001 添加插件', 1],
        ['This plugin in \u0001 may have looser code review. Review its contents before adding the bundle.', '\u0001 中的此插件代码审查可能较宽松，添加捆绑包前请先查看其内容。', 1],
        ['These plugins in \u0001 may have looser code review. Review their contents before adding the bundle.', '\u0001 中的这些插件代码审查可能较宽松，添加捆绑包前请先查看其内容。', 1],
        ['Credentials expire in \u0001. Refresh credentials to keep this automation running', '凭据将在 \u0001后过期。请刷新凭据以保持此自动化运行'],
        ['See more in \u0001', '在 \u0001 中查看更多', 2],
        ['See less in \u0001', '在 \u0001 中收起', 2],
        ['See more \u0001', '查看更多 \u0001', 1],
        ['Filter skills and rules: \u0001', '筛选技能和规则：\u0001', 1],
        ['Details for \u0001', '\u0001 的详情', 2],
        ['Plugins in \u0001', '\u0001 中的插件', 2],
        ['You have \u0001 conversations in progress. Updating will interrupt them, and they will automatically resume once the update completes.', '你有 \u0001 个对话正在进行。更新会中断它们，更新完成后它们会自动恢复。', 1],
        ["You have \u0001 conversations in progress. Updating will cancel them and you'll need to manually restart them.", '你有 \u0001 个对话正在进行。更新会取消它们，之后需要你手动重新开始。', 1],
        ['Switch environment (\u0001)', '切换环境（\u0001）', 1],
        ['No messages in last \u0001 steps \u2014 load older', '最近 \u0001 个步骤中没有消息 — 加载更早的消息', 1],
        ['No messages in last \u0001 steps, load older', '最近 \u0001 个步骤中没有消息，加载更早的消息', 1],
        ['No messages in last \u0001 steps \u00b7 Load more', '最近 \u0001 个步骤中没有消息 · 加载更多', 1],
        ['No visible messages in last \u0001 steps. Activate Load older messages to continue.', '最近 \u0001 个步骤中没有可见消息。请点击“加载更早的消息”以继续。', 1],
        ['Go to turn \u0001 of \u0001', '转到第 \u0001 轮（共 \u0001 轮）', 1],
        ['Moved conversation \u0001', '已移动对话 \u0001', 1],
        ['Managed by the \u0001 automation', '由 \u0001 自动化管理', 1],
        ['Managed by the \u0001 plugin', '由 \u0001 插件管理', 1],
        ['User uploaded media \u0001', '用户上传的媒体 \u0001', 1],
        ['Back to \u0001', '返回 \u0001', 2],
        ['There was an error determining the code changes that this undo action will make: \u0001', '无法确定此撤销操作将造成的代码更改：\u0001', 1],
        // 2.34.0 步骤行：\u0001 为模型写的工具说明（标记 3：双语模式下交给机器翻译，否则原样保留）
        ['Running \u0001', '正在运行：\u0001', 3],
        ['Editing \u0001', '正在编辑 \u0001', 1],
        ['Listing \u0001', '正在列出 \u0001', 1],
        ['Exited with code \u0001', '已退出，退出码 \u0001', 1],
        ['Used MCP tool: \u0001', '使用了 MCP 工具：\u0001', 1],
        ['Viewed \u0001', '查看了 \u0001', 1],
    ];
    // 具体句式优先：按模板字面量长度降序，避免泛化句式抢先命中
    DYNAMIC_MAP.sort(function (a, b) { return b[0].length - a[0].length; });
    for (var _di = 0; _di < DYNAMIC_MAP.length; _di++) {
        var _parts = DYNAMIC_MAP[_di][0].split('\u0001');
        var _rx = '^' + _parts.map(agEscRe).join('([\\s\\S]+?)') + '$';
        DYNAMIC_MAP[_di] = [new RegExp(_rx), DYNAMIC_MAP[_di][1], DYNAMIC_MAP[_di][2]];
    }
    function beautifyRemain(s) {
        var WD = { sunday: '周日', monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四', friday: '周五', saturday: '周六' };
        return s
            .replace(/\.$/, '')
            .replace(/, /g, ' ')
            .replace(/less than a minute/gi, '不到 1 分钟')
            .replace(/less than an hour/gi, '不到 1 小时')
            .replace(/<\s*1m\b/gi, '不到 1 分钟')
            .replace(/\ba minute\b/gi, '1 分钟')
            .replace(/\ban hour\b/gi, '1 小时')
            .replace(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/gi, function (w) { return WD[w.toLowerCase()]; })
            .replace(/\bweekdays\b/gi, '工作日')
            .replace(/\bweekends\b/gi, '周末')
            .replace(/\baround\b/gi, '约')
            .replace(/\btoday\b/gi, '今天')
            .replace(/\btomorrow\b/gi, '明天')
            .replace(/\bago\b/gi, '前')
            .replace(/(\d+)(st|nd|rd|th)\b/gi, '$1 日')
            .replace(/(\d{1,2}):(\d{2})\s*([AP])\.?M\.?/gi, function (m, h, mi, ap) { return (ap.toUpperCase() === 'A' ? '上午 ' : '下午 ') + h + ':' + mi; })
            .replace(/(\d+)\s*days?/gi, '$1 天')
            .replace(/(\d+)\s*hours?/gi, '$1 小时')
            .replace(/(\d+)\s*minutes?/gi, '$1 分钟')
            .replace(/(\d+)\s*seconds?/gi, '$1 秒')
            .replace(/(\d+)s\b/gi, '$1 秒')
            .replace(/(\d+)\s*months?/gi, '$1 个月')
            .replace(/(\d+)\s*years?/gi, '$1 年')
            .replace(/(\d+)\s*weeks?/gi, '$1 周')
            .replace(/(\d+)\s*projects?/gi, '$1 个项目')
            .replace(/(\d+)\s*items?/gi, '$1 项')
            .replace(/(\d+)\s*files?/gi, '$1 个文件')
            .replace(/(\d+)\s*folders?/gi, '$1 个文件夹')
            .replace(/(\d+)\s*sessions?/gi, '$1 个会话')
            .replace(/(\d+)\s*messages?/gi, '$1 条消息')
            .replace(/(\d+)\s*tasks?/gi, '$1 个任务')
            .replace(/(\d+)\s*agents?/gi, '$1 个智能体')
            .replace(/(\d+)\s*plugins?/gi, '$1 个插件')
            .replace(/(\d+)\s*skills?/gi, '$1 个技能')
            .replace(/(\d+)\s*results?/gi, '$1 个结果')
            .replace(/(\d+)\s*models?/gi, '$1 个模型')
            .replace(/(\d+)d\b/gi, '$1 天')
            .replace(/(\d+)h\b/gi, '$1 小时')
            .replace(/(\d+)m\b/gi, '$1 分钟')
            .replace(/\bon (?=[\u4e00-\u9fff])/g, '')
            .replace(/\bat (?=[\u4e00-\u9fff0-9])/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    // 需要翻译的属性（value 仅用于只读输入框，单独处理）
    var ATTR_KEYS = ['placeholder', 'title', 'aria-label', 'aria-description', 'data-tooltip-content', 'value'];
    // 用户/智能体内容区：不翻译其中的文本节点（智能体回复与思考过程的 Markdown、用户消息、编辑器、终端、代码）
    var SKIP_SEL = 'pre,code,textarea,script,style,[contenteditable="true"],[contenteditable=""],[contenteditable="plaintext-only"],' +
        '[data-markdown-root],[data-testid="user-message-content"],[data-testid="user-message-bubble"],' +
        '.monaco-editor,.xterm,.cm-editor,[data-agzh-skip],.agzh-tr';
    // 内容区里由界面生成的部件（Markdown 提示框标题等），仍然翻译
    var ALLOW_SEL = '.markdown-alert-title,[data-agzh-allow]';
    // 属性翻译只排除代码/编辑器（悬停提示、按钮无障碍标签属于界面文案）
    var ATTR_SKIP_SEL = 'pre,code,.monaco-editor,.xterm,.cm-editor,[data-agzh-skip]';
    var CACHE = new Map();
    function zhRaw(s) {
        var key = s.trim();
        if (!key)
            return null;
        var v = MAP[key];
        // 省略号写法差异兜底：源码里可能是 "\u2026"(…)，词表里写的是 "..."，反之亦然
        if (v === undefined && /[…\.]{1,3}$/.test(key)) {
            var alt = key.replace(/(…|\.\.\.)$/, '').trim();
            var cand = [alt + '…', alt + '...', alt];
            for (var _ai = 0; _ai < cand.length; _ai++) {
                if (MAP[cand[_ai]] !== undefined) { v = MAP[cand[_ai]]; break; }
            }
        }
        // 拼接句式匹配（模板字符串里带运行时变量）
        if (v === undefined) {
            for (var _dj = 0; _dj < DYNAMIC_MAP.length; _dj++) {
                var _dm = key.match(DYNAMIC_MAP[_dj][0]);
                if (_dm) {
                    var _dv = DYNAMIC_MAP[_dj][1];
                    for (var _dg = 1; _dg < _dm.length; _dg++)
                        _dv = _dv.replace('\u0001', (function (g) { return function () { return g; }; })(dynFill(DYNAMIC_MAP[_dj][2], _dm[_dg])));
                    v = _dv;
                    break;
                }
            }
        }
        // 动态/带数字句式优先走正则，避免被个别静态词条"抢走"导致动态部分漏翻
        if (v === undefined && /[0-9]/.test(key)) {
            for (var ri = 0; ri < REGEX_MAP.length; ri++) {
                if (REGEX_MAP[ri][0].test(key)) {
                    v = key.replace(REGEX_MAP[ri][0], REGEX_MAP[ri][1]);
                    break;
                }
            }
        }
        // 智能前缀模糊匹配：支持 UI 用省略号截断（... 或 …）的长文本
        if (v === undefined && (key.endsWith('...') || key.endsWith('…'))) {
            var prefix = key.replace(/(\.\.\.|…)$/, '').trim();
            if (prefix.length >= 8) {
                for (var mk in MAP) {
                    if (mk.indexOf(prefix) === 0) {
                        v = MAP[mk];
                        break;
                    }
                }
            }
        }
        if (v === undefined) {
            for (var i = 0; i < REGEX_MAP.length; i++) {
                if (REGEX_MAP[i][0].test(key)) {
                    v = key.replace(REGEX_MAP[i][0], REGEX_MAP[i][1]);
                    break;
                }
            }
        }
        if (v === undefined) {
            for (var j = 0; j < PREFIX_MAP.length; j++) {
                var e = PREFIX_MAP[j];
                if (key.indexOf(e.p) === 0) {
                    v = e.t + beautifyRemain(key.slice(e.p.length)) + e.s;
                    break;
                }
            }
        }
        // 逗号拼接的步骤组摘要（如 "Explored files, ran commands"）：每段都是已知词条时逐段翻译
        if (v === undefined && key.indexOf(', ') > 0) {
            var _cp = key.split(', ');
            if (_cp.length <= 4) {
                for (var _ci = 0; _ci < _cp.length && _cp[_ci] !== null; _ci++)
                    _cp[_ci] = MAP[_cp[_ci]] === undefined ? null : MAP[_cp[_ci]];
                if (_cp.indexOf(null) < 0)
                    v = _cp.join('，');
            }
        }
        if (v === undefined || v === key)
            return null;
        return s.replace(key, function () { return v; });
    }
    // 拼接句式变量的填充方式：2 按词表翻译；3 模型写的说明（双语模式下机器翻译）；其他真值原样；默认美化时间量词
    function dynFill(flag, g) {
        if (flag === 2)
            return MAP[g.trim()] || g;
        if (flag === 3)
            return mtInline(g);
        return flag ? g : beautifyRemain(g);
    }
    function zh(s) {
        // 双语模式下的结果可能含机器译文，与普通模式分开缓存；机器译文尚未返回的结果不缓存
        var ck = MT.on ? '\u0002' + s : s;
        var hit = CACHE.get(ck);
        if (hit !== undefined)
            return hit;
        var outer = MT_MISS;
        MT_MISS = false;
        var r = zhRaw(s);
        var miss = MT_MISS;
        MT_MISS = outer || miss;
        if (!miss) {
            if (CACHE.size > 20000)
                CACHE.clear();
            CACHE.set(ck, r);
        }
        return r;
    }
    // 会话列表里的对话标题是用户数据：精确保护
    function isConversationTitle(el) {
        var row = el.closest('[data-cascade-id]');
        if (!row)
            return false;
        if (el.matches('span.truncate.inline-block'))
            return true;
        var label = row.querySelector('a[aria-label]');
        var t = (el.textContent || '').trim();
        return !!(label && t && label.getAttribute('aria-label') === t);
    }
    function isProtected(el) {
        if (!el || el.nodeType !== 1)
            return true;
        var c = el.closest(SKIP_SEL);
        if (c) {
            var a = el.closest(ALLOW_SEL);
            if (!(a && c.contains(a) && a !== c))
                return true;
        }
        return isConversationTitle(el);
    }
    // 整句未命中时，按分句/分隔符切段，逐段翻译，尽力而为地中文化长句
    function translateFragment(s) {
        if (!s)
            return s;
        var whole = zh(s);
        if (whole !== null)
            return whole;
        var out = s.replace(/([^.!?。！？;；:\n]+[.!?。！？;；:]?)/g, function (seg) {
            var lead = seg.match(/^\s*/)[0];
            var body = seg.slice(lead.length);
            if (!body)
                return seg;
            var r = zh(body);
            return lead + (r !== null ? r : body);
        });
        // 说明：不再做"长词条子串替换"，那会把英文长句挖出中文洞（如 "The voice used in 语音模式."）。
        // React 拆句场景改由片段级词条（见 MAP 里的短语）覆盖。
        return out;
    }
    function translateText(src) {
        var m = zh(src);
        if (m === null && src.length <= 400 && /[A-Za-z]{3}/.test(src))
            m = translateFragment(src);
        return m !== null && m !== src ? m : null;
    }
    // 记录每个被改写的文本节点：{orig 原文, out 写入值}。React 之后若改写该节点，nodeValue 不再等于 out，
    // 即可识别为新的原文重新翻译；未被改动时继续以原文为源，保证幂等、不会叠加翻译
    var REC = new WeakMap();
    function sourceOf(t) {
        var r = REC.get(t);
        return r && r.out === t.nodeValue ? r.orig : t.nodeValue;
    }
    function write(t, src, out) {
        if (t.nodeValue !== out)
            t.nodeValue = out;
        REC.set(t, { orig: src, out: out });
    }
    function processText(t) {
        var cur = t.nodeValue;
        if (!cur || (!/[A-Za-z]/.test(cur) && !REC.has(t)))
            return;
        var src = sourceOf(t);
        MT_MISS = false;
        var out = translateText(src);
        if (out === null && MT.on && mtIsLabel(t, src))
            out = mtLabel(src);
        // 机器译文还没返回：登记节点，译文到达后重新处理
        if (MT_MISS)
            MT.watch.add(t);
        if (out !== null)
            write(t, src, out);
        else if (src !== cur)
            write(t, src, src);
    }
    // React 把一句话拆成多个相邻文本节点（如 "3" + " items"）时：拼接原文整体翻译，
    // 结果写入第一个节点、其余置空（节点本身保留，React 后续更新仍能找到它们）
    function processComposite(texts) {
        var srcs = [];
        for (var i = 0; i < texts.length; i++)
            srcs.push(sourceOf(texts[i]) || '');
        var joined = srcs.join('');
        var trimmed = joined.trim();
        var out = trimmed.length >= 2 && trimmed.length <= 600 && /[A-Za-z]{2}/.test(trimmed) ? translateText(joined) : null;
        if (out !== null && /[\u4e00-\u9fff]/.test(out)) {
            for (var j = 0; j < texts.length; j++)
                write(texts[j], srcs[j], j === 0 ? out : '');
            return;
        }
        for (var k = 0; k < texts.length; k++)
            processText(texts[k]);
    }
    function processParentTexts(p, done) {
        if (done.has(p))
            return;
        done.add(p);
        if (isProtected(p))
            return;
        var texts = [];
        var hasElement = false;
        for (var c = p.firstChild; c; c = c.nextSibling) {
            if (c.nodeType === 3)
                texts.push(c);
            else if (c.nodeType === 1)
                hasElement = true;
        }
        if (!hasElement && texts.length > 1)
            processComposite(texts);
        else
            for (var i = 0; i < texts.length; i++)
                processText(texts[i]);
    }
    function processAttrs(el) {
        if (el.closest(ATTR_SKIP_SEL))
            return;
        for (var j = 0; j < ATTR_KEYS.length; j++) {
            var a = ATTR_KEYS[j];
            if (a === 'value') {
                // 仅翻译只读输入框（下拉框显示值），不碰用户可编辑内容
                if (el.tagName === 'INPUT' && el.readOnly && el.value && /[A-Za-z]/.test(el.value)) {
                    var mv = zh(el.value);
                    if (mv !== null && mv !== el.value)
                        el.value = mv;
                }
                continue;
            }
            var v = el.getAttribute(a);
            if (v && /[A-Za-z]/.test(v)) {
                var m = zh(v);
                if (m !== null && m !== v)
                    el.setAttribute(a, m);
            }
        }
    }
    var ATTR_QUERY = '[' + ATTR_KEYS.slice(0, -1).join('],[') + '],input[readonly]';
    function processTree(root, done) {
        if (root.nodeType === 3) {
            if (root.parentElement)
                processParentTexts(root.parentElement, done);
            return;
        }
        if (root.nodeType !== 1 && root.nodeType !== 11)
            return;
        if (root.nodeType === 1) {
            processAttrs(root);
            if (root.closest(SKIP_SEL) && !root.closest(ALLOW_SEL)) {
                // 内容区：只处理其中的界面部件与属性
                var allowed = root.querySelectorAll(ALLOW_SEL);
                for (var a = 0; a < allowed.length; a++)
                    processTree(allowed[a], done);
                var attrEls0 = root.querySelectorAll(ATTR_QUERY);
                for (var b = 0; b < attrEls0.length; b++)
                    processAttrs(attrEls0[b]);
                return;
            }
        }
        var attrEls = root.querySelectorAll(ATTR_QUERY);
        for (var i = 0; i < attrEls.length; i++)
            processAttrs(attrEls[i]);
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (var n = walker.nextNode(); n; n = walker.nextNode()) {
            if (n.parentElement)
                processParentTexts(n.parentElement, done);
        }
    }
    function safe(fn) {
        try {
            fn();
        }
        catch (e) { /* 翻译失败不影响界面 */ }
    }
    // =====================================================================================
    // 双语对照（机器翻译）：模型写的内容没法进词表，开关打开后交给微软翻译（Edge 内置翻译用的免费接口）
    //   - 思考过程、智能体回复：逐段翻译，译文显示在原文下方；正在流式输出的段落等写完（或停顿）后再翻
    //   - 步骤行里模型写的说明（如 "Ran search UI text for 门禁" 的后半句）：直接替换，悬停显示原文
    //   - 行内代码/文件标签等用占位符保护，翻译后原样放回；已经是中文的段落不翻
    //   - 译文按原文缓存，界面重绘时同步复用（不闪烁）；接口失败时退避重试，期间保留原文
    // =====================================================================================
    var MT_ENDPOINT = 'https://edge.microsoft.com/translate/translatetext?from=en&to=zh-Hans&isEnterpriseClient=false';
    var MT_CFG = window.__agzhCfg || {};
    var MT = {
        on: MT_CFG.bilingual === true,
        cache: new Map(),     // 原文 -> 译文
        queue: [],            // 待请求的原文
        queued: new Set(),
        solo: new Set(),      // 曾在批量请求中失败的原文：单独发送，避免拖累同批
        tries: new Map(),
        dead: new Set(),      // 多次失败的原文：本次运行不再请求
        inflight: 0,
        fails: 0,
        failUntil: 0,
        timer: 0,
        tick: 0,
        notifyTimer: 0,
        units: new WeakMap(), // 段落元素 -> 状态
        tracked: new Set(),   // 已插入译文的段落
        pending: new Set(),   // 等待译文的段落
        watch: new Set(),     // 等待译文的步骤行文本节点
        error: false,
    };
    var MT_MISS = false;
    var MT_PH = /\u27e6\s*(\d+)\s*\u27e7/g;
    var MT_UNIT_SEL = 'p,li,h1,h2,h3,h4,h5,h6,td,th,dt,dd';
    var MT_BLOCK_TAG = /^(UL|OL|PRE|TABLE|BLOCKQUOTE|DIV|P|DETAILS|H[1-6]|HR|FIGURE|SECTION)$/;
    var MT_INLINE_TAG = /^(B|STRONG|I|EM|U|S|DEL|INS|MARK|SMALL|SUB|SUP|SPAN|A|LABEL|ABBR|Q|CITE|TIME|FONT)$/;
    var MT_THINK_BTN = 'button[data-testid="thinking-collapsible-trigger"]';
    var MT_ROOTS = new WeakMap();
    // 值得翻译：有成段英文，且不是以中文为主
    function mtWorth(s) {
        var plain = s.replace(MT_PH, ' ');
        var latin = (plain.match(/[A-Za-z]/g) || []).length;
        if (latin < 3 || !/[A-Za-z]{2,}/.test(plain))
            return false;
        var cjk = (plain.match(/[\u3400-\u9fff]/g) || []).length;
        return cjk * 2 < latin;
    }
    function mtPut(src, out) {
        if (MT.cache.size >= 4000)
            MT.cache.delete(MT.cache.keys().next().value);
        MT.cache.set(src, out);
    }
    function mtWant(s) {
        if (!MT.on || MT.cache.has(s) || MT.queued.has(s) || MT.dead.has(s))
            return;
        MT.queued.add(s);
        MT.queue.push(s);
        mtSchedule(120);
    }
    function mtSchedule(ms) {
        if (!MT.timer)
            MT.timer = setTimeout(mtFlush, ms);
    }
    function mtFlush() {
        MT.timer = 0;
        if (!MT.on || !MT.queue.length)
            return;
        var wait = MT.failUntil - Date.now();
        if (wait > 0) {
            mtSchedule(wait);
            return;
        }
        while (MT.inflight < 3 && MT.queue.length) {
            var batch = [MT.queue.shift()], chars = batch[0].length;
            if (!MT.solo.has(batch[0])) {
                while (MT.queue.length && batch.length < 40 && !MT.solo.has(MT.queue[0]) && chars + MT.queue[0].length <= 8000) {
                    chars += MT.queue[0].length;
                    batch.push(MT.queue.shift());
                }
            }
            mtSend(batch);
        }
    }
    function mtSend(batch) {
        MT.inflight++;
        var ctl = typeof AbortController === 'function' ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
        fetch(MT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batch),
            credentials: 'omit',
            signal: ctl ? ctl.signal : undefined,
        }).then(function (r) {
            if (!r.ok)
                throw new Error('HTTP ' + r.status);
            return r.json();
        }).then(function (res) {
            MT.fails = 0;
            mtSetError(false);
            for (var i = 0; i < batch.length; i++) {
                var t = res && res[i] && res[i].translations && res[i].translations[0];
                MT.queued.delete(batch[i]);
                if (t && typeof t.text === 'string')
                    mtPut(batch[i], t.text);
                else
                    MT.dead.add(batch[i]);
            }
            mtNotify();
        }, function () {
            MT.fails++;
            MT.failUntil = Date.now() + Math.min(60000, 1500 * Math.pow(2, Math.min(MT.fails, 6) - 1));
            mtSetError(true);
            for (var i = batch.length - 1; i >= 0; i--) {
                var s = batch[i], n = (MT.tries.get(s) || 0) + 1;
                MT.tries.set(s, n);
                if (batch.length > 1)
                    MT.solo.add(s);
                if (n >= 4) {
                    MT.queued.delete(s);
                    MT.dead.add(s);
                }
                else
                    MT.queue.unshift(s);
            }
        }).then(function () {
            clearTimeout(timer);
            MT.inflight--;
            if (MT.queue.length)
                mtSchedule(Math.max(50, MT.failUntil - Date.now()));
        });
    }
    // 译文到达：刷新等待中的段落与步骤行
    function mtNotify() {
        if (!MT.notifyTimer)
            MT.notifyTimer = setTimeout(function () { MT.notifyTimer = 0; safe(mtRefresh); }, 0);
    }
    function mtRefresh() {
        if (!MT.on)
            return;
        MT.pending.forEach(function (u) {
            if (!u.isConnected)
                MT.pending.delete(u);
            else
                mtUnit(u);
        });
        var done = new Set(), texts = [];
        MT.watch.forEach(function (t) { texts.push(t); });
        MT.watch.clear();
        for (var i = 0; i < texts.length; i++)
            if (texts[i].isConnected && texts[i].parentElement)
                processParentTexts(texts[i].parentElement, done);
    }
    // ---- 步骤行（模型写的工具说明）----
    // 步骤行的说明元素带 title（悬停显示的就是原文）：c2 组件的内容 span，或步骤组标题的流光文字 span
    function mtIsLabel(t, src) {
        var el = t.parentElement;
        if (!el || el.closest('[data-markdown-root],[data-testid^="user-message"],pre,code'))
            return false;
        var s = src.trim();
        for (var e = el, i = 0; e && i < 4; e = e.parentElement, i++) {
            var ti = e.getAttribute('title');
            if (ti === null)
                continue;
            if (ti.trim() !== s)
                return false;
            return (e.matches('span.truncate') && !!e.parentElement && e.parentElement.matches('div.whitespace-nowrap')) ||
                !!e.querySelector(':scope > .shimmer-text-mask');
        }
        return false;
    }
    function mtInline(g) {
        if (!MT.on)
            return g;
        var s = g.trim();
        if (!mtWorth(s))
            return g;
        var v = MT.cache.get(s);
        if (v !== undefined)
            return g.replace(s, function () { return v; });
        if (!MT.dead.has(s)) {
            MT_MISS = true;
            mtWant(s);
        }
        return g;
    }
    // "说明 · Exited with code 1"：按分隔符逐段处理，词表能翻的走词表，其余机器翻译
    function mtLabel(src) {
        var segs = src.split(' \u00b7 '), changed = false;
        for (var i = 0; i < segs.length; i++) {
            var d = zh(segs[i]);
            var m = d !== null ? d : mtInline(segs[i]);
            if (m !== segs[i]) {
                segs[i] = m;
                changed = true;
            }
        }
        return changed ? segs.join(' \u00b7 ') : null;
    }
    // ---- 思考过程 / 回复正文 ----
    function mtIsTargetRoot(root) {
        var v = MT_ROOTS.get(root);
        if (v !== undefined)
            return v;
        v = false;
        if (!root.closest('[data-testid^="user-message"]')) {
            if (root.closest('[data-testid="planner-response-text"],[data-testid="progress-update-response-text"]'))
                v = true;
            else {
                // 思考内容位于思考折叠按钮之后的展开区
                outer: for (var a = root, i = 0; a && i < 8; a = a.parentElement, i++) {
                    for (var p = a.previousElementSibling; p; p = p.previousElementSibling) {
                        if (p.matches(MT_THINK_BTN)) {
                            v = true;
                            break outer;
                        }
                    }
                }
            }
        }
        if (root.isConnected)
            MT_ROOTS.set(root, v);
        return v;
    }
    function mtUnitFrom(el, root) {
        var u = el.closest(MT_UNIT_SEL);
        if (!u || !root.contains(u) || u.closest('pre,code,.agzh-tr'))
            return null;
        // 松散列表（li 里有 p）：以 p 为单位
        if (u.tagName === 'LI')
            for (var c = u.firstElementChild; c; c = c.nextElementSibling)
                if (c.tagName === 'P')
                    return null;
        return u;
    }
    // 提取段落自身文字：行内代码、图标、文件标签等替换为占位符 ⟦n⟧；嵌套列表/代码块等子块不计入
    function mtExtract(unit) {
        var parts = [], text = '';
        (function walk(n) {
            for (var c = n.firstChild; c; c = c.nextSibling) {
                if (c.nodeType === 3) {
                    text += c.nodeValue;
                    continue;
                }
                if (c.nodeType !== 1)
                    continue;
                var tag = c.tagName;
                if (tag === 'STYLE' || tag === 'SCRIPT' || c.classList.contains('agzh-tr'))
                    continue;
                if (tag === 'BR') {
                    text += '\n';
                    continue;
                }
                if (n === unit && MT_BLOCK_TAG.test(tag)) {
                    if (tag === 'DIV' && !c.querySelector(MT_UNIT_SEL + ',pre,table'))
                        walk(c);
                    continue;
                }
                if (MT_INLINE_TAG.test(tag) && !c.querySelector('svg,img,button,input,video,canvas')) {
                    walk(c);
                    continue;
                }
                text += '\u27e6' + parts.length + '\u27e7';
                parts.push(c);
            }
        })(unit);
        var key = text.replace(/[ \t\r\f\v\u00a0]+/g, ' ').replace(/ ?\n ?/g, '\n').trim();
        return { key: key, parts: parts };
    }
    function mtPlace(unit, tr) {
        var tag = unit.tagName;
        if (tag === 'LI' || tag === 'TD' || tag === 'TH' || tag === 'DT' || tag === 'DD') {
            // 放在单元内部、嵌套子块之前
            var ref = null;
            for (var c = unit.firstChild; c; c = c.nextSibling)
                if (c !== tr && c.nodeType === 1 && MT_BLOCK_TAG.test(c.tagName)) {
                    ref = c;
                    break;
                }
            if (tr.parentNode !== unit || tr.nextSibling !== ref)
                unit.insertBefore(tr, ref);
        }
        else if (unit.parentNode && unit.nextSibling !== tr) {
            unit.parentNode.insertBefore(tr, unit.nextSibling);
        }
    }
    function mtClone(el) {
        var c = el.cloneNode(true);
        c.removeAttribute('id');
        var ids = c.querySelectorAll('[id]');
        for (var i = 0; i < ids.length; i++)
            ids[i].removeAttribute('id');
        return c;
    }
    function mtRender(unit, st, out) {
        var tr = st.tr;
        if (!tr) {
            tr = st.tr = document.createElement('div');
            tr.className = 'agzh-tr';
            tr.setAttribute('data-agzh-skip', '');
            tr.setAttribute('lang', 'zh-CN');
            MT.tracked.add(unit);
        }
        var sig = st.key + '\u0003' + st.parts.map(function (p) { return p.textContent; }).join('\u0003');
        if (st.shown !== sig) {
            while (tr.firstChild)
                tr.removeChild(tr.firstChild);
            var last = 0, m;
            MT_PH.lastIndex = 0;
            while ((m = MT_PH.exec(out))) {
                if (m.index > last)
                    tr.appendChild(document.createTextNode(out.slice(last, m.index)));
                if (st.parts[+m[1]])
                    tr.appendChild(mtClone(st.parts[+m[1]]));
                last = MT_PH.lastIndex;
            }
            if (last < out.length)
                tr.appendChild(document.createTextNode(out.slice(last)));
            st.shown = sig;
        }
        tr.classList.remove('agzh-stale');
        mtPlace(unit, tr);
    }
    function mtDrop(unit, st) {
        if (st.tr && st.tr.parentNode)
            st.tr.parentNode.removeChild(st.tr);
        MT.units.delete(unit);
        MT.tracked.delete(unit);
        MT.pending.delete(unit);
    }
    function mtUnit(unit) {
        var st = MT.units.get(unit);
        var ex = mtExtract(unit);
        if (!ex.key || ex.key.length > 5000 || !mtWorth(ex.key)) {
            if (st)
                mtDrop(unit, st);
            return;
        }
        if (!st) {
            st = { key: '', at: 0, tr: null, shown: '', parts: [] };
            MT.units.set(unit, st);
        }
        if (st.key !== ex.key) {
            st.key = ex.key;
            st.at = Date.now();
        }
        st.parts = ex.parts;
        var out = MT.cache.get(ex.key);
        if (out !== undefined) {
            MT.pending.delete(unit);
            mtRender(unit, st, out);
            return;
        }
        // 原文变了（流式输出中）：旧译文淡化保留，等新译文
        if (st.tr) {
            st.tr.classList.add('agzh-stale');
            mtPlace(unit, st.tr);
        }
        if (MT.dead.has(ex.key)) {
            MT.pending.delete(unit);
            return;
        }
        MT.pending.add(unit);
        if (!MT.tick)
            MT.tick = setInterval(function () { safe(mtTick); }, 400);
    }
    // 段落写完才请求翻译：后面已有新段落，或 0.9 秒没有变化
    function mtTick() {
        if (!MT.on || !MT.pending.size) {
            clearInterval(MT.tick);
            MT.tick = 0;
            return;
        }
        var now = Date.now();
        MT.pending.forEach(function (u) {
            var st = MT.units.get(u);
            if (!u.isConnected || !st) {
                MT.pending.delete(u);
                return;
            }
            if (!MT.queued.has(st.key) && (now - st.at >= 900 || mtHasNext(u)))
                mtWant(st.key);
        });
    }
    function mtHasNext(u) {
        for (var n = u.nextElementSibling; n; n = n.nextElementSibling)
            if (!n.classList.contains('agzh-tr'))
                return true;
        return false;
    }
    function mtCollectOf(node, units) {
        var el = node.nodeType === 1 ? node : node.parentElement;
        if (!el || el.closest('.agzh-tr'))
            return;
        var root = el.closest('[data-markdown-root]');
        if (!root || !mtIsTargetRoot(root))
            return;
        var u = mtUnitFrom(el, root);
        if (u)
            units.add(u);
    }
    function mtCollectIn(node, units) {
        if (node.nodeType !== 1) {
            mtCollectOf(node, units);
            return;
        }
        if (node.classList.contains('agzh-tr'))
            return;
        var root = node.closest('[data-markdown-root]');
        var roots = root ? [root] : node.querySelectorAll('[data-markdown-root]');
        for (var i = 0; i < roots.length; i++) {
            if (!mtIsTargetRoot(roots[i]))
                continue;
            var scope = root ? node : roots[i];
            mtCollectOf(scope, units);
            var els = scope.querySelectorAll(MT_UNIT_SEL);
            for (var j = 0; j < els.length; j++) {
                var u = mtUnitFrom(els[j], roots[i]);
                if (u)
                    units.add(u);
            }
        }
    }
    function mtOnRecords(records) {
        var units = new Set(), removed = false;
        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            if (r.type === 'childList') {
                if (r.removedNodes.length)
                    removed = true;
                for (var j = 0; j < r.addedNodes.length; j++)
                    if (r.addedNodes[j].isConnected)
                        mtCollectIn(r.addedNodes[j], units);
                mtCollectOf(r.target, units);
            }
            else if (r.type === 'characterData') {
                mtCollectOf(r.target, units);
            }
        }
        units.forEach(mtUnit);
        // 段落被移除时清理留在原处的译文
        if (removed)
            MT.tracked.forEach(function (u) {
                var st = MT.units.get(u);
                if (!st)
                    MT.tracked.delete(u);
                else if (!u.isConnected)
                    mtDrop(u, st);
            });
    }
    function mtScanAll() {
        var units = new Set();
        mtCollectIn(document.body, units);
        units.forEach(mtUnit);
    }
    function mtClearAll() {
        var trs = document.querySelectorAll('.agzh-tr');
        for (var i = 0; i < trs.length; i++)
            trs[i].parentNode.removeChild(trs[i]);
        MT.units = new WeakMap();
        MT.tracked.clear();
        MT.pending.clear();
        MT.watch.clear();
        MT.queue.length = 0;
        MT.queued.clear();
        MT.dead.clear();
        MT.tries.clear();
        MT.solo.clear();
    }
    // ---- 开关：悬浮按钮 + Alt+Shift+T（Ctrl+Alt+T 会被 QQ 全局热键抢走）；状态经主进程保存（页面端口每次启动都会变，localStorage 存不住）----
    function mtSetError(on) {
        if (MT.error !== on) {
            MT.error = on;
            mtButton();
        }
    }
    function mtStyle() {
        if (document.getElementById('agzh-style'))
            return;
        var st = document.createElement('style');
        st.id = 'agzh-style';
        st.textContent =
            '.agzh-tr{display:block;margin:2px 0 8px;padding-left:10px;border-left:2px solid rgba(127,127,127,.35);opacity:.85;font-size:.94em;line-height:1.65;white-space:pre-line;transition:opacity .2s}' +
            '.agzh-tr.agzh-stale{opacity:.45}' +
            'li>.agzh-tr,dd>.agzh-tr,dt>.agzh-tr{margin:2px 0 4px}' +
            'td>.agzh-tr,th>.agzh-tr{margin:2px 0 0;padding-left:0;border-left:0}' +
            '#agzh-mt-btn{position:fixed;z-index:2147483000;width:26px;height:26px;border-radius:13px;border:1px solid rgba(127,127,127,.35);' +
            'background:rgba(127,127,127,.12);color:inherit;font:600 12px/24px system-ui,"Microsoft YaHei",sans-serif;text-align:center;padding:0;' +
            'cursor:pointer;opacity:.55;transition:opacity .15s,background .15s;-webkit-app-region:no-drag;user-select:none}' +
            '#agzh-mt-btn:hover{opacity:1}' +
            '#agzh-mt-btn.on{background:#2563eb;border-color:#2563eb;color:#fff;opacity:.9}' +
            '#agzh-mt-btn.err{box-shadow:0 0 0 2px rgba(239,68,68,.75)}';
        (document.head || document.documentElement).appendChild(st);
    }
    function mtButton() {
        var b = document.getElementById('agzh-mt-btn');
        if (!b) {
            b = document.createElement('button');
            b.id = 'agzh-mt-btn';
            b.type = 'button';
            b.textContent = '\u8bd1';
            b.setAttribute('data-agzh-skip', '');
            b.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                mtToggle(!MT.on);
            });
            document.body.appendChild(b);
        }
        b.className = (MT.on ? 'on' : '') + (MT.on && MT.error ? ' err' : '');
        b.title = (MT.on ? '双语对照：已开启' : '双语对照：已关闭') + '（Alt+Shift+T 切换）\n翻译思考过程、回复正文和步骤说明（微软翻译）' +
            (MT.on && MT.error ? '\n翻译服务暂时连不上，正在自动重试' : '');
        b.setAttribute('aria-pressed', MT.on ? 'true' : 'false');
        mtPosition();
    }
    // 按钮贴在对话区右上角；没有打开对话时隐藏
    function mtPosition() {
        var b = document.getElementById('agzh-mt-btn');
        if (!b)
            return;
        var cv = document.querySelector('[data-testid="conversation-view"]');
        var r = cv && cv.getBoundingClientRect();
        if (!r || r.width < 200 || r.height < 120) {
            b.style.display = 'none';
            return;
        }
        b.style.display = '';
        b.style.top = Math.round(r.top + 10) + 'px';
        b.style.left = Math.round(r.right - 40) + 'px';
    }
    function mtToggle(on, fromMain) {
        on = !!on;
        if (on === MT.on)
            return;
        MT.on = on;
        MT.error = false;
        if (!fromMain)
            safe(function () { console.debug('__agzh__:' + JSON.stringify({ bilingual: on })); });
        mtButton();
        if (on)
            mtScanAll();
        else
            mtClearAll();
        // 步骤行：重新走一遍文本处理（开启时套用机器译文，关闭时还原）
        processTree(document.body, new Set());
    }
    function mtStart() {
        mtStyle();
        mtButton();
        window.__agzhSetCfg = function (cfg) {
            if (cfg && typeof cfg.bilingual === 'boolean')
                safe(function () { mtToggle(cfg.bilingual, true); });
        };
        document.addEventListener('keydown', function (e) {
            if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyT') {
                e.preventDefault();
                e.stopPropagation();
                safe(function () { mtToggle(!MT.on); });
            }
        }, true);
        window.addEventListener('resize', function () { safe(mtPosition); });
        setInterval(function () { safe(mtPosition); }, 1000);
        safe(function () { console.debug('__agzh__:' + JSON.stringify({ hello: 1 })); });
        if (MT.on)
            mtScanAll();
    }
    // 测试钩子：离线回归测试时导出匹配函数，不接触 DOM
    if (typeof window.__agZhTestHook === 'function') {
        window.__agZhTestHook({ zh: zh, translateText: translateText, MAP: MAP, REGEX_MAP: REGEX_MAP, PREFIX_MAP: PREFIX_MAP, DYNAMIC_MAP: DYNAMIC_MAP, MT: MT, mtWorth: mtWorth, mtLabel: mtLabel });
        return;
    }
    function start() {
        // 中文 lang 让 Chromium 选用简体中文字形（避免中日韩混排时回退到日文字形）
        safe(function () { document.documentElement.lang = 'zh-CN'; });
        safe(function () { processTree(document.body, new Set()); });
        var obs = new MutationObserver(function (records) {
            // 同步处理（在浏览器绘制之前完成），只处理变化的节点，避免英文闪烁与整页重扫
            safe(function () {
                var done = new Set();
                for (var i = 0; i < records.length; i++) {
                    var r = records[i];
                    if (r.type === 'childList') {
                        for (var j = 0; j < r.addedNodes.length; j++)
                            if (r.addedNodes[j].isConnected)
                                processTree(r.addedNodes[j], done);
                        // 删除兄弟文本节点会改变拆句结构，重新处理父元素
                        if (r.removedNodes.length && r.target.nodeType === 1 && r.target.isConnected)
                            processParentTexts(r.target, done);
                    }
                    else if (r.type === 'characterData') {
                        if (r.target.parentElement)
                            processParentTexts(r.target.parentElement, done);
                    }
                    else if (r.type === 'attributes') {
                        processAttrs(r.target);
                    }
                }
            });
            if (MT.on)
                safe(function () { mtOnRecords(records); });
            // 丢弃本轮自身改写产生的变更记录
            obs.takeRecords();
        });
        obs.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ATTR_KEYS,
        });
        safe(mtStart);
    }
    if (document.body)
        start();
    else
        document.addEventListener('DOMContentLoaded', start);
}
// 以自执行函数字符串形式注入渲染进程，幂等（window.__agZhPack 防重复）
// 每次注入时带上主进程保存的设置（双语对照开关），见 i18n-zh-main.js readSettings
var RENDERER_BODY = '(' + agZhRenderer.toString() + ')();';
function rendererConfig() {
    try {
        var s = require("./i18n-zh-main").readSettings();
        return { bilingual: s.bilingual === true };
    }
    catch (e) {
        return { bilingual: false };
    }
}
Object.defineProperty(exports, "RENDERER_SCRIPT", {
    enumerable: true,
    get: function () { return 'window.__agzhCfg=' + JSON.stringify(rendererConfig()) + ';' + RENDERER_BODY; },
});
