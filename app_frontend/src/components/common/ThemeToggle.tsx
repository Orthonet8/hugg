import { MoonStar, Sun } from "lucide-react";
import { useThemeMode } from "../../hooks/useThemeMode";

export const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-[0_8px_20px_rgba(57,0,7,0.12)] transition hover:bg-[color:var(--surface-soft)] active:scale-95"
      aria-label={mode === "dark" ? "ወደ ብርሃን ቅጥ ቀይር" : "ወደ ጨለማ ቅጥ ቀይር"}
      title={mode === "dark" ? "ብርሃን ቅጥ" : "ጨለማ ቅጥ"}
    >
      {mode === "dark" ? <Sun size={18} /> : <MoonStar size={18} />}
    </button>
  );
};
