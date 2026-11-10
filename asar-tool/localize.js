#!/usr/bin/env node
"use strict";
/**
 * Antigravity 桌面端一键汉化引擎 v2
 *
 * 与 v1（直接打包旧版 app-src）不同，v2 每次从「当前安装的官方 app.asar」提取源码，
 * 在新版代码上重新打汉化补丁，因此官方更新后直接重跑即可，不再依赖固定版本。
 *
 * 流程：
 *   1. 校验安装目录与运行环境
 *   2. 检测 Electron fuse（若官方启用 asar 完整性校验则中止并提示）
 *   3. 判断当前 app.asar 是否已汉化：
 *      - 未汉化（刚更新）→ 用当前官方 asar 刷新备份 app.asar.bak-zh，并以它为源
 *      - 已汉化（重复运行）→ 以备份 app.asar.bak-zh 为源（保证每次都从干净原版打补丁）
 *   4. 提取源码（通过目录联接借用安装目录的 app.asar.unpacked）
 *   5. 复制词表 app-src/dist/i18n-zh.js，并对 utils.js / main.js /
 *      loadingOverlay.js 打补丁；menu.js 用中文菜单模板整体替换（依赖齐备时）
 *   6. 语法校验 → 重新打包 asar → 关闭 Antigravity → 部署
 *
 * 用法：node localize.js <汉化包根目录>
 * 退出码：0 成功；1 失败（安装目录保持原状）
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const asar = require("@electron/asar");

const PKG_ROOT = path.resolve(String(process.argv[2] || ".").replace(/[\\/"]+$/, ""));
const INSTALL_DIR = path.join(process.env.LOCALAPPDATA || "", "Programs", "antigravity");
const RES = path.join(INSTALL_DIR, "resources");
const APP_ASAR = path.join(RES, "app.asar");
const BAK_ASAR = path.join(RES, "app.asar.bak-zh");
const UNPACKED = path.join(RES, "app.asar.unpacked");
const EXE = path.join(INSTALL_DIR, "Antigravity.exe");
const UNPACK_DIR = "node_modules/chrome-devtools-mcp";

function ok(msg) { console.log("  [OK] " + msg); }
function warn(msg) { console.log("  [警告] " + msg); }
function die(msg) { console.error("  [失败] " + msg); process.exit(1); }

/** 读取 Electron fuse 线，返回 fuse 字节数组（v1 布局） */
function readFuses(exePath) {
    const buf = fs.readFileSync(exePath);
    const sentinel = Buffer.from("dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX", "ascii");
    const idx = buf.indexOf(sentinel);
    if (idx < 0) return null;
    const version = buf[idx + sentinel.length];
    const wireLength = buf[idx + sentinel.length + 1];
    if (version < 1 || wireLength < 1 || wireLength > 32) return null;
    return Array.from(buf.slice(idx + sentinel.length + 2, idx + sentinel.length + 2 + wireLength));
}

function listArchive(p) {
    return asar.listPackage(p, { isPack: false });
}

/** 当前安装的 asar 是否已汉化 */
function isLocalized(p) {
    try {
        return listArchive(p).some((f) => f.replace(/\\/g, "/").endsWith("dist/i18n-zh.js"));
    } catch (e) {
        return false;
    }
}

function syntaxCheck(file) {
    try {
        execFileSync(process.execPath, ["--check", file], { stdio: "ignore" });
        return true;
    } catch (e) {
        return false;
    }
}

/** 在 content 中执行一次补丁；找不到锚点或锚点不唯一时警告并跳过 */
function applyPatch(fileName, content, find, replace, label) {
    const count = content.split(find).length - 1;
    if (count === 0) {
        warn(fileName + "：未找到锚点「" + label + "」，该项保持英文");
        return content;
    }
    if (count > 1) {
        warn(fileName + "：锚点「" + label + "」出现 " + count + " 次（预期 1 次），为安全起见跳过");
        return content;
    }
    ok(fileName + "：" + label);
    return content.replace(find, replace);
}

