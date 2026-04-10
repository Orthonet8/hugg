import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeMode } from "./theme-state";

const THEME_STORAGE_KEY = "church-student-pwa-theme";

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);

    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;

    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        mode === "dark" ? "#140d0f" : "#5f0113",
      );
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((current) => (current === "light" ? "dark" : "light")),
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
