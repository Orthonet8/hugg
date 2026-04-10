import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "accent" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-hover)] active:bg-[color:var(--primary-active)] focus-visible:ring-[color:var(--ring)]",
  accent:
    "bg-[color:var(--accent)] text-[color:var(--on-accent)] hover:bg-[color:var(--accent-hover)] active:bg-[color:var(--accent-active)] focus-visible:ring-[color:var(--ring)]",
  ghost:
    "bg-transparent text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:bg-[color:var(--soft-active)] focus-visible:ring-[color:var(--ring)]",
  outline:
    "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:bg-[color:var(--soft-active)] focus-visible:ring-[color:var(--ring)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[color:var(--surface)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  />
);
