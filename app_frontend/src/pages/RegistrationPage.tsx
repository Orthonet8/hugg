import { useEffect, useMemo, useState } from "react";
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

  const [form, setForm] = useState<RegistrationForm>({ ...initialForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    if (!user) {
      return;
    }

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

  const slide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[slide?.id];
  const [gradFrom, gradTo] = REGISTRATION_GRADIENT;
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
    <div className="registration-shell" style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}>
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col lg:px-6 lg:py-6">

        <div className="flex items-center justify-between px-5 pt-12 pb-3 lg:px-8 lg:pt-5">
          <button type="button" onClick={handleBack}
            className="h-10 w-10 rounded-full bg-white/16 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/28 transition">
            <ChevronLeft size={20} />
          </button>

          <div className="hidden rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 lg:block">
            Member registration
          </div>

          <div className="flex items-center gap-1.5">
            {registrationSlides.map((_, i) => (
              <motion.div key={i}
                animate={{ width: i === currentIndex ? 24 : 8, opacity: i <= currentIndex ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full bg-white" />
            ))}
          </div>

          <button type="button" onClick={() => navigate("/news")}
            className="flex items-center gap-1 text-xs font-semibold text-white/75 hover:text-white transition">
            <LogOut size={14} /> Exit
          </button>
        </div>

        <div className="px-6 pt-3 pb-7 text-white lg:px-8">
          <motion.p key={`step-${currentIndex}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
            Step {slide.step} of {registrationSlides.length}
          </motion.p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.h1 key={`h-${slide.id}`} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32 }}
                className="app-heading text-[1.8rem] font-bold leading-tight lg:text-[2.25rem]">
                {slide.title}
              </motion.h1>
              <motion.p key={`s-${slide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="mt-2 max-w-xl text-sm leading-relaxed text-white/72">
                {SUBTITLES[slide.id]}
              </motion.p>
            </div>
            <div className="rounded-[1.25rem] border border-white/16 bg-white/10 px-4 py-3 backdrop-blur-sm lg:min-w-[240px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Progress</p>
              <p className="mt-1 text-lg font-semibold text-white">{slide.progress}% complete</p>
              <p className="mt-1 text-xs leading-relaxed text-white/68">Finish this profile once and your account is ready for the app.</p>
            </div>
          </div>
        </div>

        <div className="registration-sheet flex flex-1 flex-col overflow-hidden rounded-t-[2rem] min-h-0 lg:rounded-[2rem] lg:shadow-[0_32px_80px_rgba(32,0,8,0.24)]">

          <div className="h-1 bg-(--surface-soft) shrink-0">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
              animate={{ width: `${slide.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={slide.id}
                initial={{ x: dir * 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir * -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 34 }}
                className="px-6 pt-6 pb-4 lg:px-8 lg:pt-7">

                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    ⚠ {error}
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

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-6 rounded-[1.4rem] border border-(--border) bg-(--surface-soft) px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">
                    Progress Note
                  </p>
                  <p className="mt-1 text-sm text-(--text-secondary)">
                    Complete this step to continue. Your information is saved when you finish registration.
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="shrink-0 border-t border-(--border) bg-(--surface) px-6 py-5 lg:px-8">
            <div className="flex items-center gap-3">
              {currentIndex > 0 && (
                <button type="button" onClick={handleBack}
                  className="h-14 px-5 rounded-[1.15rem] border-2 flex items-center gap-1.5 text-sm font-bold transition hover:bg-(--soft-hover)"
                  style={{ borderColor: gradFrom, color: gradFrom }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button type="button" onClick={handleNext} disabled={submitting}
                className="flex-1 h-14 rounded-[1.15rem] flex items-center justify-center gap-2 text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, boxShadow: `0 10px 28px ${gradFrom}44` }}>
                {submitting
                  ? <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : isLast
                    ? <><Check size={20} /> Complete Registration</>
                    : <>Continue <ChevronRight size={20} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
