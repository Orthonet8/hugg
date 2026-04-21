import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, LogOut } from "lucide-react";
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

/* Each slide gets its own gradient — matches Stitch color identity */
const GRADIENTS = [
  ["#5f0113", "#9b1a2f"],  // 1 crimson
  ["#1e3a8a", "#2563eb"],  // 2 blue
  ["#064e3b", "#059669"],  // 3 green
  ["#4c1d95", "#7c3aed"],  // 4 purple
  ["#92400e", "#d97706"],  // 5 amber/gold
];

/* Stitch slide subtitles */
const SUBTITLES: Record<string, string> = {
  "basic-info": "Tell us about yourself",
  "campus-academics": "Tell us about your university life.",
  "background-participation": "Please provide details about your local origins and church history.",
  "skills-service": "Help us understand how you'd like to contribute to our community.",
  "contact-social": "Almost done!",
};

/* Stitch slide motivational quotes */
const QUOTES: Record<string, string> = {
  "basic-info": "Welcome to the HUGGB family 🙏",
  "campus-academics": "Academic & Spiritual Excellence",
  "background-participation": '"Grow in the grace and knowledge of our Lord."',
  "skills-service": "Serve with heart, lead with faith.",
  "contact-social": "Welcome to the family. We're glad you're here.",
};

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

export const RegistrationPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [form, setForm] = useState<RegistrationForm>({ ...initialForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);

  const currentIndex = useMemo(() => {
    const idx = registrationSlides.findIndex((s) => s.id === stepId);
    return idx >= 0 ? idx : 0;
  }, [stepId]);

  const slide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[slide?.id];
  const [gradFrom, gradTo] = GRADIENTS[currentIndex] ?? GRADIENTS[0];
  const isLast = currentIndex === registrationSlides.length - 1;

  const goTo = (idx: number) => {
    const target = registrationSlides[idx];
    if (target) navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    if (!validators[slide?.id]?.(form)) { setError(t("reg.validationError")); return; }
    setError("");
    if (isLast) {
      setSubmitting(true);
      try { await updateProfile(form); navigate("/news"); }
      catch { setError("Failed to save. Please try again."); setSubmitting(false); }
      return;
    }
    setDir(1); goTo(currentIndex + 1);
  };

  const handleBack = () => {
    setDir(-1);
    if (currentIndex === 0) navigate("/news");
    else goTo(currentIndex - 1);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button type="button" onClick={handleBack}
          className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition">
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {registrationSlides.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === currentIndex ? 22 : 7, opacity: i <= currentIndex ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="h-[7px] rounded-full bg-white" />
          ))}
        </div>

        <button type="button" onClick={() => navigate("/news")}
          className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition">
          <LogOut size={14} /> Exit
        </button>
      </div>

      {/* ── Gradient header ── */}
      <div className="px-6 pt-3 pb-7 text-white">
        <motion.p key={`step-${currentIndex}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold uppercase tracking-widest text-white/55 mb-1">
          Step {slide.step} of {registrationSlides.length} · {slide.progress}% complete
        </motion.p>
        <motion.h1 key={`h-${slide.id}`} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32 }}
          className="app-heading text-[1.6rem] font-bold leading-tight">
          {slide.title}
        </motion.h1>
        <motion.p key={`s-${slide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mt-1 text-sm text-white/65">
          {SUBTITLES[slide.id]}
        </motion.p>
      </div>

      {/* ── White sheet ── */}
      <div className="flex-1 flex flex-col bg-[color:var(--surface)] rounded-t-[2rem] overflow-hidden min-h-0">

        {/* Thin progress bar */}
        <div className="h-[3px] bg-[color:var(--surface-soft)] shrink-0">
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
            animate={{ width: `${slide.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={slide.id}
              initial={{ x: dir * 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="px-6 pt-6 pb-4">

              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  ⚠ {error}
                </motion.div>
              )}

              {SlideComponent && <SlideComponent form={form} setForm={setForm} />}

              {/* Stitch motivational quote */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="mt-6 rounded-2xl px-4 py-3 text-center text-xs font-medium italic"
                style={{ background: `linear-gradient(135deg, ${gradFrom}18, ${gradTo}18)`, color: gradFrom }}>
                {QUOTES[slide.id]}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="shrink-0 px-6 py-5 border-t border-[color:var(--border)] bg-[color:var(--surface)] flex items-center gap-3">
          {currentIndex > 0 && (
            <button type="button" onClick={handleBack}
              className="h-14 px-5 rounded-2xl border-2 flex items-center gap-1.5 text-sm font-bold transition hover:bg-[color:var(--soft-hover)]"
              style={{ borderColor: gradFrom, color: gradFrom }}>
              <ChevronLeft size={18} /> Back
            </button>
          )}
          <button type="button" onClick={handleNext} disabled={submitting}
            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, boxShadow: `0 4px 18px ${gradFrom}44` }}>
            {submitting
              ? <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : isLast
                ? <><Check size={20} /> Complete Registration</>
                : <>Continue <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
