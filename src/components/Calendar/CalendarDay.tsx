import type { JournalEntryWithID } from "../../utils/types";

interface Props {
  date: Date;
  entries: JournalEntryWithID[];
  onEntryClick: (entryIdx: number) => void;
}

export default function CalendarDay({ date, entries, onEntryClick }: Props) {
  return (
    <div className="aspect-square flex flex-col items-center justify-start border rounded p-1">
      <span className="text-xs font-medium">{date.getDate()}</span>
      <div className="flex-1 mt-1 flex flex-col gap-1 w-full overflow-hidden">
        {entries.map((entry, idx) => (
          <img
            key={entry.id}
            src={entry.imgUrl}
            alt={entry.description}
            className="w-full h-auto rounded shadow object-cover cursor-pointer"
            onClick={() => onEntryClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}
