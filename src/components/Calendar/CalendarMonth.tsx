import { generateMonthGrid } from "../../utils/dateUtils";
import type { JournalEntryWithID } from "../../utils/types";
import { format } from "date-fns";
import CalendarDay from "./CalendarDay";

interface Props {
  month: Date;
  ref: React.Ref<HTMLDivElement>;
  journalEntriesByDate: Record<string, JournalEntryWithID[]>;
  onEntryClick: (entries: JournalEntryWithID[], entryIndex: number) => void;
}

export default function CalendarMonth({
  month,
  ref,
  journalEntriesByDate,
  onEntryClick,
}: Props) {
  const days = generateMonthGrid(month);

  return (
    <div className="mb-8 border-b pb-4" ref={ref}>
      <div className="text-lg font-bold mb-2">
        {month.toLocaleString("default", { month: "long", year: "numeric" })}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dateStringKey = format(date, "dd/MM/yyyy");
          const journalEntryOfDate = journalEntriesByDate[dateStringKey] || [];
          return (
            <CalendarDay
              date={date}
              entries={journalEntryOfDate}
              onEntryClick={(idx) =>
                journalEntryOfDate.length &&
                onEntryClick(journalEntryOfDate, idx)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
