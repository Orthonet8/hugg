import { useEffect, useState } from "react";
import { Badge } from "../components/common/Badge";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { useI18n } from "../i18n/I18nProvider";

interface FamilyApiData {
  id: number;
  familyName: string;
  members: Array<{
    id: number;
    fullName: string;
    role: string;
    avatar: string;
    email: string;
    phone: string;
  }>;
  father: { fullName: string; avatar: string } | null;
  mother: { fullName: string; avatar: string } | null;
  children: Array<{ fullName: string; avatar: string }>;
  memberCount: number;
}

export const FamilyPage = () => {
  const { t } = useI18n();
  const [families, setFamilies] = useState<FamilyApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "";
        const res = await fetch(`${API_BASE}/api/families`);
        const json = await res.json();
        if (res.ok) setFamilies(json.data);
      } catch {
        // fallback to mock
        setFamilies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <PageHeader title={t("family.title")} subtitle={t("family.subtitle")} />
        <Card className="py-10 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">
            {t("common.loading")}
          </p>
        </Card>
      </section>
    );
  }

  if (families.length === 0) {
    return (
      <section className="space-y-4">
        <PageHeader title={t("family.title")} subtitle={t("family.subtitle")} />
        <Card className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--surface-strong)]">
            <svg
              className="h-8 w-8 text-[color:var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[color:var(--text-primary)]">
            {t("family.noFamilies")}
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            {t("family.noFamiliesSubtitle")}
          </p>
        </Card>
      </section>
    );
  }

  // Show families from API
  return (
    <section className="space-y-6">
      <PageHeader title={t("family.title")} subtitle={t("family.subtitle")} />

      {families.map((fam) => (
        <Card key={fam.id} className="space-y-5 p-5">
          {/* Family Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
                {fam.familyName}
              </h2>
              <p className="text-sm text-[color:var(--text-muted)]">
                {fam.memberCount} {t("family.member")}
              </p>
            </div>
            <Badge className="border border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] text-[color:var(--on-accent)]">
              {t("family.title")}
            </Badge>
          </div>

          {/* Parents Row */}
          {(fam.father || fam.mother) && (
            <div className="grid grid-cols-2 gap-4">
              {fam.father && (
                <div className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
                  {fam.father.avatar ? (
                    <img
                      src={fam.father.avatar}
                      alt={fam.father.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-bold text-[color:var(--on-primary)]">
                      {fam.father.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[color:var(--text-muted)]">
                      {t("family.father")}
                    </p>
                    <p className="font-semibold text-[color:var(--text-primary)]">
                      {fam.father.fullName}
                    </p>
                  </div>
                </div>
              )}
              {fam.mother && (
                <div className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
                  {fam.mother.avatar ? (
                    <img
                      src={fam.mother.avatar}
                      alt={fam.mother.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-bold text-[color:var(--on-primary)]">
                      {fam.mother.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[color:var(--text-muted)]">
                      {t("family.mother")}
                    </p>
                    <p className="font-semibold text-[color:var(--text-primary)]">
                      {fam.mother.fullName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Children Grid */}
          {fam.children.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-[color:var(--text-muted)]">
                {t("family.children")}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {fam.children.map((child, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3 text-center"
                  >
                    {child.avatar ? (
                      <img
                        src={child.avatar}
                        alt={child.fullName}
                        className="mb-2 h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary)] text-lg font-bold text-[color:var(--on-primary)]">
                        {child.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {child.fullName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </section>
  );
};
