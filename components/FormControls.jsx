import React from "react";

export function InputField({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        {...props}
        className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      >
        {children}
      </select>
    </label>
  );
}

export function OptionPills({ value, options, onChange, multi = false }) {
  const handleClick = (option) => {
    if (!multi) {
      onChange(option);
      return;
    }

    const set = new Set(value || []);
    if (set.has(option)) {
      set.delete(option);
    } else {
      set.add(option);
    }
    onChange([...set]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = multi ? (value || []).includes(option) : value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleClick(option)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-primary text-white shadow-md"
                : "bg-white text-primary ring-1 ring-primary/30 hover:bg-primary/5"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
