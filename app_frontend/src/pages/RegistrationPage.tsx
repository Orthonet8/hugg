import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { registrationSlides } from "../data/registrationSlides";
import { SlideBasicInfo } from "../components/registration/SlideBasicInfo";
import { SlideCampusAcademics } from "../components/registration/SlideCampusAcademics";
import { SlideBackgroundParticipation } from "../components/registration/SlideBackgroundParticipation";
import { SlideSkillsService } from "../components/registration/SlideSkillsService";
import { SlideContactSocial } from "../components/registration/SlideContactSocial";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";

const slideMap: Record<string, React.ComponentType<{ form: RegistrationForm; setForm: React.Dispatch<React.SetStateAction<RegistrationForm>> }>> = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
};

/* Slide accent colors — each step gets its own identity */
const SLIDE_ACCENTS = [
  { from: "#5f0113", to: "#9b1a2f" },   // 1 — deep crimson
  { from: "#1d4ed8", to: "#3b82f6" },   // 2 — blue
  { from: "#047857", to: "#10b981" },   // 3 — green
  { from: "#7c3aed", to: "#a78bfa" },   // 4 — purple
  { from: "#b45309", to: "#f59e0b" },   // 5 — gold
];

export interface RegistrationForm {
  fullName: string; christianName: string; gender: string; age: string;
  campus: string; fieldOfStudy: string; dorm: string;
  region: string; zone: string; woreda: string; nativeLanguage: string; extraLanguages: string;
  previousParticipation: string; localChurch: string;
  ordination: string; ordinationYear: string; diocese: string; bishop: string;
  serviceDepartments: string[]; talents: string[]; talentDescription: string;
  mobile: string; emailOrUsername: string; telegram: string;
}

const initialForm: RegistrationForm = {
  fullName: "", christianName: "", gender: "", age: "",
  campus: "", fieldOfStudy: "", dorm: "",
  region: "", zone: "", woreda: "", nativeLanguage: "", extraLanguages: "",
  previousParticipation: "", localChurch: "",
  ordination: "", ordinationYear: "", diocese: "", bishop: "",
  serviceDepartments: [], talents: [], talentDescription: "",
  mobile: "", emailOrUsername: "", telegram: "",
};

const validators: Record<string, (f: RegistrationForm) => boolean> = {
  "basic-info": (f) => !!(f.fullName && f.christianName && f.gender && f.age),
  "campus-academics": (f) => !!(f.campus && f.fieldOfStudy),
  "background-participation": (f) => !!(f.region && f.previousParticipation),
  "skills-service": (f) => f.serviceDepartments.length > 0 || f.talents.length > 0,
  "contact-social": () => true,
};

const slideTitleKeys: Record<string, string> = {
  "basic-info": "reg.step1Title", "campus-academics": "reg.step2Title",
  "background-participation": "reg.step3Title", "skills-service": "reg.step4Title",
  "contact-social": "reg.step5Title",
};
const slideSubtitleKeys: Record<string, string> = {
  "basic-info": "reg.step1Subtitle", "campus-academics": "reg.step2Subtitle",
  "background-participation": "reg.step3Subtitle", "skills-service": "reg.step4Subtitle",
  "contact-social": "reg.step5Subtitle",
};

export const RegistrationPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [form, setForm] = useState<RegistrationForm>({ ...initialForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentIndex = useMemo(() => {
    const idx = registrationSlides.findIndex((s) => s.id === stepId);
    return idx >= 0 ? idx : 0;
  }, [stepId]);

  const currentSlide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[currentSlide?.id];
  const accent = SLIDE_ACCENTS[currentIndex] ?? SLIDE_ACCENTS[0];
  const isLast = currentIndex === registrationSlides.length - 1;

  const goTo = (idx: number) => {
    const target = registrationSlides[idx];
    if (target) navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    if (!validators[currentSlide?.id]?.(form)) { setError(t("reg.validationError")); return; }
    setError("");
    if (isLast) {
      setSubmitting(true);
      try { await updateProfile(form); navigate("/news"); }
      catch { setError("Failed to save. Please try again."); setSubmitting(false); }
      return;
    }
    setDirection(1);
    goTo(currentIndex + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentIndex === 0) navigate("/news");
    else goTo(currentIndex - 1);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: `linear-gradient(160deg, ${accent.from} 0%, ${accent.to} 100%)` }}>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-safe pt-4 pb-2 z-10">
        <button type="button" onClick={handleBack}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30">
          <ChevronLeft size={20} />
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {registrationSlides.map((_, idx) => (
            <motion.div key={idx} animate={{ width: idx === currentIndex ? 24 : 8, opacity: idx <= currentIndex ? 1 : 0.4 }}
              className="h-2 rounded-full bg-white" transition={{ duration: 0.3 }} />
          ))}
        </div>

        <button type="button" onClick={() => navigate("/news")}
          className="text-xs font-semibold text-white/70 hover:text-white transition px-2 py-1">
          Skip
        </button>
      </div>

      {/* ── Hero header ── */}
      <div className="px-6 pt-4 pb-6 text-white">
        <motion.p key={`step-${currentIndex}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">
          Step {currentSlide.step} of {registrationSlides.length}
        </motion.p>
        <motion.h1 key={`title-${currentSlide.id}`} initial={{ opacity: 0, x: direction * 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="app-heading text-2xl font-bold leading-snug">
          {t(slideTitleKeys[currentSlide.id] ?? currentSlide.title)}
        </motion.h1>
        <motion.p key={`sub-${currentSlide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mt-1 text-sm text-white/70">
          {t(slideSubtitleKeys[currentSlide.id] ?? currentSlide.subtitle)}
        </motion.p>
      </div>

      {/* ── White sheet (slides up) ── */}
      <div className="flex-1 flex flex-col bg-[color:var(--surface)] rounded-t-[2rem] overflow-hidden">
        {/* Progress bar at top of sheet */}
        <div className="h-1 w-full bg-[color:var(--surface-soft)]">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
            animate={{ width: `${currentSlide.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentSlide.id} custom={direction}
              initial={{ x: direction * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="px-6 pt-6 pb-4">

              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  ⚠ {error}
                </motion.div>
              )}

              {SlideComponent
                ? <SlideComponent form={form} setForm={setForm} />
                : <p className="text-center text-sm text-[color:var(--text-muted)] py-10">Slide not found.</p>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom action bar ── */}
        <div className="px-6 py-5 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <button type="button" onClick={handleNext} disabled={submitting}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-base font-bold text-white transition active:scale-95 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`, boxShadow: `0 4px 20px ${accent.from}55` }}>
            {submitting ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : isLast ? (
              <><Check size={20} /> Complete Registration</>
            ) : (
              <>{t("common.next")} <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
