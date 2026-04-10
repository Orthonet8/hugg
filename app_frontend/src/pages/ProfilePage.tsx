import { HelpCircle, Info, LogOut, Pencil, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { users } from "../data";

const settingGroups = {
  account: [{ label: "መገለጫ አርትዕ", icon: Pencil }],
  support: [
    { label: "እገዛ እና ድጋፍ", icon: HelpCircle },
    { label: "ስለ መተግበሪያው", icon: Info },
    { label: "ውሎች እና ፖሊሲዎች", icon: Info },
  ],
  actions: [
    { label: "ችግኝ ሪፖርት አድርግ", icon: ShieldAlert },
    { label: "ውጣ", icon: LogOut },
  ],
};

export const ProfilePage = () => {
  const [profile, setProfile] = useState(users[0]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="space-y-4">
      <PageHeader
        title="መገለጫ"
        subtitle="የግል መረጃ እና ቅንብሮች"
        action={
          <Button
            variant={isEditing ? "accent" : "outline"}
            size="sm"
            onClick={() => setIsEditing((previous) => !previous)}
          >
            {isEditing ? "አስቀምጥ" : "አርትዕ"}
          </Button>
        }
      />

      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <img
            src={profile.avatar}
            alt={profile.fullName}
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div>
            <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
              {profile.fullName}
            </h2>
            <p className="text-sm text-[color:var(--text-muted)]">
              የክርስትና ስም: {profile.christianName}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[color:var(--primary)]">
              ሙሉ ስም
              <input
                className="app-input mt-1 h-11 w-full rounded-xl px-3"
                value={profile.fullName}
                onChange={(event) =>
                  setProfile((previous) => ({
                    ...previous,
                    fullName: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm font-semibold text-[color:var(--primary)]">
              የክርስትና ስም
              <input
                className="app-input mt-1 h-11 w-full rounded-xl px-3"
                value={profile.christianName}
                onChange={(event) =>
                  setProfile((previous) => ({
                    ...previous,
                    christianName: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm font-semibold text-[color:var(--primary)]">
              ካምፓስ
              <input
                className="app-input mt-1 h-11 w-full rounded-xl px-3"
                value={profile.campus}
                onChange={(event) =>
                  setProfile((previous) => ({
                    ...previous,
                    campus: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm font-semibold text-[color:var(--primary)]">
              ዶርም
              <input
                className="app-input mt-1 h-11 w-full rounded-xl px-3"
                value={profile.dorm}
                onChange={(event) =>
                  setProfile((previous) => ({
                    ...previous,
                    dorm: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        ) : (
          <div className="grid gap-2 text-sm text-[color:var(--text-secondary)]">
            <p>
              <span className="font-semibold text-[color:var(--primary)]">
                ካምፓስ:
              </span>{" "}
              {profile.campus}
            </p>
            <p>
              <span className="font-semibold text-[color:var(--primary)]">
                ዶርም:
              </span>{" "}
              {profile.dorm}
            </p>
            <p>
              <span className="font-semibold text-[color:var(--primary)]">
                ቋንቋ:
              </span>{" "}
              {profile.languages.join("፣ ")}
            </p>
            <p>
              <span className="font-semibold text-[color:var(--primary)]">
                ተሰጥኦ:
              </span>{" "}
              {profile.talents.join("፣ ")}
            </p>
            <p>
              <span className="font-semibold text-[color:var(--primary)]">
                አገልግሎት:
              </span>{" "}
              {profile.services.join("፣ ")}
            </p>
          </div>
        )}
      </Card>

      <Card className="space-y-4 p-5">
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--text-muted)]">
            አካውንት
          </h3>
          <div className="mt-2 space-y-2">
            {settingGroups.account.map((item) => (
              <button
                type="button"
                key={item.label}
                className="app-subtle-panel flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--primary)]"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon size={16} />
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[color:var(--text-muted)]">
            ድጋፍ
          </h3>
          <div className="mt-2 space-y-2">
            {settingGroups.support.map((item) => (
              <button
                type="button"
                key={item.label}
                className="app-subtle-panel flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--primary)]"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon size={16} />
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[color:var(--text-muted)]">
            እርምጃዎች
          </h3>
          <div className="mt-2 space-y-2">
            {settingGroups.actions.map((item) => (
              <button
                type="button"
                key={item.label}
                className="app-subtle-panel flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--primary)]"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon size={16} />
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="text-sm font-semibold text-[color:var(--text-muted)]">
          መዋጮ
        </h3>
        {profile.donationAccounts.map((account) => (
          <div
            key={`${account.bankName}-${account.accountNumber}`}
            className="rounded-2xl border border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] p-3 text-sm text-[color:var(--text-secondary)]"
          >
            <p className="font-semibold text-[color:var(--primary)]">
              {account.bankName}
            </p>
            <p className="mt-1">የአካውንት ቁጥር: {account.accountNumber}</p>
            <p className="mt-1">ባለቤት: {account.accountHolder}</p>
          </div>
        ))}
      </Card>
    </section>
  );
};
