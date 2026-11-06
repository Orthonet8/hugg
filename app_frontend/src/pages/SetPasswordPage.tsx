import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useI18n } from "../i18n/I18nProvider";

export const SetPasswordPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";
  const [identifier, setIdentifier] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      if (!identifier.trim()) {
        setError("Enter the email address linked to your account.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email_or_username: identifier.trim() }),
        });
        const payload = await response.json() as { message?: string };
        if (!response.ok) throw new Error(payload.message ?? "Unable to send the reset link.");
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send the reset link.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, token, password, password_confirmation: confirmPassword }),
      });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? "This reset link is invalid or expired.");
      setSuccess(true);
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
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
                  {token ? t("passwordReset.redirecting") : "If the account exists, a reset link has been sent to your email."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
                  {token ? t("passwordReset.title") : t("auth.forgotPassword")}
                </h2>
                <p className="text-sm text-[color:var(--text-muted)]">
                  {token ? t("passwordReset.subtitle") : "Enter your account email and we will send a secure reset link."}
                </p>

                {error && (
                  <p className="app-alert-error rounded-lg px-3 py-2 text-sm">
                    {error}
                  </p>
                )}

                {!token && <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <input type="email" required placeholder="you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm" />
                  </div>
                </div>}

                {token && <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    {t("passwordReset.newPassword")}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <input type="password" required placeholder={t("passwordReset.enterNew")} value={password} onChange={(e) => setPassword(e.target.value)} className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm" />
                  </div>
                </div>}

                {token && <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
                    {t("passwordReset.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]" />
                    <input type="password" required placeholder={t("passwordReset.confirm")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm" />
                  </div>
                </div>}

                <Button type="submit" className="w-full" variant="primary" size="lg" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : token ? t("passwordReset.submit") : "Send reset link"}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
