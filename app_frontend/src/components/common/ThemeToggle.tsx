import { MoonStar, Sun } from "lucide-react";
import { useThemeMode } from "../../hooks/useThemeMode";

export const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-[0_8px_20px_rgba(57,0,7,0.12)] transition hover:bg-[color:var(--surface-soft)]"
      aria-label={mode === "dark" ? "ወደ ብርሃን ቅጥ ቀይር" : "ወደ ጨለማ ቅጥ ቀይር"}
      title={mode === "dark" ? "ብርሃን ቅጥ" : "ጨለማ ቅጥ"}
    >
      {mode === "dark" ? <Sun size={19} /> : <MoonStar size={19} />}
    </button>
  );
};
