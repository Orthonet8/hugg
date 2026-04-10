import { Clock3, MapPin } from "lucide-react";
import { Card } from "../common/Card";
import type { EventItem } from "../../types";
import { departmentStyles } from "../../utils/theme";

interface EventCardProps {
  event: EventItem;
  onOpen: (event: EventItem) => void;
}

export const EventCard = ({ event, onOpen }: EventCardProps) => (
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
      <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--primary)]">
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
