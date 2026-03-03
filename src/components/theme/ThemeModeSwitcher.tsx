"use client";

import { useEffect, useMemo, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  THEME_MODE_CHANGE_EVENT,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  ThemeMode,
  getStoredThemeMode,
  setThemeMode,
} from "@/lib/theme";

const themeIconMap = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

interface ThemeModeSwitcherProps {
  className?: string;
}

const subscribeToThemeMode = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => { };
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_STORAGE_KEY) {
      onStoreChange();
    }
  };

  media.addEventListener("change", onStoreChange);
  window.addEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);

  return () => {
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
};

export default function ThemeModeSwitcher({ className }: ThemeModeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydration-safe mount pattern
    setMounted(true);
    setMode(getStoredThemeMode());

    return subscribeToThemeMode(() => {
      setMode(getStoredThemeMode());
    });
  }, []);

  const safeMode = mounted ? mode : "system";
  const Icon = useMemo(() => themeIconMap[safeMode], [safeMode]);

  const handleThemeChange = (value: string) => {
    if (value !== "light" && value !== "dark" && value !== "system") {
      return;
    }

    setThemeMode(value as ThemeMode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-9 w-9 border-border/70 bg-card/70 text-foreground hover:bg-accent/60",
            className
          )}
          aria-label="Switch theme mode"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={mode} onValueChange={handleThemeChange}>
          {THEME_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
