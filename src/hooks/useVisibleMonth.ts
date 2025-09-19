import { useEffect, useState } from "react";

interface MonthRef {
  month: Date;
  ref: React.RefObject<HTMLDivElement>;
}

export default function useVisibleMonth(
  monthRefs: MonthRef[],
  initialMonth: Date
): Date {
  const [visibleMonth, setVisibleMonth] = useState<Date>(initialMonth);

  useEffect(() => {
    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });

        //largest intersection ratio
        let maxRatio = 0;
        let mostVisibleMonth: Date | undefined = undefined;

        ratios.forEach((ratio, elem) => {
          if (ratio > maxRatio) {
            const found = monthRefs.find((mr) => mr.ref.current === elem);
            if (found) {
              maxRatio = ratio;
              mostVisibleMonth = found.month;
            }
          }
        });

        if (mostVisibleMonth && maxRatio > 0.4) {
          setVisibleMonth(mostVisibleMonth);
        }
      },
      {
        threshold: [0, 0.2, 0.5, 0.7, 1.0],
        rootMargin: "-10% 0px -10% 0px", // Only trigger when month is well within viewport
      }
    );

    monthRefs.forEach((mr) => {
      if (mr.ref.current) {
        observer.observe(mr.ref.current);
      }
    });

    return () => observer.disconnect();
  }, [monthRefs]);

  return visibleMonth;
}
