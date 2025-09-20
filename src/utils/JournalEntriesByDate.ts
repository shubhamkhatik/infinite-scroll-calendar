import { v4 as uuidv4 } from "uuid";
import type { JournalEntryWithID } from "./types";

export function JournalEntriesByDate(
  entries: JournalEntryWithID[]
): Record<string, JournalEntryWithID[]> {
  return entries.reduce((data, entry) => {
    const withId: JournalEntryWithID = entry.id
      ? entry
      : { ...entry, id: uuidv4() };

    if (!data[withId.date]) data[withId.date] = [];
    data[withId.date].push(withId);
    return data;
  }, {} as Record<string, JournalEntryWithID[]>);
}
