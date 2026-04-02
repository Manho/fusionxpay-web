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
        "FUSIONX_EMAIL": "merchant@example.com",
        "FUSIONX_PASSWORD": "••••••••",
        "FUSIONX_GATEWAY_BASE_URL": "https://api.fusionx.fun"
      }
    }
  }
}`,
  },
  {
    id: "cli",
    label: "CLI",
    lang: "bash",
    code: `$ fusionx auth login --email merchant@example.com --password merchant123
Logged in as merchant@example.com
Merchant ID: 171
Merchant Name: Demo Merchant

$ fusionx payment search --status SUCCESS
Showing 2 payment(s)
- 65bc54e3-11f3-42c2-960d-e0c9c3b3a5fa | USD 19.25 | PROCESSING
- 87a46da7-6c42-4018-a846-24728ae67b14 | USD 19.25 | PROCESSING

$ fusionx payment refund --transaction-id 65bc54e3-11f3-42c2-960d-e0c9c3b3a5fa --amount 5.00
Status: CONFIRMATION_REQUIRED
Operation: REFUND_PAYMENT
Token: 59e6c5bc-5aaf-4b07-a605-af7dfa4e9961

$ fusionx payment confirm --token 59e6c5bc-5aaf-4b07-a605-af7dfa4e9961
Refund Status: FAILED
Error: Transaction is not in a refundable state`,
  },
  {
    id: "safety",
    label: "Safety",
    lang: "text",
    code: `1. InputSafetyAspect
   - Regex prompt-injection detection
   - Max input length guard
   - Suspicious character ratio check

2. ToolAuditAspect
   - Correlation ID per tool call
   - Merchant-scoped action summary
   - Kafka publish -> ai-audit-log

3. OutputSafetyAspect
   - PII and secret redaction
   - Safe response shaping

4. Gateway Isolation
   - JWT -> X-Merchant-Id
   - Downstream merchant filtering
   - Human confirmation for writes`,
  },
];

export default async function AIShowcase() {
  const tabs: AIShowcaseTab[] = await Promise.all(
    tabsData.map(async (tab) => ({
      ...tab,
      highlightedCode: await highlightCode(tab.code, tab.lang),
    }))
  );

  return <AIShowcaseClient tabs={tabs} />;
}
