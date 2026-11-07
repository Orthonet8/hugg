import { Calendar, Clock3, MapPin } from "lucide-react";
import { Card } from "../common/Card";
import type { EventItem } from "../../types";
import { departmentStyles } from "../../utils/theme";
import { toEthiopianDate } from "../../services/ethiopianCalendar";

interface EventCardProps {
  event: EventItem;
  onOpen: (event: EventItem) => void;
}

export const EventCard = ({ event, onOpen }: EventCardProps) => {
  const ethDate = event.ethiopianDate?.formatted || toEthiopianDate(event.date).formattedAm;
  const gregFormatted = new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      className="w-full text-left transition hover:scale-[1.01]"
    >
      <Card
        className={`space-y-2 border-l-4 ${departmentStyles[event.department].border}`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-[color:var(--text-primary)]">
            {event.title}
          </h3>
          <span
            className={`h-2.5 w-2.5 rounded-full ${departmentStyles[event.department].dot}`}
          />
        </div>
        <p className="text-sm text-[color:var(--text-muted)]">
          {event.description}
        </p>

        {/* Dual Calendar Badge */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-semibold text-[color:var(--text-muted)]">
          <span className="inline-flex items-center gap-1 rounded-md bg-[color:var(--surface-soft)] px-2 py-0.5 text-[color:var(--primary)] border border-[color:var(--border)]">
            <Calendar size={13} />
            <span>🇪🇹 {ethDate}</span>
          </span>
          <span className="text-[11px] opacity-75">({gregFormatted})</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--primary)] pt-1">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {event.location}
          </span>
        </div>
      </Card>
    </button>
  );
};
