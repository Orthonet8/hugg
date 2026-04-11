import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import RegistrationHeader from "./RegistrationHeader";
import RegistrationFooter from "./RegistrationFooter";

export default function RegistrationShell({
  slide,
  totalSteps,
  transitionClass,
  children,
  isFirst,
  isLast,
  onBack,
  onNext,
  onExit,
  submitting,
  onTopBack,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f9] via-white to-[#fffdf4] px-4 py-6 sm:px-6 md:px-8 md:py-10">
      {/* Responsive container keeps the flow readable from mobile to desktop */}
      <div
        className={`mx-auto w-full max-w-4xl rounded-3xl bg-white/95 p-5 shadow-[0_14px_60px_rgba(95,1,19,0.12)] backdrop-blur sm:p-7 md:p-10 ${transitionClass}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onTopBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-white text-primary transition hover:bg-primary/5"
            aria-label="Back"
          >
            <FaChevronLeft />
          </button>
          <div className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-dark">HUGGB</div>
        </div>

        <RegistrationHeader
          step={slide.step}
          totalSteps={totalSteps}
          title={slide.title}
          subtitle={slide.subtitle}
          progress={slide.progress}
        />

        <section className="mt-6 space-y-5 md:mt-8">{children}</section>

        <RegistrationFooter
          isFirst={isFirst}
          isLast={isLast}
          onBack={onBack}
          onNext={onNext}
          onExit={onExit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
