interface RatingFilterProps {
  value: number;
  onChange: (val: number) => void;
}

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700">Min Rating:</label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-sm text-gray-600 w-12">{value.toFixed(1)}</span>
    </div>
  );
}
