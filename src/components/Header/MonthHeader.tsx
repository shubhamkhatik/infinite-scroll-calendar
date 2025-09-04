import { useEffect, useState } from "react";

export default function MonthHeader({ month }: { month: Date }) {
  const [displayedMonth, setDisplayedMonth] = useState(month);

  useEffect(() => {
    setDisplayedMonth(month);
  }, [month]);
   if (!displayedMonth) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-10 bg-white shadow transition-all duration-300">
      <div
        key={displayedMonth.toISOString()}
        className="px-4 py-2 text-xl font-bold opacity-100 transition-all duration-300 animate-fade-in"
      >
        {displayedMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
