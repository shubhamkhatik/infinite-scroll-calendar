interface CategoryFilterProps {
  allCategories: string[];
  selected: string[];
  onToggle: (cat: string) => void;
}

export default function CategoryFilter({
  allCategories,
  selected,
  onToggle,
}: CategoryFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Categories:
      </label>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className={`px-3 py-1 text-xs rounded-full border ${
              selected.includes(cat)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
