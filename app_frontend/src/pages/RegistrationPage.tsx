import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, LogOut } from "lucide-react";
import { registrationSlides } from "../data/registrationSlides";
import { SlideBasicInfo } from "../components/registration/SlideBasicInfo";
import { SlideCampusAcademics } from "../components/registration/SlideCampusAcademics";
import { SlideBackgroundParticipation } from "../components/registration/SlideBackgroundParticipation";
import { SlideSkillsService } from "../components/registration/SlideSkillsService";
import { SlideContactSocial } from "../components/registration/SlideContactSocial";
import { SlideVisualPanel } from "../components/registration/SlideVisualPanel";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";

const slideMap: Record<string, React.ComponentType<{ form: RegistrationForm; setForm: React.Dispatch<React.SetStateAction<RegistrationForm>> }>> = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
};

/* Keep one brand gradient across all steps for a consistent experience. */
const REGISTRATION_GRADIENT: [string, string] = ["#5f0113", "#9b1a2f"];
const REG_STORAGE_KEY = "hugg-registration-form-data";

/* Stitch slide subtitles */
const SUBTITLES: Record<string, string> = {
  "basic-info": "Start with your identity and personal details.",
  "campus-academics": "Add your academic and campus information.",
  "background-participation": "Share your background and church participation.",
  "skills-service": "Select your ministry interests and talents.",
  "contact-social": "Finalize your contact information.",
};

export interface RegistrationForm {
  fullName: string; christianName: string; gender: string; age: string;
  campus: string; fieldOfStudy: string; dorm: string;
  region: string; zone: string; woreda: string; nativeLanguage: string; extraLanguages: string;
  previousParticipation: string; localChurch: string;
  ordination: string; ordinationYear: string; diocese: string; bishop: string;
  serviceDepartments: string[]; talents: string[]; talentDescription: string;
  mobile: string; emailOrUsername: string; telegram: string;
  profilePhotoFile: File | null;
  profilePhotoPreview: string;
}

const initialForm: RegistrationForm = {
  fullName: "", christianName: "", gender: "", age: "",
  campus: "", fieldOfStudy: "", dorm: "",
  region: "", zone: "", woreda: "", nativeLanguage: "", extraLanguages: "",
  previousParticipation: "", localChurch: "",
  ordination: "", ordinationYear: "", diocese: "", bishop: "",
  serviceDepartments: [], talents: [], talentDescription: "",
  mobile: "", emailOrUsername: "", telegram: "",
  profilePhotoFile: null,
  profilePhotoPreview: "",
};

const getStoredForm = (): RegistrationForm => {
  try {
    const raw = sessionStorage.getItem(REG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialForm, ...parsed, profilePhotoFile: null };
    }
  } catch {}
  return { ...initialForm };
};

const validators: Record<string, (f: RegistrationForm) => boolean> = {
  "basic-info": (f) => !!(f.fullName && f.gender && f.age),
  "campus-academics": (f) => !!(f.campus && f.fieldOfStudy),
  "background-participation": (f) => !!(f.region && f.previousParticipation),
  "skills-service": (f) => f.serviceDepartments.length > 0 || f.talents.length > 0,
  "contact-social": () => true,
};

