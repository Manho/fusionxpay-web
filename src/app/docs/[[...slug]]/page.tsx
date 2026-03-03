import { promises as fs } from "fs";
import path from "path";
import React, { isValidElement, type ReactNode } from "react";
import { highlightCode } from "@/lib/code-highlight";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Compass,
  FileText,
  Home,
  Sparkles,
} from "lucide-react";
import ThemeModeSwitcher from "@/components/theme/ThemeModeSwitcher";
import Architecture from "@/components/landing/Architecture";

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

interface LoadedDoc {
  content: string;
  relativePath: string;
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

interface NavSection {
  title: string;
  icon: string;
  items: NavItem[];
}

const DOCS_ROOT = path.join(process.cwd(), "docs");

const DOC_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    icon: "🧭",
    items: [
      {
        title: "Documentation Home",
        href: "/docs",
        description: "Entry point for all guides",
      },
    ],
  },
  {
    title: "User Guide",
    icon: "📘",
    items: [
      {
        title: "Overview",
        href: "/docs/user-guide",
        description: "Merchant and integration basics",
      },
      {
        title: "Quick Start",
        href: "/docs/user-guide/quick-start",
      },
      {
        title: "API Basics",
        href: "/docs/user-guide/api-basics",
      },
      {
        title: "Webhooks",
        href: "/docs/user-guide/webhooks",
      },
      {
        title: "FAQ",
        href: "/docs/user-guide/faq",
      },
    ],
  },
  {
    title: "Developer Docs",
    icon: "🔧",
    items: [
      { title: "Overview", href: "/docs/developer" },
      { title: "Project Overview", href: "/docs/developer/01-project-overview" },
      {
        title: "Architecture & Services",
        href: "/docs/developer/02-architecture-and-services",
      },
      { title: "API and Auth", href: "/docs/developer/03-api-and-auth" },
      {
        title: "Frontend Application",
        href: "/docs/developer/04-frontend-application",
      },
      {
        title: "Environment & Deployment",
        href: "/docs/developer/05-environment-and-deployment",
      },
      {
        title: "Operations & Observability",
        href: "/docs/developer/06-operations-observability",
      },
      { title: "Security Model", href: "/docs/developer/07-security-model" },
      { title: "Testing & CI", href: "/docs/developer/08-testing-and-ci" },
      { title: "Troubleshooting", href: "/docs/developer/09-troubleshooting" },
      {
        title: "Appendix: File Map",
        href: "/docs/developer/10-appendix-file-map",
      },
    ],
  },
];

const DOC_SEQUENCE = DOC_NAV_SECTIONS.flatMap((section) => section.items);

function formatLabel(value: string) {
  const trimmed = value.replace(/\.md$/i, "");
  if (trimmed.toLowerCase() === "readme") {
    return "Overview";
  }

  return trimmed
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=[\]{}|\\;:'",.<>/?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripMarkdownDecorators(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function getNodeText(node: ReactNode): string {
  if (node === null || node === undefined) {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return "";
}

function normalizeChecklistPrefix(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    return children.replace(/^\s*(✅|☑️|✔️)\s*/, "");
  }

  if (Array.isArray(children) && children.length > 0) {
    const [first, ...rest] = children;
    if (typeof first === "string") {
      return [first.replace(/^\s*(✅|☑️|✔️)\s*/, ""), ...rest];
    }
  }

  return children;
}

function extractTableOfContents(content: string): TocItem[] {
  const lines = content.split(/\r?\n/);
  const ids = new Map<string, number>();
  const toc: TocItem[] = [];

  lines.forEach((line, index) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) {
      return;
    }

    const level = match[1].length as 2 | 3;
    const text = stripMarkdownDecorators(match[2]);
    if (!text) {
      return;
    }

    const base = slugify(text) || `section-${index + 1}`;
    const count = (ids.get(base) ?? 0) + 1;
    ids.set(base, count);

    toc.push({
      id: count === 1 ? base : `${base}-${count}`,
      level,
      text,
    });
  });

  return toc;
}

function isUnsafeSlug(slug: string[]) {
  return slug.some((segment) => segment.includes("..") || segment.includes("\\"));
}

