import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'
import course from '../assets/course.jpg'
import course00 from '../assets/course00.jpg'
import course01 from '../assets/course01.jpg'
import mezmur from '../assets/mezmur.jpg'
import mezmur01 from '../assets/mezmur01.jpg'
import begena from '../assets/begena.jpg'
import begena00 from '../assets/begena00.jpg'
import begena01 from '../assets/begena01.jpg'
import begena03 from '../assets/begena03.jpg'
import begena06 from '../assets/begena06.jpg'
import timket1 from '../assets/timket pic 1.jpg'
import timket2 from '../assets/timket pic 2.jpg'
import timket3 from '../assets/timket pic 3 .jpg'
import freshWelcome from '../assets/fresh welcome.jpg'
import freshWelcome01 from '../assets/fresh welcome01.jpg'
import freshWelcome02 from '../assets/fresh welcome02.jpg'
import freshWelcome03 from '../assets/fresh welcome03.jpg'
import freshWelcome05 from '../assets/fresh welcome05.jpg'
import graduation from '../assets/graduation.jpg'
import graduation01 from '../assets/graduation01.jpg'
import meskel from '../assets/meskel.jpg'
import zikerMaryam from '../assets/ziker maryam.jpg'
import zikerMaryam0 from '../assets/ziker maryam0.jpg'
import zikerMaryam00 from '../assets/ziker maryam00.jpg'
import zikerMaryam01 from '../assets/ziker maryam01.jpg'

