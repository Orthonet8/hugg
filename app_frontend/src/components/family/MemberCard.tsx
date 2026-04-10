import { Phone, ShieldCheck } from "lucide-react";
import { Card } from "../common/Card";
import type { FamilyMember } from "../../types";
import { departmentStyles } from "../../utils/theme";

interface MemberCardProps {
  member: FamilyMember;
  isLeader: boolean;
  onOpen: (member: FamilyMember) => void;
}

export const MemberCard = ({ member, isLeader, onOpen }: MemberCardProps) => (
  <button
    type="button"
    className="w-full text-left"
    onClick={() => onOpen(member)}
  >
    <Card className="space-y-3 transition hover:scale-[1.01]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-[color:var(--text-primary)]">
            {member.name}
          </h3>
          <p className="text-sm text-[color:var(--text-muted)]">
            {member.role}
          </p>
        </div>
        {isLeader ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] px-2 py-1 text-xs font-semibold text-[color:var(--on-accent)]">
            <ShieldCheck size={14} />
            መሪ
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${departmentStyles[member.service].badge}`}
        >
          {member.service}
        </span>
        <span className="inline-flex items-center gap-1 text-[color:var(--primary)]">
          <Phone size={14} />
          {member.contact}
        </span>
      </div>
    </Card>
  </button>
);
