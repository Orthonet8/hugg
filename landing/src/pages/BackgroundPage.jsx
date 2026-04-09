import huggLogo from '../assets/hugg-logo.png'
import { useTranslation } from 'react-i18next'

export default function BackgroundPage() {
  const { t } = useTranslation()
  const timeline = t('background.timeline', { returnObjects: true })
  const purposeItems = t('background.purposeItems', { returnObjects: true })

  return (
    <main className="min-h-screen pb-32 amharic-lh page-entrance">
      <section className="relative h-88.25 w-full flex items-end px-6 md:px-10 lg:pl-20 lg:pr-12 py-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt={t('background.alt.hero')} className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Bet_Amanuel_church,_Lalibela.jpg" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/22 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <img
            src={huggLogo}
            alt={t('common.logoAlt')}
            className="h-20 w-20 md:h-24 md:w-24 object-contain mb-4 rounded-full bg-white/90 p-2 shadow-[0_12px_30px_rgba(21,28,39,0.22)]"
          />
          <h2 className="font-headline text-5xl md:text-6xl text-white font-bold leading-tight mb-4 italic">{t('background.heroTitle')}</h2>
          <div className="h-1 w-24 bg-secondary-fixed" />
        </div>
      </section>

      <div className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-12 max-w-5xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
            <h3 className="font-headline text-3xl text-primary font-bold mb-6">{t('background.introTitle')}</h3>
            <p className="text-on-surface/90 text-lg">
              {t('background.introBody')}
            </p>
          </div>
          <div className="md:col-span-4 bg-primary-container text-on-primary-container p-8 rounded-xl vellum-shadow flex flex-col justify-center items-center text-center space-y-4 hover-lift-card">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              history_edu
            </span>
            <p className="font-bold text-2xl font-headline">{t('background.serviceYears')}</p>
          </div>
        </div>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/30" />
            <h3 className="font-headline text-2xl font-bold text-secondary uppercase tracking-widest px-4">{t('background.journeyTitle')}</h3>
            <div className="h-px flex-1 bg-outline-variant/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 md:mt-12">
              <div className="bg-surface-container-low p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
                <span className="text-secondary font-bold text-sm tracking-tighter block mb-2">{timeline[0].period}</span>
                <h4 className="font-headline text-xl font-bold text-primary mb-3">{timeline[0].title}</h4>
                <p className="text-on-surface-variant">{timeline[0].body}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-surface-container-low p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
                <span className="text-secondary font-bold text-sm tracking-tighter block mb-2">{timeline[1].period}</span>
                <h4 className="font-headline text-xl font-bold text-primary mb-3">{timeline[1].title}</h4>
                <p className="text-on-surface-variant">{timeline[1].body}</p>
              </div>
              <div className="bg-surface-container-lowest p-1 rounded-xl vellum-shadow">
                <img alt={t('background.alt.study')} className="w-full h-64 object-cover rounded-lg" src="https://commons.wikimedia.org/wiki/Special:FilePath/Display_of_Procesional_Crosses,_Church_of_Bet_Maryam,_Lalibela,_Ethiopia_(3230772118).jpg" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-high rounded-3xl p-10 md:p-16 relative overflow-hidden vellum-shadow hover-lift-card">
          <div className="absolute -right-20 -top-20 opacity-5">
            <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              menu_book
            </span>
          </div>
          <div className="relative z-10 max-w-2xl amharic-lh">
            <h3 className="font-headline text-4xl text-primary font-bold mb-8 italic">{t('background.purposeTitle')}</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">auto_awesome</span>
                <div>
                  <span className="font-bold text-lg text-primary block">{purposeItems[0].title}</span>
                  <p className="text-on-surface-variant">{purposeItems[0].body}</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">diversity_3</span>
                <div>
                  <span className="font-bold text-lg text-primary block">{purposeItems[1].title}</span>
                  <p className="text-on-surface-variant">{purposeItems[1].body}</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">volunteer_activism</span>
                <div>
                  <span className="font-bold text-lg text-primary block">{purposeItems[2].title}</span>
                  <p className="text-on-surface-variant">{purposeItems[2].body}</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="text-center py-12">
          <blockquote className="font-headline text-2xl md:text-4xl text-primary/80 italic font-medium max-w-3xl mx-auto leading-relaxed">
            {t('background.quote')}
          </blockquote>
        </section>
      </div>
    </main>
  )
}
