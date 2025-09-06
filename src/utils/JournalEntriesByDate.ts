import { v4 as uuidv4 } from "uuid";
import type { JournalEntry, JournalEntryWithID } from "../utils/types";

export function JournalEntriesByDate(
  entries: JournalEntry[]
): Record<string, JournalEntryWithID[]> {
  return entries.reduce((data, entry) => {
    const withId: JournalEntryWithID = { ...entry, id: uuidv4() };
    if (!data[withId.date]) data[withId.date] = [];
    data[withId.date].push(withId);
    return data;
  }, {} as Record<string, JournalEntryWithID[]>);
}
// intial val is empty obj where key is string [date] and value is array[actual data]
