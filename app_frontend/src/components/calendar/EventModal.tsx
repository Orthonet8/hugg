import { Calendar, Clock3, MapPin } from "lucide-react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import type { EventItem } from "../../types";
import { departmentStyles } from "../../utils/theme";
import { toEthiopianDate } from "../../services/ethiopianCalendar";

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const ethDate = event ? (event.ethiopianDate?.formatted || toEthiopianDate(event.date).formattedAm) : "";
  const gregFormatted = event ? new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : "";

  return (
    <Modal isOpen={Boolean(event)} title={event?.title ?? ""} onClose={onClose}>
      {event ? (
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

          <div className="app-subtle-panel space-y-2.5 rounded-2xl p-3.5 text-sm text-[color:var(--primary)]">
            {/* Dual date display */}
            <div className="flex items-start gap-2">
              <Calendar size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[color:var(--text-primary)]">
                  🇪🇹 የኢትዮጵያ ቀን: {ethDate}
                </p>
                <p className="text-xs text-[color:var(--text-muted)]">
                  ፈረንጅ ቀን: {gregFormatted}
                </p>
              </div>
            </div>

            <p className="inline-flex items-center gap-2">
              <Clock3 size={16} />
              {event.time}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin size={16} />
              {event.location}
            </p>
            <p className="font-semibold text-xs pt-1 border-t border-[color:var(--border)]">
              ክፍል: {event.department}
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              ዝጋ
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
