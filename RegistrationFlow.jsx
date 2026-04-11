import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationShell from "./components/RegistrationShell";
import { registrationSlides } from "./data/questions";
import SlideBasicInfo from "./slides/SlideBasicInfo";
import SlideCampusAcademics from "./slides/SlideCampusAcademics";
import SlideBackgroundParticipation from "./slides/SlideBackgroundParticipation";
import SlideSkillsService from "./slides/SlideSkillsService";
import SlideContactSocial from "./slides/SlideContactSocial";

const slideMap = {
  "basic-info": SlideBasicInfo,
  "campus-academics": SlideCampusAcademics,
  "background-participation": SlideBackgroundParticipation,
  "skills-service": SlideSkillsService,
  "contact-social": SlideContactSocial,
};

const initialForm = {
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

export default function RegistrationFlow() {
  const navigate = useNavigate();
  const { stepId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [transitionDirection, setTransitionDirection] = useState("forward");

  const currentIndex = useMemo(() => {
    if (!stepId) return 0;
    const idx = registrationSlides.findIndex((slide) => slide.id === stepId);
    return idx >= 0 ? idx : 0;
  }, [stepId]);

  const currentSlide = registrationSlides[currentIndex];
  const SlideComponent = slideMap[currentSlide.id];

  const validators = {
    "basic-info": () => form.fullName && form.christianName && form.gender && form.age,
    "campus-academics": () => form.campus && form.fieldOfStudy,
    "background-participation": () => form.region && form.previousParticipation,
    "skills-service": () => form.serviceDepartments.length > 0 || form.talents.length > 0,
    "contact-social": () => form.mobile && form.email,
  };

  const goToIndex = (targetIndex) => {
    const target = registrationSlides[targetIndex];
    if (!target) return;
    navigate(`/register/${target.id}`);
  };

  const handleNext = async () => {
    const isValid = validators[currentSlide.id]?.();
    if (!isValid) {
      setError("እባክዎ ከመቀጠልዎ በፊት አስፈላጊ መረጃዎችን ያስገቡ።");
      return;
    }
    setError("");

    if (currentIndex === registrationSlides.length - 1) {
      setSubmitting(true);
      // Replace with API integration later. Keeping mocked submit for now.
      setTimeout(() => {
        setSubmitting(false);
        navigate("/login");
      }, 900);
      return;
    }

    setTransitionDirection("forward");
    goToIndex(currentIndex + 1);
  };

  const handleBack = () => {
    setTransitionDirection("backward");
    goToIndex(currentIndex - 1);
  };

  const handleExit = () => navigate("/signup");

  return (
    <RegistrationShell
      slide={currentSlide}
      totalSteps={registrationSlides.length}
      transitionClass={transitionDirection === "forward" ? "slide-in-right" : "slide-in-left"}
      isFirst={currentIndex === 0}
      isLast={currentIndex === registrationSlides.length - 1}
      onBack={handleBack}
      onNext={handleNext}
      onExit={handleExit}
      onTopBack={currentIndex === 0 ? handleExit : handleBack}
      submitting={submitting}
    >
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      <SlideComponent form={form} setForm={setForm} />
    </RegistrationShell>
  );
}
