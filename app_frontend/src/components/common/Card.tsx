import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "app-card border border-[color:var(--border)] p-4 text-[color:var(--text-secondary)]",
      className,
    )}
    {...props}
  />
);
