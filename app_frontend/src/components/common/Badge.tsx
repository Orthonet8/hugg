import clsx from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      className,
    )}
  >
    {children}
  </span>
);
