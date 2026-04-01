import { createHighlighter, type Highlighter } from "shiki";

// Languages to preload
const SUPPORTED_LANGS = [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "bash",
    "shell",
    "json",
    "yaml",
    "sql",
    "java",
    "python",
    "go",
    "rust",
    "html",
    "css",
    "http",
    "text",
] as const;

type SupportedLang = (typeof SUPPORTED_LANGS)[number];

// Singleton highlighter promise — initialized once per server process
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ["github-dark"],
            langs: [...SUPPORTED_LANGS],
        });
    }
    return highlighterPromise;
}

function normalizeLang(lang: string): SupportedLang {
    const l = lang.toLowerCase().trim();
    if (l === "js") return "javascript";
    if (l === "ts") return "typescript";
    if (l === "sh" || l === "zsh" || l === "console") return "bash";
    if (l === "yml") return "yaml";
    if ((SUPPORTED_LANGS as readonly string[]).includes(l)) return l as SupportedLang;
    return "text";
}

/**
 * Highlight a code string with Shiki using a forced dark theme (github-dark).
 * This ensures consistent high-contrast terminal presentation across light/dark modes.
 */
export async function highlightCode(
    code: string,
    lang: string = "text"
): Promise<string> {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, {
        lang: normalizeLang(lang),
        theme: "github-dark",
    });
}
