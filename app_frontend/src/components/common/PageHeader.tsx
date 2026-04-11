import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  hideNotification?: boolean;
}

export const PageHeader = ({
  title,
  subtitle,
  action,
  hideNotification = false,
}: PageHeaderProps) => {
  const unreadCount = useUnreadNotificationsCount();

  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="app-heading text-2xl font-bold text-[color:var(--text-primary)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        {action}
        {!hideNotification ? (
          <Link
            to="/notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-[0_8px_20px_rgba(57,0,7,0.12)] transition hover:bg-[color:var(--surface-soft)]"
            aria-label="ማስታወቂያዎች"
          >
            <Bell size={20} />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-bold text-[color:var(--on-accent)]">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        ) : null}
      </div>
    </header>
  );
};
