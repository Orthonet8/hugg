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

/* Map slide IDs to components */
const slideMap: Record<string, React.ComponentType<{ form: RegistrationForm; setForm: React.Dispatch<React.SetStateAction<RegistrationForm>> }>> = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
};

/* Registration form state — extends auth credentials */
export interface RegistrationForm {
  /* Basic Info */
  fullName: string;
  christianName: string;
  gender: string;
  age: string;
  /* Campus & Academics */
  campus: string;
  fieldOfStudy: string;
  dorm: string;
  /* Background & Participation */
  region: string;
  zone: string;
  woreda: string;
  nativeLanguage: string;
  extraLanguages: string;
  previousParticipation: string;
  localChurch: string;
  /* Skills & Service */
  ordination: string;
  ordinationYear: string;
  diocese: string;
  bishop: string;
  serviceDepartments: string[];
  talents: string[];
  talentDescription: string;
  /* Contact & Social */
  mobile: string;
  email: string;
  facebook: string;
  telegram: string;
}

const initialForm: RegistrationForm = {
  fullName: "",
  christianName: "",
  gender: "",
  age: "",
  campus: "",
  fieldOfStudy: "",
  dorm: "",
  region: "",
  zone: "",
  woreda: "",
  nativeLanguage: "",
  extraLanguages: "",
  previousParticipation: "",
  localChurch: "",
  ordination: "",
  ordinationYear: "",
  diocese: "",
  bishop: "",
  serviceDepartments: [],
  talents: [],
  talentDescription: "",
  mobile: "",
  email: "",
  facebook: "",
  telegram: "",
};

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const { user } = useAuthStore();

  const [form, setForm] = useState<RegistrationForm>(() => {
    // Pre-fill with auth data if available
    const base = { ...initialForm };
    if (user) {
      base.fullName = user.fullName || "";
      base.christianName = user.christianName || "";
      base.email = user.email || "";
      base.mobile = user.phone || "";
    }
    return base;
  });
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

  /* Per-step validators */
  const validators: Record<string, () => boolean> = {
    "basic-info": () => !!(form.fullName && form.christianName && form.gender && form.age),
    "campus-academics": () => !!(form.campus && form.fieldOfStudy),
    "background-participation": () => !!(form.region && form.previousParticipation),
    "skills-service": () => form.serviceDepartments.length > 0 || form.talents.length > 0,
    "contact-social": () => !!(form.mobile && form.email),
  };

  const goToIndex = (targetIndex: number) => {
    const target = registrationSlides[targetIndex];
    if (!target) return;
    navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    const isValid = validators[currentSlide?.id]?.();
    if (!isValid) {
      setError("እባክዎ ከመቀጠልዎ በፊት አስፈላጊ መረጃዎችን ያስገቡ።");
      return;
    }
    setError("");

    // Last step — submit
    if (currentIndex === registrationSlides.length - 1) {
      setSubmitting(true);
      // TODO: Replace with API call
      // await fetch("/api/users", { method: "POST", body: JSON.stringify(form) });
      setTimeout(() => {
        setSubmitting(false);
        navigate("/news");
      }, 900);
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

  const variants = {
    enter: (dir: "forward" | "backward") => ({
      x: dir === "forward" ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "forward" | "backward") => ({
      x: dir === "forward" ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card className="overflow-hidden border-0 p-0 shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
          <button
            type="button"
            onClick={handleTopBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--text-muted)] transition hover:text-[color:var(--primary)]"
          >
            <ArrowLeft size={16} />
            ተመለስ
          </button>
          <div className="app-gradient rounded-lg px-3 py-1.5 text-xs font-bold text-[color:var(--on-primary)]">
            HUGGB
          </div>
        </div>

        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--text-muted)]">
              Step {currentSlide.step} / {registrationSlides.length}
            </span>
            <span className="text-sm font-bold text-[color:var(--primary)]">
              {currentSlide.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-[color:var(--surface-soft)]">
            <motion.div
              className="h-full rounded-full bg-[color:var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${currentSlide.progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)] sm:text-2xl">
            {currentSlide.title}
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Content */}
        <div className="relative min-h-[280px] px-5 pb-5">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {SlideComponent ? (
                <SlideComponent form={form} setForm={setForm} />
              ) : (
                <p className="py-10 text-center text-sm text-[color:var(--text-muted)]">
                  Slide not found.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] px-5 py-4">
          <button
            type="button"
            onClick={handleExit}
            className="text-sm text-[color:var(--text-muted)] transition hover:text-red-600"
          >
            <X size={14} className="inline mr-1" />
            ውጣ
          </button>

          <div className="flex items-center gap-3">
            {currentIndex > 0 && (
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                disabled={submitting}
              >
                <ChevronLeft size={16} />
                ቀዳሚ
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting
                ? "እያስገባ ነው..."
                : currentIndex === registrationSlides.length - 1
                  ? "አስገባ"
                  : "ቀጥል"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Slide Dots Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {registrationSlides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              setDirection(idx > currentIndex ? "forward" : "backward");
              goToIndex(idx);
            }}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              idx === currentIndex
                ? "w-8 bg-[color:var(--primary)]"
                : idx < currentIndex
                  ? "w-2.5 bg-[color:var(--primary)] opacity-40"
                  : "w-2.5 bg-[color:var(--border-strong)]"
            }`}
            aria-label={`Go to step ${idx + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </div>
  );
};
