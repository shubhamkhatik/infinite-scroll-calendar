import { useMemo, useRef, useState, useEffect } from "react";
import CalendarMonth from "./CalendarMonth";
import { addMonths } from "date-fns";
import useVisibleMonth from "../../hooks/useVisibleMonth";
import MonthHeader from "../Header/MonthHeader";
import sampleData from "../../utils/sampleData.json";
import type { JournalEntry, JournalEntryWithID } from "../../utils/types";
import { JournalEntriesByDate } from "../../utils/JournalEntriesByDate";
import { EmblaCarousel } from "../EmblaCarousel";
import SearchBar from "../Search/SearchBar";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

const MONTH_BUFFER = 6;

export default function CalendarContainer() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewerEntries, setViewerEntries] = useState<
    JournalEntryWithID[] | null
  >(null);
  const [entriesIdx, setEntriesIdx] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState<
    JournalEntryWithID[] | null
  >(null);

  const months = useMemo(
    () =>
      Array.from({ length: 2 * MONTH_BUFFER + 1 }, (_, i) => i - MONTH_BUFFER),
    []
  );

  const monthRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const monthData = months.map((offset, idx) => ({
    month: addMonths(currentDate, offset),
    ref: { current: monthRefs.current[idx] } as React.RefObject<HTMLDivElement>,
  }));

  // (current month) for initial header
  const centerMonthIndex = Math.floor(months.length / 2);
  const initialMonth = monthData[centerMonthIndex].month;

  const visibleMonth = useVisibleMonth(monthData, initialMonth);

  const [entries] = useState<JournalEntry[]>(sampleData);
  const displayEntries = filteredEntries || entries;
  const perDateEntries = useMemo(
    () => JournalEntriesByDate(displayEntries || []),
    [displayEntries]
  );

  //  current month on initial load
  useEffect(() => {
    const centerIndex = Math.floor(monthData.length / 2);
    if (monthRefs.current[centerIndex]) {
      monthRefs.current[centerIndex].scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    }
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      //  more months when 20% from top
      if (scrollTop < scrollHeight * 0.2) {
        setCurrentDate((prev) => addMonths(prev, -3));
      }

      //  more months when 80% scrolled
      if (scrollTop + clientHeight > scrollHeight * 0.8) {
        setCurrentDate((prev) => addMonths(prev, 3));
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMonth = (targetDate: Date) => {
    setCurrentDate(targetDate);
    setTimeout(() => {
      const targetMonthIndex = months.findIndex((offset) => {
        const monthDate = addMonths(currentDate, offset);
        return (
          monthDate.getFullYear() === targetDate.getFullYear() &&
          monthDate.getMonth() === targetDate.getMonth()
        );
      });

      if (targetMonthIndex !== -1 && monthRefs.current[targetMonthIndex]) {
        monthRefs.current[targetMonthIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  useKeyboardNavigation({
    onNextMonth: () => scrollToMonth(addMonths(currentDate, 1)),
    onPrevMonth: () => scrollToMonth(addMonths(currentDate, -1)),
    onNextYear: () => scrollToMonth(addMonths(currentDate, 12)),
    onPrevYear: () => scrollToMonth(addMonths(currentDate, -12)),
  });

  function handleDayEntryClick(entries: JournalEntryWithID[], idx: number) {
    setViewerEntries(entries);
    setEntriesIdx(idx);
  }

  return (
    <div className="relative">
      <MonthHeader month={visibleMonth} />
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="fixed top-16 right-4 z-40 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        🔍
      </button>
      {showSearch && (
        <SearchBar
          entries={perDateEntries ? Object.values(perDateEntries).flat() : []}
          onFilteredResults={setFilteredEntries}
          onClearSearch={() => setFilteredEntries(null)}
        />
      )}
      <div className="fixed bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-30">
        ← → Navigate months | Ctrl+↑↓ Navigate years
      </div>
      <div
        ref={containerRef}
        className={`overflow-auto h-[calc(100vh-64px)] relative ${
          showSearch ? "pt-32" : "pt-7"
        }`}
      >
        {monthData.map(({ month }, idx) => (
          <div
            key={`${month.getFullYear()}-${month.getMonth()}`}
            ref={(el) => {
              if (el) monthRefs.current[idx] = el;
            }}
          >
            <CalendarMonth
              month={month}
              journalEntriesByDate={perDateEntries}
              onEntryClick={handleDayEntryClick}
            />
          </div>
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
