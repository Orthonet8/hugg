import { useEffect, useState } from "react";
import { Download, X, CheckCircle, Share } from "lucide-react";

export const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-suggest after short delay if not dismissed recently
      const dismissed = localStorage.getItem("hugg_pwa_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setShowModal(true), 2500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowModal(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowModal(true);
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowModal(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem("hugg_pwa_dismissed", String(Date.now()));
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Install Badge Button (Always available for users who want to install) */}
      <div className="fixed top-4 left-4 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[color:var(--primary)] shadow-md backdrop-blur-md transition-all hover:bg-[color:var(--primary)] hover:text-white active:scale-95"
          title="Install HU Gibi Gubae App"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--surface-soft)] text-[color:var(--primary)] group-hover:bg-white/20 group-hover:text-white">
            <Download size={12} />
          </span>
          <span>Install App / መተግበሪያ ጫን</span>
        </button>
      </div>

      {/* Mobile Header / Quick Install Icon for smaller screens */}
      <div className="fixed top-4 right-16 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-md active:scale-95"
          title="Install App"
        >
          <Download size={16} />
        </button>
      </div>

      {/* Custom Designed PWA Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-2xl transition-all">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* App Icon & Branding */}
            <div className="flex items-center gap-3.5">
              <img
                src="/app/icons/icon-192.png"
                alt="HU Gibi Gubae"
                className="h-14 w-14 rounded-2xl object-cover shadow-md ring-2 ring-[color:var(--primary)]/20"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-[color:var(--text-primary)]">
                  HU Gibi Gubae
                </h3>
                <p className="text-xs font-semibold text-[color:var(--primary)]">
                  የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ
                </p>
                <span className="mt-0.5 inline-block text-[10px] text-[color:var(--text-muted)]">
                  Official Web & Mobile PWA
                </span>
              </div>
            </div>

            {/* Value props */}
            <div className="mt-4 space-y-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3.5 text-xs text-[color:var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                <span>Fast, lightweight & works seamlessly offline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                <span>Direct home screen icon with full-screen experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                <span>Instant access to news, calendar, support chat & family</span>
              </div>
            </div>

            {/* Instructions: iOS vs Android/Desktop */}
            {isIOS ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/80">
                <p className="font-bold flex items-center gap-1.5">
                  <Share size={14} /> To install on iPhone / iPad:
                </p>
                <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                  <li>Tap the <strong>Share</strong> button at the bottom of Safari</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                  <li>Confirm by tapping <strong>Add</strong></li>
                </ol>
              </div>
            ) : null}

            {/* Action buttons */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] py-3 text-xs font-bold text-[color:var(--text-muted)] transition hover:bg-[color:var(--soft-hover)]"
              >
                Not Now / በኋላ
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-[1.4] flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--primary)] py-3 text-xs font-bold text-[color:var(--on-primary)] shadow-md transition hover:bg-[color:var(--primary-hover)] active:scale-98"
              >
                <Download size={16} />
                <span>Install Now / ጫን</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
