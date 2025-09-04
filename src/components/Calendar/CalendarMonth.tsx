import { generateMonthGrid } from "../../utils/dateUtils";

interface Props {
  month: Date;
  ref: React.Ref<HTMLDivElement>;
}

export default function CalendarMonth({ month, ref }: Props) {
  const days = generateMonthGrid(month);

  return (
    <div className="mb-8 border-b pb-4" ref={ref}>
      <div className="text-lg font-bold mb-2">
        {month.toLocaleString("default", { month: "long", year: "numeric" })}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className="aspect-square flex items-center justify-center border rounded"
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
