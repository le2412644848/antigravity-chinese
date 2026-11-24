"use strict";
/**
 * Antigravity 桌面端中文语言包（Electron 主进程层）
 *
 * 由 main.js 第一行 require 并调用 install()。与逐条锚点补丁不同，这里在运行时
 * 统一挂钩 Electron API，官方新增/改动原生文案时无需改动源码补丁：
 *   - dialog.showMessageBox(Sync) / showErrorBox / showOpenDialog(Sync) / showSaveDialog(Sync)
 *   - Menu.prototype.insert + Menu.prototype._getLabelForCommandId
 *     原生菜单显示中文，但 JS 侧 item.label 保持英文，官方按 'File'/'View' 查找菜单、
 *     按 updateActions[label] 取更新动作等逻辑不受影响；托盘"N agents running"等动态标签同样生效
 *   - Notification.prototype.show（系统通知标题/正文）
 *   - 渲染层设置桥（双语对照开关）：页面以 console.debug('__agzh__:{...}') 上报，保存到 userData/agzh-settings.json，
 *     下次注入时由 i18n-zh.js 的 RENDERER_SCRIPT 带回页面，并同步给其他已打开的窗口
 * 匹配规则：整串精确匹配 → 正则模板；多行文本逐行翻译；未收录保持原样。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.translate = translate;
exports.readSettings = readSettings;

const EXACT = {
    // —— 应用菜单（Electron 默认菜单 role 文案） ——
    'File': '文件',
    'Edit': '编辑',
    'View': '视图',
    'Window': '窗口',
    'Help': '帮助',
    'Exit': '退出',
    'Quit': '退出',
    'Undo': '撤销',
    'Redo': '重做',
    'Cut': '剪切',
    'Copy': '复制',
    'Paste': '粘贴',
    'Paste and Match Style': '粘贴并匹配样式',
    'Delete': '删除',
    'Select All': '全选',
    'Reload': '重新加载',
    'Force Reload': '强制重新加载',
    'Toggle Developer Tools': '切换开发者工具',
    'Actual Size': '实际大小',
    'Zoom In': '放大',
    'Zoom Out': '缩小',
    'Toggle Full Screen': '切换全屏',
    'Minimize': '最小化',
    'Zoom': '缩放',
    'Close': '关闭',
    'Close Window': '关闭窗口',
    'Learn More': '了解更多',
    'Services': '服务',
    'Hide Others': '隐藏其他',
    'Show All': '全部显示',
    'Bring All to Front': '全部置于顶层',
    'Speech': '语音',
    'Start Speaking': '开始朗读',
    'Stop Speaking': '停止朗读',
    // —— 应用自定义菜单项 / 托盘 / Dock ——
    'New Window': '新建窗口',
    'Docs': '文档',
    'Connect to WSL': '连接到 WSL',
    'Reopen Locally': '在本地重新打开',
    'Check for Updates': '检查更新',
    'Checking for Updates...': '正在检查更新...',
    'Downloading Update...': '正在下载更新...',
    'Restart to Update': '重启以更新',
    'No agents running': '没有正在运行的智能体',
    'Connection info…': '连接信息…',
    // —— 通用按钮 ——
    'Cancel': '取消',
    'OK': '确定',
    'Yes': '是',
    'No': '否',
    'Allow': '允许',
    "Don't Allow": '不允许',
    'Continue': '继续',
    'Sign In': '登录',
    'Sign in': '登录',
    'Restart': '重启',
    'Later': '稍后',
    'Take Over': '接管',
    'Stop Server': '停止服务器',
    'Choose Another File…': '选择其他文件…',
    // —— 启动 / 退出 / WSL ——
    'Binary not found': '未找到程序文件',
    'Startup failed': '启动失败',
    'Confirm Quit': '确认退出',
    'Are you sure you want to quit?': '确定要退出吗？',
    'There may be agents or background tasks running.': '可能仍有智能体或后台任务正在运行。',
    'WSL distro not found': '未找到 WSL 发行版',
    'Antigravity opened on Windows instead.': '已改为在 Windows 上打开 Antigravity。',
    'WSL setup failed': 'WSL 配置失败',
    'language_server binary not found at:': '未找到 language_server 程序，预期位置：',
    'Please build set a valid location.': '请设置有效的程序位置（重新安装 Antigravity 通常可以解决）。',
    // —— 更新 ——
    'No updates available': '已是最新版本',
    // —— 工作区 / 下载 ——
    'Open workspace': '打开工作区',
    'Open workspaces': '打开多个工作区',
    'Select Download Folder': '选择下载文件夹',
    'Cannot open folder': '无法打开文件夹',
    'Folder is on the Windows filesystem': '该文件夹位于 Windows 文件系统上',
    // —— 设备 / 通行密钥 / 连接信息 ——
    'Connect a device': '连接设备',
    'Select a device:': '选择设备：',
    'No compatible devices found.': '未找到兼容的设备。',
    'Choose a Passkey': '选择通行密钥',
    'Select a passkey account to continue:': '选择一个通行密钥账号以继续：',
    'Passkeys': '通行密钥',
    'Connection info': '连接信息',
    'Certificate is valid': '证书有效',
    'Certificate details': '证书详情',
    'This page': '此页面',
    // —— SSH 远程 ——
    'Choose an SSH config file': '选择 SSH 配置文件',
    'Choose another SSH config file': '选择其他 SSH 配置文件',
    'SSH connection failed': 'SSH 连接失败',
    'Could not restart the SSH server': '无法重启 SSH 服务器',
    'Stop SSH server': '停止 SSH 服务器',
    'Agents running on this host will stop and its window will close. The server starts again the next time you connect.': '该主机上运行的智能体将停止，其窗口也会关闭。下次连接时服务器会重新启动。',
    'Reconnect first, then stop its server.': '请先重新连接，再停止其服务器。',
    'Microphone access': '麦克风访问权限',
    'Shared home directory': '共享主目录',
    'Restart SSH server': '重启 SSH 服务器',
    'The connection was closed before it finished.': '连接在完成前已关闭。',
    'Touch your security key': '请触摸你的安全密钥',
};

const DEVICE_NOUNS = { 'HID device': 'HID 设备', 'USB device': 'USB 设备', 'serial port': '串口' };

/** [正则, 替换]；替换可为函数。按顺序匹配，具体句式放前面。 */
const TEMPLATES = [
    [/^(\d+) agents? running$/, '$1 个智能体正在运行'],
    [/^The WSL distro "(.+)" is no longer installed\.$/, 'WSL 发行版“$1”已不再安装。'],
    [/^(.+) wants to connect to a (HID device|USB device|serial port)$/, (m, who, kind) => `${who} 想要连接到 ${DEVICE_NOUNS[kind]}`],
    [/^Sign in to your organization for (.+)\?$/, '要为 $1 登录你的组织账号吗？'],
    [/^Sign in to (.+)$/, '登录到 $1'],
    [/^Finish this sign-in on (.+)\?$/, '要在 $1 上完成此次登录吗？'],
    [/^Stop the Antigravity server on (.+)\?$/, '要停止 $1 上的 Antigravity 服务器吗？'],
    [/^Not connected to (.+)$/, '未连接到 $1'],
    [/^Allow (.+) to use your microphone\?$/, '允许 $1 使用你的麦克风吗？'],
    [/^The page in this window comes from (.+?)\. If you allow it, that host can use this computer's microphone for voice whenever one of its windows is open\. Antigravity asks again after you quit it\.$/,
        '此窗口中的页面来自 $1。如果允许，只要该主机的任一窗口处于打开状态，它就可以使用本机麦克风进行语音输入。退出 Antigravity 后会再次询问。'],
    [/^Continue only if you just chose to sign in with your organization in this window\. (.+?) will get access to your organization's Google Cloud account\.$/,
        '仅当你刚刚在此窗口中选择使用组织账号登录时才继续。$1 将获得你组织 Google Cloud 账号的访问权限。'],
    [/^Continue only if you just chose to sign in from the (.+?) window\. Your browser opens the sign-in page; once you sign in, (.+?) gets access to that account\.$/,
        '仅当你刚刚在 $1 窗口中选择登录时才继续。浏览器将打开登录页面；登录后，$2 将获得该账号的访问权限。'],
    [/^Workforce pool: (.*?)  Provider: (.*)$/, '员工身份池：$1  提供方：$2'],
    [/^Identity provider: (.*)$/, '身份提供方：$1'],
    [/^Sign-in page: (.*)$/, '登录页面：$1'],
    [/^(.+) still runs Antigravity server (.+)\.$/, '$1 仍在运行 Antigravity 服务器 $2。'],
    [/^(.+) is running server (.+); this app is (.+)\. Restart the server now\?$/, '$1 正在运行服务器 $2，而本应用版本为 $3。要立即重启服务器吗？'],
    [/^Any (agent or task|agent, task or terminal) still running on it stops\. The server starts again with this app's version\.$/,
        (m, what) => `其上仍在运行的${what === 'agent or task' ? '智能体或任务' : '智能体、任务或终端'}都将停止。服务器将以本应用的版本重新启动。`],
    [/^This window's Antigravity server runs on (.+?), another machine that shares your home directory\.$/, '此窗口的 Antigravity 服务器运行在 $1 上，这是另一台与你共享主目录的机器。'],
    [/^Your Antigravity server runs on (.+?), another machine that shares your home directory\.$/, '你的 Antigravity 服务器运行在 $1 上，这是另一台与你共享主目录的机器。'],
    [/^(.+?), another machine that shares your home directory, started your Antigravity server\.$/, '$1（另一台与你共享主目录的机器）启动了你的 Antigravity 服务器。'],
    [/^Windows SSH hosts aren't supported yet\. ?(.*)$/, '暂不支持 Windows SSH 主机。$1'],
    [/^Password for (.+)$/, '$1 的密码'],
    [/^(.+) can't be the SSH config file$/, '$1 不能用作 SSH 配置文件'],
    [/^SSH: (.+)$/, 'SSH：$1'],
    [/^Error code: (.*)$/, '错误代码：$1'],
    [/^Logs: (.*)$/, '日志：$1'],
    [/^Error: (.*)$/, '错误：$1'],
    [/^Issued to: (.*)$/, '颁发给：$1'],
    [/^Issued by: (.*)$/, '颁发者：$1'],
    [/^Valid from: (.*)$/, '有效期起：$1'],
    [/^Valid until: (.*)$/, '有效期至：$1'],
    [/^Protocol: (.*)$/, '协议：$1'],
    [/^(.+) reported: (.*)$/, '$1 报告：$2'],
];

/** 仅用于菜单标签的泛化句式（避免误伤对话框/通知正文） */
const MENU_TEMPLATES = [
    [/^Open (.+)$/, '打开 $1'],
    [/^About (.+)$/, '关于 $1'],
    [/^Hide (.+)$/, '隐藏 $1'],
    [/^Quit (.+)$/, '退出 $1'],
];

const cache = new Map();

function translateLine(line, templates) {
    const key = line.trim();
    if (!key) {
        return line;
    }
    let out = Object.prototype.hasOwnProperty.call(EXACT, key) ? EXACT[key] : undefined;
    if (out === undefined) {
        for (const [re, rep] of templates) {
            if (re.test(key)) {
                out = key.replace(re, rep);
                break;
            }
        }
    }
    return out === undefined ? line : line.replace(key, () => out);
}

/** 翻译一段主进程文案（多行逐行处理），未收录时原样返回；forMenu 启用菜单专用句式 */
function translate(s, forMenu) {
    if (typeof s !== 'string' || !s || /[\u4e00-\u9fff]/.test(s)) {
        return s;
    }
    const ck = (forMenu ? 'M' : 'T') + s;
    let v = cache.get(ck);
    if (v === undefined) {
        const templates = forMenu ? TEMPLATES.concat(MENU_TEMPLATES) : TEMPLATES;
        v = s.split('\n').map((line) => translateLine(line, templates)).join('\n');
        if (cache.size > 2000) {
            cache.clear();
        }
        cache.set(ck, v);
    }
    return v;
}

const DIALOG_TEXT_KEYS = ['title', 'message', 'detail', 'checkboxLabel', 'buttonLabel', 'nameFieldLabel', 'prompt'];
const DIALOG_OPTION_HINTS = DIALOG_TEXT_KEYS.concat(['buttons', 'filters', 'properties', 'defaultPath', 'type']);

function isDialogOptions(arg) {
    return Boolean(arg) && typeof arg === 'object' && !Array.isArray(arg) &&
        DIALOG_OPTION_HINTS.some((k) => k in arg) && typeof arg.webContents === 'undefined';
}

function localizeDialogOptions(opts) {
    const copy = Object.assign({}, opts);
    for (const k of DIALOG_TEXT_KEYS) {
        if (typeof copy[k] === 'string') {
            copy[k] = translate(copy[k]);
        }
    }
    if (Array.isArray(copy.buttons)) {
        copy.buttons = copy.buttons.map((b) => translate(b));
    }
    if (Array.isArray(copy.filters)) {
        copy.filters = copy.filters.map((f) => (f && typeof f.name === 'string' ? Object.assign({}, f, { name: translate(f.name) }) : f));
    }
    return copy;
}

function hookDialog(dialog) {
    for (const fn of ['showMessageBox', 'showMessageBoxSync', 'showOpenDialog', 'showOpenDialogSync', 'showSaveDialog', 'showSaveDialogSync']) {
        const orig = dialog[fn];
        if (typeof orig !== 'function') {
            continue;
        }
        dialog[fn] = function (...args) {
            try {
                args = args.map((a) => (isDialogOptions(a) ? localizeDialogOptions(a) : a));
            }
            catch (e) { /* 翻译失败不影响对话框 */ }
            return orig.apply(this, args);
        };
    }
    const origErr = dialog.showErrorBox;
    if (typeof origErr === 'function') {
        dialog.showErrorBox = function (title, content) {
            return origErr.call(this, translate(title), translate(content));
        };
    }
}

function hookMenu(Menu) {
    const P = Menu && Menu.prototype;
    if (!P || typeof P.insert !== 'function') {
        return;
    }
    const origInsert = P.insert;
    P.insert = function (pos, item) {
        const label = item && item.label;
        const zh = typeof label === 'string' ? translate(label, true) : label;
        if (zh === label) {
            return origInsert.call(this, pos, item);
        }
        // 插入时把中文标签交给原生层，随后还原 JS 侧英文标签（官方按英文标签查找菜单项）
        item.label = zh;
        try {
            return origInsert.call(this, pos, item);
        }
        finally {
            item.label = label;
        }
    };
    if (typeof P._getLabelForCommandId === 'function') {
        const origGet = P._getLabelForCommandId;
        P._getLabelForCommandId = function (id) {
            return translate(origGet.call(this, id), true);
        };
    }
}

function hookNotification(Notification) {
    const P = Notification && Notification.prototype;
    if (!P || typeof P.show !== 'function') {
        return;
    }
    const origShow = P.show;
    P.show = function (...args) {
        try {
            if (typeof this.title === 'string') {
                this.title = translate(this.title);
            }
            if (typeof this.body === 'string') {
                this.body = translate(this.body);
            }
        }
        catch (e) { /* 同上 */ }
        return origShow.apply(this, args);
    };
}

// ---------------------------------------------------------------------------
// 渲染层设置桥：Hub 页面没有可用的 IPC 通道，页面端口每次启动都会变（localStorage 存不住），
// 因此页面通过带固定前缀的控制台消息上报设置，主进程保存到 userData/agzh-settings.json
// ---------------------------------------------------------------------------
const SETTINGS_PREFIX = '__agzh__:';
const SETTINGS_KEYS = { bilingual: 'boolean' };
function settingsFile() {
    const { app } = require("electron");
    return require("path").join(app.getPath('userData'), 'agzh-settings.json');
}
function readSettings() {
    try {
        const v = JSON.parse(require("fs").readFileSync(settingsFile(), 'utf8'));
        return v && typeof v === 'object' ? v : {};
    }
    catch (e) {
        return {};
    }
}
function writeSettings(patch) {
    const cur = readSettings();
    Object.assign(cur, patch);
    try {
        require("fs").writeFileSync(settingsFile(), JSON.stringify(cur, null, 2));
    }
    catch (e) {
        console.warn('[i18n-zh] 保存设置失败：', e && e.message);
    }
}
const settingsPeers = new Set();
function onRendererMessage(wc, msg) {
    let data;
    try {
        data = JSON.parse(msg.slice(SETTINGS_PREFIX.length));
    }
    catch (e) {
        return;
    }
    if (!data || typeof data !== 'object') {
        return;
    }
    if (!settingsPeers.has(wc)) {
        settingsPeers.add(wc);
        wc.once('destroyed', () => settingsPeers.delete(wc));
    }
    const patch = {};
    for (const k of Object.keys(SETTINGS_KEYS)) {
        if (typeof data[k] === SETTINGS_KEYS[k]) {
            patch[k] = data[k];
        }
    }
    if (!Object.keys(patch).length) {
        return;
    }
    writeSettings(patch);
    const js = 'window.__agzhSetCfg&&window.__agzhSetCfg(' + JSON.stringify(patch) + ')';
    for (const peer of settingsPeers) {
        if (peer !== wc && !peer.isDestroyed()) {
            peer.executeJavaScript(js).catch(() => { });
        }
    }
}
function hookSettingsBridge(app) {
    app.on('web-contents-created', (_e, wc) => {
        wc.on('console-message', (event, _level, message) => {
            // Electron 35+：消息在 event.message；旧版为第 3 个参数
            const msg = event && typeof event.message === 'string' ? event.message : message;
            if (typeof msg === 'string' && msg.startsWith(SETTINGS_PREFIX)) {
                onRendererMessage(wc, msg);
            }
        });
    });
}

let installed = false;
function install() {
    if (installed) {
        return;
    }
    installed = true;
    const electron = require("electron");
    for (const step of [() => hookDialog(electron.dialog), () => hookMenu(electron.Menu), () => hookNotification(electron.Notification), () => hookSettingsBridge(electron.app)]) {
        try {
            step();
        }
        catch (e) {
            console.warn('[i18n-zh] 主进程汉化挂钩失败：', e && e.message);
        }
    }
}
