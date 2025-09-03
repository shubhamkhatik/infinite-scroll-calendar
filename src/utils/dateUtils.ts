import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"

export function generateMonthGrid(date: Date, weekStartsOn: 0 | 1 = 0) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  // First day in the calendar grid
  const startGrid = new Date(start);
  startGrid.setDate(start.getDate() - ((getDay(start) - weekStartsOn + 7) % 7));

  // Last date in the calendar grid
  const endGrid = new Date(end);
  endGrid.setDate(end.getDate() + (6 - (getDay(end) - weekStartsOn + 7) % 7));

  return eachDayOfInterval({ start: startGrid, end: endGrid });
}
