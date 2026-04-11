import React from "react";

export default function RegistrationHeader({ step, totalSteps, title, subtitle, progress }) {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Step {step.toString().padStart(2, "0")} / {totalSteps.toString().padStart(2, "0")}
        </p>
        <p className="text-sm font-semibold text-primary">{progress}%</p>
      </div>

      {/* Progress bar uses accent color to mirror Stitch visual hierarchy */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-primary sm:text-2xl md:text-3xl">{title}</h1>
        <p className="text-sm text-slate-600 md:text-base">{subtitle}</p>
      </div>
    </header>
  );
}
