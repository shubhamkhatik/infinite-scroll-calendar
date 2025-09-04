import { useRef, useState } from "react";
import CalendarMonth from "./CalendarMonth";
import { addMonths } from "date-fns";
import useVisibleMonth from "../../hooks/useVisibleMonth";

const MONTH_BUFFER = 6; // Render 6 months before/after of visible month

export default function CalendarContainer() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
  const months = Array.from(
    { length: 2 * MONTH_BUFFER + 1 },
    (_, i) => i - MONTH_BUFFER
  );

  const monthRefs = months.map((offset) => ({
    month: addMonths(currentDate, offset),
    ref: useRef<HTMLDivElement>(null),
  }));

  const visibleMonth = useVisibleMonth(monthRefs);

  return (
    <div className="relative">
      <div className="overflow-auto h-[calc(100vh-64px)] relative pt-7">
        {monthRefs.map(({ month, ref }) => (
          <CalendarMonth key={month.toISOString()} month={month} ref={ref} />
        ))}
      </div>
    </div>
  );
}
