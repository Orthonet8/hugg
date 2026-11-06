import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'

function isActive(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname.startsWith(to)
}

function LanguageSelector({ activeLanguage, languageOptions, onSelect, t }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-outline-variant/60 bg-secondary-fixed/95 hover:bg-secondary-fixed text-on-secondary-fixed px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase shadow-[0_4px_14px_rgba(21,28,39,0.12)] transition-all active:scale-95 cursor-pointer"
        aria-label={t('language.menuAria')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="material-symbols-outlined text-[16px] sm:text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          translate
        </span>
        <span>{t(`language.code.${activeLanguage}`)}</span>
        <span className="material-symbols-outlined text-[14px] opacity-75">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/98 backdrop-blur-xl p-2 shadow-[0_16px_34px_rgba(21,28,39,0.18)] z-60 animate-in fade-in duration-150">
          <p className="px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
            {t('language.label')}
          </p>
          <div className="space-y-1 mt-1">
            {languageOptions.map((option) => {
              const active = activeLanguage === option.code
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    onSelect(option.code)
                    setIsOpen(false)
                  }}
                  className={[
                    'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all cursor-pointer',
                    active
                      ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
                  ].join(' ')}
                  role="menuitem"
                >
                  <span className="flex flex-col">
                    <span className="text-xs font-bold">{option.displayCode}</span>
                    <span className="text-[11px] opacity-80">{option.label}</span>
                  </span>
                  {active && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SiteLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const activeLanguage = i18n.language?.split('-')[0] || 'am'

  const navItems = [
    { to: '/', label: t('nav.home'), icon: 'home' },
    { to: '/about', label: t('nav.about'), icon: 'info' },
    { to: '/blog', label: t('nav.blog'), icon: 'article' },
    { to: '/background', label: t('nav.background'), icon: 'menu_book' },
  ]

  const languageOptions = [
    { code: 'en', displayCode: t('language.code.en'), label: t('language.en') },
    { code: 'am', displayCode: t('language.code.am'), label: t('language.am') },
    { code: 'om', displayCode: t('language.code.om'), label: t('language.om') },
  ]

  function handleLanguageSelect(code) {
    i18n.changeLanguage(code)
    localStorage.setItem('hugg-language', code)
  }

  useEffect(() => {
    document.documentElement.lang = activeLanguage
  }, [activeLanguage])

  return (
    <div className="page-shell bg-surface text-on-surface min-h-screen font-body">
      {/* Mobile-only top-right floating actions: Member Portal + Language Selector */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex md:hidden items-center gap-2">
        <a
          href="/app/login"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/95 hover:bg-primary text-white px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.06em] uppercase shadow-[0_8px_20px_rgba(8,61,65,0.22)] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="የአባላት መግቢያ / Member Portal"
        >
          <span className="material-symbols-outlined text-[16px]">account_circle</span>
          <span>መግቢያ</span>
        </a>

        <LanguageSelector
          activeLanguage={activeLanguage}
          languageOptions={languageOptions}
          onSelect={handleLanguageSelect}
          t={t}
        />
      </div>

      <div className={isHomePage ? 'relative z-10 pt-0 md:pt-0' : 'relative z-10 pt-0 md:pt-24'}>
        <Outlet />
      </div>

      <nav
        className={[
          'fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.2rem)] max-w-3xl flex items-center px-1.5 pt-1.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] rounded-[1.35rem] bg-white/86 backdrop-blur-[10px] z-50 border border-white/70 shadow-[0_14px_26px_rgba(15,38,34,0.12)] md:top-0 md:bottom-auto md:left-0 md:translate-x-0 md:w-full md:max-w-none md:bg-white/72 md:backdrop-blur-[14px] md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:border-white/65 md:shadow-[0_8px_20px_rgba(15,38,34,0.06)] md:px-4 md:py-1.5 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-3',
        ].join(' ')}
      >
        <div className="hidden md:flex items-center gap-2 shrink-0 pl-1">
          <img
            src={huggLogo}
            alt={t('common.logoAlt')}
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
                  'relative flex-1 flex flex-col items-center justify-center px-1 py-1.5 rounded-xl transition-all duration-200 ease-in-out md:flex-none md:flex-row md:gap-1 md:px-3 md:py-1.5 md:rounded-full md:hover:bg-primary-container md:hover:text-on-primary md:hover:-translate-y-1 md:hover:shadow-[0_8px_16px_rgba(8,61,65,0.22)] md:hover:scale-[1.01]',
                  active
                    ? 'bg-primary/10 text-primary md:bg-primary md:text-on-primary'
                    : 'text-on-surface opacity-75 hover:opacity-100',
                ].join(' ')}
              >
                <span className="relative flex h-8 w-8 items-center justify-center md:h-auto md:w-auto">
                  <span
                    className={[
                      'absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity md:hidden',
                      active ? 'bg-secondary-fixed opacity-100' : 'opacity-0',
                    ].join(' ')}
                  />
                  <span className="material-symbols-outlined relative z-10 text-[26px] leading-none md:hidden" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {item.icon}
                  </span>
                </span>
                <span className="font-sans text-[10px] font-semibold tracking-[0.06em] uppercase mt-0.5 md:mt-0 md:text-[10px]">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-2.5 shrink-0 pr-2">
          <LanguageSelector
            activeLanguage={activeLanguage}
            languageOptions={languageOptions}
            onSelect={handleLanguageSelect}
            t={t}
          />
          <a
            href="/app/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary px-3.5 py-1.5 text-[11px] font-bold tracking-wider shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
            title="የአባላት መግቢያ / Member Portal"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>መግቢያ / Login</span>
          </a>
        </div>
      </nav>
    </div>
  )
}
