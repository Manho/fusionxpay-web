export const THEME_STORAGE_KEY = "fusionxpay-theme-mode";
export const THEME_MODE_CHANGE_EVENT = "fusionxpay-theme-change";

export type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const DEFAULT_THEME_MODE: ThemeMode = "system";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_MODE;
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(saved) ? saved : DEFAULT_THEME_MODE;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return getSystemTheme();
  }

  return mode;
}

export function applyThemeMode(mode: ThemeMode): ResolvedTheme {
  if (typeof document === "undefined") {
    return mode === "system" ? "dark" : mode;
  }

  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.dataset.themeMode = mode;
  root.style.colorScheme = resolved;

  return resolved;
}

export function setThemeMode(mode: ThemeMode): ResolvedTheme {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    window.dispatchEvent(new Event(THEME_MODE_CHANGE_EVENT));
  }

  return applyThemeMode(mode);
}

export const THEME_OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];
