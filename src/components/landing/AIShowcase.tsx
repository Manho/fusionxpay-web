import { highlightCode } from "@/lib/code-highlight";
import AIShowcaseClient, { type AIShowcaseTab } from "./AIShowcaseClient";

const tabsData = [
  {
    id: "mcp",
    label: "MCP",
    lang: "json",
    code: `{
  "mcpServers": {
    "fusionxpay": {
      "command": "java",
      "args": ["-jar", "ai-mcp-server-1.0.0.jar"],
      "env": {
        "FUSIONX_GATEWAY_BASE_URL": "https://api.fusionx.fun",
        "FUSIONX_AUDIENCE": "ai-mcp",
        "FUSIONX_AUTH_MODE": "browser"
      }
    }
  }
}`,
  },
  {
    id: "cli",
    label: "CLI",
    lang: "custom-html",
    code: `<div class="flex gap-3"><span class="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">&gt;</span><span>fusionx auth login</span></div>
<div class="flex gap-3"><div class="h-2 w-2 shrink-0 rounded-full bg-black dark:bg-white mt-[6px]"></div><span class="flex-1 text-slate-700 dark:text-zinc-300">Browser approval required: fusionx.fun/ai/device</span></div>
<div class="ml-[20px] text-emerald-600 dark:text-emerald-400 font-medium">Status: APPROVED</div>

<div class="flex gap-3 mt-2"><span class="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">&gt;</span><span>fusionx payment search --size 2</span></div>
<div class="ml-[20px] text-slate-700 dark:text-zinc-300">- 87a46da7 | USD 19.25 | SUCCESS</div>
<div class="ml-[20px] text-slate-700 dark:text-zinc-300">- 1c4d55c2 | USD 18.75 | PROCESSING</div>

<div class="flex gap-3 mt-2"><span class="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">&gt;</span><span>fusionx payment refund 87a46da7</span></div>
<div class="ml-[20px] text-amber-600 dark:text-amber-400 font-semibold">Status: CONFIRMATION_REQUIRED</div>
<div class="ml-[20px] text-violet-600 dark:text-violet-400">Token: cfm_dc4</div>

<div class="flex gap-3 mt-2"><span class="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">&gt;</span><span>fusionx payment confirm cfm_dc4</span></div>
<div class="ml-[20px] text-emerald-600 dark:text-emerald-400 font-medium">Refund Status: SUCCESS</div>
<div class="ml-[20px] text-muted-foreground">ID: rf_9d12 | Amount: USD 19.25</div>`,
  },
  {
    id: "safety",
    label: "Safety",
    lang: "custom-html",
    code: `<div class="flex gap-3"><span class="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">&gt;</span><span>fusionx safety check</span></div>
<div class="flex gap-3"><div class="h-2 w-2 shrink-0 rounded-full bg-emerald-500 mt-[6px]"></div><span class="text-slate-800 dark:text-zinc-200">5-layer platform security diagnostics complete</span></div>

<div class="ml-[20px] mt-1.5 font-semibold text-slate-800 dark:text-zinc-200">✔ Browser Authorization</div>
<div class="ml-[40px] text-muted-foreground">Device code fallback ready</div>

<div class="ml-[20px] mt-1.5 font-semibold text-slate-800 dark:text-zinc-200">✔ Session &amp; Audience Tokens</div>
<div class="ml-[40px] text-muted-foreground">Strictly scoped short-lived access</div>

<div class="ml-[20px] mt-1.5 font-semibold text-slate-800 dark:text-zinc-200">✔ Input Safety Aspect</div>
<div class="ml-[40px] text-muted-foreground">Prompt-injection guards active</div>

<div class="ml-[20px] mt-1.5 font-semibold text-slate-800 dark:text-zinc-200">✔ Tool Audit Aspect</div>
<div class="ml-[40px] text-muted-foreground">Kafka ai-audit-log connected</div>

<div class="ml-[20px] mt-1.5 font-semibold text-slate-800 dark:text-zinc-200">✔ Output Safety Aspect &amp; Gateway</div>
<div class="ml-[40px] text-muted-foreground">PII redacted &amp; Human confirmation ENABLED</div>`,
  },
];

export default async function AIShowcase() {
  const tabs: AIShowcaseTab[] = await Promise.all(
    tabsData.map(async (tab) => ({
      ...tab,
      highlightedCode:
        tab.lang === "custom-html"
          ? "<div class=\"px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-1.5\">" + tab.code + "</div>"
          : await highlightCode(tab.code, tab.lang),
    }))
  );

  return <AIShowcaseClient tabs={tabs} />;
}
