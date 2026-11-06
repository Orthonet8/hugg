import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { localeNames, type Locale } from "../../i18n/translations";

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-[0_8px_20px_rgba(57,0,7,0.12)] transition hover:bg-[color:var(--surface-soft)] active:scale-95"
        aria-label="Language"
      >
        <Globe size={18} />
      </button>

      {open && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-12 z-50 min-w-[180px] sm:min-w-[200px] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1.5 shadow-xl">
            {(["en", "am", "om"] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setLocale(lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-[color:var(--soft-hover)] ${
                  lang === locale
                    ? "bg-[color:var(--nav-active)] font-semibold text-[color:var(--primary)]"
                    : "text-[color:var(--text-primary)]"
                }`}
              >
                {lang === locale && <Check size={14} className="shrink-0" />}
                <span className={lang === locale ? "" : "pl-5"}>
                  {localeNames[lang]}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
