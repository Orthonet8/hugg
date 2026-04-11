import { useMemo, useState } from "react";
import { MemberCard } from "../components/family/MemberCard";
import { MemberModal } from "../components/family/MemberModal";
import { Badge } from "../components/common/Badge";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { familyGroup } from "../data";
import type { FamilyMember } from "../types";
import { useI18n } from "../i18n/I18nProvider";

export const FamilyPage = () => {
  const { t } = useI18n();
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const leader = useMemo(
    () => familyGroup.members.find((member) => member.id === familyGroup.leaderId),
    [],
  );

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

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </section>
  );
};
