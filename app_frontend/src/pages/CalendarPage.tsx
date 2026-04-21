import clsx from "clsx";
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { EventCard } from "../components/calendar/EventCard";
import { EventModal } from "../components/calendar/EventModal";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { useAppStore } from "../context/useAppStore";
import type { EventItem } from "../types";
import { buildMonthGrid, toIsoDate } from "../utils/calendar";
import { departmentStyles } from "../utils/theme";
import { useI18n } from "../i18n/I18nProvider";

const weekDays = ["ሰ", "ማ", "ረ", "ሐ", "አ", "ቅ", "እ"];

export const CalendarPage = () => {
  const { t } = useI18n();
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);

  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(parseISO(selectedDate)),
  );
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || "";
    fetch(`${API_BASE}/api/events`)
      .then((res) => res.json())
      .then((data: EventItem[]) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  const monthDays = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const eventsByDate = useMemo(() => {
    const bucket = new Map<string, EventItem[]>();

    events.forEach((event) => {
      const existing = bucket.get(event.date) ?? [];
      bucket.set(event.date, [...existing, event]);
    });

    return bucket;
  }, [events]);

  const selectedDateEvents = eventsByDate.get(selectedDate) ?? [];

  return (
    <section className="space-y-4">
      <PageHeader title={t("calendar.title")} subtitle={t("calendar.subtitle")} />

      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)]"
            onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
            aria-label="ወደ ቀድሞ ወር"
          >
            <ChevronLeft size={18} />
          </button>

          <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
            {currentMonth.toLocaleDateString("am-ET", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            type="button"
            className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)]"
            onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
            aria-label="ወደ ቀጣይ ወር"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[color:var(--text-muted)]">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const dayIso = toIsoDate(day);
            const dayEvents = eventsByDate.get(dayIso) ?? [];
            const isSelected = selectedDate === dayIso;

            return (
              <button
                type="button"
                key={dayIso}
                onClick={() => setSelectedDate(dayIso)}
                className={clsx(
                  "min-h-[58px] rounded-2xl border p-1 text-center text-sm transition",
                  isSelected
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:border-[color:var(--border-strong)]",
                  !isSameMonth(day, currentMonth) &&
                    "bg-[color:var(--surface-soft)] text-[color:color-mix(in_srgb,var(--text-muted)_75%,transparent)] shadow-none",
                )}
              >
                <span
                  className={clsx(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    isSameDay(day, new Date()) &&
                      !isSelected &&
                      "bg-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] text-[color:var(--primary)]",
                  )}
                >
                  {format(day, "d")}
                </span>

                <div className="mt-1 flex justify-center gap-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={`h-1.5 w-1.5 rounded-full ${departmentStyles[event.department].dot}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-muted)]">
          {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("am-ET")} {t("calendar.events")}
        </h3>

        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <EventCard key={event.id} event={event} onOpen={setActiveEvent} />
          ))
        ) : (
          <Card className="py-8 text-center">
            <p className="text-sm text-[color:var(--text-muted)]">
              {t("calendar.noEvents")}
            </p>
          </Card>
        )}
      </div>

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
};
