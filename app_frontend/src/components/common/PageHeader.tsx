import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="app-heading text-xl sm:text-2xl font-bold tracking-tight text-[color:var(--text-primary)] break-words">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-xs sm:text-sm text-[color:var(--text-muted)] break-words line-clamp-2">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
        {/* Mobile controls for Language & Theme (visible below lg screen size) */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {action}

        {!hideNotification ? (
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-[0_8px_20px_rgba(57,0,7,0.12)] transition hover:bg-[color:var(--surface-soft)] active:scale-95"
            aria-label="ማስታወቂያዎች"
          >
            <Bell size={18} />
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
