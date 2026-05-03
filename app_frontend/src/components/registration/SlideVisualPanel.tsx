import { motion } from "framer-motion";

type SlideVisualId =
  | "basic-info"
  | "campus-academics"
  | "background-participation"
  | "skills-service"
  | "contact-social";

const VISUALS: Record<
  SlideVisualId,
  {
    quote: string;
    verse: string;
    accent: string;
    glow: string;
    art: "profile" | "campus" | "roots" | "service" | "contact";
  }
> = {
  "basic-info": {
    quote: "I praise You, for I am fearfully and wonderfully made.",
    verse: "Psalm 139:14",
    accent: "#f3c913",
    glow: "rgba(243, 201, 19, 0.28)",
    art: "profile",
  },
  "campus-academics": {
    quote: "The fear of the Lord is the beginning of wisdom.",
    verse: "Proverbs 9:10",
    accent: "#7ad0ff",
    glow: "rgba(122, 208, 255, 0.28)",
    art: "campus",
  },
  "background-participation": {
    quote: "So we, though many, are one body in Christ.",
    verse: "Romans 12:5",
    accent: "#6fe3b8",
    glow: "rgba(111, 227, 184, 0.28)",
    art: "roots",
  },
  "skills-service": {
    quote: "As each has received a gift, use it to serve one another.",
    verse: "1 Peter 4:10",
    accent: "#ffb07a",
    glow: "rgba(255, 176, 122, 0.28)",
    art: "service",
  },
  "contact-social": {
    quote: "Let us consider how to stir up one another to love and good works.",
    verse: "Hebrews 10:24",
    accent: "#d4b4ff",
    glow: "rgba(212, 180, 255, 0.28)",
    art: "contact",
  },
};

export const SlideVisualPanel = ({ slideId }: { slideId: SlideVisualId }) => {
  const visual = VISUALS[slideId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="slide-visual-card"
      style={{
        ["--slide-accent" as string]: visual.accent,
        ["--slide-glow" as string]: visual.glow,
      }}
    >
      <div className="slide-visual-art">
        <motion.div
          className="slide-visual-orb orb-a"
          animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="slide-visual-orb orb-b"
          animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
          transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="slide-visual-orb orb-c"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <ArtVariant art={visual.art} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="slide-quote-card"
      >
        <p className="slide-quote-mark">“</p>
        <p className="slide-quote-text">{visual.quote}</p>
        <p className="slide-quote-verse">{visual.verse}</p>
      </motion.div>
    </motion.div>
  );
};

const ArtVariant = ({ art }: { art: SlideVisualId extends never ? never : "profile" | "campus" | "roots" | "service" | "contact" }) => {
  if (art === "profile") {
    return (
      <svg viewBox="0 0 220 150" className="slide-visual-svg" aria-hidden="true">
        <circle cx="110" cy="46" r="24" fill="rgba(255,255,255,0.95)" />
        <path d="M58 130c8-28 27-43 52-43s44 15 52 43" fill="rgba(255,255,255,0.95)" />
        <rect x="28" y="30" width="34" height="78" rx="17" fill="rgba(255,255,255,0.16)" />
        <rect x="158" y="18" width="34" height="92" rx="17" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }

  if (art === "campus") {
    return (
      <svg viewBox="0 0 220 150" className="slide-visual-svg" aria-hidden="true">
        <path d="M38 118h144" stroke="rgba(255,255,255,0.82)" strokeWidth="8" strokeLinecap="round" />
        <path d="M60 118V74h100v44" stroke="rgba(255,255,255,0.95)" strokeWidth="8" strokeLinecap="round" />
        <path d="M48 74l62-30 62 30" stroke="rgba(255,255,255,0.95)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 118V90M128 118V90" stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }

  if (art === "roots") {
    return (
      <svg viewBox="0 0 220 150" className="slide-visual-svg" aria-hidden="true">
        <path d="M110 116V48" stroke="rgba(255,255,255,0.95)" strokeWidth="8" strokeLinecap="round" />
        <path d="M110 64c-11-16-26-24-46-24M110 72c12-15 26-22 48-21M110 88c-13 9-22 20-28 34M110 86c16 10 26 21 32 35" stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="63" cy="40" r="12" fill="rgba(255,255,255,0.96)" />
        <circle cx="158" cy="49" r="11" fill="rgba(255,255,255,0.82)" />
        <circle cx="78" cy="117" r="10" fill="rgba(255,255,255,0.72)" />
        <circle cx="144" cy="118" r="10" fill="rgba(255,255,255,0.9)" />
      </svg>
    );
  }

  if (art === "service") {
    return (
      <svg viewBox="0 0 220 150" className="slide-visual-svg" aria-hidden="true">
        <path d="M45 106c18 0 22-22 36-22 10 0 15 11 29 11 12 0 18-10 29-10 12 0 18 12 37 12" stroke="rgba(255,255,255,0.95)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M52 52l18 30 26-42 15 24 18-14 18 30" stroke="rgba(255,255,255,0.84)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="70" cy="82" r="10" fill="rgba(255,255,255,0.92)" />
        <circle cx="150" cy="80" r="10" fill="rgba(255,255,255,0.78)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" className="slide-visual-svg" aria-hidden="true">
      <rect x="42" y="28" width="74" height="94" rx="16" fill="rgba(255,255,255,0.95)" />
      <rect x="58" y="44" width="42" height="8" rx="4" fill="rgba(95,1,19,0.18)" />
      <rect x="58" y="61" width="42" height="8" rx="4" fill="rgba(95,1,19,0.1)" />
      <rect x="58" y="78" width="28" height="8" rx="4" fill="rgba(95,1,19,0.1)" />
      <path d="M145 42c12 0 21 9 21 21 0 27-34 42-34 42s-34-15-34-42c0-12 9-21 21-21 7 0 10 3 13 8 3-5 6-8 13-8z" fill="rgba(255,255,255,0.82)" />
    </svg>
  );
};
