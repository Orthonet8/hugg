import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  Home,
  Phone,
  Send,
  Music,
  Heart,
  Globe,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Moon,
  Sun,
  BookOpen,
  ClipboardList,
  MapPin,
  ShieldAlert,
  Church,
  Sparkles,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";
import { useThemeMode } from "../hooks/useThemeMode";

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const { t } = useI18n();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const [showRegistrationPreview, setShowRegistrationPreview] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const departments = [
    ...(user.services || []).map((s) => ({ label: s, icon: Heart, accent: true })),
    ...(user.talents || []).map((t) => ({ label: t, icon: Music, accent: true })),
    ...(user.languages || []).map((l) => ({ label: l, icon: Globe, accent: false })),
  ];

  const profileComplete = Boolean(user.christianName && user.campus);

  const registrationSections = useMemo(
    () => [
      {
        title: "Identity",
        icon: User,
        items: [
          ["Full name", user.fullName],
          ["Christian name", user.christianName],
          ["Gender", user.gender],
          ["Age", user.age],
        ],
      },
      {
        title: "Campus",
        icon: GraduationCap,
        items: [
          ["Campus", user.campus],
          ["Field of study", user.fieldOfStudy],
          ["Dorm", user.dorm],
        ],
      },
      {
        title: "Background",
        icon: MapPin,
        items: [
          ["Region", user.region],
          ["Zone", user.zone],
          ["Woreda", user.woreda],
          ["Languages", user.languages?.join(", ")],
        ],
      },
      {
        title: "Church",
        icon: Church,
        items: [
          ["Previous participation", user.previousParticipation],
          ["Local church", user.localChurch],
          ["Ordination", user.ordination],
          ["Ordination year", user.ordinationYear],
          ["Diocese", user.diocese],
          ["Bishop", user.bishop],
        ],
      },
      {
        title: "Service",
        icon: Sparkles,
        items: [
          ["Departments", user.services?.join(", ")],
          ["Talents", user.talents?.join(", ")],
          ["Talent detail", user.talentDescription],
        ],
      },
      {
        title: "Contact",
        icon: Send,
        items: [
          ["Phone", user.phone],
          ["Telegram", user.telegram],
          ["Email / Username", user.emailOrUsername || user.email],
        ],
      },
    ],
    [user],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="app-heading text-2xl font-bold text-[color:var(--text-primary)]">
            {t("profile.title")}
          </h1>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6 text-center">
        <div className="relative mx-auto mb-4 h-24 w-24">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-full w-full rounded-full border-4 border-[color:var(--primary)] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[color:var(--primary)] bg-[color:var(--surface-soft)] text-2xl font-bold text-[color:var(--primary)]">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={32} />}
            </div>
          )}
        </div>
        <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
          {user.fullName || "—"}
        </h2>
        {user.christianName && (
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {user.christianName}
          </p>
        )}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-strong)] px-3 py-1">
          <Check size={12} className="text-[color:var(--accent)]" />
          <span className="text-xs font-semibold text-[color:var(--text-secondary)]">
            {t("profile.memberBadge")}
          </span>
        </div>
      </Card>

      {!profileComplete && (
        <Card className="overflow-hidden p-0">
          <div className="bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[color:var(--primary)] text-[color:var(--on-primary)] shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[color:var(--text-primary)]">Finish your fellowship registration</p>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
                  Your account is active, but some church and campus details are still missing. Complete them to finish your member profile.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <Button className="flex-1" variant="primary" onClick={() => navigate("/register/basic-info")}>
              <ClipboardList size={16} />
              Finish Registration
            </Button>
            <Button className="flex-1" variant="outline" onClick={() => setShowRegistrationPreview((value) => !value)}>
              <BookOpen size={16} />
              {showRegistrationPreview ? "Hide Preview" : "Preview Details"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
              Registration Details
            </h3>
            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
              Preview the information saved from your fellowship registration flow.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowRegistrationPreview((value) => !value)}>
            <BookOpen size={16} />
            {showRegistrationPreview ? "Hide Details" : "Show Details"}
          </Button>
        </div>

        {showRegistrationPreview && (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {registrationSections.map((section) => {
              const visibleItems = section.items.filter(([, value]) => Boolean(value));

              if (visibleItems.length === 0) return null;

              return (
                <div
                  key={section.title}
                  className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <section.icon size={16} className="text-[color:var(--primary)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--text-primary)]">
                      {section.title}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {visibleItems.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[1rem] bg-[color:var(--surface)] px-3 py-2.5"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Personal Info */}
      <Card className="divide-y divide-[color:var(--border)] overflow-hidden rounded-xl p-0">
        <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
          {t("profile.personalInfo")}
        </div>
        {user.campus && (
          <div className="flex items-center gap-3 px-4 py-3">
            <GraduationCap size={18} className="text-[color:var(--primary)] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                {t("profile.campus")}
              </p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {user.campus}
              </p>
            </div>
          </div>
        )}
        {user.dorm && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Home size={18} className="text-[color:var(--primary)] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                {t("profile.dorm")}
              </p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {user.dorm}
              </p>
            </div>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone size={18} className="text-[color:var(--primary)] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                {t("profile.phone")}
              </p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {user.phone}
              </p>
            </div>
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Send size={18} className="text-[color:var(--primary)] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                Email
              </p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {user.email}
              </p>
            </div>
          </div>
        )}
        {user.telegram && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Send size={18} className="text-[color:var(--primary)] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-[color:var(--text-muted)]">
                {t("profile.telegram")}
              </p>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {user.telegram}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Skills & Services */}
      {departments.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
            {t("profile.skillsServices")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  dept.accent
                    ? "bg-[color:var(--accent)] text-[color:var(--on-accent)]"
                    : "border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text-primary)]"
                }`}
              >
                <dept.icon size={12} />
                {dept.label}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Donation Accounts */}
      {user.donationAccounts && user.donationAccounts.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
            {t("profile.donationAccounts")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {user.donationAccounts.map((acc, i) => (
              <Card key={i} className="p-3">
                <p className="text-[10px] text-[color:var(--text-muted)]">{acc.bankName}</p>
                <p className="text-sm font-bold text-[color:var(--text-primary)]">
                  {acc.accountNumber}
                </p>
                <p className="text-[10px] text-[color:var(--text-secondary)]">
                  {acc.accountHolder}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* App Settings */}
      <Card className="divide-y divide-[color:var(--border)] rounded-xl p-0">
        <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
          {t("profile.appSettings")}
        </div>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
        >
          <Bell size={18} className="text-[color:var(--primary)] shrink-0" />
          <span className="flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
            {t("common.notifications")}
          </span>
          <ChevronRight size={16} className="text-[color:var(--border-strong)]" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleMode}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
        >
          {mode === "dark" ? (
            <Sun size={18} className="text-[color:var(--accent)] shrink-0" />
          ) : (
            <Moon size={18} className="text-[color:var(--primary)] shrink-0" />
          )}
          <span className="flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
            {t("common.theme")}
          </span>
          <span className="text-xs font-medium text-[color:var(--text-muted)]">
            {mode === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        {/* Help */}
        <button
          type="button"
          onClick={() => alert("Help & Support — coming soon")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
        >
          <HelpCircle size={18} className="text-[color:var(--primary)] shrink-0" />
          <span className="flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
            {t("common.help")}
          </span>
          <ChevronRight size={16} className="text-[color:var(--border-strong)]" />
        </button>
      </Card>

      {/* Logout */}
      <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
        <LogOut size={16} />
        {t("common.logout")}
      </Button>
    </div>
  );
};
