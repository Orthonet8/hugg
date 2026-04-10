import { Phone, X } from "lucide-react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import type { FamilyMember } from "../../types";

interface MemberModalProps {
  member: FamilyMember | null;
  onClose: () => void;
}

export const MemberModal = ({ member, onClose }: MemberModalProps) => {
  if (!member) {
    return null;
  }

  return (
    <Modal isOpen={Boolean(member)} title={member.name} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="app-heading text-xl font-bold text-[color:var(--text-primary)]">
          {member.name}
        </h3>
        <div className="app-subtle-panel rounded-2xl p-4 text-sm text-[color:var(--text-secondary)]">
          <p>
            <span className="font-semibold text-[color:var(--primary)]">
              ሚና:
            </span>{" "}
            {member.role}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-[color:var(--primary)]">
              አገልግሎት:
            </span>{" "}
            {member.service}
          </p>
          <p className="mt-2 inline-flex items-center gap-1">
            <Phone size={14} />
            {member.contact}
          </p>
          {member.note ? (
            <p className="mt-2">
              <span className="font-semibold text-[color:var(--primary)]">
                ማብራሪያ:
              </span>{" "}
              {member.note}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            <X size={16} />
            ዝጋ
          </Button>
        </div>
      </div>
    </Modal>
  );
};