export const RegistrationPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState<RegistrationForm>(getStoredForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);

  const scrollerRef = useRef<HTMLDivElement>(null);

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      const { profilePhotoFile, ...toSave } = form;
      sessionStorage.setItem(REG_STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [form]);

  // Pre-fill profile info from authenticated user if available
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || ((user as { fullName?: string }).fullName ?? ""),
      christianName: prev.christianName || ((user as { christianName?: string }).christianName ?? ""),
      mobile: prev.mobile || ((user as { phone?: string }).phone ?? ""),
      telegram: prev.telegram || ((user as { telegram?: string }).telegram ?? ""),
      profilePhotoPreview: prev.profilePhotoPreview || ((user as { avatar?: string }).avatar ?? ""),
      emailOrUsername:
        prev.emailOrUsername ||
        ((user as { emailOrUsername?: string; email?: string }).emailOrUsername ??
          (user as { emailOrUsername?: string; email?: string }).email ??
          ""),
    }));
  }, [user]);

  const currentIndex = useMemo(() => {
    const idx = registrationSlides.findIndex((s) => s.id === stepId);
    return idx >= 0 ? idx : 0;
  }, [stepId]);

  // Reset scroll to top whenever slide changes
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex, stepId]);

  const slide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[slide?.id];
  const [gradFrom, gradTo] = REGISTRATION_GRADIENT;
  const isLast = currentIndex === registrationSlides.length - 1;

  const goTo = (idx: number) => {
    const target = registrationSlides[idx];
    if (target) navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    if (!validators[slide?.id]?.(form)) {
      setError(t("reg.validationError"));
      scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");

    if (isLast) {
      setSubmitting(true);
      try {
        await updateProfile(form);
        try { sessionStorage.removeItem(REG_STORAGE_KEY); } catch {}
        navigate("/news");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save profile. Please check your details.";
        setError(msg);
        setSubmitting(false);
        scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setDir(1);
    goTo(currentIndex + 1);
  };

  const handleBack = () => {
    setDir(-1);
    if (currentIndex === 0) navigate("/news");
    else goTo(currentIndex - 1);
  };

  return (
    <div className="registration-shell" style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}>
      <div className="mx-auto flex h-screen max-h-screen w-full max-w-5xl flex-col lg:px-6 lg:py-6 overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-6 lg:px-8 lg:pt-3">
          <button
            type="button"
            onClick={handleBack}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/16 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/28 active:scale-95 transition"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="hidden rounded-full border border-white/16 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 lg:block">
            Member registration
          </div>

          <div className="flex items-center gap-1.5">
            {registrationSlides.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === currentIndex ? 24 : 8, opacity: i <= currentIndex ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full bg-white"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/news")}
            className="flex items-center gap-1 text-xs font-semibold text-white/75 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/10"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>

        {/* Header title & progress */}
        <div className="shrink-0 px-4 pt-1 pb-3 text-white sm:px-6 lg:px-8 lg:pb-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <motion.p
              key={`step-${currentIndex}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70"
            >
              Step {slide.step} of {registrationSlides.length}
            </motion.p>
            <span className="text-xs font-bold text-white/85 sm:hidden">{slide.progress}%</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl min-w-0">
              <motion.h1
                key={`h-${slide.id}`}
                initial={{ opacity: 0, x: dir * 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28 }}
                className="app-heading text-[1.45rem] sm:text-[1.8rem] lg:text-[2.1rem] font-bold leading-tight"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                key={`s-${slide.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="mt-0.5 text-xs sm:text-sm leading-relaxed text-white/75 truncate sm:whitespace-normal"
              >
                {SUBTITLES[slide.id]}
              </motion.p>
            </div>

            <div className="hidden sm:block rounded-[1.15rem] border border-white/16 bg-white/10 px-3.5 py-2 backdrop-blur-sm shrink-0 sm:min-w-[190px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Progress</span>
                <span className="text-sm font-bold text-white">{slide.progress}%</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-white/70">Finish profile to unlock all features.</p>
            </div>
          </div>
        </div>

        {/* Form Sheet Card */}
        <div className="registration-sheet flex flex-1 flex-col overflow-hidden rounded-t-[1.75rem] min-h-0 lg:rounded-[2rem] lg:shadow-[0_32px_80px_rgba(32,0,8,0.24)]">

          {/* Progress bar line */}
          <div className="h-1 bg-(--surface-soft) shrink-0">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
              animate={{ width: `${slide.progress}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>

          {/* Scrollable form content with custom slim scroller */}
          <div
            ref={scrollerRef}
            className="registration-scroller flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8 sm:px-6 sm:pt-6 lg:px-8"
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={slide.id}
                initial={{ x: dir * 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir * -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="max-w-4xl mx-auto"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-2.5 shadow-sm"
                  >
                    <span className="text-base leading-none">⚠</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="registration-content-grid">
                  <div className="registration-visual-column">
                    <SlideVisualPanel slideId={slide.id as Parameters<typeof SlideVisualPanel>[0]["slideId"]} />
                  </div>

                  <div className="registration-form-column">
                    {SlideComponent && <SlideComponent form={form} setForm={setForm} />}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.3rem] border border-(--border) bg-(--surface-soft) px-4 py-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                    Progress Note
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-(--text-secondary)">
                    Complete this step to continue. Your information is securely stored when you finish registration.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="sticky bottom-0 z-30 shrink-0 border-t border-(--border) bg-(--surface)/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 lg:px-8 pb-[calc(0.9rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
            <div className="max-w-4xl mx-auto flex items-center gap-2.5 sm:gap-3">
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 sm:h-13 px-4 sm:px-5 rounded-[1.1rem] border-2 flex items-center gap-1.5 text-xs sm:text-sm font-bold transition hover:bg-(--soft-hover) active:scale-95 shrink-0"
                  style={{ borderColor: gradFrom, color: gradFrom }}
                >
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex-1 h-12 sm:h-13 rounded-[1.1rem] flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60 shadow-[0_8px_22px_rgba(95,1,19,0.28)]"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
              >
                {submitting ? (
                  <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : isLast ? (
                  <>
                    <Check size={18} /> Complete Registration
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
