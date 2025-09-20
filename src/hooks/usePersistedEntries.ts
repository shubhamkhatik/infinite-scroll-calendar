import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { JournalEntry, JournalEntryWithID } from "../utils/types";
import sampleData from "../utils/sampleData.json";

const STORAGE_KEY = "calendar_journal_entries";

export function usePersistedEntries() {
  const [entries, setEntries] = useState<JournalEntryWithID[]>([]);
  // initial process of getting data may be local or json by ensuring ids
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedEntries = JSON.parse(stored);
        const entriesWithIds = parsedEntries.map(
          (entry: JournalEntry | JournalEntryWithID) => ({
            ...entry,
            id: "id" in entry ? entry.id : uuidv4(),
          })
        );
        setEntries(entriesWithIds);
      } catch (error) {
        console.error("Failed to parse stored entries:", error);
        const sampleWithIds = sampleData.map(
          (entry: JournalEntry | JournalEntryWithID) => ({
            ...entry,
            id: "id" in entry ? entry.id : uuidv4(),
          })
        );
        setEntries(sampleWithIds);
      }
    } else {
      const sampleWithIds = sampleData.map(
        (entry: JournalEntry | JournalEntryWithID) => ({
          ...entry,
          id: "id" in entry ? entry.id : uuidv4(),
        })
      );
      setEntries(sampleWithIds);
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  // CRUD operations using IDs
  const createEntry = useCallback(
    (newEntry: Omit<JournalEntryWithID, "id">) => {
      const entryWithId: JournalEntryWithID = {
        ...newEntry,
        id: uuidv4(),
      };
      setEntries((prev) => [...prev, entryWithId]);
      return entryWithId;
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, updatedEntry: Partial<JournalEntryWithID>) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        )
      );
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getEntryById = useCallback(
    (id: string) => {
      return entries.find((entry) => entry.id === id);
    },
    [entries]
  );

  // Helper to find entry by other properties (for backward compatibility)
  const findEntryIndex = useCallback(
    (searchEntry: Partial<JournalEntryWithID>) => {
      return entries.findIndex(
        (entry) =>
          entry.id === searchEntry.id ||
          (entry.date === searchEntry.date &&
            entry.description === searchEntry.description &&
            entry.imgUrl === searchEntry.imgUrl)
      );
    },
    [entries]
  );

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    findEntryIndex,
  };
}
