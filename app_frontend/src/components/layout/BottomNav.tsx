import clsx from "clsx";
import { CalendarDays, Newspaper, UserCircle2, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/news", label: "ዜና", icon: Newspaper },
  { to: "/calendar", label: "ቀን መቁጠሪያ", icon: CalendarDays },
  { to: "/family", label: "ቤተሰብ", icon: UsersRound },
  { to: "/profile", label: "መገለጫ", icon: UserCircle2 },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md px-4 pb-4 md:max-w-2xl md:px-8 lg:max-w-4xl">
    <div className="rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--glass)] p-2 shadow-[0_20px_40px_rgba(57,0,7,0.28)] backdrop-blur">
      <ul className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "relative flex min-h-[60px] flex-col items-center justify-center rounded-2xl px-2 text-[11px] font-semibold transition",
                  isActive
                    ? "bg-[color:var(--nav-active)] text-[color:var(--primary)]"
                    : "text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="mt-1 line-clamp-1">{item.label}</span>
                  {isActive ? (
                    <span className="absolute -bottom-[3px] h-1.5 w-8 rounded-full bg-[color:var(--accent)]" />
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);
