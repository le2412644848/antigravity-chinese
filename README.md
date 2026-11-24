# Antigravity 桌面端汉化包 v3

给 Google Antigravity 桌面端（`%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe`）做的中文界面。
**版本自适应**：每次从当前安装的官方 `app.asar` 提取代码重新打补丁，官方更新后重跑脚本即可。

当前适配：**Antigravity 2.35.0**（Electron 44.9.1），2026-11-24。

## 日常使用

| 脚本 | 作用 |
| --- | --- |
| `一键汉化.cmd` | 词表自检 → 关闭 Antigravity → 从官方原版提取源码 → 打补丁 → 打包部署 → 自动重启 |
| `一键还原.cmd` | 关闭 Antigravity → 恢复官方原版 `app.asar.bak-zh` → 自动重启 |

**官方自动更新后界面变回英文？更新完直接双击 `一键汉化.cmd`**，脚本会自动用新版官方文件重建备份并在其上打补丁。

只想检查新版本能不能汉化、不想动安装目录：

```
node asar-tool\localize.js . --check
```

## 汉化覆盖范围

| 层 | 文件 | 方式 |
| --- | --- | --- |
| 网页界面（侧栏、设置、对话步骤、弹窗、提示…） | `app-src/dist/i18n-zh.js` | 注入页面，按词表替换文本节点与 `placeholder` / `title` / `aria-label` 等属性 |
| 原生菜单栏、托盘菜单、系统对话框、系统通知 | `app-src/dist/i18n-zh-main.js` | 主进程运行时挂钩 Electron 的 `dialog` / `Menu` / `Notification` |
| 启动加载页 | `localize.js` 补丁 | 加一行“正在加载 Antigravity…” |

**词表不翻译的内容**：智能体回复与思考过程（Markdown 渲染区）、你发出的消息、代码块、编辑器、终端、会话列表里的对话标题。

## 双语对照（机器翻译模型输出）

模型写的内容没法放进词表，所以另做了一个**双语对照**开关，默认关闭：

- **开关**：对话区右上角的小圆钮「译」，或快捷键 `Alt+Shift+T`。开关状态会记住（保存在 `%APPDATA%\Antigravity\agzh-settings.json`），多个窗口同步。
- **翻译范围**：
  - 思考过程、智能体回复：逐段翻译，译文以浅色显示在每段原文下方，原文保留。
  - 步骤行里模型写的说明（如 `Ran search UI text for 门禁` 的后半句）、步骤计划（todo list）里的条目：直接替换成中文，鼠标悬停显示原文。
  - 命令参数、文件名/路径、带下划线或数字的名字、驼峰名、提交哈希等标识符先换成占位符再翻译，原样放回；占位符被译丢时保留原文。
  - 不翻：你发出的消息、代码块、产物文档、已经是中文的段落。行内代码、文件标签用占位符保护，翻译后原样放回。
- **流式输出**：正在输出的段落等它写完（后面出现新段落，或停顿 0.9 秒）再翻；段落继续变化时旧译文变淡，新译文到达后替换。
- **翻译引擎**：微软翻译（Edge 浏览器内置翻译用的免费接口 `edge.microsoft.com/translate/translatetext`，无需密钥）。这是非官方接口，微软随时可能调整；连不上时按钮外圈变红，自动退避重试，期间显示原文。
- **隐私**：开启后，思考过程、回复和步骤说明的文字会发送给微软翻译。不想外发时关掉开关即可（关闭状态下不会发出任何翻译请求）。
- 译文按原文缓存，界面重绘或重新打开开关时直接复用，不会重复请求。

## 想补翻译词条？

1. 网页界面文本在 `app-src\dist\i18n-zh.js` 的 `MAP` 里，一行一条：`'英文原文': '中文翻译',`
   - 去掉首尾空格后**必须与英文原文完全一致**才会替换；`…` 和 `...` 互通
   - 带变量的句子放 `DYNAMIC_MAP`，`\u0001` 代表变量，例如 `['Connected to \u0001', '已连接到 \u0001', 1]`
     第三项：省略 = 变量里的时间/数量会被美化（如 `5 minutes` → `5 分钟`）；`1` = 变量原样保留（路径、命令、名称）；`2` = 变量本身是界面名词，按 MAP 翻译
