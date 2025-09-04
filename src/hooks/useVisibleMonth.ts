import { useEffect, useState } from "react";

interface MonthRef {
  month: Date;
  ref: React.RefObject<HTMLDivElement>;
}

export default function useVisibleMonth(monthRefs: MonthRef[]): Date | null {
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const monthRef = monthRefs.find((mr) => mr.ref.current === visible.target);
          if (monthRef) setVisibleMonth(monthRef.month);
        }
      },
      { threshold: 0.5 } // at least half visible
    );

    monthRefs.forEach((mr) => mr.ref.current && observer.observe(mr.ref.current));

    return () => observer.disconnect();
  }, [monthRefs]);

  return visibleMonth;
}
