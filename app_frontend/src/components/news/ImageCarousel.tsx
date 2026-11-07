import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ImageCarouselProps {
  imageUrls: string[];
  title: string;
  aspectClass?: string;
}

export const ImageCarousel = ({
  imageUrls,
  title,
  aspectClass = "h-52 sm:h-64",
}: ImageCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = imageUrls.length;

  const activeImage = useMemo(() => imageUrls[index], [imageUrls, index]);

  // Lock body scroll when modal lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowLeft") setIndex((prev) => (prev - 1 + total) % total);
        if (e.key === "ArrowRight") setIndex((prev) => (prev + 1) % total);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [lightboxOpen, total]);

  if (total === 0) {
    return null;
  }

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % total);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Inline Preview Carousel */}
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[color:var(--surface-soft)]"
        onClick={openLightbox}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${aspectClass}`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.2 }}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Hover / Tap Zoom Hint */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-[color:var(--overlay)]/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md opacity-85 transition group-hover:opacity-100">
          <ZoomIn size={14} />
          <span>ምስል እይ</span>
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--overlay)]/75 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-[color:var(--overlay)] active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--overlay)]/75 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-[color:var(--overlay)] active:scale-95"
            >
              <ChevronRight size={18} />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-[color:var(--overlay)]/70 px-2.5 py-1 backdrop-blur-sm">
              {imageUrls.map((imageUrl, idx) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(idx);
                  }}
                  className={
                    idx === index
                      ? "h-1.5 w-4 rounded-full bg-[color:var(--accent)] transition-all"
                      : "h-1.5 w-1.5 rounded-full bg-white/60 hover:bg-white"
                  }
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Full Screen Lightbox Modal */}
      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Lightbox Header */}
            <div className="flex w-full max-w-5xl items-center justify-between text-white">
              <div className="min-w-0 pr-4">
                <p className="truncate text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/60">
                  {index + 1} of {total}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
                aria-label="Close full image view"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Centered Full Image */}
            <div
              className="relative flex flex-1 items-center justify-center w-full max-w-5xl my-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl select-none"
                />
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails preview strip in Lightbox */}
            {total > 1 && (
              <div
                className="flex items-center gap-2 overflow-x-auto py-2 px-3 max-w-full bg-white/5 rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {imageUrls.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setIndex(idx)}
                    className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      idx === index
                        ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/50 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};
