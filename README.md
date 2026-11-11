# Antigravity 桌面端汉化包 v2

给 Google Antigravity 桌面端（`%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe`，Agentic Desktop Application）做的中文界面。
v1 制作于 2026-08-30（适用 2.11.0）；**v2 重制于 2026-09-05（初版适配 2.12.2；**现已在 44.9.1 上完整验证**），且改为“版本自适应”方案：每次从当前安装的官方版本提取代码重新打补丁，官方更新后直接重跑脚本即可，不再依赖固定版本的源码。**

> **2026-10-28 适配 44.5.1（官方改用新版本号体系）**：
> 1. 新版在 `utils.js` 里 `void win.loadURL(url);` 与 `return win;` 之间插入了 `hubWindows.add(win);`，导致旧的整段锚点失效、界面注入被静默跳过（表现为菜单/托盘中文、但正文全英文）。已把注入锚点改为稳定的 `void win.loadURL(url);`（缺失时回退到 `hubWindows.add(win);`），不再依赖易变的相邻语句。
> 2. 新版 `main.js` / `ipcHandlers.js` 依赖 `menu.js` 导出的 `wslConnectMenuTemplate` / `wslReopenLocallyTemplate` / `relaunchWithWslDistro`；旧中文菜单模板缺这三个导出会导致启动即崩。中文菜单模板已改为“自包含 + 保留 WSL 导出”的实现。
> 3. 词表大幅补充：从 `language_server.exe` 内置的网页包（`/main.js`，约 10MB）中批量提取界面英文原文，新增约 590 条词条（设置各面板副标题、通知/声音/内置浏览器、用量/额度、语音、插件/技能、钩子/MCP、工作区/远程控制、各类操作按钮与状态等），使设置弹窗等深层页面也完整中文。设置项文案通过 `label:`/`description:` 属性渲染，同样被 `dom-ready` 注入脚本按文本精确匹配翻译。

## 日常使用

| 脚本 | 作用 |
| --- | --- |
| `一键汉化.cmd` | 关闭 Antigravity → 从当前官方 `app.asar` 提取源码 → 打汉化补丁 → 重新打包部署 → 自动重启 |
| `一键还原.cmd` | 关闭 Antigravity → 恢复官方原版 `app.asar.bak-zh` → 自动重启 |

**官方自动更新后界面变回英文？更新完直接双击 `一键汉化.cmd` 就行**——脚本会自动用新版官方文件重建备份并在其上打补丁，无需任何手动操作。

## 想补翻译词条？

界面文本都在 `app-src\dist\i18n-zh.js` 的 `MAP` 里，格式一行一条:

```js
'英文原文': '中文翻译',
```

改完保存(UTF-8)，双击 `一键汉化.cmd` 即可生效。

- 匹配规则:界面文本去掉首尾空格后**必须与英文原文完全一致**才会替换，所以长句子要一字不差地抄;没收录的文本保持英文，不会出错。
- `placeholder`、`title`(悬停提示)、`aria-label` 也会被翻译。
- 对话内容、对话标题是你的数据，不会被词表误伤(除非恰好整条就是某个词条)。
- `app-src\dist\menu.js` 是中文菜单模板(文件/编辑/视图/窗口/帮助)，一般不用动。

## v2 原理与文件构成

- 桌面端是 Electron 壳 + `language_server.exe` 内置网页，界面文本在网页里，程序本身没有语言设置。
- 汉化 = 修改 Electron 壳的 `app.asar`。v2 每次运行时:
  1. 检测 Electron fuse——若官方启用了 asar 完整性校验(`EnableEmbeddedAsarIntegrityValidation`)会**主动中止**并提示，避免打出无法启动的包(2.12.2 实测该开关是关闭的);
  2. 当前未汉化(刚更新)→ 自动重建官方备份 `app.asar.bak-zh`;已汉化(重复运行)→ 以备份为源，保证每次都从干净原版打补丁;
  3. 提取官方源码，复制词表并在 `utils.js`(dom-ready 注入 + 加载失败自动重试)、`main.js`(退出确认框/错误框/托盘)、`loadingOverlay.js`(启动加载页)上打补丁，`menu.js` 换成中文菜单模板;
  4. 全部文件过一遍 `node --check` 语法校验，**任何环节失败都不动安装目录**;
  5. 重新打包(`--unpack-dir node_modules/chrome-devtools-mcp`)并部署。
