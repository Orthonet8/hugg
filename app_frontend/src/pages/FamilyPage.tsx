import { useEffect, useMemo, useState } from "react";
import { MemberCard } from "../components/family/MemberCard";
import { MemberModal } from "../components/family/MemberModal";
import { Badge } from "../components/common/Badge";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { familyGroup } from "../data";
import type { FamilyMember } from "../types";
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
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
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

  const leader = useMemo(
    () => familyGroup.members.find((member) => member.id === familyGroup.leaderId),
    [],
  );

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
    // Fallback to mock data when no API data
    return (
      <section className="space-y-4">
        <PageHeader title={t("family.title")} subtitle={t("family.subtitle")} />

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
                {familyGroup.groupName}
              </h2>
              <p className="text-sm text-[color:var(--text-muted)]">
                {familyGroup.members.length} {t("family.member")} • 5 {t("reg.serviceDepartments")}
              </p>
            </div>
            <Badge className="border border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] text-[color:var(--on-accent)]">
              {t("family.title")}
            </Badge>
          </div>

          {leader ? (
            <div className="rounded-2xl border border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] p-3">
              <p className="text-xs font-semibold text-[color:var(--text-muted)]">
                {t("family.leader")}
              </p>
              <p className="mt-1 font-bold text-[color:var(--text-primary)]">
                {leader.name}
              </p>
              <p className="text-sm text-[color:var(--primary)]">
                {leader.contact}
              </p>
            </div>
          ) : null}
        </Card>

        <div className="space-y-3">
          {familyGroup.members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isLeader={member.id === familyGroup.leaderId}
              onOpen={setSelectedMember}
            />
          ))}
        </div>

        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
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
