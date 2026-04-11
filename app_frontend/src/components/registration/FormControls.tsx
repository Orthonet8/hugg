import clsx from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

/* ------------------------------------------------------------------ */
/*  InputField                                                         */
/* ------------------------------------------------------------------ */

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = ({ label, className, id, ...props }: InputFieldProps) => {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={clsx("space-y-1", className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-[color:var(--text-secondary)]">
        {label}
      </label>
      <input
        id={inputId}
        className="app-input w-full rounded-xl px-4 py-3 text-sm"
        {...props}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  SelectField                                                        */
/* ------------------------------------------------------------------ */

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const SelectField = ({ label, className, id, children, ...props }: SelectFieldProps) => {
  const selectId = id || `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={clsx("space-y-1", className)}>
      <label htmlFor={selectId} className="block text-sm font-medium text-[color:var(--text-secondary)]">
        {label}
      </label>
      <select
        id={selectId}
        className="app-input w-full rounded-xl px-4 py-3 text-sm"
        {...props}
      >
        {children}
      </select>
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
        <label className="block text-sm font-medium text-[color:var(--text-secondary)]">
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
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              "data-[active=true]:bg-[color:var(--primary)] data-[active=true]:text-[color:var(--on-primary)] data-[active=true]:border-[color:var(--primary)]",
              "data-[active=false]:border-[color:var(--border-strong)] data-[active=false]:text-[color:var(--text-muted)] data-[active=false]:hover:bg-[color:var(--soft-hover)]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
