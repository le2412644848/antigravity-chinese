#!/usr/bin/env node
"use strict";
/**
 * Antigravity 桌面端一键汉化引擎 v3
 *
 * 每次从「当前安装的官方 app.asar」提取源码，在新版代码上重新打补丁，官方更新后直接重跑即可。
 *
 * v3 相比 v2：
 *   - 外壳文案（原生菜单/托盘/对话框/系统通知）改为运行时挂钩 Electron API（dist/i18n-zh-main.js），
 *     不再逐条锚点替换 main.js / menu.js / updater.js / ipcHandlers.js，也不再整体替换 menu.js
 *     （旧做法会丢掉官方新版的缩放修复、WSL 子菜单、调试菜单隐藏等逻辑）
 *   - 补丁表驱动：每项标明是否「必需」；必需项锚点失效时直接中止，不部署半成品
 *   - 适配 2.34.0：界面注入挂到 hubContents，加载失败重试改走 loadHubWindowUrl（重新签发启动令牌）
 *   - --check 预检模式：完整走一遍提取/打补丁/打包，但不碰安装目录、不关闭 Antigravity
 *   - 部署前等待 Antigravity 进程完全退出，文件占用时自动重试
 *
 * 用法：node localize.js <汉化包根目录> [--check] [--a11y]
 *   --check  只预检，不部署
 *   --out=<文件>  配合 --check，把打好的 app.asar 另存一份（用于沙盒测试）
 *   --a11y   额外保持 Chromium 无障碍树常驻（v2 默认开启；会增加 CPU/内存开销，仅外部 UI 自动化工具需要）
 * 退出码：0 成功；1 失败（安装目录保持原状）
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const asar = require("@electron/asar");

const PACK_VERSION = "v3";
const args = process.argv.slice(2);
const FLAGS = new Set(args.filter((a) => a.startsWith("--")));
const CHECK_ONLY = FLAGS.has("--check");
const KEEP_A11Y = FLAGS.has("--a11y");
const OUT_ASAR = ((args.find((a) => a.startsWith("--out=")) || "").slice(6)) || null;
const PKG_ROOT = path.resolve(String(args.find((a) => !a.startsWith("--")) || path.join(__dirname, "..")).replace(/[\\/"]+$/, ""));
const INSTALL_DIR = path.join(process.env.LOCALAPPDATA || "", "Programs", "antigravity");
const RES = path.join(INSTALL_DIR, "resources");
const APP_ASAR = path.join(RES, "app.asar");
const BAK_ASAR = path.join(RES, "app.asar.bak-zh");
const UNPACKED = path.join(RES, "app.asar.unpacked");
const EXE = path.join(INSTALL_DIR, "Antigravity.exe");
const UNPACK_DIR = "node_modules/chrome-devtools-mcp";
const SRC_DIST = path.join(PKG_ROOT, "app-src", "dist");
/** 需要复制进包的汉化模块 */
const PAYLOAD = ["i18n-zh.js", "i18n-zh-main.js"];

