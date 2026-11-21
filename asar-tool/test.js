#!/usr/bin/env node
"use strict";
/**
 * 汉化词表离线回归测试（不需要启动 Antigravity）
 * 用法：node test.js
 * 退出码：0 全部通过；1 有失败
 */
const path = require("path");
const DIST = path.join(__dirname, "..", "app-src", "dist");

function loadRenderer() {
    delete require.cache[require.resolve(path.join(DIST, "i18n-zh.js"))];
    const { RENDERER_SCRIPT } = require(path.join(DIST, "i18n-zh.js"));
    let api;
    global.window = { __agZhTestHook: (x) => { api = x; } };
    // eslint-disable-next-line no-eval
    (0, eval)(RENDERER_SCRIPT);
    delete global.window;
    return api;
}

const R = loadRenderer();
const M = require(path.join(DIST, "i18n-zh-main.js"));

// [输入, 期望输出]；期望为 null 表示应保持原样
const RENDERER_CASES = [
    ["New Conversation", "新建对话"],
    ["  Settings  ", "  设置  "],
    ["Good response", "回答不错"],
    ["5 minutes ago", "5 分钟前"],
    ["just now", "刚刚"],
    ["3:00 PM", "下午 3:00"],
    ["Show 3 more", "再显示 3 项"],
    ["Welcome back, Alice. Where should we pick up?", "欢迎回来，Alice。我们从哪里继续？"],
    ["Copied path to clipboard", "已复制 path 到剪贴板"],
    ["Resets in 2h 30m", "将在 2 小时 30 分钟后重置"],
    ["Price is $1 today", null],
    ["Some random user sentence that is not UI", null],
    // 2.34.0：插入值原样保留（命令/搜索词不被时间量词美化）
    ["Thought for 12s", "思考了 12 秒"],
    ["Ran command: `rm 5 files, now`", "运行了命令：`rm 5 files, now`"],
    ['Searched for "3 days ago"', "搜索了“3 days ago”"],
    // 插入值为界面名词时按词表翻译
    ["Back to Settings", "返回 设置"],
    // 插入值含 $ 时不被当成替换模式
    ["Copied $& to clipboard", "已复制 $& 到剪贴板"],
    ["Proceed with implementation plan and 2 comments", "按实施计划继续（附 2 条评论）"],
    // 对话步骤行：前缀动词、逗号拼接的步骤组摘要、退出码；模型写的说明在普通模式下原样保留
    ["Ran", "运行了"],
    ["Analyzed", "分析了"],
    ["Explored files, ran commands", "探索了文件，运行了命令"],
    ["Ran commands, edited files", "运行了命令，编辑了文件"],
    ["Exited with code 1", "已退出，退出码 1"],
    ["Running check AGENT_WEB_TOKEN on vps-syd", "正在运行：check AGENT_WEB_TOKEN on vps-syd"],
    ["Explored files, some user text", null],
];

// 双语对照：是否值得机器翻译
const WORTH_CASES = [
    ["search UI text for 门禁", true],
    ["I need to locate the ⟦0⟧ component first.", true],
    ["这一段已经是中文了，不需要翻译。", false],
    ["⟦0⟧ ⟦1⟧", false],
    ["OK", false],
];

const MAIN_CASES = [
    ["Cancel", false, "取消"],
    ["2 agents running", true, "2 个智能体正在运行"],
    ["Open Antigravity", true, "打开 Antigravity"],
    ["Open Antigravity", false, "Open Antigravity"],
    ["Are you sure you want to quit?", false, "确定要退出吗？"],
    ["Error code: E1\nLogs: C:/x.log", false, "错误代码：E1\n日志：C:/x.log"],
    ["Toggle Developer Tools", true, "切换开发者工具"],
    ["The WSL distro \"Ubuntu\" is no longer installed.", false, "WSL 发行版“Ubuntu”已不再安装。"],
    ["Allow devbox to use your microphone?", false, "允许 devbox 使用你的麦克风吗？"],
];

let fail = 0;
function check(name, got, want) {
    if (got !== want) {
        fail++;
        console.log("  [FAIL] " + name + "\n         期望: " + JSON.stringify(want) + "\n         实际: " + JSON.stringify(got));
    }
}

for (const [input, want] of RENDERER_CASES) {
    check("渲染层 " + JSON.stringify(input), R.translateText(input), want);
}
for (const [input, want] of WORTH_CASES) {
    check("双语过滤 " + JSON.stringify(input), R.mtWorth(input), want);
}
// 双语：标识符保护（占位符后的文本）
const MASK_CASES = [
    ["run test.js and localize.js --check", true, "run ⟦0⟧ and ⟦1⟧ ⟦2⟧"],
    ["inspect commit 0153e3b stats", true, "inspect commit ⟦0⟧ stats"],
    ["locate local antigravity-chinese repo", true, "locate local ⟦0⟧ repo"],
    ["The well-known issue is that useAuth is stale.", false, "The well-known issue is that ⟦0⟧ is stale."],
    ["run npm test -- --watch on src/lib/auth.ts.", false, "run npm test ⟦0⟧ ⟦1⟧ on ⟦2⟧."],
    ["check AGENT_WEB_TOKEN 门禁", true, "check ⟦0⟧ 门禁"],
];
for (const [input, label, want] of MASK_CASES) {
    let n = 0;
    check("标识符保护 " + JSON.stringify(input), R.mtMask(input, label, () => n++), want);
}
// 关闭双语时，步骤行说明不走机器翻译（只翻分隔符后的已知片段）
check("步骤行（双语关闭）", R.mtLabel("find Login and Lock UI components · Exited with code 1"), "find Login and Lock UI components · 已退出，退出码 1");
check("主进程设置读取（非 Electron 环境返回空对象）", JSON.stringify(M.readSettings()), "{}");
for (const [input, menu, want] of MAIN_CASES) {
    check("主进程 " + JSON.stringify(input), M.translate(input, menu), want);
}

// 词表自检：空译文（译文与原文相同的品牌名词条是有意保留，用于阻止其被模糊规则误翻）
for (const [k, v] of Object.entries(R.MAP)) {
    if (typeof v !== "string" || !v.trim()) check("词条译文为空 " + JSON.stringify(k), v, "(非空)");
}

const total = RENDERER_CASES.length + MAIN_CASES.length + WORTH_CASES.length + MASK_CASES.length + 2;
console.log("词表：MAP " + Object.keys(R.MAP).length + " 条，DYNAMIC " + R.DYNAMIC_MAP.length + "，REGEX " + R.REGEX_MAP.length + "，PREFIX " + R.PREFIX_MAP.length);
console.log(fail ? "回归测试：" + fail + " 项失败" : "回归测试：" + total + " 项全部通过，词表自检通过");
process.exit(fail ? 1 : 0);