2. 原生菜单/对话框文本在 `app-src\dist\i18n-zh-main.js` 的 `EXACT` / `TEMPLATES` 里
3. 保存（UTF-8）后双击 `一键汉化.cmd` 生效

### 维护工具（`asar-tool\`）

| 命令 | 作用 |
| --- | --- |
| `node test.js` | 离线回归测试：抽样词条、动态句式、主进程文案（`一键汉化.cmd` 会先跑它） |
| `node audit.js` | 覆盖率审计：自动找到正在运行的 Antigravity 语言服务，下载前端包并提取界面文案候选（含 `` `${n} steps` `` 这类模板句式），未覆盖清单写到 `_audit-untranslated.txt` |
| `node localize.js . --check [--out=文件]` | 预检：完整走一遍提取/打补丁/打包，不碰安装目录 |
| `node localize.js . --a11y` | 部署时额外开启 Chromium 无障碍树常驻（v2 默认开启；有性能开销，仅外部 UI 自动化工具需要） |

`audit.js` 的提取规则会过滤日志、断言、内置 ELK 图布局库等非界面字符串；剩下未覆盖的基本是开发调试信息、Google 内部功能和品牌名。

## 原理

- 桌面端 = Electron 壳 + `language_server.exe` 内置网页，界面文本在网页里，程序本身没有语言设置。
- `localize.js` 每次运行：
  1. 检测 Electron fuse —— 若官方启用了 asar 完整性校验会**主动中止**（目前是关闭的）；
  2. 当前未汉化（刚更新）→ 刷新官方备份 `app.asar.bak-zh`；已汉化 → 以备份为源，保证每次都从干净原版打补丁；
  3. 复制 `i18n-zh.js` / `i18n-zh-main.js`，按补丁表打补丁：

     | 文件 | 补丁 | 必需 |
     | --- | --- | --- |
     | `main.js` | 第一行加载主进程汉化挂钩 | 是 |
     | `utils.js` | 引入词表；在 Hub 页面 `dom-ready` 时注入；主框架加载失败时重新签发启动令牌重试（最多 5 次） | 是 |
     | `loadingOverlay.js` | 启动加载页文案 | 否 |

     每项按顺序尝试多个锚点，第一个“恰好出现一次”的生效。**必需项全部失效时直接中止、不部署**，避免装上一个只有菜单是中文的半成品；
  4. 全部改动文件过 `node --check`；
  5. 重新打包（保留 `node_modules/chrome-devtools-mcp` 为 unpacked），等待 Antigravity 进程完全退出后部署（文件占用自动重试）。
- 原生菜单挂钩的细节：`Menu.prototype.insert` 把中文标签交给原生层后**还原 JS 侧英文标签**，并接管 `_getLabelForCommandId`，所以官方按 `'File'` / `'View'` 查找菜单、按标签取更新动作等逻辑完全不受影响，托盘“N agents running”这类运行时改变的标签也能翻译。
- 网页注入的细节：`MutationObserver` 回调里**同步**只处理变化的节点（绘制前完成，无英文闪烁）；翻译结果缓存；React 把一句话拆成多个相邻文本节点时整体翻译、结果写入第一个节点、其余置空（不移除节点，React 后续更新仍能正确识别）。

## 注意

- **官方自动更新会覆盖 `app.asar`**，界面变回英文属正常，重跑 `一键汉化.cmd` 即可。
- 本包放在 OneDrive 里：刚复制完或 OneDrive 正在同步时首次运行可能报错，等同步完成再跑一次。
- 若汉化后 Antigravity 无法启动：先跑 `一键还原.cmd` 恢复原版，再把 `一键汉化.cmd` 窗口里的输出发给维护者。
- 需要 Node.js（≥ 16）且在 PATH 中。
- 从 VS Code 等 Electron 系终端里手动启动 Antigravity 时，若环境变量里有 `ELECTRON_RUN_AS_NODE=1` 会启动失败（报 `bad option`）；两个 `.cmd` 脚本已自动清掉它。

