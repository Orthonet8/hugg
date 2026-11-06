import huggLogo from '../assets/hugg-logo.png'
import { useTranslation } from 'react-i18next'

export default function BlackPage() {
  const { t } = useTranslation()
  const chips = t('black.chips', { returnObjects: true })
  const cards = t('black.cards', { returnObjects: true })
  const academicParagraphs = t('black.academicParagraphs', { returnObjects: true })

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 lg:pl-20 lg:pr-12 py-8 pb-32 amharic-lh page-entrance">
      <section className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary-container p-8 mb-12 vellum-shadow min-h-100 flex flex-col justify-end hover-lift-card">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Ark_of_the_Covenant_church_in_Axum_Ethiopia.jpg" alt={t('black.alt.hero')} />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/14 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <img src={huggLogo} alt={t('common.logoAlt')} className="h-20 w-20 md:h-24 md:w-24 object-contain mb-4 rounded-full bg-white/90 p-1.5" />
          <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">
            {t('black.chip')}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold italic mb-6 leading-tight text-white">{t('black.title')}</h2>
          <p className="text-lg md:text-xl font-body font-light amharic-text opacity-90 leading-relaxed">
            {t('black.intro')}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 vellum-shadow flex flex-col justify-between hover-lift-card">
          <div>
            <h3 className="text-3xl font-headline font-bold text-primary mb-4 amharic-text">{t('black.meaningTitle')}</h3>
            <p className="text-on-surface-variant amharic-text text-lg mb-8">
              {t('black.meaningBody')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full text-xs" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container rounded-xl p-8 flex flex-col justify-center items-center text-center hover-lift-card">
          <span className="material-symbols-outlined text-5xl mb-6 opacity-50">format_quote</span>
          <p className="font-headline italic text-2xl amharic-text leading-snug">{t('black.scriptureQuote')}</p>
          <div className="h-px w-12 bg-secondary-container my-6" />
          <p className="text-sm font-bold tracking-widest uppercase opacity-70">{t('black.scriptureRef')}</p>
        </div>

        {cards.map((card, index) => (
          <div className="bg-surface-container-lowest rounded-xl p-6 vellum-shadow flex items-start gap-4 hover-lift-card" key={card.title}>
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">{['book_2', 'history_edu', 'church'][index]}</span>
            </div>
            <div>
              <h4 className="font-bold text-primary amharic-text">{card.title}</h4>
              <p className="text-sm text-on-surface-variant amharic-text">{card.desc}</p>
            </div>
          </div>
        ))}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12 md:col-span-3 bg-surface-container-low/40 rounded-3xl px-6 md:px-10 lg:px-12 vellum-shadow hover-lift-card">
          <div>
            <h2 className="text-4xl font-headline font-bold text-primary mb-8 amharic-text">{t('black.academicTitle')}</h2>
            <div className="space-y-6 text-on-surface-variant amharic-text text-lg leading-relaxed">
              {academicParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <a className="mt-10 inline-flex px-8 py-3 bg-linear-to-r from-primary-container to-primary text-on-primary rounded-md font-bold text-sm tracking-wide amharic-text" href="/about">
              {t('black.readMore')}
            </a>
          </div>
          <div className="relative">
            <div className="aspect-4/5 rounded-2xl overflow-hidden vellum-shadow">
              <img className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Gondar_Fasiladas_Bath_Timket.jpg" alt={t('black.alt.finalImage')} />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-secondary-container p-6 rounded-xl vellum-shadow max-w-xs">
              <p className="font-headline font-bold text-on-secondary-container text-xl amharic-text italic">{t('black.sideQuote')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
