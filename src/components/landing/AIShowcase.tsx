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
}

// 🔐 First launch naturally triggers a secure browser approval flow
// 💻 Device code fallback ensures readiness for headless environments
// 🚫 No sensitive merchant password is ever stored in the MCP runtime`,
  },
  {
    id: "cli",
    label: "CLI",
    lang: "bash",
    code: `$ fusionx auth login
Opening your browser to approve this CLI session...
Verification URL: https://fusionx.fun/ai/device
User code: A1B2C3D4

Approved. Session token stored.
Audience: ai-cli

$ fusionx payment search --page 0 --size 20
Payments: 2 total (page 0/0)
- 87a46da7 | order 41205537 | USD 19.25 | SUCCESS
- 1c4d55c2 | order ca14e290 | USD 18.75 | PROCESSING

$ fusionx payment refund --transaction-id 87a46da7
Status: CONFIRMATION_REQUIRED
Token: cfm_dc400d03

$ fusionx payment confirm --token cfm_dc400d03
Status: CONFIRMED
Refund Status: SUCCESS
Refund ID: rf_9d12 | Amount: USD 19.25`,
  },
  {
    id: "safety",
    label: "Safety",
    lang: "text",
    code: `1. Browser Authorization
   - First-party approval page
   - Device code fallback
   - No password stored in CLI/MCP

2. Audience-Scoped Session Tokens
   - ai-cli / ai-mcp
   - Short-lived access token
   - Refresh + revoke support

3. InputSafetyAspect
   - Regex prompt-injection detection
   - Max input length guard
   - Suspicious character ratio check

4. ToolAuditAspect
   - Correlation ID per tool call
   - Merchant-scoped action summary
   - Kafka publish -> ai-audit-log

5. OutputSafetyAspect + Gateway Isolation
   - PII and secret redaction
   - JWT -> X-Merchant-Id
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
