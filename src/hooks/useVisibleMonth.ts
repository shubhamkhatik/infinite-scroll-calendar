import { useEffect, useState } from "react";

interface MonthRef {
  month: Date;
  ref: React.RefObject<HTMLDivElement>;
}
// Shows 13 months (6 before, current, 6 after)
// Returns the month most visible in the viewport
export default function useVisibleMonth(monthRefs: MonthRef[]): Date {
  // Fallback to the first month (currentDate) in the initial render if available,
  // otherwise fallback to today to avoid crashes on initial mount.
  const defaultMonth =
    monthRefs && monthRefs.length > 0 ? monthRefs[0].month : new Date();
  const [visibleMonth, setVisibleMonth] = useState<Date>(defaultMonth);
  // debug
  // console.log("visibleMonth hook:", visibleMonth, "monthRefs length:", monthRefs.length);

  useEffect(() => {
    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });

        // Pick the element with the largest intersection ratio
        let maxRatio = 0;
        let mostVisibleMonth: Date | undefined = undefined;

        ratios.forEach((ratio, elem) => {
          if (ratio > maxRatio) {
            // Find the month for this element
            const found = monthRefs.find((mr) => mr.ref.current === elem);
            if (found) {
              maxRatio = ratio;
              mostVisibleMonth = found.month;
            }
          }
        });

        if (mostVisibleMonth) setVisibleMonth(mostVisibleMonth);
      },
      { threshold: [0, 0.2, 0.5, 0.7, 1.0] }
    );

    monthRefs.forEach((mr) => {
      if (mr.ref.current) observer.observe(mr.ref.current);
    });

    return () => observer.disconnect();
  }, [monthRefs]);

  return visibleMonth;
}
