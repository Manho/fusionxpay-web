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
    // Common aliases
    if (l === "js") return "javascript";
    if (l === "ts") return "typescript";
    if (l === "sh" || l === "zsh" || l === "console") return "bash";
    if (l === "yml") return "yaml";
    if ((SUPPORTED_LANGS as readonly string[]).includes(l)) return l as SupportedLang;
    return "text";
}

/**
 * Highlight a code string with Shiki (github-dark theme).
 * Returns an HTML string ready for dangerouslySetInnerHTML.
 * The inline background-color on <pre> is stripped so the caller
 * can control the container background.
 */
export async function highlightCode(
    code: string,
    lang: string = "text"
): Promise<string> {
    const highlighter = await getHighlighter();
    const html = highlighter.codeToHtml(code, {
        lang: normalizeLang(lang),
        theme: "github-dark",
    });

    // Strip Shiki's inline background-color so our wrapper controls the bg
    return html.replace(/(<pre[^>]*?) style="[^"]*"/g, "$1");
}
