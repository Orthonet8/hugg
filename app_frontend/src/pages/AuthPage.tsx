import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, UserPlus, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "../components/common/Button";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";
import { SignupFlow } from "../components/auth/SignupFlow";

const TRANSITION = { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] as const };
const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const BACKEND_BASE = API_BASE.replace(/\/+$/, "").replace(/\/api$/, "");

export const AuthPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Desktop: left hero panel ── */}
      <div className="auth-hero hidden lg:flex lg:w-[42%] flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-bold backdrop-blur-sm">ሀ</div>
          <span className="text-sm font-semibold opacity-90">HUGGB</span>
        </div>
        <div>
          <h1 className="app-heading text-4xl font-bold leading-tight mb-4">ሐረማያ ዩኒቨርሲቲ<br />ግቢ ጉባኤ</h1>
          <p className="text-white/70 text-base leading-relaxed mb-8">Haramaya University Gebi Gubae — connecting students in faith, service, and community.</p>
          <div className="flex flex-col gap-3">
            {["Community & Fellowship", "Spiritual Growth", "Service Opportunities"].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2026 HUGGB Management System</p>
      </div>

      {/* ── Form Panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile: crimson hero banner (matches Stitch design) */}
        <div className="auth-hero lg:hidden px-6 pt-10 pb-16 text-white text-center">
          <div className="mx-auto mb-3 h-16 w-16 rounded-[1.25rem] bg-[color:var(--accent)] flex items-center justify-center text-2xl font-bold text-[color:var(--on-accent)] shadow-lg">ሀ</div>
          <h1 className="app-heading text-xl font-bold">ሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ</h1>
          <p className="mt-1 text-sm text-white/70">Haramaya University Gebi Gubae</p>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-end px-5 py-3 lg:px-8 lg:py-5">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Form — overlaps hero on mobile (negative margin) */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-5 lg:px-12 -mt-10 lg:mt-0">
          <div className="w-full max-w-[420px] bg-[color:var(--surface)] rounded-3xl shadow-2xl p-7 lg:bg-transparent lg:shadow-none lg:rounded-none lg:p-0">
            <AnimatePresence mode="wait" initial={false}>
              {!showSignup ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={TRANSITION}
                >
                  <LoginForm
                    onLogin={() => navigate("/news")}
                    onForgotPassword={() => navigate("/set-password")}
                    onSwitchToSignup={() => setShowSignup(true)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={TRANSITION}
                >
                  <SignupFlow
                    onSignupComplete={() => navigate("/register/basic-info")}
                    onBackToLogin={() => setShowSignup(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-xs text-[color:var(--text-muted)]">
              {t("auth.termsAgree")}{" "}
              <button type="button" className="text-[color:var(--primary)] underline" onClick={() => alert("Terms — coming soon")}>
                {t("auth.termsOfService")}
              </button>{" "}
              {t("common.or")}{" "}
              <button type="button" className="text-[color:var(--primary)] underline" onClick={() => alert("Privacy — coming soon")}>
                {t("auth.privacyPolicy")}
              </button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Login Form ── */
function LoginForm({ onLogin, onForgotPassword, onSwitchToSignup }: {
  onLogin: () => void;
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(emailOrUsername, password);
      if (success) {
        const user = useAuthStore.getState().user;
        const needsRegistration = !user?.christianName || !user?.campus;
        if (needsRegistration) navigate("/register/basic-info");
        else onLogin();
      }
      else setError(t("auth.loginError"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="app-heading text-2xl font-bold text-[color:var(--text-primary)]">{t("auth.welcome")}</h2>
        <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">{t("auth.loginSubtitle")}</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <span className="mt-0.5 shrink-0">⚠</span> {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">{t("reg.emailOrUsername")}</label>
          <div className="auth-input-wrap">
            <Mail size={17} className="input-icon" />
            <input type="text" required placeholder="you@example.com or username"
              value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-[color:var(--text-secondary)]">{t("auth.password")}</label>
            <button type="button" onClick={onForgotPassword}
              className="text-xs font-medium text-[color:var(--primary)] hover:underline">
              {t("auth.forgotPassword")}
            </button>
          </div>
          <div className="auth-input-wrap">
            <Lock size={17} className="input-icon" />
            <input type={showPw ? "text" : "password"} required placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "2.75rem" }} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--primary)]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" variant="primary" size="lg" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>{t("auth.signIn")} <ArrowRight size={16} /></>}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
        <span className="h-px flex-1 bg-[color:var(--border)]" />
        <span>{t("common.or")}</span>
        <span className="h-px flex-1 bg-[color:var(--border)]" />
      </div>

      <button type="button"
        className="w-full rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] py-3 text-sm font-semibold text-[color:var(--text-primary)] hover:bg-[color:var(--soft-hover)] flex items-center justify-center gap-2.5 transition"
        onClick={() => { window.location.href = `${BACKEND_BASE}/auth/google/redirect`; }}>
        <GoogleIcon />
        {t("auth.continueWithGoogle")}
      </button>

      <button
        type="button"
        onClick={onSwitchToSignup}
        className="signup-entry-btn mt-3 w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div className="signup-entry-icon">
            <UserPlus size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[color:var(--primary)]">{t("auth.signUp")}</span>
              <span className="signup-entry-badge">
                <Sparkles size={12} />
                New member
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--text-muted)]">
              Create your account, then continue into the full church and campus profile setup.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.111C34.945 32.67 30.123 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.132-2.644-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.57 4.819C14.242 16.51 18.845 14 24 14c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 16.665 4 10.112 8.696 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.421 0 10.216-1.796 13.876-4.866l-6.43-5.328C29.99 34.91 27.201 36 24 36c-6.054 0-11.19-4.344-12.296-10.078l-6.44 4.96C8.193 39.61 15.625 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.111c-1.115 3.46-4.152 6-7.9 6-3.201 0-5.99-1.09-7.814-2.859l-6.432 5.326C15.95 38.728 19.819 40 24 40c9.389 0 17-7.611 17-17 0-1.34-.132-2.644-.389-3.917z" />
    </svg>
  );
}
