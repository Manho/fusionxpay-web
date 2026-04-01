import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
}

export function TerminalWindow({
  title = "Terminal",
  children,
  className,
  contentClassName,
  delay = 0,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-border/40 shadow-2xl bg-[#0d1117]", // github-dark background
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20 bg-[#161b22]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 text-center pr-10">
          <span className="text-[10px] uppercase tracking-widest font-medium text-slate-400">
            {title}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "text-xs sm:text-sm overflow-x-auto text-slate-300 [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-4",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
