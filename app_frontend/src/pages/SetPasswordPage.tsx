import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useI18n } from "../i18n/I18nProvider";

export const SetPasswordPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSuccess(true);

    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--text-muted)] transition hover:text-[color:var(--primary)]"
        >
          <ArrowLeft size={16} />
          {t("common.back")}
        </button>

        <Card className="overflow-hidden border-0 p-0 shadow-2xl">
          <div className="p-6">
            {success ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
                  {t("passwordReset.success")}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                  {t("passwordReset.redirecting")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
                  {t("passwordReset.title")}
                </h2>
                <p className="text-sm text-[color:var(--text-muted)]">
                  {t("passwordReset.subtitle")}
                </p>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    {t("passwordReset.newPassword")}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <input type="password" required placeholder={t("passwordReset.enterNew")} value={password} onChange={(e) => setPassword(e.target.value)} className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    {t("passwordReset.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <input type="password" required placeholder={t("passwordReset.confirm")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm" />
                  </div>
                </div>

                <Button type="submit" className="w-full" variant="primary" size="lg" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : t("passwordReset.submit")}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
