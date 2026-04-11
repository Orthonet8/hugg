import clsx from "clsx";
import { CalendarDays, Newspaper, UserCircle2, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

export const SideNav = () => {
  const { t } = useI18n();

  const navItems = [
    { to: "/news", label: t("nav.news"), icon: Newspaper },
    { to: "/calendar", label: t("nav.calendar"), icon: CalendarDays },
    { to: "/family", label: t("nav.family"), icon: UsersRound },
    { to: "/profile", label: t("nav.profile"), icon: UserCircle2 },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-2 w-56 shrink-0 sticky top-8 self-start">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "bg-[color:var(--nav-active)] text-[color:var(--primary)]"
                : "text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
};
