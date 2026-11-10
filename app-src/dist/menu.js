"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApplicationMenu = setupApplicationMenu;
exports.wslConnectMenuTemplate = wslConnectMenuTemplate;
exports.wslReopenLocallyTemplate = wslReopenLocallyTemplate;
exports.relaunchWithWslDistro = relaunchWithWslDistro;
const electron_1 = require("electron");
const path = require("path");
const utils_1 = require("./utils");
const updater_1 = require("./updater");
const wsl_1 = require("./wsl");
/**
 * Applies modifications to the default application menu.
 * Windows/Linux 上使用全中文自定义菜单模板；macOS 保留默认菜单
 * （role 项由系统自动本地化），仅插入 New Window 与更新项。
 *
 * 说明：本模板为“自包含”实现，同时保留 WSL 相关导出，以兼容新版 main.js /
 * ipcHandlers.js 对 wslConnectMenuTemplate / wslReopenLocallyTemplate /
 * relaunchWithWslDistro 的引用（缺失会导致启动即崩）。
 */
function setupApplicationMenu(url) {
    if (!(0, utils_1.isMacOS)()) {
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(buildChineseTemplate(url)));
        return;
    }
    const menu = electron_1.Menu.getApplicationMenu();
    if (!menu) {
        return;
    }
    // Adds a "New Window" item to the top of the existing File menu.
    addItemToSubmenu(menu, 'File', 0, new electron_1.MenuItem({
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => {
            (0, utils_1.createWindow)(url);
        },
    }));
    // Add "Check for Updates" to the application menu on macOS.
    if ((0, utils_1.isMacOS)()) {
        const appSubmenu = menu.items[0]?.submenu;
        if (appSubmenu) {
            appSubmenu.insert(1, new electron_1.MenuItem({
                id: 'check-for-updates',
                label: updater_1.MenuUpdateStep.CheckForUpdates,
                click: (menuItem) => {
                    const action = updater_1.updateActions[menuItem.label];
                    action?.();
                },
            }));
        }
    }
    // Adds Docs to the Help menu (DevTools item stays hidden)
    addItemToSubmenu(menu, 'Help', 0, new electron_1.MenuItem({
        label: 'Docs',
        click: async () => {
            await electron_1.shell.openExternal('https://antigravity.google/docs');
        },
    }));
    const hideDevTools = (menuInstance) => {
        menuInstance.items?.forEach((item) => {
            if (item.role?.toLocaleLowerCase() === 'toggledevtools') {
                item.visible = false;
            }
            if (item.submenu) {
                hideDevTools(item.submenu);
            }
        });
    };
    hideDevTools(menu);
    // Re-apply the menu so the change takes effect.
    electron_1.Menu.setApplicationMenu(menu);
}
/**
 * Windows/Linux 全中文菜单。role 保持与默认菜单一致的功能与快捷键。
 */
function buildChineseTemplate(url) {
    return [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建窗口',
                    accelerator: 'CmdOrCtrl+Shift+N',
                    click: () => (0, utils_1.createWindow)(url),
                },
                { type: 'separator' },
                { role: 'quit', label: '退出' },
            ],
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' },
                { role: 'selectAll', label: '全选' },
            ],
        },
        {
            label: '视图',
            submenu: [
                { role: 'reload', label: '重新加载' },
                { role: 'forceReload', label: '强制重新加载' },
                { type: 'separator' },
                { role: 'resetZoom', label: '实际大小' },
                { role: 'zoomIn', label: '放大' },
                { role: 'zoomOut', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '切换全屏' },
            ],
        },
        {
            label: '窗口',
            submenu: [
                { role: 'minimize', label: '最小化' },
                { role: 'zoom', label: '缩放' },
                { role: 'close', label: '关闭' },
            ],
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '文档',
                    click: async () => {
                        await electron_1.shell.openExternal('https://antigravity.google/docs');
                    },
                },
            ],
        },
    ];
}
/**
 * Builds a "Connect to WSL" submenu of installed distros (null when WSL
 * isn't applicable); selecting one relaunches the app connected to it.
 * （保留自官方新版，供托盘菜单复用）
 */
async function wslConnectMenuTemplate() {
    if (!(0, wsl_1.isWslAvailable)()) {
        return null;
    }
    let distros;
    try {
        distros = await (0, wsl_1.listWslDistros)();
    }
    catch (err) {
        console.error('Failed to list WSL distros:', err);
        return null;
    }
    if (distros.length === 0) {
        return null;
    }
    const active = (0, wsl_1.getActiveWslDistro)();
    const submenu = distros.map((d) => ({
        label: d.name,
        type: 'checkbox',
        checked: d.name === active,
        click: () => relaunchWithWslDistro(d.name),
    }));
    return { label: '连接到 WSL', submenu };
}
/** "Reopen Locally" item leaving WSL mode, or null when already local. */
function wslReopenLocallyTemplate() {
    if (!(0, wsl_1.getActiveWslDistro)()) {
        return null;
    }
    return { label: '在本地重新打开', click: () => relaunchWithWslDistro('') };
}
/** Relaunches the app connected to `distro` ('' = local mode). */
function relaunchWithWslDistro(distro) {
    if (distro === (0, wsl_1.getActiveWslDistro)()) {
        return;
    }
    // Persist so the choice survives relaunches that drop command-line switches.
    (0, wsl_1.persistWslDistro)(path.join(electron_1.app.getPath('userData'), wsl_1.WSL_STATE_FILE), distro);
    const args = process.argv
        .slice(1)
        .filter((a) => !a.startsWith('--wsl-distro'));
    if (distro) {
        args.push(`--wsl-distro=${distro}`);
    }
    electron_1.app.relaunch({ args });
    electron_1.app.quit();
}
/**
 * Adds a menu item to a submenu of the main application menu.
 */
function addItemToSubmenu(appMenu, submenuLabel, position, item) {
    const submenuItem = appMenu.items.find((entry) => entry.label === submenuLabel);
    if (!submenuItem?.submenu) {
        return;
    }
    submenuItem.submenu.insert(position, item);
}
