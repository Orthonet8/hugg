import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface ImageCarouselProps {
  imageUrls: string[];
  title: string;
}

export const ImageCarousel = ({ imageUrls, title }: ImageCarouselProps) => {
  const [index, setIndex] = useState(0);
  const total = imageUrls.length;

  const activeImage = useMemo(() => imageUrls[index], [imageUrls, index]);

  if (total === 0) {
    return null;
  }

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeImage}
          src={activeImage}
          alt={title}
          className="h-48 w-full object-cover"
          initial={{ opacity: 0.2, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.25 }}
          transition={{ duration: 0.25 }}
          loading="lazy"
        />
      </AnimatePresence>

      {total > 1 ? (
        <>
          <button
            type="button"
            aria-label="ወደ ቀድሞ ምስል"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--overlay)] p-1.5 text-[color:var(--on-primary)]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="ወደ ቀጣይ ምስል"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--overlay)] p-1.5 text-[color:var(--on-primary)]"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-[color:var(--overlay)] px-2 py-1">
            {imageUrls.map((imageUrl, idx) => (
              <span
                key={imageUrl}
                className={
                  idx === index
                    ? "h-1.5 w-4 rounded-full bg-[color:var(--accent)]"
                    : "h-1.5 w-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--surface)_70%,transparent)]"
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
