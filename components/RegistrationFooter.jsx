import React from "react";

export default function RegistrationFooter({
  isFirst,
  isLast,
  onBack,
  onNext,
  onExit,
  submitting,
}) {
  return (
    <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onExit}
        className="order-3 text-sm font-medium text-slate-500 transition hover:text-primary sm:order-1"
      >
        Exit Registration
      </button>
      <div className="order-1 flex gap-3 sm:order-2">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-full border border-primary/40 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5 sm:w-auto"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isLast ? (submitting ? "Submitting..." : "Finish") : "Continue"}
        </button>
      </div>
    </footer>
  );
}