---

## 更新记录

### v3.2（2026-11-24，适配 2.35.0）

- 2.35.0 补丁锚点全部有效，无需改 `localize.js`。
- 新增的**步骤计划（todo list）**：进度胶囊 `3/3 steps · 1 failed · 2 skipped`、无障碍标签由词表翻译；计划条目是模型写的，开启双语后机器翻译（悬停看原文）。
- 词表补齐 2.35.0 新界面：收件箱模式、自动标记已解决、听写语言、插件权限、浏览器下载/Cookie、SSH 等，静态文案审计覆盖率 89.5% → 94.1%。
- 通用规则：` · ` 拼接的状态摘要逐段翻译。
- 双语修正：微软接口偶尔吞掉占位符右括号（`⟦1⟧` → `⟦1`）导致整句退回英文，现在能正确还原；标识符与中文之间补空格；修正“call site → 呼叫网站”等误译。
- `audit.js` 新增模板字符串句式审计；回归测试增至 58 项。

### v3.1（2026-11-22）

- 新增**双语对照**：思考过程、回复正文、步骤行模型说明的机器翻译（微软翻译），对话区右上角「译」按钮或 `Alt+Shift+T` 开关。
- 词表补齐对话步骤行：`Ran` / `Analyzed` / `Explored files, ran commands` / `Exited with code N` 等前缀与步骤组摘要。
- 回归测试增至 41 项；另用无头 Edge + 真实翻译接口做了 DOM 级测试（流式段落、React 式改写、段落删除、开关还原）。

### v3（2026-11-22，适配 2.34.0）

官方 2.34.0 把窗口改成了 `BaseWindow + WebContentsView`，页面改由 `loadHubWindowUrl` 携带一次性启动令牌加载，并新增 SSH 远程、Passkey、设备选择、连接信息等大量原生对话框。v2 在新版上的问题与本轮改动：

1. **加载失败重试会丢令牌**：v2 的重试直接 `win.loadURL(url)`，绕过了启动令牌签发。现改为挂在 `hubContents` 上，重试走官方 `loadHubWindowUrl`。
2. **整体替换 `menu.js` 会丢官方功能**：v2 用固定中文模板覆盖官方 `menu.js`，新版里会丢掉 Hub 缩放修复（`Ctrl+=` 放大）、开发者工具隐藏、WSL 子菜单、新建窗口前的语言服务检查等。现在不再改 `menu.js`，改为主进程挂钩翻译。
3. **外壳文案改为运行时挂钩**：v2 在 `main.js` / `updater.js` / `ipcHandlers.js` 上逐条锚点替换（约 30 处），每次官方改一个字就静默失效。现在由 `i18n-zh-main.js` 统一翻译所有原生对话框、菜单、托盘和通知，新增的 SSH / Passkey / 设备选择 / 证书信息对话框都已覆盖。
4. **补丁失效不再“假成功”**：必需补丁找不到锚点时中止部署（v2 只打印警告，结果装上去界面还是英文）。
5. **网页注入引擎重写**：
   - 只处理变化的节点 + 同步执行，告别每次变化都整页重扫（长对话流式输出时更省 CPU）与 80ms 英文闪烁；
   - 新增翻译缓存；
   - **修复正文误伤**：v2 会把智能体回复里恰好和词条相同的句子翻成中文（例如回复里单独一句 `Done.`），现在跳过 Markdown 渲染区与用户消息；
   - **修复拆分节点被“冻结”**：v2 用 `textContent =` 覆盖拆分句子会摘掉 React 的文本节点，之后计数/计时不再更新（如 `Running for 5s` 停住）；
   - 页面 `lang` 设为 `zh-CN`，中文使用简体字形；
   - 新增属性 `aria-description`、`data-tooltip-content`。