export default function AboutPage() {
  const { t } = useTranslation()
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(null)

  const serviceGalleryMeta = [
    {
      key: 'fresh',
      accent: 'from-[#5f0113] to-[#390007]',
      images: [course, course00, course01],
    },
    {
      key: 'mezmur',
      accent: 'from-[#7b5300] to-[#5f0113]',
      images: [mezmur, mezmur01],
    },
    {
      key: 'begena',
      accent: 'from-[#2f3a4e] to-[#5f0113]',
      images: [begena, begena00, begena01, begena03, begena06],
    },
    {
      key: 'timket',
      accent: 'from-[#24526a] to-[#5f0113]',
      images: [timket1, timket2, timket3],
    },
    {
      key: 'fresh-welcome',
      accent: 'from-[#6a1f33] to-[#9c6b00]',
      images: [freshWelcome, freshWelcome01, freshWelcome02, freshWelcome03, freshWelcome05],
    },
    {
      key: 'graduation',
      accent: 'from-[#2a5b4f] to-[#7b5300]',
      images: [graduation, graduation01],
    },
    {
      key: 'meskel',
      accent: 'from-[#9c6b00] to-[#5f0113]',
      images: [meskel],
    },
    {
      key: 'ziker-maryam',
      accent: 'from-[#4e345c] to-[#5f0113]',
      images: [zikerMaryam, zikerMaryam0, zikerMaryam00, zikerMaryam01],
    },
  ]

  const localizedServiceGallery = t('about.serviceGallery', { returnObjects: true })
  const valueItems = t('about.values', { returnObjects: true })
  const valueIcons = ['church', 'school', 'group', 'volunteer_activism']

  const serviceGallery = serviceGalleryMeta.map((section, index) => ({
    ...section,
    title: localizedServiceGallery[index]?.title || section.key,
    subtitle: localizedServiceGallery[index]?.subtitle || '',
  }))

  let globalImageIndex = 0
  const gallerySections = serviceGallery.map((section) => ({
    ...section,
    imageItems: section.images.map((src, imageIndex) => ({
      src,
      imageIndex,
      globalIndex: globalImageIndex++,
      title: section.title,
      subtitle: section.subtitle,
    })),
  }))

  const allGalleryImages = gallerySections.flatMap((section) => section.imageItems)

  const selectedGalleryImage = selectedGalleryIndex !== null ? allGalleryImages[selectedGalleryIndex] : null

  function closeGalleryPreview() {
    setSelectedGalleryIndex(null)
  }

  function showNextImage() {
    if (selectedGalleryIndex === null) return
    setSelectedGalleryIndex((selectedGalleryIndex + 1) % allGalleryImages.length)
  }

  function showPreviousImage() {
    if (selectedGalleryIndex === null) return
    setSelectedGalleryIndex((selectedGalleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length)
  }

  useEffect(() => {
    if (selectedGalleryIndex === null) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeGalleryPreview()
      if (event.key === 'ArrowRight') showNextImage()
      if (event.key === 'ArrowLeft') showPreviousImage()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedGalleryIndex])

  return (
    <main className="min-h-screen pb-32 amharic-lh page-entrance">
      <section className="relative pt-12 px-6 md:px-10 lg:pl-20 lg:pr-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <img src={huggLogo} alt={t('common.logoAlt')} className="mx-auto h-24 w-24 md:h-28 md:w-28 object-contain vellum-shadow" />
          <h2 className="font-headline text-3xl sm:text-5xl md:text-7xl font-bold text-primary tracking-tight leading-tight">{t('about.title')}</h2>
          <p className="amharic-text text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl -z-10" />
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 mt-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 vellum-shadow relative overflow-hidden group hover-lift-card">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs uppercase tracking-widest">
                {t('about.historyChip')}
              </div>
              <h3 className="font-headline text-3xl font-bold text-primary">{t('about.historyTitle')}</h3>
              <p className="amharic-text text-on-surface leading-relaxed text-lg">
                {t('about.historyBody')}
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
              <img alt="Ancient religious manuscript textures" className="w-full h-full object-cover grayscale" src="https://commons.wikimedia.org/wiki/Special:FilePath/Ethiopian_Madonna.jpg" />
            </div>
          </div>

          <div className="md:col-span-4 bg-primary-container rounded-xl p-8 text-on-primary vellum-shadow flex flex-col justify-between hover-lift-card">
            <span className="material-symbols-outlined text-5xl text-secondary-fixed mb-6" data-icon="auto_awesome">
              auto_awesome
            </span>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-4">{t('about.missionTitle')}</h3>
              <p className="amharic-text text-on-primary-container text-base leading-relaxed">
                {t('about.missionBody')}
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 vellum-shadow flex flex-col justify-center hover-lift-card">
            <h3 className="font-headline text-2xl font-bold text-primary mb-2">{t('about.visionTitle')}</h3>
            <p className="amharic-text text-on-surface-variant">{t('about.visionBody')}</p>
          </div>

          <div className="md:col-span-8 bg-surface-container-highest/30 rounded-xl p-10 grid grid-cols-2 gap-8 vellum-shadow hover-lift-card">
            {valueItems.map((item, index) => (
              <div className="space-y-2" key={item.title}>
                <span className="material-symbols-outlined text-secondary">{valueIcons[index]}</span>
                <h4 className="font-bold text-primary">{item.title}</h4>
                <p className="amharic-text text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-20 px-0 max-w-7xl mx-auto">
          <h3 className="font-headline text-4xl font-bold text-primary text-center mb-12">{t('about.galleryTitle')}</h3>
          <div className="space-y-10">
            {gallerySections.map((section, sectionIndex) => {
              const [featuredImage, ...restImages] = section.imageItems
              return (
                <article
                  key={section.key}
                  className="bg-surface-container-low rounded-2xl p-6 md:p-8 vellum-shadow hover-lift-card animate-[fadeInUp_560ms_ease-out_both]"
                  style={{ animationDelay: `${sectionIndex * 70}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
                    <div className="space-y-2">
                      <h4 className="font-headline text-3xl text-primary font-bold">{section.title}</h4>
                      <p className="text-sm md:text-base text-on-surface-variant amharic-text">{section.subtitle}</p>
                    </div>
                    <span className={`inline-flex h-1.5 w-36 rounded-full bg-linear-to-r ${section.accent}`} aria-hidden="true" />
                  </div>

                  <div className="grid lg:grid-cols-12 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedGalleryIndex(featuredImage.globalIndex)}
                      className="group lg:col-span-5 rounded-2xl overflow-hidden bg-surface-container-lowest focus:outline-none"
                      aria-label={t('about.aria.openFeatured', { title: section.title })}
                    >
                      <img
                        src={featuredImage.src}
                        alt={t('about.aria.imageAlt', { title: section.title })}
                        className="w-full h-56 md:h-72 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {restImages.map((image) => (
                        <button
                          key={`${section.key}-${image.imageIndex}`}
                          type="button"
                          onClick={() => setSelectedGalleryIndex(image.globalIndex)}
                          className="group rounded-xl overflow-hidden bg-surface-container-lowest focus:outline-none"
                          aria-label={t('about.aria.openMore', { title: section.title })}
                        >
                          <img src={image.src} alt={t('about.aria.imageAlt', { title: section.title })} className="w-full h-32 md:h-36 object-cover transition-transform duration-400 group-hover:scale-105" />
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-24 px-6 max-w-4xl mx-auto text-center pb-20">
          <div className="p-12 bg-surface-container-low rounded-4xl vellum-shadow relative overflow-hidden hover-lift-card">
            <h3 className="font-headline text-3xl font-bold text-primary mb-6">{t('about.joinTitle')}</h3>
            <p className="amharic-text text-lg text-on-surface-variant mb-8">{t('about.joinBody')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link className="bg-linear-to-br from-primary-container to-primary text-on-primary px-8 py-4 rounded-md font-bold hover:scale-105 transition-transform text-center" to="/background">
                {t('about.joinCta')}
              </Link>
              <Link className="bg-surface-container-lowest px-8 py-4 rounded-md text-primary font-bold hover:bg-surface-container-highest transition-colors text-center" to="/">
                {t('about.infoCta')}
              </Link>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl" />
          </div>
        </section>
      </section>

      {selectedGalleryImage
        ? createPortal(
            <div
              className="fixed inset-0 z-95 bg-[#151c27]/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
              onClick={closeGalleryPreview}
            >
              <div
                className="relative w-full max-w-6xl rounded-2xl bg-surface-container-lowest overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={selectedGalleryImage.src}
                  alt={t('about.aria.imageAlt', { title: selectedGalleryImage.title })}
                  className="w-full max-h-[78vh] object-contain bg-surface-container-lowest p-2 md:p-3"
                />

                <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-4">
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105"
                    aria-label={t('common.previousImage')}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4">
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105"
                    aria-label={t('common.nextImage')}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5 bg-linear-to-t from-[#151c27]/80 via-[#151c27]/35 to-transparent text-white">
                  <p className="text-xs font-bold tracking-widest uppercase opacity-90">{selectedGalleryImage.title}</p>
                  <p className="text-sm md:text-base font-semibold mt-1">{selectedGalleryImage.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={closeGalleryPreview}
                  className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105"
                  aria-label={t('about.aria.closeGallery')}
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
