import clsx from "clsx";
import type { Department } from "../../types";
import { departmentStyles } from "../../utils/theme";

interface FilterBarProps {
  departments: Department[];
  activeDepartment: string;
  onChange: (department: string) => void;
}

export const FilterBar = ({
  departments,
  activeDepartment,
  onChange,
}: FilterBarProps) => (
  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
    {["ሁሉም", ...departments].map((department) => {
      const departmentStyle =
        department === "ሁሉም"
          ? "data-[active=true]:bg-[color:var(--primary)] data-[active=true]:text-[color:var(--on-primary)]"
          : departmentStyles[department as Department].chip;

      return (
        <button
          type="button"
          key={department}
          onClick={() => onChange(department)}
          data-active={activeDepartment === department}
          className={clsx(
            "shrink-0 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--text-muted)] transition",
            "hover:border-[color:var(--border-strong)] hover:text-[color:var(--primary)]",
            departmentStyle,
          )}
        >
          {department}
        </button>
      );
    })}
  </div>
);
