import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'
import mainPic from '../assets/main pic.jpg'
import maksegoTselot from '../assets/maksego tselot.jpg'
import segoTselot from '../assets/sego tselot.jpg'
import erobTselot from '../assets/erob tselot.jpg'
import gcTselot from '../assets/GC tselot.jpg'
import arebTselot from '../assets/areb tselot.jpg'

export default function HomePage() {
  const { t } = useTranslation()
  const [selectedPrayerImage, setSelectedPrayerImage] = useState(null)

  useEffect(() => {
    if (!selectedPrayerImage) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedPrayerImage])

  const courseSchedule = t('home.courseSchedule', { returnObjects: true })
  const prayerSchedule = t('home.prayerSchedule', { returnObjects: true })
  const additionalPrograms = t('home.additionalPrograms', { returnObjects: true })
  const knowledgeItems = t('home.knowledgeItems', { returnObjects: true })

  const prayerImageByDay = {
    [prayerSchedule[0]?.day]: segoTselot,
    [prayerSchedule[1]?.day]: maksegoTselot,
    [prayerSchedule[2]?.day]: erobTselot,
    [prayerSchedule[3]?.day]: gcTselot,
    [prayerSchedule[4]?.day]: arebTselot,
  }

  return (
    <main className="pb-28 page-entrance">
      <section className="relative min-h-163.75 flex flex-col justify-end px-6 md:px-10 lg:pl-20 lg:pr-12 py-12 lg:justify-start lg:pt-16 lg:pb-10 xl:justify-end xl:py-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt={t('home.heroImageAlt')}
            className="w-full h-full object-cover object-top md:object-[center_-24px] lg:object-[center_-72px] xl:object-[center_-96px]"
            src={mainPic}
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/35 to-[#1a2524]/10" />
        </div>
        <div className="relative z-10 space-y-6 max-w-3xl stagger-fade" style={{ animationDelay: '80ms' }}>
          <div className="inline-block px-3.5 py-1.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_8px_22px_rgba(51,33,0,0.2)]">
            {t('home.established')}
          </div>
          <img
            src={huggLogo}
            alt={t('common.logoAlt')}
            className="h-28 w-28 md:h-32 md:w-32 lg:h-28 lg:w-28 xl:h-36 xl:w-36 object-contain rounded-full bg-white/90 p-2 shadow-[0_12px_30px_rgba(15,38,34,0.24)] hero-logo-glow"
          />
          <h2 className="font-headline text-5xl md:text-7xl text-white leading-[1.08] font-semibold italic drop-shadow-[0_8px_22px_rgba(0,0,0,0.25)]">
            {t('home.titleLine1')} <br /> {t('home.titleLine2')}
          </h2>
          <p className="text-white/88 font-body text-lg md:text-xl leading-relaxed max-w-xl">
            {t('home.intro')}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a className="sacred-gradient text-on-primary px-8 py-4 rounded-full font-semibold flex items-center gap-2 group transition-all shadow-[0_14px_30px_rgba(8,61,65,0.3)] active:scale-95" href="/app/login">
              Member Login
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">login</span>
            </a>
            <Link className="sacred-gradient text-on-primary px-8 py-4 rounded-full font-semibold flex items-center gap-2 group transition-all shadow-[0_14px_30px_rgba(8,61,65,0.3)] active:scale-95" to="/background">
              {t('home.ctaReadMore')}
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link className="bg-white/12 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/24 transition-all" to="/about">
              {t('home.ctaAbout')}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-20 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:row-span-2 bg-surface-container-lowest/95 rounded-2xl p-8 vellum-shadow flex flex-col justify-between group overflow-hidden relative hover-lift-card stagger-fade" style={{ animationDelay: '140ms' }}>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">history_edu</span>
              <h3 className="font-headline text-3xl text-primary font-bold mb-4">{t('home.historyTitle')}</h3>
              <p className="text-on-surface-variant font-body leading-relaxed max-w-md">
                {t('home.historyDescription')}
              </p>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                history_edu
              </span>
            </div>
            <Link className="text-primary font-bold flex items-center gap-2 mt-8 z-10 group-hover:gap-4 transition-all" to="/background">
              {t('home.viewMore')}
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>

          <div className="md:col-span-4 md:row-span-1 bg-primary-container rounded-2xl p-6 flex flex-col justify-between text-on-primary-container hover-lift-card stagger-fade" style={{ animationDelay: '220ms' }}>
            <div>
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary-fixed">event</span>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">{t('home.nextSession')}</span>
              </div>
              <h4 className="font-headline text-xl mt-4 text-white">{t('home.weeklyProgramTitle')}</h4>
            </div>
            <p className="text-sm opacity-90">{t('home.weeklyProgramHint')}</p>
          </div>

          <div className="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between vellum-shadow hover-lift-card stagger-fade" style={{ animationDelay: '260ms' }}>
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
            <div>
              <h4 className="font-headline text-xl text-primary font-bold">{t('home.digitalLibraryTitle')}</h4>
              <p className="text-xs text-on-surface-variant mt-2">{t('home.digitalLibraryDescription')}</p>
            </div>
          </div>

          <div className="md:col-span-12 rounded-[1.75rem] bg-surface-container-lowest/95 p-6 md:p-8 vellum-shadow space-y-8 stagger-fade" style={{ animationDelay: '320ms' }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h4 className="font-headline text-3xl text-primary font-bold">{t('home.detailedWeeklyProgram')}</h4>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed/35 px-4 py-1 text-xs font-bold text-on-secondary-fixed tracking-wide">
                <span className="material-symbols-outlined text-base">schedule</span>
                {t('home.scheduleBadge')}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <article className="rounded-xl bg-surface-container-low p-5 md:p-6 border border-outline-variant/30">
                <h5 className="font-headline text-2xl text-primary font-bold mb-4">{t('home.courseScheduleTitle')}</h5>
                <div className="space-y-3">
                  {courseSchedule.map((item) => (
                    <div key={item.day} className="flex items-start gap-3 rounded-lg bg-surface px-4 py-3">
                      <span className="min-w-17 text-xs font-bold tracking-wide uppercase text-secondary">{item.day}</span>
                      <p className="text-sm text-on-surface-variant">{item.plan}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl bg-surface-container-low p-5 md:p-6 border border-outline-variant/30">
                <h5 className="font-headline text-2xl text-primary font-bold mb-4">{t('home.prayerScheduleTitle')}</h5>
                <div className="space-y-4">
                  {prayerSchedule.map((item) => {
                    const prayerImage = prayerImageByDay[item.day]
                    const isFriday = item.day === prayerSchedule[4]?.day

                    return (
                      <article
                        key={item.day}
                          className={[
                            'rounded-xl border p-3 md:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(15,38,34,0.14)]',
                          isFriday
                            ? 'bg-linear-to-br from-primary-container/30 via-surface to-surface border-primary/30'
                            : 'bg-surface border-outline-variant/30',
                        ].join(' ')}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            type="button"
                            onClick={() => setSelectedPrayerImage({ day: item.day, plan: item.plan, src: prayerImage })}
                            className="group/image relative block h-32 sm:h-27.5 sm:w-42.5 rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest focus:outline-none"
                            aria-label={t('home.aria.zoomPrayerImage', { day: item.day })}
                          >
                            <img
                              src={prayerImage}
                              alt={t('home.aria.prayerImageAlt', { day: item.day })}
                              className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover/image:scale-105 group-focus-visible/image:scale-105"
                            />
                            <span className="absolute inset-0 bg-linear-to-t from-[#151c27]/40 via-transparent to-transparent" />
                            <span className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm">
                              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                            </span>
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="inline-flex h-7 items-center rounded-full bg-primary text-white px-2.5 text-[11px] font-bold tracking-wide">{item.day}</span>
                              {isFriday ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed/35 px-2.5 py-1 text-[10px] font-semibold text-on-secondary-fixed tracking-wide uppercase">
                                  <span className="material-symbols-outlined text-[14px]">priority_high</span>
                                  {t('home.mainPrayer')}
                                </span>
                              ) : null}
                            </div>

                            <p className={[
                              'text-sm md:text-[15px] leading-relaxed',
                              isFriday ? 'text-primary font-semibold' : 'text-on-surface-variant',
                            ].join(' ')}>
                              {item.plan}
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </article>
            </div>

            <article className="rounded-xl bg-primary-container p-5 md:p-6 text-on-primary-container">
              <h5 className="font-headline text-2xl text-white font-bold mb-4">{t('home.additionalProgramsTitle')}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalPrograms.map((program) => (
                  <div className="rounded-lg bg-white/10 px-4 py-4" key={program.day}>
                    <p className="text-sm font-semibold">{program.day}</p>
                    <p className="text-sm opacity-95 mt-1">{program.title}</p>
                    <p className="text-xs opacity-85 mt-1">{program.time}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="md:col-span-12 text-center max-w-3xl mx-auto space-y-6 pt-6 stagger-fade" style={{ animationDelay: '380ms' }}>
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              format_quote
            </span>
            <blockquote className="font-headline text-3xl text-primary italic leading-relaxed">
              {t('home.quote')}
            </blockquote>
            <cite className="block font-body text-xs tracking-[0.3em] uppercase text-on-surface-variant font-bold">{t('home.quoteSource')}</cite>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-20 bg-surface-container-low/45 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="group aspect-4/5 bg-surface-container-highest rounded-2xl overflow-hidden vellum-shadow -rotate-2 hover-lift-card stagger-fade" style={{ animationDelay: '120ms' }}>
              <img
                alt={t('home.knowledgeImageAlt')}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Display_of_Procesional_Crosses,_Church_of_Bet_Maryam,_Lalibela,_Ethiopia_(3230772118).jpg"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 aspect-square bg-secondary-fixed rounded-2xl vellum-shadow rotate-6 p-4 flex items-end stagger-fade" style={{ animationDelay: '220ms' }}>
              <p className="text-on-secondary-fixed text-xs font-bold leading-tight">{t('home.knowledgeNote')}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8 stagger-fade" style={{ animationDelay: '300ms' }}>
            <h3 className="font-headline text-4xl text-primary leading-tight">{t('home.knowledgeTitle')}</h3>
            <div className="space-y-6">
              {knowledgeItems.map((item, index) => (
                <div className="flex gap-4" key={item.title}>
                  <div className="shrink-0 w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">{index === 0 ? 'school' : 'groups'}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-primary">{item.title}</h5>
                    <p className="text-sm text-on-surface-variant mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedPrayerImage
        ? createPortal(
            <div
              className="fixed inset-0 z-90 bg-[#151c27]/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
              onClick={() => setSelectedPrayerImage(null)}
            >
              <div
                className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={selectedPrayerImage.src}
                  alt={t('home.aria.prayerImageAlt', { day: selectedPrayerImage.day })}
                  className="w-full max-h-[78vh] object-contain bg-surface-container-lowest p-2 md:p-3 transition-transform duration-500 hover:scale-[1.01]"
                />

                <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5 bg-linear-to-t from-[#151c27]/80 via-[#151c27]/35 to-transparent text-white">
                  <p className="text-xs font-bold tracking-widest uppercase opacity-90">{selectedPrayerImage.day}</p>
                  <p className="text-sm md:text-base font-semibold mt-1">{selectedPrayerImage.plan}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPrayerImage(null)}
                  className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105"
                  aria-label={t('home.aria.closePrayerPreview')}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </main>
  )
}