const report = { patched: 0, skipped: [], failed: [] };
function ok(msg) { console.log("  [OK] " + msg); }
function info(msg) { console.log("  " + msg); }
function warn(msg) { console.log("  [警告] " + msg); }
function die(msg) { console.error("  [失败] " + msg); process.exit(1); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function hasEntry(asarPath, suffix) {
    try {
        return asar.listPackage(asarPath, { isPack: false }).some((f) => f.replace(/\\/g, "/").endsWith(suffix));
    } catch (e) {
        return false;
    }
}

function appVersionOf(asarPath) {
    try {
        return JSON.parse(asar.extractFile(asarPath, "package.json").toString("utf8")).version || "?";
    } catch (e) {
        return "?";
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

function count(haystack, needle) {
    return haystack.split(needle).length - 1;
}

// ---------------------------------------------------------------------------
// 补丁表
// 每项：file 目标文件；label 说明；required 失败时是否中止；marker 已打过的标记；
//       variants [{ find, replace }]：按顺序尝试，第一个「恰好出现 1 次」的锚点生效
// ---------------------------------------------------------------------------
const HUB_INJECTION_V234 =
    "    // 汉化注入：Hub 页面每次 dom-ready 时执行中文词表替换脚本\n" +
    "    hubContents.on('dom-ready', () => {\n" +
    "        try {\n" +
    "            void hubContents.executeJavaScript(i18n_zh_1.RENDERER_SCRIPT).catch(() => { });\n" +
    "        }\n" +
    "        catch (e) { /* 汉化注入失败不影响主流程 */ }\n" +
    "    });\n" +
    "    // 语言服务偶发启动慢会导致加载失败黑屏：主框架加载失败时重新签发启动令牌并重试（连续最多 5 次）\n" +
    "    let agZhLoadRetry = 0;\n" +
    "    hubContents.on('did-finish-load', () => { agZhLoadRetry = 0; });\n" +
    "    hubContents.on('did-fail-load', (_event, errorCode, _errorDescription, _validatedURL, isMainFrame) => {\n" +
    "        if (!isMainFrame || errorCode === -3 /* ERR_ABORTED */ || agZhLoadRetry >= 5)\n" +
    "            return;\n" +
    "        agZhLoadRetry += 1;\n" +
    "        setTimeout(() => {\n" +
    "            if (win.isDestroyed?.() || hubContents.isDestroyed?.())\n" +
    "                return;\n" +
    "            void loadHubWindowUrl(win, resolveCurrentHubUrl(url), { skipBootstrapMint }).catch(() => { });\n" +
    "        }, 2000);\n" +
    "    });\n";

const LEGACY_INJECTION =
    "    // 汉化注入：每个窗口 dom-ready 时执行中文词表替换脚本\n" +
    "    win.webContents.on('dom-ready', () => {\n" +
    "        try {\n" +
    "            void win.webContents.executeJavaScript(i18n_zh_1.RENDERER_SCRIPT).catch(() => { });\n" +
    "        }\n" +
    "        catch (e) { /* 汉化注入失败不影响主流程 */ }\n" +
    "    });\n";

const PATCHES = [
    {
        file: "main.js", label: "主进程汉化挂钩（菜单/托盘/对话框/通知）", required: true, marker: 'require("./i18n-zh-main")',
        variants: [{ find: '"use strict";\n', replace: '"use strict";\nrequire("./i18n-zh-main").install();\n', first: true }],
    },
    {
        file: "utils.js", label: "引入渲染层词表模块", required: true, marker: 'require("./i18n-zh")',
        variants: [
            { find: 'const loadingOverlay_1 = require("./loadingOverlay");', replace: 'const loadingOverlay_1 = require("./loadingOverlay");\nconst i18n_zh_1 = require("./i18n-zh");' },
            { find: '"use strict";\n', replace: '"use strict";\nconst i18n_zh_1 = require("./i18n-zh");\n', first: true },
        ],
    },
    {
        file: "utils.js", label: "界面注入 + 加载失败重试", required: true, marker: "i18n_zh_1.RENDERER_SCRIPT",
        variants: [
            // 2.34.0+：窗口为 BaseWindow + hubWcv，页面由 loadHubWindowUrl 带一次性启动令牌加载
            { find: "    void loadHubWindowUrl(win, url, { skipBootstrapMint });", replace: HUB_INJECTION_V234 + "    void loadHubWindowUrl(win, url, { skipBootstrapMint });",
                requires: ["const hubContents = getHubWebContents(win);", "function resolveCurrentHubUrl(", "const skipBootstrapMint = "] },
            // 2.1x ~ 2.3x 早期
            { find: "    void win.loadURL(url);", replace: LEGACY_INJECTION + "    void win.loadURL(url);" },
            { find: "    hubWindows.add(win);", replace: LEGACY_INJECTION + "    hubWindows.add(win);" },
        ],
    },
    {
        file: "loadingOverlay.js", label: "启动加载页文案", required: false, marker: "正在加载 Antigravity",
        variants: [
            { find: '<div class="text">Loading Antigravity</div>', replace: '<div class="text">正在加载 Antigravity</div>' },
            { find: "  </svg>\n</body>", replace: '  </svg>\n  <div style="margin-top:16px;font-size:14px;opacity:0.6;">正在加载 Antigravity…</div>\n</body>' },
        ],
    },
    {
        file: "main.js", label: "无障碍树常驻（--a11y）", required: false, optIn: KEEP_A11Y, marker: "setAccessibilitySupportEnabled(true)",
        variants: [
            { find: "    main_1.default.initialize({", replace: "    electron_1.app.setAccessibilitySupportEnabled(true);\n    main_1.default.initialize({" },
            { find: "    main_1.default.initialize();", replace: "    electron_1.app.setAccessibilitySupportEnabled(true);\n    main_1.default.initialize();" },
        ],
    },
];

function applyPatchSpec(distDir, spec) {
    const target = path.join(distDir, spec.file);
    if (!fs.existsSync(target)) return { ok: false, why: "文件不存在" };
    let content = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n");
    if (content.includes(spec.marker)) return { ok: true, why: "已存在" };
    for (const v of spec.variants) {
        const n = count(content, v.find);
        if (n === 0 || (n > 1 && !v.first)) continue;
        if (v.requires && !v.requires.every((r) => content.includes(r))) continue;
        content = content.replace(v.find, () => v.replace);
        fs.writeFileSync(target, content, "utf8");
        return { ok: true, why: v === spec.variants[0] ? "" : "（备用锚点）" };
    }
    return { ok: false, why: "未找到可用锚点" };
}

/** 等待 Antigravity 进程全部退出 */
async function closeAntigravity() {
    const running = () => {
        try {
            return execFileSync("tasklist", ["/FI", "IMAGENAME eq Antigravity.exe", "/NH"], { encoding: "utf8" }).includes("Antigravity.exe");
        } catch (e) {
            return false;
        }
    };
    if (!running()) return;
    try { execFileSync("taskkill", ["/F", "/T", "/IM", "Antigravity.exe"], { stdio: "ignore" }); } catch (e) { /* 已退出 */ }
    for (let i = 0; i < 40 && running(); i++) await sleep(250);
    if (running()) die("Antigravity 未能退出，请手动关闭后重试");
    info("已关闭正在运行的 Antigravity");
    await sleep(500);
}

async function copyWithRetry(src, dst) {
    for (let i = 0; ; i++) {
        try {
            fs.copyFileSync(src, dst);
            return;
        } catch (e) {
            if (i >= 10 || !/EBUSY|EPERM|EACCES/.test(e.code || "")) throw e;
            await sleep(500);
        }
    }
}

async function main() {
    console.log("=== Antigravity 一键汉化 " + PACK_VERSION + (CHECK_ONLY ? "（预检模式，不部署）" : "") + " ===");

    // ---- 1. 环境与安装校验 ----
    console.log("[1/6] 校验环境");
    if (!fs.existsSync(EXE)) die("未找到 " + EXE + "，请确认 Antigravity 已安装");
    if (!fs.existsSync(APP_ASAR)) die("未找到 " + APP_ASAR);
    for (const f of PAYLOAD) {
        const p = path.join(SRC_DIST, f);
        if (!fs.existsSync(p)) die("未找到汉化模块 " + p);
        if (!syntaxCheck(p)) die(f + " 语法错误，请检查最近的修改");
    }
    ok("安装目录与汉化模块就绪");

    // ---- 2. fuse 完整性校验检测 ----
    console.log("[2/6] 检测 Electron fuse");
    const fuses = readFuses(EXE);
    if (fuses) {
        // FuseV1 顺序: 0 RunAsNode, 1 CookieEncryption, 2 NodeOptions, 3 NodeCliInspect,
        // 4 EnableEmbeddedAsarIntegrityValidation, 5 OnlyLoadAppFromAsar, ...
        const integrityEnabled = fuses[4] === 0x31;
        ok("fuse 共 " + fuses.length + " 个，asar 完整性校验 = " + (integrityEnabled ? "启用" : "关闭"));
        if (integrityEnabled) die("官方已启用 asar 完整性校验（EnableEmbeddedAsarIntegrityValidation），修改 app.asar 会导致无法启动。请联系维护者更新方案。");
    } else {
        warn("未能解析 fuse 线，跳过完整性校验检测");
    }

    // ---- 3. 选择源 asar 并维护官方备份 ----
    console.log("[3/6] 选择官方原版");
    let sourceAsar;
    if (hasEntry(APP_ASAR, "dist/i18n-zh.js")) {
        if (!fs.existsSync(BAK_ASAR) || hasEntry(BAK_ASAR, "dist/i18n-zh.js")) {
            die("当前 app.asar 已是汉化版，但缺少干净的官方备份 app.asar.bak-zh。请先重装/更新 Antigravity 恢复官方原版。");
        }
        sourceAsar = BAK_ASAR;
        ok("当前已汉化，以官方备份为源（官方版本 " + appVersionOf(BAK_ASAR) + "）");
    } else if (CHECK_ONLY) {
        sourceAsar = APP_ASAR;
        ok("当前为官方原版 " + appVersionOf(APP_ASAR) + "（预检模式不刷新备份）");
    } else {
        fs.copyFileSync(APP_ASAR, BAK_ASAR);
        sourceAsar = BAK_ASAR;
        ok("当前为官方原版 " + appVersionOf(APP_ASAR) + "，已刷新备份 app.asar.bak-zh");
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
        if (!fs.existsSync(path.join(distDir, "main.js"))) die("提取失败：dist/main.js 不存在");
        const mcpOk = fs.existsSync(path.join(workSrc, "node_modules", "chrome-devtools-mcp"));
        ok("源码提取完成" + (mcpOk ? "" : "（警告：chrome-devtools-mcp 缺失）"));

        // ---- 5. 打补丁 ----
        console.log("[5/6] 应用汉化补丁");
        for (const f of PAYLOAD) fs.copyFileSync(path.join(SRC_DIST, f), path.join(distDir, f));
        ok("汉化模块已复制：" + PAYLOAD.join(", "));
        for (const spec of PATCHES) {
            if (spec.optIn === false) continue;
            const r = applyPatchSpec(distDir, spec);
            const name = spec.file + "：" + spec.label;
            if (r.ok) {
                report.patched++;
                ok(name + (r.why ? " " + r.why : ""));
            } else if (spec.required) {
                report.failed.push(name);
                console.log("  [失败] " + name + " —— " + r.why);
            } else {
                report.skipped.push(name);
                warn(name + " —— " + r.why + "，该项保持英文");
            }
        }
        if (report.failed.length) {
            die("有 " + report.failed.length + " 个必需补丁失效（官方代码结构可能已变化），已中止，安装目录未改动。请把以上输出发给维护者。");
        }
        fs.writeFileSync(path.join(distDir, "i18n-zh-version.json"), JSON.stringify({
            pack: PACK_VERSION, app: appVersionOf(sourceAsar), builtAt: new Date().toISOString(),
        }, null, 2));
        const touched = [...new Set(PATCHES.map((p) => p.file).concat(PAYLOAD))];
        for (const f of touched) {
            if (!syntaxCheck(path.join(distDir, f))) die(f + " 语法校验失败，已中止（安装目录未改动）");
        }
        ok("语法校验通过（" + touched.join(", ") + "）");

        // ---- 6. 打包并部署 ----
        console.log("[6/6] 打包" + (CHECK_ONLY ? "（预检）" : "并部署"));
        await asar.createPackageWithOptions(workSrc, packedAsar, { unpackDir: UNPACK_DIR });
        if (!PAYLOAD.every((f) => hasEntry(packedAsar, "dist/" + f))) die("打包结果校验失败：包内缺少汉化模块");
        ok("打包完成（" + (fs.statSync(packedAsar).size / 1048576).toFixed(1) + " MB）");

        if (CHECK_ONLY) {
            if (OUT_ASAR) {
                fs.copyFileSync(packedAsar, OUT_ASAR);
                ok("预检产物已保存到 " + OUT_ASAR);
            }
            console.log("\n预检通过：补丁 " + report.patched + " 项成功" + (report.skipped.length ? "，" + report.skipped.length + " 项跳过" : "") + "。未改动安装目录。");
            return;
        }
        await closeAntigravity();
        await copyWithRetry(packedAsar, APP_ASAR);
        ok("app.asar 已部署");
        const packedUnpacked = packedAsar + ".unpacked";
        if (fs.existsSync(packedUnpacked)) {
            try {
                fs.cpSync(packedUnpacked, UNPACKED, { recursive: true, force: true });
                ok("app.asar.unpacked 已同步");
            } catch (e) {
                warn("app.asar.unpacked 同步失败（" + e.message + "），内容通常与原版一致，可忽略");
            }
        }
        console.log("\n全部完成：补丁 " + report.patched + " 项成功" + (report.skipped.length ? "，" + report.skipped.length + " 项跳过" : "") + "。");
    } finally {
        try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) { /* 清理失败无碍 */ }
    }
}

main().catch((e) => die(e.stack || String(e)));
