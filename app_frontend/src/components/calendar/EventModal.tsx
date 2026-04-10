import { Clock3, MapPin, X } from "lucide-react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import type { EventItem } from "../../types";
import { departmentStyles } from "../../utils/theme";

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  if (!event) {
    return null;
  }

  return (
    <Modal isOpen={Boolean(event)} title={event.title} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
              የዝግጅት ዝርዝር
            </p>
            <h3 className="app-heading mt-1 text-xl font-bold text-[color:var(--text-primary)]">
              {event.title}
            </h3>
          </div>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${departmentStyles[event.department].badge}`}
            aria-hidden="true"
          >
            •
          </span>
        </div>

        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
          {event.description}
        </p>

        <div className="app-subtle-panel rounded-2xl p-3 text-sm text-[color:var(--primary)]">
          <p className="inline-flex items-center gap-2">
            <Clock3 size={16} />
            {new Date(event.date).toLocaleDateString("am-ET")} • {event.time}
          </p>
          <p className="mt-2 inline-flex items-center gap-2">
            <MapPin size={16} />
            {event.location}
          </p>
          <p className="mt-2 font-semibold">ክፍል: {event.department}</p>
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
