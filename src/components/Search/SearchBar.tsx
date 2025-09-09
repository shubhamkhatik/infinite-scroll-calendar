import { useState, useMemo, useEffect } from "react";
import type { JournalEntryWithID } from "../../utils/types";
import SearchInput from "./SearchInput";
import RatingFilter from "./RatingFilter";
import CategoryFilter from "./CategoryFilter";

interface SearchBarProps {
  entries: JournalEntryWithID[];
  onFilteredResults: (results: JournalEntryWithID[]) => void;
  onClearSearch: () => void;
}

export default function SearchBar({
  entries,
  onFilteredResults,
  onClearSearch,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // categories in set
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [entries]);

  // filtering logic
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !searchTerm ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.categories.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesRating = entry.rating >= minRating;

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) => entry.categories.includes(c));

      return matchesSearch && matchesRating && matchesCategories;
    });
  }, [entries, searchTerm, minRating, selectedCategories]);

  useEffect(() => {
    if (searchTerm || minRating > 0 || selectedCategories.length > 0) {
      onFilteredResults(filteredEntries);
    } else {
      onClearSearch();
    }
  }, [
    filteredEntries,
    searchTerm,
    minRating,
    selectedCategories,
    onFilteredResults,
    onClearSearch,
  ]);

  const clearAll = () => {
    setSearchTerm("");
    setMinRating(0);
    setSelectedCategories([]);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-12 z-30">
      <div className="max-w-md mx-auto space-y-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />

        <RatingFilter value={minRating} onChange={setMinRating} />

        <CategoryFilter
          allCategories={allCategories}
          selected={selectedCategories}
          onToggle={(cat) =>
            setSelectedCategories((prev) =>
              prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
            )
          }
        />

        {(searchTerm || minRating > 0 || selectedCategories.length > 0) && (
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-600">
              {filteredEntries.length} entries found
            </span>
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
