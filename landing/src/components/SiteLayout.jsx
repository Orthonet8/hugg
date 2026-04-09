import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'

const navItems = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/about', label: 'About', icon: 'info' },
  { to: '/blog', label: 'Blog', icon: 'article' },
  { to: '/background', label: 'Background', icon: 'menu_book' },
]

function isActive(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname.startsWith(to)
}

export default function SiteLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [language, setLanguage] = useState('EN')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const languageOptions = [
    { code: 'EN', label: 'English' },
    { code: 'አማ', label: 'Amharic' },
    { code: 'AFO', label: 'Afan Oromo' },
  ]

  function handleLanguageSelect(code) {
    setLanguage(code)
    setIsLanguageMenuOpen(false)
  }

  return (
    <div className="page-shell bg-surface text-on-surface min-h-screen font-body">
      <button
        type="button"
        onClick={() => setIsLanguageMenuOpen(true)}
        className="fixed top-4 right-4 z-70 flex items-center gap-2 px-3.5 py-2 rounded-full bg-secondary-fixed/95 text-on-secondary-fixed text-[10px] font-bold tracking-[0.14em] uppercase shadow-[0_10px_28px_rgba(15,38,34,0.16)] border border-white/60"
        aria-label="Open language selector"
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          translate
        </span>
        {language}
      </button>

      {isLanguageMenuOpen ? (
        <div className="fixed inset-0 z-60 bg-[#151c27]/24 backdrop-blur-[2px]" onClick={() => setIsLanguageMenuOpen(false)}>
          <aside
            className="absolute left-0 right-0 bottom-0 mx-auto max-w-xl rounded-t-3xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-20px_60px_rgba(21,28,39,0.18)] p-5 animate-[slideUp_240ms_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant font-semibold">Language</p>
                <h2 className="font-headline text-2xl text-primary font-bold">Select your language</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {languageOptions.map((option) => {
                const active = language === option.code
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleLanguageSelect(option.code)}
                    className={[
                      'w-full flex items-center justify-between rounded-2xl px-4 py-4 text-left transition-all',
                      active ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-low text-on-surface',
                    ].join(' ')}
                  >
                    <span>
                      <span className="block font-headline text-xl font-bold">{option.code}</span>
                      <span className="block text-sm opacity-80">{option.label}</span>
                    </span>
                    {active ? <span className="material-symbols-outlined">check_circle</span> : <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                )
              })}
            </div>
          </aside>
        </div>
      ) : null}

      <div className={isHomePage ? 'relative z-10 pt-0 md:pt-0' : 'relative z-10 pt-0 md:pt-24'}>
        <Outlet />
      </div>

      <nav
        className={[
          'fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.2rem)] max-w-3xl flex items-center px-1.5 pt-1.5 pb-2.5 rounded-[1.35rem] bg-white/86 backdrop-blur-[10px] z-50 border border-white/70 shadow-[0_14px_26px_rgba(15,38,34,0.12)] md:top-0 md:bottom-auto md:left-0 md:translate-x-0 md:w-full md:max-w-none md:bg-white/72 md:backdrop-blur-[14px] md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:border-white/65 md:shadow-[0_8px_20px_rgba(15,38,34,0.06)] md:px-3 md:py-1.5 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-2',
        ].join(' ')}
      >
        <div className="hidden md:flex items-center gap-2 shrink-0 pl-1">
          <img
            src={huggLogo}
            alt="HUGG logo"
            className="h-7 w-7 object-contain rounded-full bg-white/95 p-0.5 shadow-[0_6px_12px_rgba(15,38,34,0.16)]"
          />
          <h1 className="font-headline font-bold italic text-[15px] tracking-tight text-primary">HU Gibi Gubae</h1>
        </div>

        <div className="flex w-full items-center justify-between md:justify-center md:gap-1 md:justify-self-center md:w-auto md:min-w-max">
          {navItems.map((item) => {
            const active = isActive(location.pathname, item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  'relative flex-1 flex flex-col items-center justify-center px-1 py-2.5 rounded-xl transition-all duration-200 ease-in-out md:flex-none md:flex-row md:gap-1 md:px-3 md:py-1.5 md:rounded-full md:hover:bg-primary-container md:hover:text-on-primary md:hover:-translate-y-1 md:hover:shadow-[0_8px_16px_rgba(8,61,65,0.22)] md:hover:scale-[1.01]',
                  active
                    ? 'bg-primary/10 text-primary md:bg-primary md:text-on-primary'
                    : 'text-on-surface opacity-75 hover:opacity-100',
                ].join(' ')}
              >
                <span className="relative flex h-10 w-10 items-center justify-center md:h-auto md:w-auto">
                  <span
                    className={[
                      'absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity md:hidden',
                      active ? 'bg-secondary-fixed opacity-100' : 'opacity-0',
                    ].join(' ')}
                  />
                  <span className="material-symbols-outlined relative z-10 text-[34px]! leading-none md:hidden" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {item.icon}
                  </span>
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase mt-1 md:mt-0 md:text-[10px]">{item.label}</span>
              </Link>
            )
          })}

          <div className="hidden md:block w-22.5" aria-hidden="true" />
        </div>
      </nav>
    </div>
  )
}
