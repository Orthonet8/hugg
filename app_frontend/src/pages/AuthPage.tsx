import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../context/useAuthStore";

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-6 text-center">
          <div className="app-gradient mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg">
            <span className="text-2xl font-bold text-[color:var(--on-primary)]">
              ሀ
            </span>
          </div>
          <h1 className="app-heading text-2xl font-bold text-[color:var(--text-primary)]">
            ሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ
          </h1>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Haramaya University Gebi Gubae
          </p>
        </div>

        <Card className="overflow-hidden border-0 p-0 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex border-b border-[color:var(--border)]">
            <button
              type="button"
              onClick={() => setMode("login")}
              data-active={mode === "login"}
              className="flex-1 py-4 text-sm font-semibold transition data-[active=true]:border-b-2 data-[active=true]:border-[color:var(--primary)] data-[active=true]:text-[color:var(--primary)] text-[color:var(--text-muted)]"
            >
              ይግቡ
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              data-active={mode === "signup"}
              className="flex-1 py-4 text-sm font-semibold transition data-[active=true]:border-b-2 data-[active=true]:border-[color:var(--primary)] data-[active=true]:text-[color:var(--primary)] text-[color:var(--text-muted)]"
            >
              ይመዝገቡ
            </button>
          </div>

          {/* Forms */}
          <div className="relative p-6">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm
                    onLogin={() => navigate("/news")}
                    onForgotPassword={() => navigate("/set-password")}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignupQuickForm
                    onSignupComplete={() => navigate("/register/basic-info")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-[color:var(--text-muted)]">
          By continuing, you agree to our{" "}
          <button
            type="button"
            className="text-[color:var(--primary)] underline hover:text-[color:var(--primary-hover)]"
            onClick={() => alert("Terms of Service — coming soon")}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-[color:var(--primary)] underline hover:text-[color:var(--primary-hover)]"
            onClick={() => alert("Privacy Policy — coming soon")}
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Login Form                                                        */
/* ------------------------------------------------------------------ */

function LoginForm({ onLogin, onForgotPassword }: { onLogin: () => void; onForgotPassword: () => void }) {
  const login = useAuthStore((s) => s.login);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(emailOrMobile, password);
      if (success) {
        onLogin();
      } else {
        setError("ስህተት ነው። እባክዎ ኢሜይል/ስልክ እና የይለፍ ቃል ያረጋግጡ።");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
        እንኳን ደህና መጡ
      </h2>
      <p className="text-sm text-[color:var(--text-muted)]">
        መለያዎን በመጠቀም ይግቡ።
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          ኢሜይል ወይም ስልክ
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="text"
            required
            placeholder="example@gmail.com"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          የይለፍ ቃል
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => onForgotPassword()}
          className="text-sm font-medium text-[color:var(--primary)] hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full" variant="primary" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            ይግቡ <ArrowRight size={16} />
          </>
        )}
      </Button>

      <div className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
        <span className="h-px flex-1 bg-[color:var(--border)]" />
        <span>or</span>
        <span className="h-px flex-1 bg-[color:var(--border)]" />
      </div>

      <button
        type="button"
        className="w-full rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--soft-hover)] flex items-center justify-center gap-2"
        onClick={() => alert("Google Login — coming soon")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.111C34.945 32.67 30.123 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.132-2.644-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.57 4.819C14.242 16.51 18.845 14 24 14c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 16.665 4 10.112 8.696 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.421 0 10.216-1.796 13.876-4.866l-6.43-5.328C29.99 34.91 27.201 36 24 36c-6.054 0-11.19-4.344-12.296-10.078l-6.44 4.96C8.193 39.61 15.625 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.111c-1.115 3.46-4.152 6-7.9 6-3.201 0-5.99-1.09-7.814-2.859l-6.432 5.326C15.95 38.728 19.819 40 24 40c9.389 0 17-7.611 17-17 0-1.34-.132-2.644-.389-3.917z"
          />
        </svg>
        Google በመጠቀም ቀጥል
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Signup Form (2-4 credential fields)                         */
/* ------------------------------------------------------------------ */

function SignupQuickForm({ onSignupComplete }: { onSignupComplete: () => void }) {
  const signup = useAuthStore((s) => s.signup);
  const [fullName, setFullName] = useState("");
  const [christianName, setChristianName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const success = await signup({
        fullName,
        christianName,
        email,
        mobile,
        password,
      });
      if (success) {
        onSignupComplete();
      } else {
        setError("This email or phone number is already registered.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
        አዲስ መለያ ይፍጠሩ
      </h2>
      <p className="text-sm text-[color:var(--text-muted)]">
        መረጃዎን ያስገቡ ከዚያ የምዝገባ ቅጹን ይሙሉ።
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          ሙሉ ስም <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          የክርስትና ስም
        </label>
        <div className="relative">
          <User
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Christian name (optional)"
            value={christianName}
            onChange={(e) => setChristianName(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          ኢሜይል <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="email"
            required
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          ስልክ ቁጥር
        </label>
        <div className="relative">
          <Phone
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="tel"
            placeholder="+251912345678"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          የይለፍ ቃል <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[color:var(--text-secondary)]">
          የይለፍ ቃል ያረጋግጡ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[color:var(--text-muted)]"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="app-input w-full rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" variant="primary" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            ቀጥል <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
