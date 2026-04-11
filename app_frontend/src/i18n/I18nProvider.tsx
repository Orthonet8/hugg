import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

const STORAGE_KEY = "hugg-locale";

const getInitialLocale = (): Locale => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "am" || saved === "om") return saved;
  return "en";
};

const hasLocaleBeenSet = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  languageSelected: boolean;
  markLanguageSelected: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [languageSelected, setLanguageSelected] = useState(hasLocaleBeenSet);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = (locale: Locale) => setLocaleState(locale);
  const markLanguageSelected = () => setLanguageSelected(true);

  const t = useMemo(() => {
    const dict = translations[locale] as Record<string, string>;
    return (key: string): string => dict[key] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, languageSelected, markLanguageSelected }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
