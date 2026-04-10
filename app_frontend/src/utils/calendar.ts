import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const buildMonthGrid = (month: Date): Date[] => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
};

export const toIsoDate = (date: Date): string => format(date, "yyyy-MM-dd");
