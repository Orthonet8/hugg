import { motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { localeNames, type Locale } from "../i18n/translations";

const languageDetails: Record<Locale, { greeting: string; sub: string }> = {
  en: {
    greeting: "Welcome",
    sub: "Choose your preferred language",
  },
  am: {
    greeting: "እንኳን ደህና መጡ",
    sub: "የሚመቹትን ቋንቋ ይምረጡ",
  },
  om: {
    greeting: "Nagaan Dhuftan",
    sub: "Afaan filattan filadhaa",
  },
};

export const LanguagePickerPage = () => {
  const { locale, setLocale, markLanguageSelected } = useI18n();
  const navigate = useNavigate();

  const handleSelect = (lang: Locale) => {
    setLocale(lang);
    markLanguageSelected();
    navigate("/login", { replace: true });
  };

  const greeting = languageDetails[locale].greeting;
  const sub = languageDetails[locale].sub;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="app-gradient mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg">
            <Globe size={36} className="text-[color:var(--on-primary)]" />
          </div>
          <h1 className="app-heading text-3xl font-bold text-[color:var(--text-primary)]">
            {greeting}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {sub}
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-3">
          {(["en", "am", "om"] as Locale[]).map((lang, i) => (
            <motion.button
              key={lang}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              onClick={() => handleSelect(lang)}
              className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                lang === locale
                  ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-lg shadow-[color:color-mix(in_srgb,var(--primary)_25%,transparent)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:border-[color:var(--primary)] hover:bg-[color:var(--soft-hover)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{localeNames[lang]}</p>
                  <p
                    className={`mt-0.5 text-sm ${
                      lang === locale
                        ? "text-[color:color-mix(in_srgb,var(--on-primary)_80%,transparent)]"
                        : "text-[color:var(--text-muted)]"
                    }`}
                  >
                    {languageDetails[lang].greeting}
                  </p>
                </div>
                {lang === locale && <Check size={20} className="shrink-0" />}
              </div>
            </motion.button>
          ))}
        </div>

        <p className="mt-8 text-xs text-[color:var(--text-muted)]">
          You can change this anytime from your profile settings.
        </p>
      </div>
    </div>
  );
};
