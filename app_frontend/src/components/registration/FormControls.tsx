import clsx from "clsx";
import { useState } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  InputField                                                         */
/* ------------------------------------------------------------------ */

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const InputField = ({ label, helperText, className, id, ...props }: InputFieldProps) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={clsx("space-y-1.5", className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          "block text-sm font-medium transition-colors duration-200",
          focused ? "text-(--primary)" : "text-(--text-secondary)"
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={clsx(
          "app-input w-full rounded-xl px-4 py-3 text-sm transition-all duration-200",
          "focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--surface)",
          "focus:border-(--primary)"
        )}
        {...props}
      />
      {helperText ? (
        <p className="text-xs text-(--text-muted)">{helperText}</p>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  SelectField                                                        */
/* ------------------------------------------------------------------ */

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
  children: React.ReactNode;
}

export const SelectField = ({ label, helperText, className, id, children, ...props }: SelectFieldProps) => {
  const [focused, setFocused] = useState(false);
  const selectId = id || `select-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={clsx("space-y-1.5", className)}>
      <label
        htmlFor={selectId}
        className={clsx(
          "block text-sm font-medium transition-colors duration-200",
          focused ? "text-(--primary)" : "text-(--text-secondary)"
        )}
      >
        {label}
      </label>
      <select
        id={selectId}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={clsx(
          "app-input w-full rounded-xl px-4 py-3 text-sm transition-all duration-200",
          "focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--surface)",
          "focus:border-(--primary)"
        )}
        {...props}
      >
        {children}
      </select>
      {helperText ? (
        <p className="text-xs text-(--text-muted)">{helperText}</p>
      ) : null}
    </div>
  );
};

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, subtitle, children, className }: SectionCardProps) => {
  return (
    <div className={clsx("rounded-2xl border border-(--border) bg-(--surface-soft) p-4 space-y-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-(--text-primary)">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-(--text-muted)">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  OptionPills                                                        */
/* ------------------------------------------------------------------ */

interface OptionPillsProps {
  label?: string;
  value: string | string[];
  options: string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
  className?: string;
}

export const OptionPills = ({ label, value, options, onChange, multi = false, className }: OptionPillsProps) => {
  const handleToggle = (option: string) => {
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      onChange(next);
    } else {
      onChange(value === option ? "" : option);
    }
  };

  const isSelected = (option: string) =>
    multi ? (Array.isArray(value) && value.includes(option)) : value === option;

  return (
    <div className={clsx("space-y-2.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-(--text-secondary)">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            data-active={isSelected(option)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              "data-[active=true]:bg-(--primary) data-[active=true]:text-(--on-primary) data-[active=true]:border-(--primary) data-[active=true]:shadow-md data-[active=true]:scale-105",
              "data-[active=false]:border-(--border-strong) data-[active=false]:text-(--text-muted) data-[active=false]:hover:bg-(--soft-hover) data-[active=false]:hover:scale-102",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