6. **词表**：MAP 2782 → 3248 条，DYNAMIC 72 → 299 条（新增对话步骤状态 `Thought for 12s`、`Ran command`、`Searched for`、浏览器数据/Cookie 管理、快捷键方案、编排器/执行器、旁路提问、SSH 主机、插件捆绑包、额度提示等）。拼接句式新增“插入值原样保留”模式，命令、路径、搜索词不再被误改成“5 个文件”之类。
7. **无障碍树常驻改为可选**（`--a11y`）：它与汉化无关，且会让 Chromium 持续维护无障碍树，带来额外开销。
8. **新增维护工具**：`test.js`（离线回归测试）、`audit.js`（自动抓取前端包审计覆盖率）、`localize.js --check`（预检）。

### v2（2026-09-05 ~ 2026-11-11）

- 改为版本自适应：每次从当前官方 `app.asar` 提取源码打补丁；内置离线 `@electron/asar`，不再依赖 `npx` 联网。
- 44.x / 2.3x 适配：注入锚点改为 `void win.loadURL(url);`（回退 `hubWindows.add(win);`）；中文菜单模板保留 WSL 导出；`initialize({` 双锚点兼容。
- 词表从 1814 条扩到 2783 条，新增 REGEX_MAP / PREFIX_MAP / DYNAMIC_MAP 动态匹配、片段级翻译、省略号变体兜底；删除会造成中英混杂的“长词条子串替换”。

### v1（2026-08-30，适配 2.11.0）

- 直接打包固定版本的已汉化源码。

---

## 致谢

感谢以下服务、项目与开源组件为本汉化包提供核心支撑（本仓库与以下官方团队/厂商均无从属或背书关系）：

### 在线服务与上游应用

| 名称 | 用途说明 | 备注 |
| --- | --- | --- |
| **Microsoft Edge 翻译接口** | 为「双语对照」模式提供免密钥英译中机翻能力 | 调用端点 `edge.microsoft.com/translate/translatetext`（非官方公开接口，默认关闭，开启后仅将需翻译片段发往微软接口） |
| **Google Antigravity & Electron** | 提供目标桌面端应用与底层 Electron 运行时框架 | `Antigravity` 名称与原版程序版权归 Google LLC 所有，本工具仅为非官方第三方本地化补丁 |
| **Node.js** | 运行 `localize.js`、`audit.js`、`test.js` 等构建与测试脚本 | 基于 MIT License 开源 |

### 核心开源依赖（`asar-tool/`）

| 组件 | 协议 | 用途 |
| --- | --- | --- |
| [@electron/asar](https://github.com/electron/asar) (`^4.3.0`) | MIT | 官方 `app.asar` 本地增量解包、Fuse 校验与重打包 |
| `balanced-match` / `brace-expansion` | MIT | `@electron/asar` 底层路径通配依赖 |
| `glob` / `minimatch` / `lru-cache` / `minipass` / `path-scurry` | BlueOak-1.0.0 | `@electron/asar` 文件遍历、模式匹配与流缓冲依赖 |

---

## 开源许可

- 本仓库中的原创本地化代码、词表、主进程挂钩模块及配套脚本（`asar-tool/localize.js`、`asar-tool/audit.js`、`asar-tool/test.js`、`app-src/dist/i18n-zh.js`、`app-src/dist/i18n-zh-main.js`、`一键汉化.cmd`、`一键还原.cmd`、`README.md` 等）均基于 **[MIT License](LICENSE)** 开源。
- **权属声明与免责边界**：
  - `app-src/` 目录下除 `i18n-zh*.js` 外的历史原版提取文件、图标资产以及 `app-src/package.json` 所列上游依赖均归 Google LLC 及各自原作者/开源项目所有，各自遵循其原有协议，不适用本仓库 MIT 再授权；
  - 使用「双语对照」机器翻译功能时，请注意微软在线翻译接口的服务可用性及数据外发合规性；
  - 本工具仅在本地对桌面客户端执行可逆补丁（自动保留 `app.asar.bak-zh` 原版备份并支持 `一键还原.cmd`），使用前请确保符合目标软件的使用条款。
