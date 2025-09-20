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
  // desktop  intersection behavior is inconsistent due to 2 rows visible at once
    const isDesktop = window.innerWidth >= 1024;

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

        if (mostVisibleMonth && maxRatio > (isDesktop ? 0.2 : 0.4)) {
          setVisibleMonth(mostVisibleMonth);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],
        rootMargin: isDesktop ? '-5% 0px -5% 0px' : '-10% 0px -10% 0px'
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
