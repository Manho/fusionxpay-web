"use client";

import { useEffect } from "react";
import { THEME_STORAGE_KEY, applyThemeMode, getStoredThemeMode } from "@/lib/theme";

export default function ThemeController() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const sync = () => {
      applyThemeMode(getStoredThemeMode());
    };

    sync();

    const handleSystemChange = () => {
      if (getStoredThemeMode() === "system") {
        sync();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        sync();
      }
    };

    media.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      media.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