async function main() {
    console.log("=== Antigravity 一键汉化 v2 ===");

    // ---- 1. 环境与安装校验 ----
    console.log("[1/6] 校验环境");
    if (!fs.existsSync(EXE)) die("未找到 " + EXE + "，请确认 Antigravity 已安装");
    if (!fs.existsSync(APP_ASAR)) die("未找到 " + APP_ASAR);
    const wordList = path.join(PKG_ROOT, "app-src", "dist", "i18n-zh.js");
    if (!fs.existsSync(wordList)) die("未找到词表 " + wordList);
    ok("安装目录与词表就绪");

    // ---- 2. fuse 完整性校验检测 ----
    console.log("[2/6] 检测 Electron fuse");
    const fuses = readFuses(EXE);
    let integrityEnabled = false;
    if (fuses) {
        // FuseV1 顺序: 0 RunAsNode, 1 CookieEncryption, 2 NodeOptions,
        // 3 NodeCliInspect, 4 EnableEmbeddedAsarIntegrityValidation, 5 OnlyLoadAppFromAsar, ...
        integrityEnabled = fuses[4] === 0x31;
        ok("fuse 线读取成功（共 " + fuses.length + " 个），asar 完整性校验 = " + (integrityEnabled ? "启用" : "关闭"));
    } else {
        warn("未能解析 fuse 线，跳过完整性校验检测");
    }
    if (integrityEnabled) {
        die("官方已启用 asar 完整性校验（EnableEmbeddedAsarIntegrityValidation），修改 app.asar 会导致无法启动。请联系维护者更新方案。");
    }

    // ---- 3. 选择源 asar 并维护官方备份 ----
    console.log("[3/6] 维护官方原版备份");
    const currentLocalized = isLocalized(APP_ASAR);
    let sourceAsar;
    if (currentLocalized) {
        if (!fs.existsSync(BAK_ASAR)) {
            die("当前 app.asar 已是汉化版，但官方备份 app.asar.bak-zh 丢失，无法重新打补丁。请先重装/更新 Antigravity 恢复官方原版。");
        }
        sourceAsar = BAK_ASAR;
        ok("当前已汉化，以官方备份 app.asar.bak-zh 为源重新打补丁");
    } else {
        fs.copyFileSync(APP_ASAR, BAK_ASAR);
        sourceAsar = BAK_ASAR;
        ok("当前为官方原版，已刷新备份 app.asar.bak-zh（" + fs.statSync(BAK_ASAR).size + " 字节）");
    }

    // ---- 4. 提取源码 ----
    console.log("[4/6] 提取官方源码");
    const work = fs.mkdtempSync(path.join(os.tmpdir(), "agzh-"));
    const workAsar = path.join(work, "app.asar");
    const workUnpackedLink = path.join(work, "app.asar.unpacked");
    const workSrc = path.join(work, "app-src");
    const packedAsar = path.join(work, "app.asar.new");
    try {
        fs.copyFileSync(sourceAsar, workAsar);
        if (fs.existsSync(UNPACKED)) {
            fs.symlinkSync(UNPACKED, workUnpackedLink, "junction");
        } else {
            warn("安装目录缺少 app.asar.unpacked，提取出的包可能缺 chrome-devtools-mcp");
        }
        asar.extractAll(workAsar, workSrc);
        if (fs.existsSync(workUnpackedLink)) fs.unlinkSync(workUnpackedLink);
        const distDir = path.join(workSrc, "dist");
        if (!fs.existsSync(path.join(distDir, "utils.js"))) die("提取失败：dist/utils.js 不存在");
        const mcpDir = path.join(workSrc, "node_modules", "chrome-devtools-mcp");
        ok("源码提取完成" + (fs.existsSync(mcpDir) ? "（chrome-devtools-mcp 完整）" : "（警告：chrome-devtools-mcp 缺失）"));

        // ---- 5. 打补丁 ----
        console.log("[5/6] 应用汉化补丁");

        // 5.1 词表
        fs.copyFileSync(wordList, path.join(distDir, "i18n-zh.js"));
        ok("dist/i18n-zh.js：词表已复制");

        // 5.2 utils.js —— 注入渲染进程脚本 + 加载失败自动重试
        // 兼容性：新版(44.x)在 loadURL 与 return win 之间插入了 hubWindows.add(win);
        // 因此不再用大段固定锚点，而是把注入代码挂到「创建窗口并加载页面」的稳定锚点上。
        let utils = fs.readFileSync(path.join(distDir, "utils.js"), "utf8");
        if (utils.includes('require("./i18n-zh")')) {
            warn("utils.js：补丁已存在，跳过");
        } else {
            // 5.2.1 引入词表模块（锚点：加载页模块的 require）
            if (utils.includes('const loadingOverlay_1 = require("./loadingOverlay");')) {
                utils = applyPatch("utils.js", utils,
                    'const loadingOverlay_1 = require("./loadingOverlay");',
                    'const loadingOverlay_1 = require("./loadingOverlay");\nconst i18n_zh_1 = require("./i18n-zh");',
                    "引入词表模块");
            } else {
                // 退路：插到 "use strict"; 之后
                utils = applyPatch("utils.js", utils,
                    '"use strict";',
                    '"use strict";\nconst i18n_zh_1 = require("./i18n-zh");',
                    "引入词表模块(退路)");
            }
            // 5.2.2 dom-ready 注入 + 主框架加载失败自动重试
            const injection =
                "    // 汉化注入:每个窗口 dom-ready 时执行中文词表替换脚本\n" +
                "    win.webContents.on('dom-ready', () => {\n" +
                "        try {\n" +
                "            void win.webContents.executeJavaScript(i18n_zh_1.RENDERER_SCRIPT).catch(() => { });\n" +
                "        }\n" +
                "        catch (e) { /* 汉化注入失败不影响主流程 */ }\n" +
                "    });\n" +
                "    // 语言服务偶发启动慢会导致加载超时黑屏,主框架加载失败时自动重试\n" +
                "    let loadRetryCount = 0;\n" +
                "    win.webContents.on('did-fail-load', (_event, errorCode, _errorDescription, _validatedURL, isMainFrame) => {\n" +
                "        if (!isMainFrame || errorCode === -3 /* ERR_ABORTED */)\n" +
                "            return;\n" +
                "        if (loadRetryCount >= 5)\n" +
                "            return;\n" +
                "        loadRetryCount += 1;\n" +
                "        setTimeout(() => {\n" +
                "            try {\n" +
                "                void win.loadURL(url);\n" +
                "            }\n" +
                "            catch (e) { /* 重试失败不影响主流程 */ }\n" +
                "        }, 2000);\n" +
                "    });\n";
            let injected = false;
            if (utils.includes("    void win.loadURL(url);")) {
                utils = applyPatch("utils.js", utils,
                    "    void win.loadURL(url);",
                    injection + "    void win.loadURL(url);",
                    "dom-ready 注入 + 加载失败重试");
                injected = true;
            }
            if (!injected && utils.includes("    hubWindows.add(win);")) {
                utils = applyPatch("utils.js", utils,
                    "    hubWindows.add(win);",
                    injection + "    hubWindows.add(win);",
                    "dom-ready 注入 + 加载失败重试(挂 hubWindows.add)");
                injected = true;
            }
            if (!injected) {
                warn("utils.js：未找到创建窗口的稳定锚点，跳过界面注入（仅能汉化菜单/托盘等外壳）");
            }
            fs.writeFileSync(path.join(distDir, "utils.js"), utils, "utf8");
        }

        // 5.3 main.js —— 对话框与托盘中文化
        let mainJs = fs.readFileSync(path.join(distDir, "main.js"), "utf8");
        if (mainJs.includes("setAccessibilitySupportEnabled")) {
            warn("main.js：补丁已存在，跳过");
        } else {
            mainJs = applyPatch("main.js", mainJs,
                "    main_1.default.initialize();",
                "    // 保持无障碍树常驻(中文词表注入依赖 MutationObserver,也便于外部工具读取界面)\n" +
                "    electron_1.app.setAccessibilitySupportEnabled(true);\n" +
                "    main_1.default.initialize();",
                "无障碍树常驻");
            mainJs = applyPatch("main.js", mainJs,
                "showErrorBox('Binary not found', msg)",
                "showErrorBox('未找到程序文件', msg)",
                "错误框·未找到程序文件");
            mainJs = applyPatch("main.js", mainJs,
                "showErrorBox('Startup failed', msg)",
                "showErrorBox('启动失败', msg)",
                "错误框·启动失败");
            mainJs = applyPatch("main.js", mainJs,
                "label: 'No agents running',",
                "label: '没有正在运行的智能体',",
                "托盘·没有正在运行的智能体");
            mainJs = applyPatch("main.js", mainJs,
                "label: `Open ${electron_1.app.getName()}`,",
                "label: `打开 ${electron_1.app.getName()}`,",
                "托盘·打开");
            mainJs = applyPatch("main.js", mainJs,
                "label: 'Quit',",
                "label: '退出',",
                "托盘·退出");
            mainJs = applyPatch("main.js", mainJs,
                "buttons: ['Cancel', 'Quit'],",
                "buttons: ['取消', '退出'],",
                "退出确认框·按钮");
            mainJs = applyPatch("main.js", mainJs,
                "title: 'Confirm Quit',",
                "title: '确认退出',",
                "退出确认框·标题");
            mainJs = applyPatch("main.js", mainJs,
                "message: 'Are you sure you want to quit?',",
                "message: '确定要退出吗？',",
                "退出确认框·正文");
            mainJs = applyPatch("main.js", mainJs,
                "detail: 'There may be agents or background tasks running.',",
                "detail: '可能仍有智能体或后台任务正在运行。',",
                "退出确认框·补充说明");
            fs.writeFileSync(path.join(distDir, "main.js"), mainJs, "utf8");
        }

        // 5.4 loadingOverlay.js —— 启动加载页
        let overlay = fs.readFileSync(path.join(distDir, "loadingOverlay.js"), "utf8");
        if (overlay.includes("正在加载 Antigravity")) {
            warn("loadingOverlay.js：补丁已存在，跳过");
        } else {
            if (overlay.includes('<div class="text">Loading Antigravity</div>')) {
                overlay = applyPatch("loadingOverlay.js", overlay,
                    '<div class="text">Loading Antigravity</div>',
                    '<div class="text">正在加载 Antigravity</div>',
                    "启动加载页文案");
            } else if (overlay.includes("</svg>")) {
                overlay = applyPatch("loadingOverlay.js", overlay,
                    "</svg>",
                    '</svg>\n  <div style="margin-top:16px;font-size:14px;opacity:0.8;">正在加载 Antigravity...</div>',
                    "启动加载页文案");
            }
            fs.writeFileSync(path.join(distDir, "loadingOverlay.js"), overlay, "utf8");
        }

        // 5.5 menu.js —— 用中文菜单模板整体替换（校验依赖齐备）
        const menuTemplate = path.join(PKG_ROOT, "app-src", "dist", "menu.js");
        const menuTarget = path.join(distDir, "menu.js");
        const origMenu = fs.readFileSync(menuTarget, "utf8");
        if (origMenu.includes("buildChineseTemplate")) {
            warn("menu.js：已是中文模板，跳过");
        } else {
            const depsOk =
                origMenu.includes("exports.setupApplicationMenu") &&
                utils.includes("exports.createWindow") &&
                utils.includes("exports.isMacOS") &&
                fs.readFileSync(path.join(distDir, "updater.js"), "utf8").includes("MenuUpdateStep");
            if (fs.existsSync(menuTemplate) && depsOk) {
                fs.copyFileSync(menuTemplate, menuTarget);
                ok("menu.js：已替换为全中文菜单模板");
            } else {
                warn("menu.js：模板缺失或新版接口不兼容，保留英文菜单（不影响其他汉化）");
            }
        }

        // 5.6 语法校验
        for (const f of ["utils.js", "main.js", "loadingOverlay.js", "menu.js", "i18n-zh.js"]) {
            if (!syntaxCheck(path.join(distDir, f))) die(f + " 语法校验失败，已中止（安装目录未改动）");
        }
        ok("全部文件语法校验通过");

        // ---- 6. 打包并部署 ----
        console.log("[6/6] 打包并部署");
        await asar.createPackageWithOptions(workSrc, packedAsar, { unpackDir: UNPACK_DIR });
        const entries = listArchive(packedAsar);
        if (!entries.some((f) => f.replace(/\\/g, "/").endsWith("dist/i18n-zh.js"))) {
            die("打包结果校验失败：包内没有 dist/i18n-zh.js");
        }
        ok("打包完成（" + fs.statSync(packedAsar).size + " 字节，含 i18n-zh.js）");

        try {
            execFileSync("taskkill", ["/F", "/IM", "Antigravity.exe"], { stdio: "ignore" });
            console.log("  已关闭正在运行的 Antigravity");
        } catch (e) { /* 没在运行 */ }
        await new Promise((r) => setTimeout(r, 1500));

        fs.copyFileSync(packedAsar, APP_ASAR);
        ok("app.asar 已部署");
        const packedUnpacked = packedAsar + ".unpacked";
        if (fs.existsSync(packedUnpacked)) {
            try {
                if (fs.existsSync(UNPACKED)) fs.rmSync(UNPACKED, { recursive: true, force: true });
                fs.cpSync(packedUnpacked, UNPACKED, { recursive: true });
                ok("app.asar.unpacked 已同步");
            } catch (e) {
                warn("app.asar.unpacked 同步失败（" + e.message + "），内容通常与原版一致，可忽略");
            }
        }

        console.log("\n全部完成！Antigravity 即将启动，若界面仍是英文请等几秒或重开窗口。");
    } finally {
        try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) { /* 清理失败无碍 */ }
    }
}

main().catch((e) => die(e.stack || String(e)));
