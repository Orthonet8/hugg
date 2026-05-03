import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../common/Button";
import { useAuthStore } from "../../context/useAuthStore";
import { useI18n } from "../../i18n/I18nProvider";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const buildApiUrl = (path: string): string => {
  const base = API_BASE.replace(/\/+$/, "");

  if (base.endsWith("/api") && path.startsWith("/api/")) {
    return `${base}${path.slice(4)}`;
  }

  return `${base}${path}`;
};
const TRANSITION = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const };
type SignupStep = "credentials" | "personal" | "confirmation";
const STEPS: SignupStep[] = ["credentials", "personal", "confirmation"];
const STEP_LABELS = ["Account", "Name", "Confirm"];

interface SignupFormData { emailOrUsername: string; password: string; fullName: string; }

export const SignupFlow = ({ onSignupComplete, onBackToLogin }: {
  onSignupComplete: () => void;
  onBackToLogin: () => void;
}) => {
  const [step, setStep] = useState<SignupStep>("credentials");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [form, setForm] = useState<SignupFormData>({ emailOrUsername: "", password: "", fullName: "" });
  const [error, setError] = useState("");

  const goToStep = (target: SignupStep) => {
    setDirection(STEPS.indexOf(target) > STEPS.indexOf(step) ? "forward" : "backward");
    setError("");
    setStep(target);
  };

  const currentIdx = STEPS.indexOf(step);

  return (
    <div className="signup-flow-shell">
      <div className="mb-6">
        <button type="button" onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--text-muted)] hover:text-[color:var(--primary)] transition mb-5">
          <ArrowLeft size={15} /> Back to login
        </button>
        <div className="signup-flow-hero">
          <div className="signup-flow-hero-badge">
            <Sparkles size={14} />
            Guided onboarding
          </div>
          <h2 className="app-heading text-2xl font-bold text-[color:var(--text-primary)]">Create your member account</h2>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-muted)]">
            Start with your sign-in details, then we will take you through the full campus and church profile setup.
          </p>
          <div className="signup-flow-promise">
            <ShieldCheck size={16} />
            <span>Use your email here if you want to continue with Google later.</span>
          </div>
        </div>
      </div>

      <div className="signup-step-rail mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`step-pill ${i < currentIdx ? "done" : i === currentIdx ? "active" : "pending"}`}>
                {i < currentIdx ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${i === currentIdx ? "text-[color:var(--primary)]" : "text-[color:var(--text-muted)]"}`}>
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`signup-step-line ${i < currentIdx ? "is-done" : ""}`} />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[340px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction === "forward" ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "forward" ? -40 : 40, opacity: 0 }}
            transition={TRANSITION}
            className="signup-step-panel"
          >
            {step === "credentials" && <StepCredentials form={form} setForm={setForm} onNext={() => goToStep("personal")} error={error} setError={setError} />}
            {step === "personal" && <StepPersonal form={form} setForm={setForm} onNext={() => goToStep("confirmation")} onBack={() => goToStep("credentials")} error={error} setError={setError} />}
            {step === "confirmation" && <StepConfirmation form={form} onConfirm={onSignupComplete} onBack={() => goToStep("personal")} error={error} setError={setError} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Step 1: Credentials ── */
function StepCredentials({ form, setForm, onNext, error, setError }: {
  form: SignupFormData; setForm: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void; error: string; setError: (e: string) => void;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const val = form.emailOrUsername.trim();
    if (val.length < 3) { setStatus("idle"); return; }
    let cancelled = false;
    setStatus("checking");
    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(`${buildApiUrl("/api/auth/check-identifier")}?email_or_username=${encodeURIComponent(val)}`, { headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" } });
        if (!res.ok) { if (!cancelled) setStatus("idle"); return; }
        const data = await res.json() as { exists?: boolean };
        if (!cancelled) setStatus(data.exists ? "taken" : "available");
      } catch { if (!cancelled) setStatus("idle"); }
    }, 450);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [form.emailOrUsername]);

  const handleNext = () => {
    setError("");
    if (!form.emailOrUsername.trim()) { setError("Email or username is required"); return; }
    if (form.password.length < 6) { setError(t("auth.passwordMinLength")); return; }
    if (status === "taken") { setError("Already registered"); return; }
    if (status === "checking") { setError("Please wait…"); return; }
    onNext();
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner msg={error} />}
      <div className="signup-section-copy">
        <p className="signup-section-eyebrow">Account details</p>
        <p className="text-sm text-[color:var(--text-muted)]">Choose the identifier you will use to sign in and a password for this device.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">{t("reg.emailOrUsername")} <span className="text-red-500">*</span></label>
        <div className="auth-input-wrap">
          <Mail size={17} className="input-icon" />
          <input type="text" required placeholder={t("reg.emailOrUsernamePlaceholder")} value={form.emailOrUsername}
            onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))} />
        </div>
        {status === "checking" && <p className="mt-1 text-xs text-[color:var(--text-muted)]">Checking…</p>}
        {status === "available" && <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={11} /> Available</p>}
        {status === "taken" && <p className="mt-1 text-xs text-red-600">Already registered</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">{t("auth.password")} <span className="text-red-500">*</span></label>
        <div className="auth-input-wrap">
          <Lock size={17} className="input-icon" />
          <input type={showPw ? "text" : "password"} required placeholder="Min 6 characters" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={{ paddingRight: "2.75rem" }} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--primary)]">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div className="signup-hint-card">
        <ShieldCheck size={15} />
        <span>Using your real email here makes Google sign-in reuse the same account later.</span>
      </div>
      <Button type="button" className="w-full mt-2" variant="primary" size="lg" onClick={handleNext}>
        Continue <ArrowRight size={16} />
      </Button>
    </div>
  );
}

/* ── Step 2: Personal ── */
function StepPersonal({ form, setForm, onNext, onBack, error, setError }: {
  form: SignupFormData; setForm: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void; onBack: () => void; error: string; setError: (e: string) => void;
}) {
  const { t } = useI18n();
  const handleNext = () => {
    setError("");
    if (!form.fullName.trim()) { setError("Full name is required"); return; }
    onNext();
  };
  return (
    <div className="space-y-4">
      {error && <ErrorBanner msg={error} />}
      <div className="signup-section-copy">
        <p className="signup-section-eyebrow">Personal details</p>
        <p className="text-sm text-[color:var(--text-muted)]">This name appears across your member profile and community features.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">{t("auth.fullName")} <span className="text-red-500">*</span></label>
        <div className="auth-input-wrap">
          <User size={17} className="input-icon" />
          <input type="text" required placeholder={t("reg.fullNamePlaceholder")} value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
        </div>
      </div>
      <div className="signup-preview-card">
        <p className="signup-section-eyebrow">Preview</p>
        <p className="mt-1 text-base font-semibold text-[color:var(--text-primary)]">{form.fullName.trim() || "Your name will appear here"}</p>
        <p className="mt-1 text-xs text-[color:var(--text-muted)]">You can complete Christian name, campus, departments, and contact details in the next stage.</p>
      </div>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
        <Button variant="primary" size="lg" onClick={handleNext} className="flex-1">Continue <ArrowRight size={16} /></Button>
      </div>
    </div>
  );
}

/* ── Step 3: Confirmation ── */
function StepConfirmation({ form, onConfirm, onBack, error, setError }: {
  form: SignupFormData; onConfirm: () => void; onBack: () => void; error: string; setError: (e: string) => void;
}) {
  const { t } = useI18n();
  const signup = useAuthStore((s) => s.signup);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${buildApiUrl("/api/auth/check-identifier")}?email_or_username=${encodeURIComponent(form.emailOrUsername)}`, { headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" } });
      if (res.ok) {
        const data = await res.json() as { exists?: boolean };
        if (data.exists) { setError("Already registered"); setLoading(false); return; }
      }
      const success = await signup({ fullName: form.fullName, emailOrUsername: form.emailOrUsername, password: form.password, passwordConfirmation: form.password });
      if (success) onConfirm();
      else setError(t("auth.alreadyRegistered"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner msg={error} />}
      <div className="signup-section-copy">
        <p className="signup-section-eyebrow">Review and create</p>
        <p className="text-sm text-[color:var(--text-muted)]">This creates the account. The full registration form opens immediately after this step.</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 space-y-3 shadow-[0_16px_32px_rgba(95,1,19,0.08)]">
        {[
          { label: "Email / Username", value: form.emailOrUsername },
          { label: "Full Name", value: form.fullName },
          { label: "Password", value: "•".repeat(Math.min(form.password.length, 10)) },
        ].map(({ label, value }, i, arr) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-[color:var(--text-primary)]">{value}</p>
            {i < arr.length - 1 && <div className="mt-3 h-px bg-[color:var(--border)]" />}
          </div>
        ))}
      </motion.div>
      <div className="signup-hint-card">
        <Sparkles size={15} />
        <span>After account creation, you will continue into the full member profile setup without signing in again.</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1" type="button">Back</Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>{t("auth.createAccount")} <ArrowRight size={16} /></>}
        </Button>
      </div>
    </form>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700 flex items-start gap-2">
      <span className="shrink-0 mt-0.5">⚠</span> {msg}
    </motion.div>
  );
}
