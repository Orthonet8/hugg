import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { useAuthStore } from "../../context/useAuthStore";
import { useI18n } from "../../i18n/I18nProvider";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const TRANSITION = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const };

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SignupStep = "credentials" | "personal" | "confirmation";

interface SignupFormData {
  emailOrUsername: string;
  password: string;
  fullName: string;
}

/* ------------------------------------------------------------------ */
/*  Main SignupFlow                                                    */
/* ------------------------------------------------------------------ */

export const SignupFlow = ({
  onSignupComplete,
  onBackToLogin,
}: {
  onSignupComplete: () => void;
  onBackToLogin: () => void;
}) => {
  const [step, setStep] = useState<SignupStep>("credentials");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [form, setForm] = useState<SignupFormData>({
    emailOrUsername: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");

  const goToStep = (target: SignupStep) => {
    const order: SignupStep[] = ["credentials", "personal", "confirmation"];
    const currentIdx = order.indexOf(step);
    const targetIdx = order.indexOf(target);
    setDirection(targetIdx > currentIdx ? "forward" : "backward");
    setError("");
    setStep(target);
  };

  return (
    <div className="relative">
      {/* Back button */}
      <div className="px-7 pt-5 pb-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--text-muted)] transition hover:text-[color:var(--primary)]"
        >
          <ArrowLeft size={15} />
          {useI18n().t("common.back")}
        </button>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Slide content */}
      <div className="min-h-[340px] px-7 pb-7">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={direction === "forward" ? { x: 60, opacity: 0 } : { x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={direction === "forward" ? { x: -60, opacity: 0 } : { x: 60, opacity: 0 }}
            transition={TRANSITION}
          >
            {step === "credentials" && (
              <StepCredentials
                form={form}
                setForm={setForm}
                onNext={() => goToStep("personal")}
                error={error}
                setError={setError}
              />
            )}
            {step === "personal" && (
              <StepPersonal
                form={form}
                setForm={setForm}
                onNext={() => goToStep("confirmation")}
                onBack={() => goToStep("credentials")}
                error={error}
                setError={setError}
              />
            )}
            {step === "confirmation" && (
              <StepConfirmation
                form={form}
                onConfirm={() => onSignupComplete()}
                onBack={() => goToStep("personal")}
                error={error}
                setError={setError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ currentStep }: { currentStep: SignupStep }) {
  const steps: SignupStep[] = ["credentials", "personal", "confirmation"];
  const currentIdx = steps.indexOf(currentStep);

  return (
    <div className="px-7 pb-4">
      <div className="flex items-center gap-2">
        {steps.map((s, idx) => (
          <div key={s} className="flex items-center flex-1">
            <motion.div
              animate={{
                scale: idx === currentIdx ? 1.1 : 1,
                backgroundColor: idx <= currentIdx ? "var(--primary)" : "var(--border)",
              }}
              transition={{ duration: 0.3 }}
              className="h-2.5 flex-1 rounded-full"
            />
            {idx < steps.length - 1 && (
              <div className="w-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Credentials (Email & Password)                             */
/* ------------------------------------------------------------------ */

function StepCredentials({
  form,
  setForm,
  onNext,
  error,
  setError,
}: {
  form: SignupFormData;
  setForm: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
  error: string;
  setError: (e: string) => void;
}) {
  const { t } = useI18n();
  const [identifierStatus, setIdentifierStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [identifierError, setIdentifierError] = useState("");

  useEffect(() => {
    const value = form.emailOrUsername.trim();
    setIdentifierError("");

    if (value.length < 3) {
      setIdentifierStatus("idle");
      return;
    }

    let cancelled = false;
    setIdentifierStatus("checking");

    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/auth/check-identifier?email_or_username=${encodeURIComponent(value)}`,
          {
            headers: {
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          },
        );

        if (!res.ok) {
          if (!cancelled) setIdentifierStatus("idle");
          return;
        }

        const data = (await res.json()) as { exists?: boolean };
        if (!cancelled) {
          setIdentifierStatus(data.exists ? "taken" : "available");
        }
      } catch {
        if (!cancelled) setIdentifierStatus("idle");
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [form.emailOrUsername]);

  const handleNext = () => {
    setError("");
    setIdentifierError("");

    if (!form.emailOrUsername.trim()) {
      setError("Email or username is required");
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (identifierStatus === "taken") {
      setIdentifierError("Already registered");
      return;
    }
    if (identifierStatus === "checking") {
      setError("Please wait while we check availability.");
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-soft)]">
          <Mail size={22} className="text-[color:var(--primary)]" />
        </div>
        <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
          {t("auth.createAccount")}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          {t("auth.createAccountSubtitle")}
        </p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {error}
        </motion.p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
          {t("reg.emailOrUsername")} <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <Mail size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[color:var(--text-muted)] transition group-focus-within:text-[color:var(--primary)]" />
          <input
            type="text"
            required
            placeholder={t("reg.emailOrUsernamePlaceholder")}
            value={form.emailOrUsername}
            onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))}
            className="app-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--surface)]"
          />
        </div>
        {!identifierError && identifierStatus === "checking" && (
          <p className="mt-1.5 text-xs text-[color:var(--text-muted)]">Checking availability...</p>
        )}
        {!identifierError && identifierStatus === "available" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 size={12} /> Available
          </motion.p>
        )}
        {identifierError && (
          <p className="mt-1.5 text-xs text-red-600">{identifierError}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
          {t("auth.password")} <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <Lock size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[color:var(--text-muted)] transition group-focus-within:text-[color:var(--primary)]" />
          <input
            type="password"
            required
            placeholder="Min 6 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="app-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--surface)]"
          />
        </div>
      </div>

      <Button type="button" className="w-full" variant="primary" size="lg" onClick={handleNext}>
        Next <ArrowRight size={16} />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Personal Info (Full Name)                                  */
/* ------------------------------------------------------------------ */

function StepPersonal({
  form,
  setForm,
  onNext,
  onBack,
  error,
  setError,
}: {
  form: SignupFormData;
  setForm: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onNext: () => void;
  onBack: () => void;
  error: string;
  setError: (e: string) => void;
}) {
  const { t } = useI18n();

  const handleNext = () => {
    setError("");
    if (!form.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-soft)]">
          <User size={22} className="text-[color:var(--primary)]" />
        </div>
        <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
          {t("auth.fullName")}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Enter your full name as you'd like it to appear
        </p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {error}
        </motion.p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
          {t("auth.fullName")} <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <User size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[color:var(--text-muted)] transition group-focus-within:text-[color:var(--primary)]" />
          <input
            type="text"
            required
            placeholder={t("reg.fullNamePlaceholder")}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="app-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--surface)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={handleNext} className="flex-1">
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Confirmation & Submit                                     */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  form,
  onConfirm,
  onBack,
  error,
  setError,
}: {
  form: SignupFormData;
  onConfirm: () => void;
  onBack: () => void;
  error: string;
  setError: (e: string) => void;
}) {
  const { t } = useI18n();
  const signup = useAuthStore((s) => s.signup);
  const [loading, setLoading] = useState(false);

  const checkAvailabilityNow = async (params: {
    identifier?: string;
  }): Promise<{ identifierExists: boolean }> => {
    const identifier = (params.identifier ?? "").trim();
    const search = new URLSearchParams();
    if (identifier !== "") {
      search.set("email_or_username", identifier);
    }
    if (![...search.keys()].length) {
      return { identifierExists: false };
    }
    const res = await fetch(
      `${API_BASE}/api/auth/check-identifier?${search.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
    if (!res.ok) {
      return { identifierExists: false };
    }
    const data = (await res.json()) as {
      identifier_exists?: boolean;
      mobile_exists?: boolean;
      telegram_exists?: boolean;
      exists?: boolean;
    };
    return {
      identifierExists: Boolean(data.identifier_exists ?? data.exists),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const checkResult = await checkAvailabilityNow({
        identifier: form.emailOrUsername,
      });

      if (checkResult.identifierExists) {
        setError("Already registered");
        setLoading(false);
        return;
      }

      const success = await signup({
        fullName: form.fullName,
        emailOrUsername: form.emailOrUsername,
        password: form.password,
        passwordConfirmation: form.password,
      });

      if (success) {
        onConfirm();
      } else {
        setError(t("auth.alreadyRegistered"));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-soft)]">
          <CheckCircle2 size={22} className="text-[color:var(--primary)]" />
        </div>
        <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
          Review & Create Account
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Please review your information before continuing
        </p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {error}
        </motion.p>
      )}

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5 space-y-3"
      >
        <div>
          <p className="text-xs font-medium text-[color:var(--text-muted)] uppercase tracking-wide">Email / Username</p>
          <p className="mt-0.5 text-sm font-semibold text-[color:var(--text-primary)]">{form.emailOrUsername}</p>
        </div>
        <div className="h-px bg-[color:var(--border)]" />
        <div>
          <p className="text-xs font-medium text-[color:var(--text-muted)] uppercase tracking-wide">Full Name</p>
          <p className="mt-0.5 text-sm font-semibold text-[color:var(--text-primary)]">{form.fullName}</p>
        </div>
        <div className="h-px bg-[color:var(--border)]" />
        <div>
          <p className="text-xs font-medium text-[color:var(--text-muted)] uppercase tracking-wide">Password</p>
          <p className="mt-0.5 text-sm font-semibold text-[color:var(--text-primary)]">{"•".repeat(Math.min(form.password.length, 12))}</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={loading}>
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {t("auth.createAccount")} <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
