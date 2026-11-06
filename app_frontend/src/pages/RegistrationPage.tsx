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
import { SlideEmergencyContact } from "../components/registration/SlideEmergencyContact";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";

const slideMap: Record<string, React.ComponentType<{ form: RegistrationForm; setForm: React.Dispatch<React.SetStateAction<RegistrationForm>> }>> = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
  "emergency-contact": SlideEmergencyContact,
};

/* Keep one brand gradient across all steps for a consistent experience. */
const REGISTRATION_GRADIENT: [string, string] = ["#5f0113", "#8d1b32"];

/* Stitch slide subtitles */
const SUBTITLES: Record<string, string> = {
  "basic-info": "Start with your identity and personal details.",
  "campus-academics": "Add your academic and campus information.",
  "background-participation": "Share your background and church participation.",
  "skills-service": "Select your ministry interests and talents.",
  "contact-social": "Finalize your contact information.",
  "emergency-contact": "Add emergency contacts and your preferred account details.",
};

export interface RegistrationForm {
  fullName: string; christianName: string; gender: string; age: string;
  campus: string; fieldOfStudy: string; dorm: string;
  region: string; zone: string; woreda: string; nativeLanguage: string; extraLanguages: string;
  previousParticipation: string; localChurch: string;
  ordination: string; ordinationYear: string; diocese: string; bishop: string;
  serviceDepartments: string[]; talents: string[]; talentDescription: string;
  mobile: string; emailOrUsername: string; telegram: string;
  parentPhone: string; emergencyContacts: string; accountNumber: string; accountName: string; accountType: string;
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
  parentPhone: "", emergencyContacts: "", accountNumber: "", accountName: "", accountType: "",
  profilePhotoFile: null,
  profilePhotoPreview: "",
};

const validators: Record<string, (f: RegistrationForm) => boolean> = {
  "basic-info": (f) => !!(f.fullName && f.gender && f.age),
  "campus-academics": (f) => !!(f.campus && f.fieldOfStudy),
  "background-participation": (f) => !!(f.region && f.previousParticipation),
  "skills-service": (f) => f.serviceDepartments.length > 0 || f.talents.length > 0,
  "contact-social": () => true,
  "emergency-contact": () => true,
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
      parentPhone: prev.parentPhone || ((user as { parentPhone?: string }).parentPhone ?? ""),
      emergencyContacts: prev.emergencyContacts || ((user as { emergencyContacts?: string }).emergencyContacts ?? ""),
      accountNumber: prev.accountNumber || ((user as { accountNumber?: string }).accountNumber ?? ""),
      accountName: prev.accountName || ((user as { accountName?: string }).accountName ?? ""),
      accountType: prev.accountType || ((user as { accountType?: string }).accountType ?? ""),
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
    <div className="registration-shell">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-3 py-3 sm:px-5 lg:py-5">

        <div className="registration-topbar flex items-center justify-between px-2 py-1 sm:px-3">
          <button type="button" onClick={handleBack}
            className="registration-icon-button">
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--text-muted)">Profile setup</p>
            <p className="mt-0.5 text-xs font-semibold text-(--text-primary)">Step {slide.step} of {registrationSlides.length}</p>
          </div>

          <div className="flex items-center gap-1">
            <div className="registration-control">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button type="button" onClick={() => navigate("/news")}
              className="registration-exit-button">
              <LogOut size={14} /> <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        <div className="px-2 pt-5 pb-4 sm:px-3">
          <div className="flex flex-col gap-2">
            <div>
              <motion.h1 key={`h-${slide.id}`} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32 }}
                className="app-heading text-lg font-bold leading-tight text-(--text-primary) sm:text-xl">
                {slide.title}
              </motion.h1>
              <motion.p key={`s-${slide.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="mt-1 max-w-2xl text-xs leading-relaxed text-(--text-muted) sm:text-sm">
                {SUBTITLES[slide.id]}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="registration-sheet flex flex-col rounded-2xl">

          <div className="registration-progress-track">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
              animate={{ width: `${slide.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>

          <div>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`registration-step-content px-4 py-4 sm:px-6 sm:py-5 ${slide.id === "basic-info" ? "registration-basic-step" : ""}`}>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="app-alert-error mb-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    ⚠ {error}
                  </motion.div>
                )}

                <div className="registration-form-column">
                  {SlideComponent && <SlideComponent form={form} setForm={setForm} />}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-(--border) bg-(--surface) px-5 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              {currentIndex > 0 && (
                <button type="button" onClick={handleBack}
                  className="h-11 px-4 rounded-[1rem] border-2 flex items-center gap-1.5 text-sm font-bold transition hover:bg-(--soft-hover)"
                  style={{ borderColor: gradFrom, color: gradFrom }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button type="button" onClick={handleNext} disabled={submitting}
                className="flex-1 h-11 rounded-[1rem] flex items-center justify-center gap-2 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
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