- 打补丁用的是“锚点匹配”:若未来版本改动过大导致某个锚点找不到，该项**自动跳过保持英文**并输出警告，不会损坏应用。
- `asar-tool\` 是离线打包工具(内置 `@electron/asar`，无需联网、不依赖 npx)——v1 依赖 `npx --yes @electron/asar` 联网下载，代理没开时就报“打包失败,请检查网络或 node 环境”，v2 已彻底消除该问题。
- 旧版 `app-src` 里的其余 2.11.0 源码已不再使用(仅 `i18n-zh.js` 词表和 `menu.js` 模板是活文件)，留作历史参考。

## 注意

- **官方自动更新会覆盖 `app.asar` 并清掉备份文件**，界面变回英文属正常，重跑 `一键汉化.cmd` 即可(它会自动重建备份)。
- 本包放在 OneDrive 里:若刚复制完整个汉化包、或 OneDrive 正在同步(任务栏云朵图标转圈)，首次运行可能报错，**等同步完成再跑一次即可**。
- 若汉化后 Antigravity 无法启动:先跑 `一键还原.cmd` 恢复原版，再把 `一键汉化.cmd` 窗口里的输出发给维护者。
- 需要 Node.js(≥16)且在 PATH 中(`where node` 能找到)。
- 沙盒/受限环境里启动 Antigravity 可能因写不了 `%APPDATA%\antigravity\lockfile` 而秒退(报 `process_singleton_win.cc Lock file can not be created`),这不是汉化的问题，正常双击快捷方式启动即可。

---

## 2026-11-11 适配 44.9.1 —— 完整性补译（本轮）

针对"官方多次更新后汉化不到位"做了一次系统性审计与补齐，**词表从 1814 条扩到 2783 条（+53%）**，并新增三类动态匹配机制：

| 机制 | 数量 | 作用 |
| --- | --- | --- |
| MAP 精确词条 | 2407 | 静态界面文本（原有 + 本轮新增约 590 条） |
| REGEX_MAP 正则 | 39 | 纯数字/时间句式（1mo、5 minutes ago、Every 2 hours、3:00 PM…） |
| PREFIX_MAP 前缀 | 24 | 带动态尾部的句式（Next run …、Resets in …、Your Plan: …） |
| DYNAMIC_MAP 句式 | 64 | **新增**：模板字符串里插入变量的句子（Welcome back, {name}. Where should we pick up?、Copied {x} to clipboard…） |

本轮修复的典型问题：

1. **单数形式缺失**：词表原先只收了复数（Skills/Plugins/Agents），单数 Skill/Plugin/Agent/Hook/Rule/Extension/Environment 等全部漏翻。
2. **高频按钮词缺失**：Skip/Dismiss/Retry/Next/Done/Confirm/Reset/Apply/Export/Import/Share/Log in/Connect/Disconnect 等。
3. **大小写/标点近失配**：Good Response（原文 Good response）、Open In（Open in）、Pull Requests（Pull requests）、Undo to Here（Undo To Here）、Tip:/Output:/Command:（原文带冒号）等 11 处**静默不翻**，已补齐。
4. **动态句式全漏**：just now、5 minutes ago、Next run today around 9:00 AM、Resets in 2h 30m、Show 3 more、Every hour at :30、AM/PM 时间等，靠"整串精确匹配"永远命中不了，已由 REGEX_MAP/PREFIX_MAP/DYNAMIC_MAP 覆盖。
5. **React 拆分文本节点导致中英混杂**：设置页权限卡片被 React 拆成 "Also includes" + <span>Global Permissions</span> + "when working " + "in this project" + "." 五个节点，整句永远拼不出来。已改为**片段级翻译**（逐节点命中）+ 删除会造成混杂的前缀规则，并把 ./,/:/; 独立标点也纳入词表。
6. **外壳层英文**：WSL setup failed、WSL distro not found、Antigravity opened on Windows instead.、New Window、Check for Updates/Checking for Updates.../Downloading Update.../Restart to Update、Open workspace/Open workspaces/Select Download Folder/Cannot open folder/Folder is on the Windows filesystem —— 已在 main.js/updater.js/ipcHandlers.js/menu.js 中全部中文化（localize.js 新增 5.6/5.7 两节补丁）。
7. **失效锚点**：44.9.1 把 main_1.default.initialize(); 改成 initialize({，导致"无障碍树常驻"补丁被静默跳过。localize.js 已改为**双锚点兼容**。
8. **占位符 bug**：'plan': 'plan'（译文与原文相同 → 永远不生效）已修为 '方案'。

**翻译引擎能力升级**：
- zh() 匹配优先级改为 MAP → DYNAMIC_MAP → REGEX_MAP → PREFIX_MAP，并让"含数字"的文本优先走正则，避免静态词条抢走动态部分。
- 新增 `translateFragment()`：整句未命中时按分句切段逐段翻译，并对长短语做子串替换兜底。
- 新增 `applyComposite()`：对无子元素的容器元素取 `textContent` 整体翻译，处理 React 把一句话拆到多个 <span> 的情况。
- `beautifyRemain()` 扩展：中文星期、`ago`/`today`/`tomorrow`/`around`、<1m、st/nd/rd/th、AM/PM 转上午/下午、2h 30m/1d 2h 复合时长、以及 N projects/items/files/tasks/... 量词。

**回归测试**：静态词条 90/90、动态句式 23/23 全部命中；部署后 6 个外壳文件补丁全部校验通过。

**覆盖率**：从网页前端（含 JSX 文本节点与 `title:`/`label:`/`description:` 等对象键，含不带引号写法）提取 1567 条 UI 候选串，扣除 232 条仅出现在 VS Code 主题色选择器里的颜色描述后，可翻译文案 **1335 条**，实际覆盖 **1329 条 = 99.6%**。仅剩 `Project 4K`/`Google Chat`/`Google Chrome`/`Sample GDoc`/`Gemini Flash Next`（品牌/产品名）与 `Command Shift A`（快捷键标签），均属刻意保留。

> 维护提示：本轮新增词条集中在 i18n-zh.js 末尾的几个 // —— ... —— 注释块内，便于日后审阅。

### 第三轮追加（针对实机截图复查）

实机逐页截图复查发现一批**设置卡片文案**此前未被提取到，根因是这些文案用的是**不带引号的对象键**：

```js
B.createElement(RP, {title:"Browser", description:"Configure built-in browser, ..."})
```

而首轮提取正则只匹配了 `"title":"..."` 这种带引号的写法，于是「应用 / 外观 / 浏览器 / 语音模式」四个设置页的描述句整批漏翻。本轮已修正提取规则并补齐 **104 条**（含 `Verbose→详细`、`Strong→高对比`、`Change…→更改…` 等选项值与按钮）。

同时修掉两个引擎级缺陷：

1. **删除"长词条子串替换"兜底** —— 它会在英文长句里挖出中文洞，产生 `The voice used in 语音模式. Powered by Gemini Live.` 这类中英混杂。React 拆句改由**片段级词条**（如 `Scan the code to open this device in` + `Remote Control` + `copy link`）逐节点覆盖，输出干净。
2. **新增省略号变体兜底** —— 源码里常写 `"Change\u2026"`（运行时是 `…`），词表里写 `...` 会匹配失败。现在 `…`/`...` 会互相回退查找。
