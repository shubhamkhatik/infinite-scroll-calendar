import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { JournalEntry } from "../utils/types";
interface EmblaCarouselProps {
  entries: JournalEntry[];
  startIndex: number;
  onClose: () => void;
}

export function EmblaCarousel({
  entries,
  startIndex,
  onClose,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex, loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 font-bold">
          ✕
        </button>
        <div className="embla " ref={emblaRef}>
          <div className="embla__container">
            {entries.map((e, idx) => (
              <div className="embla__slide p-2" key={idx}>
                <img
                  src={e.imgUrl}
                  alt={e.description}
                  className="w-full h-64 object-cover rounded"
                />
                <div className="p-4">
                  <p>{e.description}</p>
                  <p>Rating: {e.rating.toFixed(1)}</p>
                  <p>Categories: {e.categories.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              className={`px-4 py-2 rounded bg-gray-200 ${
                !canPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
            >
              Prev
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              className={`px-4 py-2 rounded bg-gray-200 ${
                !canNext ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
