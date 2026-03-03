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
            themes: ["github-light", "github-dark"],
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
 * Highlight a code string with Shiki using dual themes (github-light + github-dark).
 *
 * defaultColor: 'light' → Shiki writes github-light colors directly as inline style="color: #xxx"
 * on every token span, so light mode always renders correctly without extra CSS.
 * It also emits --shiki-dark CSS variables on each span.
 *
 * Our globals.css then overrides `.dark .shiki span { color: var(--shiki-dark) !important }` to
 * switch to the dark palette when the .dark class is present.
 */
export async function highlightCode(
    code: string,
    lang: string = "text"
): Promise<string> {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, {
        lang: normalizeLang(lang),
        themes: {
            light: "github-light",
            dark: "github-dark",
        },
        defaultColor: "light", // Light colors as default inline style; dark via CSS vars
    });
}
