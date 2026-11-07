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
import { Calendar, ChevronLeft, ChevronRight, Globe } from "lucide-react";
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
import {
  toEthiopianDate,
  fromEthiopianDate,
  getDaysInEthiopianMonth,
  ETHIOPIAN_MONTHS,
} from "../services/ethiopianCalendar";

const weekDaysAm = ["ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ", "እሑድ"];

export const CalendarPage = () => {
  const { t } = useI18n();
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);

  // Calendar View System Mode: "ethiopian" | "gregorian"
  const [calendarMode, setCalendarMode] = useState<"ethiopian" | "gregorian">("ethiopian");

  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);

  // Gregorian view state
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(parseISO(selectedDate || new Date().toISOString().split("T")[0])),
  );

  // Ethiopian view state: year & month
  const initialEth = useMemo(
    () => toEthiopianDate(selectedDate || new Date()),
    [selectedDate],
  );
  const [ethYear, setEthYear] = useState(initialEth.year);
  const [ethMonth, setEthMonth] = useState(initialEth.month);

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

  // Ethiopian month days grid with leading empty offsets
  const ethiopianDaysGrid = useMemo(() => {
    const totalDays = getDaysInEthiopianMonth(ethYear, ethMonth);
    // Find weekday of the 1st day of this Ethiopian month
    const { date: firstDayGreg } = fromEthiopianDate(ethYear, ethMonth, 1);
    // Monday = 1, Sunday = 0 in JS Date -> convert so Monday is 0
    const dayOfWeek = (firstDayGreg.getDay() + 6) % 7;

    const days: { ethDay: number; gregDate: Date; gregIso: string }[] = [];

    for (let d = 1; d <= totalDays; d++) {
      const { date: gDate, iso: gIso } = fromEthiopianDate(ethYear, ethMonth, d);
      days.push({ ethDay: d, gregDate: gDate, gregIso: gIso });
    }

    return { leadingBlanks: dayOfWeek, days };
  }, [ethYear, ethMonth]);

  const handleEthPrevMonth = () => {
    if (ethMonth === 1) {
      setEthMonth(13);
      setEthYear((y) => y - 1);
    } else {
      setEthMonth((m) => m - 1);
    }
  };

  const handleEthNextMonth = () => {
    if (ethMonth === 13) {
      setEthMonth(1);
      setEthYear((y) => y + 1);
    } else {
      setEthMonth((m) => m + 1);
    }
  };

  const selectedEthDate = useMemo(
    () => toEthiopianDate(selectedDate || new Date()),
    [selectedDate],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title={t("calendar.title")} subtitle={t("calendar.subtitle")} />

        {/* Calendar Mode Switcher (Ethiopian vs Gregorian) */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setCalendarMode("ethiopian")}
            className={clsx(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
              calendarMode === "ethiopian"
                ? "bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-sm"
                : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
            )}
          >
            <span>🇪🇹 የኢትዮጵያ ቀን</span>
          </button>
          <button
            type="button"
            onClick={() => setCalendarMode("gregorian")}
            className={clsx(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition",
              calendarMode === "gregorian"
                ? "bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-sm"
                : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
            )}
          >
            <Globe size={13} />
            <span>Gregorian</span>
          </button>
        </div>
      </div>

      <Card className="space-y-4 p-4 md:p-5">
        {/* Ethiopian Calendar View */}
        {calendarMode === "ethiopian" ? (
          <>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:scale-95 transition"
                onClick={handleEthPrevMonth}
                aria-label="ወደ ቀድሞ ወር"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
                  {ETHIOPIAN_MONTHS[ethMonth]?.am} {ethYear} ዓ.ም.
                </h2>
                <p className="text-[11px] font-semibold text-[color:var(--text-muted)]">
                  {ETHIOPIAN_MONTHS[ethMonth]?.en} ({ETHIOPIAN_MONTHS[ethMonth]?.om})
                </p>
              </div>

              <button
                type="button"
                className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:scale-95 transition"
                onClick={handleEthNextMonth}
                aria-label="ወደ ቀጣይ ወር"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-[color:var(--text-muted)]">
              {weekDaysAm.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty offset padding cells */}
              {Array.from({ length: ethiopianDaysGrid.leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[56px] rounded-2xl bg-transparent" />
              ))}

              {ethiopianDaysGrid.days.map(({ ethDay, gregIso, gregDate }) => {
                const dayEvents = eventsByDate.get(gregIso) ?? [];
                const isSelected = selectedDate === gregIso;
                const isToday = isSameDay(gregDate, new Date());

                return (
                  <button
                    type="button"
                    key={gregIso}
                    onClick={() => setSelectedDate(gregIso)}
                    className={clsx(
                      "group relative flex min-h-[58px] flex-col items-center justify-between rounded-2xl border p-1 text-center transition active:scale-95",
                      isSelected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-md"
                        : isToday
                        ? "border-[color:var(--primary)] bg-[color:var(--surface)] text-[color:var(--text-primary)] ring-2 ring-[color:var(--primary)]/20"
                        : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:border-[color:var(--primary)]/50",
                    )}
                  >
                    {/* Ethiopian day number */}
                    <span
                      className={clsx(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        isSelected
                          ? "bg-[color:var(--on-primary)]/20 text-[color:var(--on-primary)]"
                          : isToday
                          ? "bg-[color:var(--primary)] text-[color:var(--on-primary)]"
                          : "text-[color:var(--text-primary)]",
                      )}
                    >
                      {ethDay}
                    </span>

                    {/* Subtle Gregorian day number */}
                    <span
                      className={clsx(
                        "text-[9px] font-medium leading-none opacity-60",
                        isSelected ? "text-[color:var(--on-primary)]" : "text-[color:var(--text-muted)]",
                      )}
                    >
                      {format(gregDate, "d")}
                    </span>

                    {/* Events indicators */}
                    <div className="flex h-1.5 items-center justify-center gap-1">
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
          </>
        ) : (
          /* Gregorian Calendar View */
          <>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:scale-95 transition"
                onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <p className="text-[11px] font-semibold text-[color:var(--text-muted)]">
                  {toEthiopianDate(currentMonth).formattedAm}
                </p>
              </div>

              <button
                type="button"
                className="app-subtle-panel inline-flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--primary)] hover:bg-[color:var(--soft-hover)] active:scale-95 transition"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-[color:var(--text-muted)]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {monthDays.map((day) => {
                const dayIso = toIsoDate(day);
                const dayEvents = eventsByDate.get(dayIso) ?? [];
                const isSelected = selectedDate === dayIso;
                const ethInfo = toEthiopianDate(day);

                return (
                  <button
                    type="button"
                    key={dayIso}
                    onClick={() => setSelectedDate(dayIso)}
                    className={clsx(
                      "flex min-h-[58px] flex-col items-center justify-between rounded-2xl border p-1 text-center transition active:scale-95",
                      isSelected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-md"
                        : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:border-[color:var(--primary)]/50",
                      !isSameMonth(day, currentMonth) &&
                        "bg-[color:var(--surface-soft)] text-[color:color-mix(in_srgb,var(--text-muted)_75%,transparent)] shadow-none opacity-50",
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        isSameDay(day, new Date()) &&
                          !isSelected &&
                          "bg-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] text-[color:var(--primary)]",
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Ethiopian day equivalent */}
                    <span
                      className={clsx(
                        "text-[9px] font-medium leading-none opacity-70",
                        isSelected ? "text-[color:var(--on-primary)]" : "text-[color:var(--text-muted)]",
                      )}
                    >
                      🇪🇹 {ethInfo.day}
                    </span>

                    <div className="flex h-1.5 items-center justify-center gap-1">
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
          </>
        )}
      </Card>

      {/* Selected Date Summary & Events List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-[color:var(--text-primary)] flex items-center gap-2">
              <Calendar size={16} className="text-[color:var(--primary)]" />
              <span>🇪🇹 {selectedEthDate.formattedAm}</span>
            </h3>
            <p className="text-xs text-[color:var(--text-muted)]">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              • {t("calendar.events")}
            </p>
          </div>

          <span className="rounded-full bg-[color:var(--surface-soft)] px-2.5 py-1 text-xs font-bold text-[color:var(--primary)] border border-[color:var(--border)]">
            {selectedDateEvents.length} ዝግጅቶች
          </span>
        </div>

        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event) => (
            <EventCard key={event.id} event={event} onOpen={setActiveEvent} />
          ))
        ) : (
          <Card className="py-10 text-center space-y-1">
            <p className="text-sm font-semibold text-[color:var(--text-muted)]">
              {t("calendar.noEvents")}
            </p>
            <p className="text-xs text-[color:var(--text-muted)]">
              በዚህ ቀን የተመዘገበ መርሐ ግብር የለም።
            </p>
          </Card>
        )}
      </div>

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </section>
  );
};
