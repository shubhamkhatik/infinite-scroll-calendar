import React, { useMemo, useRef, useState } from "react";
import CalendarMonth from "./CalendarMonth";
import { addMonths } from "date-fns";
import useVisibleMonth from "../../hooks/useVisibleMonth";
import MonthHeader from "../Header/MonthHeader";
import sampleData from "../../utils/sampleData.json";
import type { JournalEntry, JournalEntryWithID } from "../../utils/types";
import { JournalEntriesByDate } from "../../utils/JournalEntriesByDate";
import { EmblaCarousel } from "../EmblaCarousel";

const MONTH_BUFFER = 6; // Render 6 months before/after of visible month

export default function CalendarContainer() {
  const [currentDate] = useState(new Date());
  const [viewerEntries, setViewerEntries] = useState<
    JournalEntryWithID[] | null
  >(null);
  const [entriesIdx, setEntriesIdx] = useState(0);

  // [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
  const months = useMemo(
    () =>
      Array.from({ length: 2 * MONTH_BUFFER + 1 }, (_, i) => i - MONTH_BUFFER),
    []
  );
  // ref for each month div
  const monthRefs = useRef<HTMLDivElement[]>([]);
  const monthData = months.map((offset, idx) => ({
    month: addMonths(currentDate, offset),
    ref: { current: monthRefs.current[idx] } as React.RefObject<HTMLDivElement>,
  }));

  const visibleMonth = useVisibleMonth(monthData);
  const [entries] = useState<JournalEntry[]>(sampleData);
  const perDateEntries = useMemo(
    () => JournalEntriesByDate(entries || []),
    [entries]
  );

  function handleDayEntryClick(entries: JournalEntryWithID[], idx: number) {
    setViewerEntries(entries);
    setEntriesIdx(idx);
  }
  return (
    <div className="relative">
      <MonthHeader month={visibleMonth || currentDate} />
      <div className="overflow-auto h-[calc(100vh-64px)] relative p-10 mt-7">
        {monthData.map(({ month }, idx) => (
          <CalendarMonth
            key={month.toISOString()}
            month={month}
            ref={(el) => {
              if (el) monthRefs.current[idx] = el;
            }}
            journalEntriesByDate={perDateEntries}
            onEntryClick={handleDayEntryClick}
          />
        ))}
      </div>
      {viewerEntries && (
        <EmblaCarousel
          entries={viewerEntries}
          startIndex={entriesIdx}
          onClose={() => setViewerEntries(null)}
        />
      )}
    </div>
  );
}
