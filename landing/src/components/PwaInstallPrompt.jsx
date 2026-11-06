import { useEffect, useState } from 'react'
import huggLogo from '../assets/hugg-logo.png'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowModal(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowModal(true)
      } else {
        // Direct to app login where manifest prompt engages
        window.location.href = '/app/login'
      }
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setShowModal(false)
    }
    setDeferredPrompt(null)
  }

  if (isInstalled) return null

  return (
    <>
      {/* Top Banner Button on Landing */}
      <div className="fixed top-4 left-4 z-70">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest/95 text-primary px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] uppercase shadow-[0_10px_28px_rgba(21,28,39,0.14)] hover:bg-primary hover:text-white transition-all active:scale-95"
          title="Install PWA"
        >
          <span className="material-symbols-outlined text-[16px]">install_mobile</span>
          <span>Install App / መተግበሪያ ጫን</span>
        </button>
      </div>

      {/* Custom Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-outline-variant/60 bg-surface-container-lowest/98 p-6 shadow-2xl text-on-surface">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-xl p-1 text-on-surface-variant hover:bg-surface-container"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-3.5">
              <img
                src={huggLogo}
                alt="HU Gibi Gubae"
                className="h-14 w-14 rounded-2xl object-contain bg-white/95 p-1.5 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-primary font-headline">
                  HU Gibi Gubae
                </h3>
                <p className="text-xs font-semibold text-secondary-fixed">
                  የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ
                </p>
                <span className="text-[10px] opacity-75">Official Mobile & Web App</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-surface-container p-3.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                <span>One-tap access directly from your Home Screen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                <span>Fast & smooth offline-ready performance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                <span>Full access to calendar, news, family, and support chat</span>
              </div>
            </div>

            {isIOS && (
              <div className="mt-4 rounded-2xl bg-amber-500/10 p-3 text-xs text-on-surface border border-amber-500/30">
                <p className="font-bold flex items-center gap-1.5 text-amber-700">
                  <span className="material-symbols-outlined text-[16px]">ios_share</span> To install on iPhone / iPad:
                </p>
                <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-[11px] opacity-90">
                  <li>Tap the <strong>Share</strong> icon at the bottom of Safari</li>
                  <li>Select <strong>Add to Home Screen</strong></li>
                  <li>Confirm by tapping <strong>Add</strong></li>
                </ol>
              </div>
            )}

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl border border-outline-variant/60 bg-surface-container py-3 text-xs font-bold opacity-80 hover:opacity-100 transition"
              >
                Cancel / ሰርዝ
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-[1.4] flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-on-primary shadow-md hover:bg-primary-container transition active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Install Now / ጫን</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
