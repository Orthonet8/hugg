import { useState } from "react";
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
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";
import { localeNames, type Locale } from "../i18n/translations";
import { useThemeMode } from "../hooks/useThemeMode";

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const { t, locale, setLocale } = useI18n();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const [showLangPicker, setShowLangPicker] = useState(false);

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
          <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[color:var(--primary)] bg-[color:var(--surface-soft)] text-2xl font-bold text-[color:var(--primary)]">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={32} />}
          </div>
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
      <Card className="divide-y divide-[color:var(--border)] overflow-hidden rounded-xl p-0">
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

        {/* Language Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangPicker((v) => !v)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--soft-hover)]"
          >
            <Globe size={18} className="text-[color:var(--primary)] shrink-0" />
            <span className="flex-1 text-sm font-semibold text-[color:var(--text-primary)]">
              {t("common.language")}
            </span>
            <span className="text-xs font-medium text-[color:var(--text-muted)]">
              {localeNames[locale]}
            </span>
            <ChevronRight size={16} className="text-[color:var(--border-strong)]" />
          </button>

          {showLangPicker && (
            <div className="absolute right-4 z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl">
              {(["en", "am", "om"] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocale(loc);
                    setShowLangPicker(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[color:var(--soft-hover)] ${
                    loc === locale
                      ? "bg-[color:var(--nav-active)] font-semibold text-[color:var(--primary)]"
                      : "text-[color:var(--text-primary)]"
                  }`}
                >
                  {loc === locale && <Check size={14} />}
                  <span className={loc === locale ? "" : "pl-5"}>{localeNames[loc]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
