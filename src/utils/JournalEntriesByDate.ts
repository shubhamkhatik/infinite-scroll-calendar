import type { JournalEntry } from "../utils/types";

export function JournalEntriesByDate(
  entries: JournalEntry[]
): Record<string, JournalEntry[]> {
  return entries.reduce((data, entry) => {
    if (!data[entry.date]) data[entry.date] = [];
    data[entry.date].push(entry);
    return data;
  }, {} as Record<string, JournalEntry[]>);
  // intial val is empty obj where key is string [date] and value is array[actual data]
}
