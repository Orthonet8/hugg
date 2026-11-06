import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'

function isActive(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname.startsWith(to)
}

export default function SiteLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef(null)
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
    setIsLanguageMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = activeLanguage
  }, [activeLanguage])

  useEffect(() => {
    if (!isLanguageMenuOpen) return undefined

    function handleOutsideClick(event) {
      if (!languageMenuRef.current?.contains(event.target)) {
        setIsLanguageMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setIsLanguageMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isLanguageMenuOpen])

  return (
    <div className="page-shell bg-surface text-on-surface min-h-screen font-body">
      <div className="fixed top-4 right-4 z-70" ref={languageMenuRef}>
        <button
          type="button"
          onClick={() => setIsLanguageMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-outline-variant/60 bg-secondary-fixed/95 text-on-secondary-fixed px-3.5 py-2 text-[10px] font-bold tracking-[0.14em] uppercase shadow-[0_10px_28px_rgba(21,28,39,0.14)]"
          aria-label={t('language.menuAria')}
          aria-expanded={isLanguageMenuOpen}
          aria-haspopup="menu"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            translate
          </span>
          {t(`language.code.${activeLanguage}`)}
        </button>

        {isLanguageMenuOpen ? (
          <div className="absolute right-0 top-full mt-2 w-55 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/95 backdrop-blur-xl p-2 shadow-[0_16px_34px_rgba(21,28,39,0.18)]">
            <p className="px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant font-semibold">{t('language.label')}</p>
            <div className="space-y-1">
              {languageOptions.map((option) => {
                const active = activeLanguage === option.code
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleLanguageSelect(option.code)}
                    className={[
                      'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all',
                      active ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
                    ].join(' ')}
                    role="menuitem"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-bold">{option.displayCode}</span>
                      <span className="text-xs opacity-80">{option.label}</span>
                    </span>
                    {active ? <span className="material-symbols-outlined text-[18px]">check</span> : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

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
        </div>

        <a
          href="/app/login"
          className="hidden md:inline-flex md:mr-24 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-on-primary shadow-[0_8px_18px_rgba(8,61,65,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[16px]">login</span>
          Member Login
        </a>
      </nav>

      <a
        href="/app/login"
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-on-primary shadow-[0_10px_22px_rgba(8,61,65,0.22)] md:hidden"
      >
        <span className="material-symbols-outlined text-[16px]">login</span>
        Login
      </a>
    </div>
  )
}
