import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, X } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { registrationSlides } from "../data/registrationSlides";
import { SlideBasicInfo } from "../components/registration/SlideBasicInfo";
import { SlideCampusAcademics } from "../components/registration/SlideCampusAcademics";
import { SlideBackgroundParticipation } from "../components/registration/SlideBackgroundParticipation";
import { SlideSkillsService } from "../components/registration/SlideSkillsService";
import { SlideContactSocial } from "../components/registration/SlideContactSocial";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";

/* Map slide IDs to components */
const slideMap: Record<string, React.ComponentType<{ form: RegistrationForm; setForm: React.Dispatch<React.SetStateAction<RegistrationForm>> }>> = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
};

export interface RegistrationForm {
  fullName: string;
  christianName: string;
  gender: string;
  age: string;
  campus: string;
  fieldOfStudy: string;
  dorm: string;
  region: string;
  zone: string;
  woreda: string;
  nativeLanguage: string;
  extraLanguages: string;
  previousParticipation: string;
  localChurch: string;
  ordination: string;
  ordinationYear: string;
  diocese: string;
  bishop: string;
  serviceDepartments: string[];
  talents: string[];
  talentDescription: string;
  mobile: string;
  emailOrUsername: string;
  telegram: string;
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

/* Premium slide variants with spring-like easing */
const slideVariants = {
  enter: (dir: "forward" | "backward") => ({
    x: dir === "forward" ? 80 : -80,
    opacity: 0,
    scale: 0.97,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: "forward" | "backward") => ({
    x: dir === "forward" ? -80 : 80,
    opacity: 0,
    scale: 0.97,
    filter: "blur(4px)",
  }),
};

export const RegistrationPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  /* All fields start empty - no prefill from signup */
  const [form, setForm] = useState<RegistrationForm>({ ...initialForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const currentIndex = useMemo(() => {
    if (!stepId) return 0;
    const idx = registrationSlides.findIndex((slide) => slide.id === stepId);
    return idx >= 0 ? idx : 0;
  }, [stepId]);

  const currentSlide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[currentSlide?.id];

  /* Per-step title/subtitle keys */
  const slideTitleKeys: Record<string, string> = {
    "basic-info": "reg.step1Title",
    "campus-academics": "reg.step2Title",
    "background-participation": "reg.step3Title",
    "skills-service": "reg.step4Title",
    "contact-social": "reg.step5Title",
  };
  const slideSubtitleKeys: Record<string, string> = {
    "basic-info": "reg.step1Subtitle",
    "campus-academics": "reg.step2Subtitle",
    "background-participation": "reg.step3Subtitle",
    "skills-service": "reg.step4Subtitle",
    "contact-social": "reg.step5Subtitle",
  };

  const validators: Record<string, () => boolean> = {
    "basic-info": () => !!(form.fullName && form.christianName && form.gender && form.age),
    "campus-academics": () => !!(form.campus && form.fieldOfStudy),
    "background-participation": () => !!(form.region && form.previousParticipation),
    "skills-service": () => form.serviceDepartments.length > 0 || form.talents.length > 0,
    "contact-social": () => true,
  };

  const goToIndex = (targetIndex: number) => {
    const target = registrationSlides[targetIndex];
    if (!target) return;
    navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    const isValid = validators[currentSlide?.id]?.();
    if (!isValid) {
      setError(t("reg.validationError"));
      return;
    }
    setError("");

    if (currentIndex === registrationSlides.length - 1) {
      setSubmitting(true);
      try {
        await updateProfile(form);
        navigate("/news");
      } catch {
        setError("Failed to save registration. Please try again.");
        setSubmitting(false);
      }
      return;
    }

    setDirection("forward");
    goToIndex(currentIndex + 1);
  };

  const handleBack = () => {
    setDirection("backward");
    goToIndex(currentIndex - 1);
  };

  const handleExit = () => navigate("/news");
  const handleTopBack = currentIndex === 0 ? handleExit : handleBack;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card className="overflow-hidden border-0 p-0 shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-4">
          <button type="button" onClick={handleTopBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--text-muted)] transition hover:text-[color:var(--primary)]">
            <ArrowLeft size={16} />
            {t("common.back")}
          </button>
          <div className="flex items-center gap-2">
            <div className="app-gradient rounded-lg px-3 py-1.5 text-xs font-bold text-[color:var(--on-primary)]">
              HUGGB
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--text-muted)]"
            >
              Step {currentSlide.step} / {registrationSlides.length}
            </motion.span>
            <motion.span
              key={currentSlide.progress}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-bold text-[color:var(--primary)]"
            >
              {currentSlide.progress}%
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-[color:var(--surface-soft)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${currentSlide.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <motion.h2
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="app-heading text-xl font-bold text-[color:var(--text-primary)] sm:text-2xl"
          >
            {t(slideTitleKeys[currentSlide.id] ?? currentSlide.title)}
          </motion.h2>
          <motion.p
            key={`subtitle-${currentSlide.id}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1.5 text-sm text-[color:var(--text-muted)]"
          >
            {t(slideSubtitleKeys[currentSlide.id] ?? currentSlide.subtitle)}
          </motion.p>
        </div>

        {/* Slide Content */}
        <div className="relative min-h-[280px] px-6 pb-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
            >
              {SlideComponent ? (
                <SlideComponent form={form} setForm={setForm} />
              ) : (
                <p className="py-10 text-center text-sm text-[color:var(--text-muted)]">Slide not found.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] px-6 py-5">
          <button type="button" onClick={handleExit} className="inline-flex items-center gap-1 text-sm text-[color:var(--text-muted)] transition hover:text-red-600">
            <X size={14} />
            {t("common.exit")}
          </button>

          <div className="flex items-center gap-3">
            {currentIndex > 0 && (
              <Button variant="outline" size="md" onClick={handleBack} disabled={submitting}>
                <ChevronLeft size={16} />
                {t("common.back")}
              </Button>
            )}
            <Button variant="primary" size="lg" onClick={handleNext} disabled={submitting}>
              {submitting ? t("common.submitting") : currentIndex === registrationSlides.length - 1 ? t("common.submit") : t("common.next")}
            </Button>
          </div>
        </div>
      </Card>

      {/* Slide Dots - Interactive */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {registrationSlides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => { setDirection(idx > currentIndex ? "forward" : "backward"); goToIndex(idx); }}
            className={`rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-9 h-2.5 bg-[color:var(--primary)]"
                : idx < currentIndex
                  ? "w-2.5 h-2.5 bg-[color:var(--primary)] opacity-50 hover:opacity-70"
                  : "w-2.5 h-2.5 bg-[color:var(--border-strong)] hover:bg-[color:var(--primary)] hover:opacity-50"
            }`}
            aria-label={`Go to step ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