function canonicalPathFromSlug(slug: string[]) {
  if (slug.length === 0) {
    return "/docs";
  }

  const normalized = [...slug];
  const last = normalized[normalized.length - 1]?.toLowerCase();
  if (last === "readme" || last === "readme.md") {
    normalized.pop();
  }

  if (normalized.length === 0) {
    return "/docs";
  }

  return `/docs/${normalized.join("/")}`.replace(/\/+$/, "");
}

function isDocPathActive(currentPath: string, href: string) {
  if (href === "/docs") {
    return currentPath === "/docs";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function getDocFamilyLabel(currentPath: string) {
  if (currentPath.startsWith("/docs/user-guide")) {
    return "User Guide";
  }

  if (currentPath.startsWith("/docs/developer")) {
    return "Developer Docs";
  }

  return "Documentation";
}

function estimateReadingMinutes(content: string) {
  const words = content
    .replace(/[#>*`[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

function extractLeadParagraph(content: string) {
  const lines = content.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    const rawTrimmed = line.trim();
    if (rawTrimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const trimmed = stripMarkdownDecorators(rawTrimmed);
    if (!trimmed) {
      continue;
    }

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      /^\d+\.$/.test(trimmed)
    ) {
      continue;
    }

    return trimmed;
  }

  return "Technical docs for integration, operations, and development workflows.";
}

function resolveMarkdownHref(href: string, relativePath: string | null) {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    return href;
  }

  if (href.startsWith("/")) {
    return href;
  }

  const [pathWithQuery, hash = ""] = href.split("#");
  const [rawPath, query = ""] = pathWithQuery.split("?");

  const baseDir = relativePath ? path.posix.dirname(relativePath) : "";
  const joined = path.posix.normalize(path.posix.join(baseDir, rawPath));

  if (joined.startsWith("../") || joined === "..") {
    return href;
  }

  const normalized = joined
    .replace(/\.md$/i, "")
    .replace(/\/README$/i, "")
    .replace(/^\//, "");

  const docsPath = normalized ? `/docs/${normalized}` : "/docs";
  const withQuery = query ? `${docsPath}?${query}` : docsPath;
  return hash ? `${withQuery}#${hash}` : withQuery;
}

async function loadMarkdownDoc(slug: string[]): Promise<LoadedDoc | null> {
  if (isUnsafeSlug(slug)) {
    return null;
  }

  const joined = slug.join("/");
  const candidates =
    slug.length === 0
      ? ["README.md"]
      : joined.endsWith(".md")
        ? [joined]
        : [`${joined}.md`, `${joined}/README.md`];

  for (const candidate of candidates) {
    const normalized = path.posix.normalize(candidate);
    if (normalized.startsWith("../") || normalized === "..") {
      continue;
    }

    const absolutePath = path.join(DOCS_ROOT, normalized);
    if (!absolutePath.startsWith(DOCS_ROOT)) {
      continue;
    }

    try {
      const content = await fs.readFile(absolutePath, "utf-8");
      return {
        content,
        relativePath: normalized,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return null;
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = (resolvedParams.slug ?? []).map((segment) => decodeURIComponent(segment));

  const loadedDoc = await loadMarkdownDoc(slug);
  const content = loadedDoc?.content ?? "";
  const error = loadedDoc ? null : "Document not found";

  const canonicalPath = canonicalPathFromSlug(slug);
  const breadcrumbSlug =
    canonicalPath === "/docs"
      ? []
      : canonicalPath
        .replace(/^\/docs\//, "")
        .split("/")
        .filter(Boolean);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    ...breadcrumbSlug.map((part, index) => ({
      label: formatLabel(part),
      href: `/docs/${breadcrumbSlug.slice(0, index + 1).join("/")}`,
    })),
  ];

  const tocItems = content ? extractTableOfContents(content) : [];
  const readingMinutes = content ? estimateReadingMinutes(content) : 0;

  // Pre-highlight all code blocks in the markdown so the pre renderer can
  // inject Shiki HTML without needing an async component function.
  const codeHighlights = new Map<string, { html: string; lang: string }>();
  if (content) {
    const codeFenceRegex = /^```(\w+)?\s*[\r\n]([\s\S]*?)^```/gm;
    await Promise.all(
      [...content.matchAll(codeFenceRegex)].map(async ([, lang = "text", code]) => {
        const trimmed = code.trimEnd();
        if (!codeHighlights.has(trimmed)) {
          const html = await highlightCode(trimmed, lang);
          codeHighlights.set(trimmed, { html, lang: lang || "text" });
        }
      })
    );
  }

  const currentIndex = DOC_SEQUENCE.findIndex((item) => item.href === canonicalPath);
  const previousItem = currentIndex > 0 ? DOC_SEQUENCE[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < DOC_SEQUENCE.length - 1
      ? DOC_SEQUENCE[currentIndex + 1]
      : null;

  const headingQueues = new Map<string, string[]>();
  for (const toc of tocItems) {
    const key = `${toc.level}:${toc.text}`;
    headingQueues.set(key, [...(headingQueues.get(key) ?? []), toc.id]);
  }

  const resolveHeadingId = (level: 2 | 3, children: ReactNode) => {
    const text = stripMarkdownDecorators(getNodeText(children));
    const key = `${level}:${text}`;
    const queue = headingQueues.get(key);

    if (queue && queue.length > 0) {
      const [id, ...rest] = queue;
      headingQueues.set(key, rest);
      return id;
    }

    return slugify(text) || `section-${level}`;
  };

  const markdownComponents: Components = {
    h1({ children, ...props }) {
      return (
        <h1
          {...props}
          className="mb-8 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl"
        >
          {children}
        </h1>
      );
    },
    h2({ children, ...props }) {
      const id = resolveHeadingId(2, children);
      return (
        <h2
          {...props}
          id={id}
          className="group mt-16 border-t border-border/60 pt-8 text-3xl font-bold tracking-tight text-foreground"
        >
          <span className="border-l-4 border-[#2d1ef5] pl-4">{children}</span>
        </h2>
      );
    },
    h3({ children, ...props }) {
      const id = resolveHeadingId(3, children);
      return (
        <h3
          {...props}
          id={id}
          className="mt-10 text-2xl font-semibold tracking-tight text-foreground"
        >
          <span className="border-l-3 border-[#7b6fff]/60 pl-3">{children}</span>
        </h3>
      );
    },
    p({ children, ...props }) {
      return (
        <p {...props} className="my-5 text-[1.05rem] leading-[1.85] text-foreground/75 dark:text-muted-foreground">
          {children}
        </p>
      );
    },
    a({ href, children, ...props }) {
      const targetHref = href ? resolveMarkdownHref(href, loadedDoc?.relativePath ?? null) : href;
      const isExternal = targetHref ? /^https?:\/\//i.test(targetHref) : false;

      return (
        <a
          {...props}
          href={targetHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-[#2d1ef5] dark:text-[#8f86ff] underline decoration-[#2d1ef5]/30 dark:decoration-[#8f86ff]/40 underline-offset-4 transition-colors hover:text-[#4a3fff] dark:hover:text-[#c7c2ff]"
        >
          {children}
          {isExternal ? <span className="ml-1 inline-block text-xs">↗</span> : null}
        </a>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul {...props} className="my-5 list-none space-y-3 pl-0">
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      // Inject data-ordered into direct <li> children so they can suppress the bullet dot
      const orderedChildren = Array.isArray(children)
        ? children.map((child, i) =>
          isValidElement<React.HTMLAttributes<HTMLElement>>(child)
            ? React.cloneElement(child, { key: i, "data-ordered": "true" } as React.HTMLAttributes<HTMLElement>)
            : child
        )
        : children;
      return (
        <ol
          {...props}
          className="my-6 list-decimal space-y-3 pl-6 text-muted-foreground marker:font-semibold marker:text-foreground/75 dark:marker:text-muted-foreground"
        >
          {orderedChildren}
        </ol>
      );
    },
    li({ children, ...props }) {
      const normalizedChildren = normalizeChecklistPrefix(children);

      // Extract leading text to detect emoji or number prefix
      const textContent = String(
        Array.isArray(normalizedChildren)
          ? normalizedChildren.find((c) => typeof c === "string") ?? ""
          : typeof normalizedChildren === "string" ? normalizedChildren : ""
      ).trimStart();

      const startsWithEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(textContent);
      const startsWithNumber = /^\d+[\.\)]\s/.test(textContent);

      // Detect ordered list via data-ordered attribute injected by the ol renderer above
      const isOrdered = (props as Record<string, unknown>)["data-ordered"] === "true";
      const isTaskList = typeof props.className === "string" && props.className.includes("task-list-item");

      // Strip data-ordered before passing to DOM to avoid unknown attr warning
      const { "data-ordered": _dataOrdered, ...restProps } = props as Record<string, unknown> & { "data-ordered"?: string };

      if (startsWithEmoji || startsWithNumber || isOrdered || isTaskList) {
        return (
          <li {...restProps} className={`leading-7 text-foreground/75 dark:text-muted-foreground ${isTaskList ? 'list-none flex items-start gap-2.5 my-2 [&>input]:mt-[0.35rem] [&>input]:accent-[#2d1ef5]' : 'pl-1'}`}>
            {normalizedChildren}
          </li>
        );
      }

      return (
        <li {...restProps} className="leading-7 text-foreground/75 dark:text-muted-foreground">
          <span className="flex items-start gap-3">
            <span className="mt-2.5 inline-block h-2 w-2 flex-none rounded-full bg-foreground/60 dark:bg-muted-foreground" />
            <span className="min-w-0">{normalizedChildren}</span>
          </span>
        </li>
      );
    },
    blockquote({ children, ...props }) {
      return (
        <blockquote
          {...props}
          className="my-8 rounded-r-xl border-l-4 border-[#2d1ef5] bg-gradient-to-r from-[#2d1ef5]/10 to-transparent px-5 py-4 text-foreground/70 dark:text-muted-foreground shadow-sm"
        >
          {children}
        </blockquote>
      );
    },
    pre({ children }) {
      // Extract raw code text from the children to look up Shiki-highlighted HTML
      const child = Array.isArray(children) ? children[0] : children;
      let rawCode = "";
      let language = "text";

      if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
        rawCode = getNodeText(child.props.children).trimEnd();
        if (typeof child.props.className === "string") {
          const match = /language-([\w-]+)/.exec(child.props.className);
          if (match?.[1]) language = match[1];
        }
      }

      const highlight = codeHighlights.get(rawCode);
      const displayLang = highlight?.lang ?? language;

      if (displayLang === "architecture" || displayLang === "mermaid") {
        return (
          <div className="my-8 w-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background to-background/50">
            <Architecture variant="docs" />
          </div>
        );
      }

      return (
        <div className="my-6 overflow-hidden rounded-xl border border-border/60 shadow-xl">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5 bg-muted/50">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <div className="flex-1" />
            <span className="rounded-full border border-[#2d1ef5]/30 bg-[#2d1ef5]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#2d1ef5] dark:text-[#c7c2ff]">
              {displayLang}
            </span>
          </div>
          {highlight ? (
            <div
              className="overflow-x-auto text-[0.88rem] leading-7 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:px-4 [&_pre]:py-4"
              dangerouslySetInnerHTML={{ __html: highlight.html }}
            />
          ) : (
            <pre className="overflow-x-auto px-4 py-4 text-[0.88rem] leading-7 text-foreground [&_code]:bg-transparent [&_code]:p-0">
              {children}
            </pre>
          )}
        </div>
      );
    },
    code({ className, children, ...props }) {
      // Only style inline code (no className means not a fenced block)
      if (className) {
        return <code {...props} className={`${className} font-medium`}>{children}</code>;
      }
      return (
        <code
          {...props}
          className="rounded-md border border-[#2d1ef5]/30 bg-[#2d1ef5]/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#2d1ef5] dark:text-[#c7c2ff]"
        >
          {children}
        </code>
      );
    },
    table({ children, ...props }) {
      return (
        <div className="my-8 overflow-hidden rounded-2xl border border-border/60">
          <table {...props} className="w-full border-collapse text-left text-sm text-muted-foreground">
            {children}
          </table>
        </div>
      );
    },
    thead({ children, ...props }) {
      return (
        <thead {...props} className="bg-gradient-to-r from-[#2d1ef5]/8 to-[#7b6fff]/5 dark:bg-accent/45 text-sm uppercase tracking-wider text-foreground/60 dark:text-muted-foreground">
          {children}
        </thead>
      );
    },
    th({ children, ...props }) {
      return (
        <th {...props} className="border-b border-border/60 px-4 py-3.5 font-semibold">
          {children}
        </th>
      );
    },
    td({ children, ...props }) {
      return (
        <td {...props} className="border-b border-border/60 px-4 py-3 align-top leading-7 text-foreground/75 dark:text-muted-foreground">
          {children}
        </td>
      );
    },
    hr({ ...props }) {
      return <hr {...props} className="my-12 border-border/60" />;
    },
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-[#2d1ef5]/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[42%] h-[22rem] w-[22rem] rounded-full bg-[#7b6fff]/12 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2d1ef5] transition-all duration-300 group-hover:glow-blue">
              <span className="text-base font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              FusionX<span className="text-[var(--cream)]">Pay</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeModeSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pb-20 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <ChevronRight className="h-4 w-4" /> : null}
                <Link
                  href={crumb.href}
                  className={`transition-colors hover:text-foreground ${index === breadcrumbs.length - 1 ? "text-foreground" : ""
                    }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="xl:hidden mb-6 overflow-x-auto">
            <div className="flex min-w-max gap-2 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur-xl">
              <Link
                href="/docs/user-guide"
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isDocPathActive(canonicalPath, "/docs/user-guide") && !isDocPathActive(canonicalPath, "/docs/user-guide/quick-start")
                  ? "bg-[#2d1ef5]/20 text-[#2d1ef5] dark:text-foreground shadow-[0_2px_12px_rgba(45,30,245,0.25)] border border-[#2d1ef5]/30"
                  : "text-muted-foreground hover:bg-[#2d1ef5]/10 hover:text-[#2d1ef5] dark:hover:text-foreground hover:shadow-[0_4px_16px_rgba(45,30,245,0.2)] hover:-translate-y-0.5"
                  }`}
              >
                User Guide
              </Link>
              <Link
                href="/docs/developer"
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isDocPathActive(canonicalPath, "/docs/developer")
                  ? "bg-[#2d1ef5]/20 text-[#2d1ef5] dark:text-foreground shadow-[0_2px_12px_rgba(45,30,245,0.25)] border border-[#2d1ef5]/30"
                  : "text-muted-foreground hover:bg-[#2d1ef5]/10 hover:text-[#2d1ef5] dark:hover:text-foreground hover:shadow-[0_4px_16px_rgba(45,30,245,0.2)] hover:-translate-y-0.5"
                  }`}
              >
                Developer Docs
              </Link>
              <Link
                href="/docs/user-guide/quick-start"
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isDocPathActive(canonicalPath, "/docs/user-guide/quick-start")
                  ? "bg-[#2d1ef5]/20 text-[#2d1ef5] dark:text-foreground shadow-[0_2px_12px_rgba(45,30,245,0.25)] border border-[#2d1ef5]/30"
                  : "text-muted-foreground hover:bg-[#2d1ef5]/10 hover:text-[#2d1ef5] dark:hover:text-foreground hover:shadow-[0_4px_16px_rgba(45,30,245,0.2)] hover:-translate-y-0.5"
                  }`}
              >
                Quick Start
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_250px]">
            <aside className="hidden xl:block">
              <div className="sticky top-24 rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 to-card/60 dark:from-card/70 dark:to-card/70 p-5 backdrop-blur-xl shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-[#2d1ef5] dark:text-[#8f86ff]" />
                  Documentation
                </div>

                <div className="space-y-5">
                  {DOC_NAV_SECTIONS.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        <span className="mr-1">{section.icon}</span>
                        {section.title}
                      </div>
                      <nav className="space-y-1.5">
                        {section.items.map((item) => {
                          const active = isDocPathActive(canonicalPath, item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block rounded-xl border px-3 py-2.5 transition-all duration-200 ${active
                                ? "border-[#2d1ef5]/45 bg-[#2d1ef5]/15 text-[#2d1ef5] dark:text-foreground shadow-[0_2px_12px_rgba(45,30,245,0.15)] font-medium"
                                : "border-transparent text-muted-foreground hover:border-[#2d1ef5]/20 hover:bg-[#2d1ef5]/5 hover:text-foreground hover:shadow-[0_2px_10px_rgba(45,30,245,0.1)] hover:-translate-x-0.5"
                                }`}
                            >
                              <div className="text-sm font-medium">{item.title}</div>
                              {item.description ? (
                                <p className="mt-1 text-xs leading-5 text-muted-foreground/80">{item.description}</p>
                              ) : null}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="min-w-0">
              <section className="mb-6 rounded-2xl border border-border/60 bg-gradient-to-r from-[#2d1ef5]/5 via-card/70 to-[#7b6fff]/5 dark:from-card/70 dark:via-card/70 dark:to-card/70 px-5 py-3 sm:px-6 sm:py-4 backdrop-blur-xl shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-[#2d1ef5]/40 bg-[#2d1ef5]/20 px-3 py-1 text-xs font-medium text-[#2d1ef5] dark:text-[#c7c2ff]">
                    <Compass className="mr-1.5 h-3.5 w-3.5" />
                    {getDocFamilyLabel(canonicalPath)}
                  </span>
                  {!error ? (
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-[#7b6fff] dark:text-[#a5a0ff]" />
                      {readingMinutes} min read
                      <span className="text-border">·</span>
                      {tocItems.length} sections
                    </span>
                  ) : null}
                </div>
              </section>

              <article className="overflow-hidden rounded-3xl border border-[#2d1ef5]/15 dark:border-border/60 bg-card/90 dark:bg-card/70 p-6 shadow-[0_20px_60px_rgba(45,30,245,0.08),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_70px_rgba(5,8,18,0.5)] backdrop-blur-2xl sm:p-10 lg:p-12">
                {error ? (
                  <div className="py-20 text-center">
                    <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground/70" />
                    <h2 className="mb-2 text-3xl font-bold text-foreground">Document Not Found</h2>
                    <p className="mb-6 text-muted-foreground">{error}</p>
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#2d1ef5] px-6 py-3 text-white transition-colors hover:bg-[#4a3fff]"
                    >
                      <Home className="h-4 w-4" />
                      Back to Documentation
                    </Link>
                  </div>
                ) : (
                  <div className="prose max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-h1:mb-8 prose-h1:border-b prose-h1:border-border/60 prose-h1:pb-6 prose-h1:text-4xl sm:prose-h1:text-5xl prose-strong:text-foreground prose-img:rounded-2xl prose-img:border prose-img:border-border/60 prose-img:shadow-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </article>

              {!error && (previousItem || nextItem) ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {previousItem ? (
                    <Link
                      href={previousItem.href}
                      className="group rounded-2xl border border-border/60 bg-card/60 p-4 transition-all hover:border-[#2d1ef5]/40 hover:bg-[#2d1ef5]/10"
                    >
                      <span className="mb-2 inline-flex items-center text-xs uppercase tracking-wider text-muted-foreground/80">
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                        Previous
                      </span>
                      <p className="text-sm font-medium text-foreground">{previousItem.title}</p>
                    </Link>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  {nextItem ? (
                    <Link
                      href={nextItem.href}
                      className="group rounded-2xl border border-border/60 bg-card/60 p-4 text-right transition-all hover:border-[#2d1ef5]/40 hover:bg-[#2d1ef5]/10"
                    >
                      <span className="mb-2 inline-flex items-center text-xs uppercase tracking-wider text-muted-foreground/80">
                        Next
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm font-medium text-foreground">{nextItem.title}</p>
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </main>

            <aside className="hidden xl:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    On this page
                  </h3>
                  {tocItems.length > 0 ? (
                    <nav className="space-y-1">
                      {tocItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/60 hover:text-foreground ${item.level === 3 ? "pl-5 text-muted-foreground" : "text-muted-foreground"
                            }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  ) : (
                    <p className="text-sm text-muted-foreground/80">No section headings found for this page.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Reading Tips
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Use the left navigation for section jumps, and this panel for quick heading-level jumps.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
