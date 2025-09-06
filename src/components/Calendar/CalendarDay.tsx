import type { JournalEntry } from "../../utils/types";

interface Props {
  date: Date;
  entries: JournalEntry[];
  onEntryClick: (entryIdx: number) => void;
}

export default function CalendarDay({ date, entries, onEntryClick }: Props) {
  return (
    <div className="aspect-square flex flex-col items-center justify-start border rounded p-1">
      <span className="text-xs font-medium">{date.getDate()}</span>
      <div className="flex mt-1 flex-wrap gap-1">
        {entries.map((entry, idx) => (
          <img
            key={idx}
            src={entry.imgUrl}
            alt={entry.description}
            className="w-5 h-5 cursor-pointer rounded shadow"
            onClick={() => onEntryClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}
