import { generateMonthGrid } from "../../utils/dateUtils";
import type { JournalEntry } from "../../utils/types";
import { format } from "date-fns";


interface Props {
  month: Date;
  ref: React.Ref<HTMLDivElement>;
  journalEntriesByDate: Record<string, JournalEntry[]>;
  onEntryClick: (entryIndex: number) => void;
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
            <div
              key={date.toISOString()}
              className="aspect-square flex items-center justify-center border rounded"
            >
              <div>{date.getDate()}</div>

              <div className="flex flex-wrap gap-1 mt-1">
                {journalEntryOfDate.map((entry, idx) => (
                  <img
                    key={idx}
                    src={entry.imgUrl}
                    alt={entry.description}
                    className="w-6 h-6 rounded cursor-pointer"
                    onClick={() =>
                      onEntryClick(idx)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
