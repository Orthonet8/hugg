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
  const [touched, setTouched] = useState(false);
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const showRequiredError = Boolean(props.required && touched && !String(props.value ?? "").trim());
  const { onChange, onBlur, ...inputProps } = props;

  return (
    <div className={clsx("registration-field space-y-1", className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          "block text-xs font-semibold transition-colors duration-200",
          focused ? "text-(--primary)" : "text-(--text-secondary)"
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          setFocused(false);
          setTouched(true);
          onBlur?.(event);
        }}
        onChange={(event) => {
          setTouched(true);
          onChange?.(event);
        }}
        aria-invalid={showRequiredError}
        className={clsx(
          "app-input w-full rounded-[0.75rem] px-3 py-2.5 text-sm transition-all duration-200",
          "focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--surface)",
          "focus:border-(--primary)",
          showRequiredError && "registration-field-error"
        )}
        {...inputProps}
      />
      {showRequiredError ? <p className="registration-validation-message">Required</p> : null}
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
  const [touched, setTouched] = useState(false);
  const selectId = id || `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const showRequiredError = Boolean(props.required && touched && !String(props.value ?? "").trim());
  const { onChange, onBlur, ...selectProps } = props;

  return (
    <div className={clsx("registration-field space-y-1", className)}>
      <label
        htmlFor={selectId}
        className={clsx(
          "block text-xs font-semibold transition-colors duration-200",
          focused ? "text-(--primary)" : "text-(--text-secondary)"
        )}
      >
        {label}
      </label>
      <select
        id={selectId}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          setFocused(false);
          setTouched(true);
          onBlur?.(event);
        }}
        onChange={(event) => {
          setTouched(true);
          onChange?.(event);
        }}
        aria-invalid={showRequiredError}
        className={clsx(
          "app-input w-full rounded-[0.75rem] px-3 py-2.5 text-sm transition-all duration-200",
          "focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--surface)",
          "focus:border-(--primary)",
          showRequiredError && "registration-field-error"
        )}
        {...selectProps}
      >
        {children}
      </select>
      {showRequiredError ? <p className="registration-validation-message">Required</p> : null}
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
    <div className={clsx("registration-section-card space-y-2.5", className)}>
      <div className="registration-section-heading">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-primary)">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-relaxed text-(--text-muted)">{subtitle}</p>
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
    <div className={clsx("space-y-2", className)}>
      {label && (
        <label className="block text-xs font-semibold text-(--text-secondary)">
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
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              "data-[active=true]:bg-(--primary) data-[active=true]:text-(--on-primary) data-[active=true]:border-(--primary) data-[active=true]:shadow-md data-[active=true]:scale-105",
              "data-[active=false]:border-(--border-strong) data-[active=false]:bg-(--surface) data-[active=false]:text-(--text-muted) data-[active=false]:hover:bg-(--soft-hover) data-[active=false]:hover:scale-102",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
