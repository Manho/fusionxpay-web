"use client";

import { useMemo, useState } from "react";

type DemoState =
  | "idle"
  | "searched"
  | "confirmation_required"
  | "confirmed"
  | "rejected_processing"
  | "not_found"
  | "invalid_input";

interface TerminalLine {
  tone: "user" | "agent" | "meta" | "tree" | "blank" | "muted" | "result" | "warn" | "token" | "ok";
  text: string;
  hint?: string;
  icon?: string;
}

const blankLine: TerminalLine = { tone: "blank", text: "" };
const SEARCH_TRANSACTION_ID = "87a46da7";
const PROCESSING_TRANSACTION_ID = "1c4d55c2";
const CONFIRM_TOKEN = "cfm_dc400d03";

const searchedLines: TerminalLine[] = [
  { tone: "user", text: "check recent payments" },
  { tone: "agent", text: "I'll search recent merchant payments first." },
  blankLine,
  { tone: "meta", text: "1 tool call finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "└─", text: "fusionx payment search --page 0 --size 20" },
  { tone: "tree", icon: "   └─", text: "Done" },
  blankLine,
  { tone: "muted", text: "Latest merchant payments" },
  { tone: "result", text: "- 87a46da7 | order 41205537 | USD 19.25 | SUCCESS" },
  { tone: "result", text: "- 1c4d55c2 | order ca14e290 | USD 18.75 | PROCESSING" },
];

const confirmationLines: TerminalLine[] = [
  { tone: "user", text: "refund 87a46da7" },
  { tone: "agent", text: "I'll prepare the refund and wait for explicit confirmation." },
  blankLine,
  { tone: "meta", text: "1 tool call finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "└─", text: "fusionx payment refund --transaction-id 87a46da7" },
  { tone: "tree", icon: "   └─", text: "Done" },
  blankLine,
  { tone: "warn", text: "Status: CONFIRMATION_REQUIRED" },
  { tone: "token", text: `Token: ${CONFIRM_TOKEN}` },
  { tone: "agent", text: "Human confirmation required before any refund is executed." },
  { tone: "agent", text: "Reply \"confirm\" to continue." },
];

const confirmedLines: TerminalLine[] = [
  { tone: "user", text: "confirm" },
  blankLine,
  { tone: "meta", text: "1 tool call finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "└─", text: `fusionx payment confirm --token ${CONFIRM_TOKEN}` },
  { tone: "tree", icon: "   └─", text: "Done" },
  blankLine,
  { tone: "ok", text: "Status: CONFIRMED" },
  { tone: "ok", text: "Refund Status: SUCCESS" },
  { tone: "muted", text: "Refund ID: rf_9d12 | Amount: USD 19.25" },
  { tone: "agent", text: "Refund completed and recorded in the audit trail." },
];

const processingRejectedLines: TerminalLine[] = [
  { tone: "user", text: "refund 1c4d55c2" },
  blankLine,
  { tone: "meta", text: "1 tool call finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "└─", text: "fusionx payment refund --transaction-id 1c4d55c2" },
  { tone: "tree", icon: "   └─", text: "Done" },
  blankLine,
  { tone: "warn", text: "Status: REJECTED" },
  { tone: "muted", text: "Reason: Transaction is still PROCESSING" },
  { tone: "agent", text: `Try: refund ${SEARCH_TRANSACTION_ID}` },
];

const notFoundLines = (input: string): TerminalLine[] => [
  { tone: "user", text: input },
  blankLine,
  { tone: "warn", text: "Error: Payment transaction not found" },
  { tone: "agent", text: `Use a transaction id like ${SEARCH_TRANSACTION_ID}.` },
];

function invalidLines(expected: DemoState): TerminalLine[] {
  const suggestion = expected === "searched" || expected === "rejected_processing" || expected === "not_found"
    ? `Try: refund ${SEARCH_TRANSACTION_ID}`
    : expected === "confirmation_required"
      ? "Try: confirm"
      : "Try: check recent payments";

  return [
    { tone: "agent", text: "I can help with a small demo flow here." },
    { tone: "agent", text: suggestion },
  ];
}

function normalizeInput(value: string) {
  return value
    .toLowerCase()
    .replace(/[`"'.,!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWord(word: string) {
  if (word.startsWith("chec")) return "check";
  if (word.startsWith("paymen")) return "payment";
  if (word === "payments") return "payment";
  if (word === "latest") return "recent";
  if (word === "show" || word === "list") return "check";
  return word;
}

function fuzzyWords(input: string) {
  return normalizeInput(input).split(" ").filter(Boolean).map(normalizeWord);
}

function extractRefundId(input: string) {
  const match = normalizeInput(input).match(/\brefund\b(?:\s+(?:payment|tx|transaction))?\s+([a-z0-9]+)/);
  return match?.[1] ?? null;
}

function matchesSearchIntent(input: string) {
  const words = fuzzyWords(input);
  const hasAction = words.includes("check") || words.includes("search");
  const hasRecent = words.includes("recent");
  const hasPayment = words.includes("payment");
  return hasAction && hasPayment && (hasRecent || words.length <= 3);
}

function matchesConfirmIntent(input: string) {
  const words = fuzzyWords(input);
  return words.includes("confirm") || normalizeInput(input).startsWith(`fusionx payment confirm --token ${CONFIRM_TOKEN}`);
}

function replayLines(state: Exclude<DemoState, "invalid_input">): TerminalLine[] {
  if (state === "idle") {
    return [
      { tone: "agent", text: "Try a payment query or refund command." },
      { tone: "agent", text: 'Examples: "check recent payments", "refund 87a46da7", "confirm"' },
    ];
  }
  if (state === "searched") {
    return searchedLines;
  }
  if (state === "confirmation_required") {
    return [...searchedLines, blankLine, ...confirmationLines];
  }
  if (state === "rejected_processing") {
    return [...searchedLines, blankLine, ...processingRejectedLines];
  }
  if (state === "not_found") {
    return [...searchedLines, blankLine, ...notFoundLines(notFoundInputSeed)];
  }
  return [...searchedLines, blankLine, ...confirmationLines, blankLine, ...confirmedLines];
}

const notFoundInputSeed = "refund unknown";

export default function HeroTerminalDemo({ isLoaded }: { isLoaded: boolean }) {
  const [state, setState] = useState<DemoState>("idle");
  const [lastStableState, setLastStableState] = useState<Exclude<DemoState, "invalid_input">>("idle");
  const [command, setCommand] = useState("");
  const [notFoundInput, setNotFoundInput] = useState(notFoundInputSeed);
  const [hasInteracted, setHasInteracted] = useState(false);

  const placeholder = useMemo(() => {
    const stable = state === "invalid_input" ? lastStableState : state;
    if (stable === "searched" || stable === "rejected_processing" || stable === "not_found") {
      return `Try: refund ${SEARCH_TRANSACTION_ID}`;
    }
    if (stable === "confirmation_required") {
      return "Try: confirm";
    }
    if (stable === "confirmed") {
      return "Try: replay";
    }
    return 'Try: "check recent payments"';
  }, [state, lastStableState]);

  const lines = useMemo<TerminalLine[]>(() => {
    if (state === "idle") {
      return hasInteracted
        ? replayLines("idle")
        : [...searchedLines, blankLine, ...confirmationLines, blankLine, ...confirmedLines];
    }
    if (state === "searched") {
      return searchedLines;
    }
    if (state === "confirmation_required") {
      return [...searchedLines, blankLine, ...confirmationLines];
    }
    if (state === "confirmed") {
      return [...searchedLines, blankLine, ...confirmationLines, blankLine, ...confirmedLines];
    }
    if (state === "rejected_processing") {
      return [...searchedLines, blankLine, ...processingRejectedLines];
    }
    if (state === "not_found") {
      return [...searchedLines, blankLine, ...notFoundLines(notFoundInput)];
    }
    return [...replayLines(lastStableState), blankLine, ...invalidLines(lastStableState)];
  }, [state, lastStableState, notFoundInput, hasInteracted]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const rawInput = command.trim();
    const normalized = normalizeInput(rawInput);
    const current = state === "invalid_input" ? lastStableState : state;

    if (!normalized) {
      return;
    }

    if (normalized === "replay" || normalized === "reset") {
      setState("idle");
      setLastStableState("idle");
      setNotFoundInput(notFoundInputSeed);
      setHasInteracted(false);
      setCommand("");
      return;
    }

    if ((current === "idle" || current === "searched" || current === "rejected_processing" || current === "not_found") && matchesSearchIntent(normalized)) {
      setState("searched");
      setLastStableState("searched");
      setCommand("");
      return;
    }

    const refundId = extractRefundId(normalized);
    if (refundId) {
      if (refundId.startsWith(SEARCH_TRANSACTION_ID)) {
        setState("confirmation_required");
        setLastStableState("confirmation_required");
      } else if (refundId.startsWith(PROCESSING_TRANSACTION_ID)) {
        setState("rejected_processing");
        setLastStableState("rejected_processing");
      } else {
        setState("not_found");
        setLastStableState("not_found");
        setNotFoundInput(rawInput);
      }
      setCommand("");
      return;
    }

    if (matchesConfirmIntent(normalized)) {
      if (current === "confirmation_required" || current === "confirmed") {
        setState("confirmed");
        setLastStableState("confirmed");
      } else {
        setState("invalid_input");
      }
      setCommand("");
      return;
    }

    setState("invalid_input");
    setCommand("");
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0f0f11] border border-border/50 dark:border-white/10">
      <div className="px-4 py-3 border-b border-border/50 dark:border-white/5 flex items-center bg-muted/30 dark:bg-[#18181b]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center mr-12">
          <span className="text-[12px] font-medium text-muted-foreground font-mono tracking-wide">
            claude — zsh
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12px] leading-[1.6] sm:leading-[1.65] text-left">
        {lines.map((line, index) => (
          <div
            key={`${line.tone}-${index}-${line.text}`}
            className={`${line.tone === "user" ? "text-slate-800 dark:text-zinc-100 flex items-start gap-3" :
              line.tone === "agent" ? "text-slate-700 dark:text-zinc-300 flex items-start gap-3" :
              line.tone === "meta" ? "flex items-start gap-3" :
              line.tone === "ok" ? "text-emerald-600 dark:text-emerald-400 font-medium ml-[20px]" :
              line.tone === "warn" ? "text-amber-600 dark:text-amber-400 font-semibold ml-[20px]" :
              line.tone === "token" ? "text-violet-600 dark:text-violet-400 ml-[20px]" :
              line.tone === "tree" ? "" :
              line.tone === "blank" ? "h-2" :
              line.tone === "result" ? "text-slate-700 dark:text-zinc-300 ml-[20px]" :
              "text-muted-foreground ml-[20px]"
              } ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: "700ms",
              transitionDelay: `${500 + index * 60}ms`,
            }}
          >
            {line.tone === "meta" ? (
              <>
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 mt-[6px]" />
                <div className="flex-1">
                  <span className="text-slate-800 dark:text-zinc-200">{line.text}</span>
                  {line.hint ? <span className="text-slate-400 dark:text-slate-500 ml-2">{line.hint}</span> : null}
                </div>
              </>
            ) : line.tone === "tree" ? (
              <div className="flex items-start">
                <span className="text-slate-400 dark:text-slate-500 whitespace-pre shrink-0 ml-[0.5px]">{line.icon} </span>
                <span className={`${line.text === "Done" ? "text-slate-500 dark:text-slate-500" : "text-[#2563eb] dark:text-blue-400"} break-words`}>{line.text}</span>
              </div>
            ) : line.tone === "user" ? (
              <>
                <span className="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">{">"}</span>
                <span className="whitespace-pre-wrap">{line.text}</span>
              </>
            ) : line.tone === "agent" ? (
              <>
                <div className="h-2 w-2 shrink-0 rounded-full bg-black dark:bg-white mt-[6px]" />
                <span className="whitespace-pre-wrap flex-1">{line.text}</span>
              </>
            ) : (
              <span className={`whitespace-pre-wrap inline-block w-full ${line.tone === "muted" ? "text-muted-foreground ml-[20px]" : line.tone === "blank" ? "" : line.tone === "result" ? "" : "ml-[20px]"}`}>
                {line.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border/50 dark:border-white/5 px-4 py-3 bg-background/80 dark:bg-[#111215]">
        <div className="flex items-center gap-3">
          <span className="text-[#2563eb] dark:text-blue-400 font-mono text-sm">{">"}</span>
          <input
            value={command}
            onChange={(event) => {
              if (!hasInteracted && event.target.value.trim().length > 0) {
                setHasInteracted(true);
              }
              setCommand(event.target.value);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setLastStableState("idle");
              setNotFoundInput(notFoundInputSeed);
              setHasInteracted(false);
              setCommand("");
            }}
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Replay
          </button>
        </div>
      </form>
    </div>
  );
}
