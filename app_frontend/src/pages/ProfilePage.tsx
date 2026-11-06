import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  BookOpen,
  ClipboardList,
  MapPin,
  ShieldAlert,
  Church,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAuthStore } from "../context/useAuthStore";
import { useI18n } from "../i18n/I18nProvider";

export const ProfilePage = () => {
  const { user, logout, updateCredentials } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showRegistrationPreview, setShowRegistrationPreview] = useState(false);
  const [showCredentialEditor, setShowCredentialEditor] = useState(false);
  const [credentialUsername, setCredentialUsername] = useState("");
  const [credentialPassword, setCredentialPassword] = useState("");
  const [credentialConfirmation, setCredentialConfirmation] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const [savingCredentials, setSavingCredentials] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
        title: "Personal Information",
        icon: User,
        items: [
          ["Campus", user.campus],
          ["Dorm", user.dorm],
          ["Field of study", user.fieldOfStudy],
          ["Phone", user.phone],
          ["Email", user.emailOrUsername || user.email],
          ["Telegram", user.telegram],
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
          ["Section", user.section?.name],
          ["Previous participation", user.previousParticipation],
          ["Local church", user.localChurch],
          ["Ordination", user.ordination],
          ["Ordination year", user.ordinationYear],
          ["Diocese", user.diocese],
          ["Bishop", user.bishop],
        ],
      },
      {
        title: "Skills & Services",
        icon: Sparkles,
        items: [
          ["Departments", user.services?.join(", ")],
          ["Talents", user.talents?.join(", ")],
          ["Talent detail", user.talentDescription],
        ],
      },
      {
        title: "Emergency & account",
        icon: ShieldAlert,
        items: [
          ["Parent phone", user.parentPhone],
          ["Emergency contacts", user.emergencyContacts],
          ["Account number", user.accountNumber],
          ["Account holder", user.accountName],
          ["Account type", user.accountType],
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

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--primary)]">
              <LockKeyhole size={17} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[color:var(--text-primary)]">Login details</h3>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">Update your username or password.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => {
            setCredentialUsername(user.emailOrUsername || "");
            setCredentialPassword("");
            setCredentialConfirmation("");
            setCredentialError("");
            setShowCredentialEditor((value) => !value);
          }}>
            {showCredentialEditor ? "Cancel" : "Edit Login"}
          </Button>
        </div>

        {showCredentialEditor && (
          <form
            className="mt-4 grid gap-3 sm:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setCredentialError("");
              if (!credentialUsername.trim()) {
                setCredentialError("Username or email is required.");
                return;
              }
              if (credentialPassword && credentialPassword.length < 8) {
                setCredentialError("Password must be at least 8 characters.");
                return;
              }
              if (credentialPassword !== credentialConfirmation) {
                setCredentialError("Passwords do not match.");
                return;
              }
              setSavingCredentials(true);
              try {
                await updateCredentials(credentialUsername.trim(), credentialPassword, credentialConfirmation);
                setCredentialPassword("");
                setCredentialConfirmation("");
                setShowCredentialEditor(false);
              } catch (error) {
                setCredentialError(error instanceof Error ? error.message : "Unable to update login details.");
              } finally {
                setSavingCredentials(false);
              }
            }}
          >
            <label className="text-xs font-semibold text-[color:var(--text-secondary)]">
              Username or email
              <input
                className="app-input mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
                value={credentialUsername}
                onChange={(event) => setCredentialUsername(event.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)]">
              New password
              <input
                type="password"
                className="app-input mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
                value={credentialPassword}
                onChange={(event) => setCredentialPassword(event.target.value)}
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
              />
            </label>
            <label className="text-xs font-semibold text-[color:var(--text-secondary)] sm:col-start-2">
              Confirm new password
              <input
                type="password"
                className="app-input mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
                value={credentialConfirmation}
                onChange={(event) => setCredentialConfirmation(event.target.value)}
                autoComplete="new-password"
              />
            </label>
            {credentialError && <p className="text-xs font-semibold text-[color:var(--danger-text)] sm:col-span-2">{credentialError}</p>}
            <div className="sm:col-span-2 sm:flex sm:justify-end">
              <Button type="submit" variant="primary" disabled={savingCredentials}>
                {savingCredentials ? "Saving..." : "Save Login Details"}
              </Button>
            </div>
          </form>
        )}
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
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {registrationSections.map((section) => {
              const visibleItems = section.items.filter(([, value]) => Boolean(value));

              if (visibleItems.length === 0) return null;

              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 shadow-sm"
                >
                <div className="mb-3 flex items-center gap-2 border-b border-[color:var(--border)] pb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--primary)] text-[color:var(--on-primary)]">
                    <section.icon size={14} />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-primary)]">
                    {section.title}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {visibleItems.map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5"
                    >
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
                        {label}
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold leading-snug text-[color:var(--text-primary)]">
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

        {/* Help */}
        <button
          type="button"
          onClick={() => navigate("/support")}
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
