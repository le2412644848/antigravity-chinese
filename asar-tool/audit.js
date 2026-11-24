#!/usr/bin/env node
"use strict";
/**
 * 词表覆盖率审计：从 Antigravity 网页前端包中提取界面文案候选，统计哪些还没有中文
 *
 * 用法：node audit.js [main.js 路径 | http://127.0.0.1:端口]
 *   不带参数时自动寻找正在运行的 language_server 端口并下载 /main.js（需先启动 Antigravity）
 * 输出：控制台汇总 + asar-tool/_audit-untranslated.txt（按出现次数排序的未翻译清单）
 */
const fs = require("fs");
const path = require("path");
const http = require("http");
const { execFileSync } = require("child_process");

const OUT_FILE = path.join(__dirname, "_audit-untranslated.txt");

function get(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, { timeout: 60000 }, (res) => {
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
        });
        req.on("error", reject);
        req.on("timeout", () => req.destroy(new Error("timeout")));
    });
}

/** 找到正在运行的 language_server 的 HTTP 端口（返回网页首页且含 __APP_CONFIG__ 的那个） */
async function discoverBase() {
    const tl = execFileSync("tasklist", ["/FO", "CSV", "/NH"], { encoding: "utf8" });
    const pids = new Set(tl.split(/\r?\n/).filter((l) => /^"language_server/i.test(l)).map((l) => l.split('","')[1]));
    if (!pids.size) throw new Error("没有找到正在运行的 language_server，请先启动 Antigravity，或直接传入 main.js 路径");
    const ns = execFileSync("netstat", ["-ano", "-p", "TCP"], { encoding: "utf8" });
    const ports = ns.split(/\r?\n/).map((l) => l.trim().split(/\s+/))
        .filter((f) => f.length >= 5 && f[3] === "LISTENING" && pids.has(f[4]) && f[1].startsWith("127.0.0.1:"))
        .map((f) => f[1].split(":")[1]);
    for (const p of ports) {
        try {
            const r = await get("http://127.0.0.1:" + p + "/");
            if (r.status === 200 && r.body.includes("__APP_CONFIG__")) return "http://127.0.0.1:" + p;
        } catch (e) { /* 试下一个 */ }
    }
    throw new Error("找不到前端页面端口（候选：" + ports.join(", ") + "）");
}

async function loadBundle(arg) {
    if (arg && !/^https?:/.test(arg)) return { src: fs.readFileSync(arg, "utf8"), from: arg };
    const base = arg ? arg.replace(/\/+$/, "") : await discoverBase();
    const home = await get(base + "/");
    const ver = (home.body.match(/"appVersion":"([^"]+)"/) || [])[1] || "?";
    const r = await get(base + "/main.js");
    if (r.status !== 200) throw new Error("下载 /main.js 失败：HTTP " + r.status);
    return { src: r.body, from: base + "/main.js", version: ver };
}

const STR = '"((?:[^"\\\\\\n]|\\\\.)*)"';
const UI_KEYS = "title|label|description|placeholder|tooltip|tooltipContent|subtitle|heading|header|message|text|buttonText|buttonLabel|confirmText|confirmLabel|cancelText|cancelLabel|actionLabel|emptyText|emptyMessage|emptyState|helperText|helpText|hint|caption|errorMessage|successMessage|ariaLabel|\"aria-label\"|\"aria-description\"|\"data-tooltip-content\"|children";
const PATTERNS = [
    // JSX 子节点：createElement(tag, props, "文本") / 相邻子节点
    new RegExp("(?:null|\\}|\\))\\s*,\\s*" + STR, "g"),
    // 界面属性：title:"..."、"aria-label":"..."
    new RegExp("(?:[,{(]\\s*)(?:" + UI_KEYS + ")\\s*:\\s*" + STR, "g"),
    // toast / 通知
    new RegExp("\\.(?:success|error|warning|info|loading|message)\\(\\s*" + STR, "g"),
];

/** 日志、断言、抛错等非界面上下文 */
const NON_UI_CONTEXT = /(console|logger|log|Log|debug|warn)\.(?:error|warn|info|log|debug|message|success|warning|loading)\(\s*$|[!=]==?\s*null\s*,\s*$|(?:invariant|assert|Error|throw\s+new\s+\w+)\([^()]{0,30}$/;

function decode(raw) {
    try {
        return JSON.parse('"' + raw + '"');
    } catch (e) {
        return raw;
    }
}

function looksLikeUi(s) {
    const t = s.trim();
    if (t.length < 2 || t.length > 400) return false;
    if (!/[A-Za-z]{2}/.test(t)) return false;
    if (/[\u4e00-\u9fff]/.test(t)) return false;
    if (/^(https?:|data:|file:|mailto:|\/|\.\/|#|@|--|\$\{)/.test(t)) return false;
    if (/[{}<>`\\]|=>|&&|\|\||\(\)|%s/.test(t)) return false;
    if (/^\[[^\]]+\]/.test(t) || /^\$[a-z]/.test(t)) return false; // 日志标签 [Foo] / Lexical 内部断言
    if (/^-?\d+(\.\d+)?(px|em|rem|%|ms|s)?$/.test(t)) return false;
    // className / 选择器 / 标识符 / 常量
    if (!/\s/.test(t)) {
        if (/^[a-z]/.test(t) && !/^[a-z]+$/.test(t)) return false; // camelCase / kebab / snake
        if (/^[a-z]+$/.test(t)) return false; // 全小写单词多为内部键
        if (/^[A-Z0-9_]+$/.test(t) && t.length > 3) return false; // SCREAMING_CASE
        if (/[_:./\[\]=]/.test(t)) return false;
    } else {
        const toks = t.split(/\s+/);
        if (toks.every((x) => /^[!a-z0-9:\[\]\-\/_.%&>()#=@,*~+]+$/.test(x)) && toks.some((x) => /[-:\[\]\/]/.test(x))) return false; // tailwind
        if (/^[a-z]/.test(t) && !/[.?!]$/.test(t) && toks.length > 1 && toks.every((x) => /^[a-z0-9-]+$/.test(x)) && t.length < 25) {
            // 全小写短语（如 "just now"）保留，但过滤明显的 CSS 值
            if (/^(solid|dashed|auto|none|inherit|normal|bold|flex|block|inline|absolute|relative|center)\b/.test(t)) return false;
        }
    }
    return true;
}

/**
 * 模板字符串句式（如 `${d}/${f} steps`）：从每个 ${ 向两侧找反引号边界（整文件正则会被嵌套模板带偏），
 * 变量替换为 \u0001，返回 [{ stat, at }]
 */
function extractTemplates(src) {
    const out = [], seen = new Set();
    function at(i) {
        let a = i;
        while (a > 0 && i - a < 300) {
            a--;
            if (src[a] === "`") break;
            if (src[a] === "}") return null;
        }
        if (src[a] !== "`" || seen.has(a)) return null;
        seen.add(a);
        let b = a + 1, stat = "", cur = "";
        while (b < src.length && b - a < 600) {
            const c = src[b];
            if (c === "\\") { cur += src.substr(b, 2); b += 2; continue; }
            if (c === "`") return { stat: stat + decode(cur), at: a };
            if (c === "$" && src[b + 1] === "{") {
                let d = 1, k = b + 2;
                for (; k < src.length && d > 0; k++) {
                    if (src[k] === "{") d++;
                    else if (src[k] === "}") d--;
                    else if (src[k] === "`") return null;
                }
                stat += decode(cur) + "\u0001";
                cur = "";
                b = k;
                continue;
            }
            cur += c;
            b++;
        }
        return null;
    }
    for (let i = src.indexOf("${"); i >= 0; i = src.indexOf("${", i + 1)) {
        const t = at(i);
        if (!t) continue;
        const s = t.stat.trim(), words = s.replace(/\u0001/g, "").trim();
        if (!/[A-Za-z]{3,}/.test(s) || !/\s/.test(words) || /[\u4e00-\u9fff]/.test(s)) continue;
        // CSS 类名 / 样式值 / 代码片段 / 内部协议文本
        if (/[<>{}=;_]|https?:|^[\/.#@-]|[a-z][A-Z]|\\n|--|\.(js|ts|json|png|css)\b/.test(s)) continue;
        if (/\b(px|rem|var|translate|rgba?|hsla?|calc|ms|repeat|minmax|gradient|color-mix|srgb|ease-out|cubic-bezier)\b|\b(flex|gap|rounded|text-|bg-|border|shrink|duration|w-|h-|p[xy]?-|m[xy]?-|items-|justify-|transition|font-|select-none|cursor|opacity|absolute|relative|hover:|tabular)/.test(s)) continue;
        if (NON_UI_CONTEXT.test(src.slice(Math.max(0, t.at - 60), t.at)) || /(?:throw\s*(?:new \w+\()?|Error\()\s*$/.test(src.slice(Math.max(0, t.at - 30), t.at))) continue;
        out.push({ stat: s, at: t.at });
    }
    return out;
}

function loadRendererApi() {
    const { RENDERER_SCRIPT } = require(path.join(__dirname, "..", "app-src", "dist", "i18n-zh.js"));
    let api;
    global.window = { __agZhTestHook: (x) => { api = x; } };
    (0, eval)(RENDERER_SCRIPT);
    delete global.window;
    return api;
}

async function main() {
    const { src, from, version } = await loadBundle(process.argv[2]);
    console.log("前端包：" + from + "（" + (src.length / 1048576).toFixed(1) + " MB" + (version ? "，版本 " + version : "") + "）");
    const counts = new Map();
    for (const re of PATTERNS) {
        let m;
        while ((m = re.exec(src))) {
            const s = decode(m[1]).trim();
            const quote = m.index + m[0].length - m[1].length - 2;
            const before = src.slice(Math.max(0, quote - 60), quote);
            if (NON_UI_CONTEXT.test(before)) continue;
            // 内置的 ELK 图布局库（Mermaid 依赖）以 GWT 构建器链注册选项说明：(new dc,X),"key"),"名称"),"说明")
            if (/\(new [A-Za-z$_]{1,3},[A-Za-z0-9$_]{1,5}\),"[^"]*"\)/.test(src.slice(Math.max(0, quote - 700), quote))) continue;
            if (looksLikeUi(s)) counts.set(s, (counts.get(s) || 0) + 1);
        }
    }
    const R = loadRendererApi();
    const missing = [];
    let hit = 0;
    for (const [s, n] of counts) {
        const v = R.translateText(s);
        if (v !== null && /[\u4e00-\u9fff]/.test(v)) hit++;
        else if (Object.prototype.hasOwnProperty.call(R.MAP, s)) hit++; // 有意保留原文的品牌词
        else missing.push([s, n]);
    }
    missing.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    fs.writeFileSync(OUT_FILE, missing.map(([s, n]) => n + "\t" + JSON.stringify(s)).join("\n") + "\n", "utf8");
    const total = counts.size;
    console.log("界面文案候选 " + total + " 条，已覆盖 " + hit + " 条（" + (total ? (hit * 100 / total).toFixed(1) : "0") + "%），未覆盖 " + missing.length + " 条");
    // 模板句式：变量用样例值 3 代入后看能否翻译
    const tpl = new Map();
    for (const { stat } of extractTemplates(src)) {
        if (tpl.has(stat)) continue;
        const v = R.translateText(stat.replace(/\u0001/g, "3"));
        tpl.set(stat, v !== null && /[\u4e00-\u9fff]/.test(v));
    }
    const tplMissing = [...tpl].filter(([, ok]) => !ok).map(([s]) => s);
    fs.appendFileSync(OUT_FILE, "\n# 模板句式（\\u0001 = 运行时变量；含较多内部报错文案，仅供参考）\n" + tplMissing.map((s) => JSON.stringify(s)).join("\n") + "\n", "utf8");
    console.log("模板句式候选 " + tpl.size + " 条，已覆盖 " + (tpl.size - tplMissing.length) + " 条，未覆盖 " + tplMissing.length + " 条");
    console.log("未覆盖清单：" + OUT_FILE);
    console.log("（候选由启发式规则提取，含少量内部字符串/品牌名，覆盖率仅供参考）");
}

main().catch((e) => {
    console.error("[失败] " + (e.message || e));
    process.exit(1);
});
