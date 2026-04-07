import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'
import mainPic from '../assets/main pic.jpg'
import maksegoTselot from '../assets/maksego tselot.jpg'
import segoTselot from '../assets/sego tselot.jpg'
import erobTselot from '../assets/erob tselot.jpg'
import gcTselot from '../assets/GC tselot.jpg'
import arebTselot from '../assets/areb tselot.jpg'

export default function HomePage() {
  const [selectedPrayerImage, setSelectedPrayerImage] = useState(null)

  useEffect(() => {
    if (!selectedPrayerImage) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedPrayerImage])

  const courseSchedule = [
    ['ሰኞ', 'የ1ኛ አመት'],
    ['ማክሰኞ', 'የ3ኛ አመት'],
    ['ረቡዕ', 'የ2ኛ አመት እና የ4ኛ እና 5ኛ አመት'],
  ]

  const prayerSchedule = [
    ['ሰኞ', 'የመዝሙር እቅድ እና ሕፃናት'],
    ['ማክሰኞ', 'የት/ት ልማት እና ሒሳብና ንብረት'],
    ['ረቡዕ', 'የባች የሙያ የአባላት እና ቋንቋ'],
    ['ሐሙስ', 'የGC ፀሎት'],
    ['አርብ', 'አጠቃላይ የግቢ ጉባኤ ፀሎት'],
  ]

  const prayerImageByDay = {
    'ሰኞ': segoTselot,
    'ማክሰኞ': maksegoTselot,
    'ረቡዕ': erobTselot,
    'ሐሙስ': gcTselot,
    'አርብ': arebTselot,
  }

  return (
    <main className="pb-24 page-entrance">
      <section className="relative min-h-[618px] flex flex-col justify-end px-6 md:px-10 lg:pl-20 lg:pr-12 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Sacred Orthodox architecture"
            className="w-full h-full object-cover object-top"
            src={mainPic}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/22 to-transparent" />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm">
            Established 1954
          </div>
          <img
            src={huggLogo}
            alt="HUGG logo"
            className="h-28 w-28 md:h-36 md:w-36 object-contain rounded-full bg-white/90 p-2 shadow-[0_12px_30px_rgba(21,28,39,0.22)] hero-logo-glow"
          />
          <h2 className="font-headline text-5xl md:text-7xl text-white leading-[1.1] font-medium italic">
            የሐረማያ ዩኒቨርሲቲ <br /> ግቢ ጉባኤ
          </h2>
          <p className="text-surface-variant font-body text-lg md:text-xl leading-relaxed max-w-lg opacity-90">
            እንኳን ወደ ሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በሰላም መጣችሁ። የእግዚአብሔር ቃል ለሕይወታችን ብርሃን፣
            ለጉዟችንም መመሪያ ነው።
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link className="sacred-gradient text-on-primary px-8 py-4 rounded-md font-semibold flex items-center gap-2 group transition-all active:scale-95" to="/background">
              ቀጣይ ያንብቡ
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-md font-semibold hover:bg-white/20 transition-all" to="/about">
              ስለ እኛ
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-20 bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:row-span-2 bg-surface-container-lowest rounded-xl p-8 vellum-shadow flex flex-col justify-between group overflow-hidden relative hover-lift-card">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">history_edu</span>
              <h3 className="font-headline text-3xl text-primary font-bold mb-4">የቤተክርስቲያን ታሪክ</h3>
              <p className="text-on-surface-variant font-body leading-relaxed max-w-md">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ጥንታዊ ታሪክና በዩኒቨርሲቲያችን ያለውን የግቢ ጉባኤ
                አመሰራረት በጥልቀት ይረዱ።
              </p>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                history_edu
              </span>
            </div>
            <Link className="text-primary font-bold flex items-center gap-2 mt-8 z-10 group-hover:gap-4 transition-all" to="/background">
              ተጨማሪ ይመልከቱ
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>

          <div className="md:col-span-4 md:row-span-1 bg-primary-container rounded-xl p-6 flex flex-col justify-between text-on-primary-container hover-lift-card">
            <div>
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary-fixed">event</span>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Next Session</span>
              </div>
              <h4 className="font-headline text-xl mt-4 text-white">የሳምንቱ መርሃ ግብር</h4>
            </div>
            <p className="text-sm opacity-90">የኮርስ፣ የፀሎት እና የጥናት ዝርዝር መርሃ ግብር ከታች ተለይቶ ቀርቧል።</p>
          </div>

          <div className="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between vellum-shadow hover-lift-card">
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
            <div>
              <h4 className="font-headline text-xl text-primary font-bold">ዲጂታል መጽሐፍ ቤት</h4>
              <p className="text-xs text-on-surface-variant mt-2">መንፈሳዊ መጻሕፍት፣ መዝሙሮችና ስብከቶች</p>
            </div>
          </div>

          <div className="md:col-span-12 rounded-2xl bg-surface-container-lowest p-6 md:p-8 vellum-shadow space-y-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h4 className="font-headline text-3xl text-primary font-bold">ዝርዝር የሳምንቱ መርሃ ግብር</h4>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed/35 px-4 py-1 text-xs font-bold text-on-secondary-fixed tracking-wide">
                <span className="material-symbols-outlined text-base">schedule</span>
                HU Gibi Gubae
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <article className="rounded-xl bg-surface-container-low p-5 md:p-6 border border-outline-variant/30">
                <h5 className="font-headline text-2xl text-primary font-bold mb-4">1) የኮርስ መርሃግብር</h5>
                <div className="space-y-3">
                  {courseSchedule.map(([day, plan]) => (
                    <div key={day} className="flex items-start gap-3 rounded-lg bg-surface px-4 py-3">
                      <span className="min-w-[68px] text-xs font-bold tracking-wide uppercase text-secondary">{day}</span>
                      <p className="text-sm text-on-surface-variant">{plan}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl bg-surface-container-low p-5 md:p-6 border border-outline-variant/30">
                <h5 className="font-headline text-2xl text-primary font-bold mb-4">2) የፀሎት መርሃግብር</h5>
                <div className="space-y-4">
                  {prayerSchedule.map(([day, plan]) => {
                    const prayerImage = prayerImageByDay[day]
                    const isFriday = day === 'አርብ'

                    return (
                      <article
                        key={day}
                        className={[
                          'rounded-xl border p-3 md:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(21,28,39,0.12)]',
                          isFriday
                            ? 'bg-gradient-to-br from-primary-container/30 via-surface to-surface border-primary/30'
                            : 'bg-surface border-outline-variant/30',
                        ].join(' ')}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            type="button"
                            onClick={() => setSelectedPrayerImage({ day, plan, src: prayerImage })}
                            className="group/image relative block h-32 sm:h-[110px] sm:w-[170px] rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest focus:outline-none"
                            aria-label={`${day} ፀሎት ምስል በትልቅ ለማየት`}
                          >
                            <img
                              src={prayerImage}
                              alt={`${day} ፀሎት`}
                              className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover/image:scale-105 group-focus-visible/image:scale-105"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-[#151c27]/40 via-transparent to-transparent" />
                            <span className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm">
                              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                            </span>
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="inline-flex h-7 items-center rounded-full bg-primary text-white px-2.5 text-[11px] font-bold tracking-wide">{day}</span>
                              {isFriday ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed/35 px-2.5 py-1 text-[10px] font-semibold text-on-secondary-fixed tracking-wide uppercase">
                                  <span className="material-symbols-outlined text-[14px]">priority_high</span>
                                  Main Prayer
                                </span>
                              ) : null}
                            </div>

                            <p className={[
                              'text-sm md:text-[15px] leading-relaxed',
                              isFriday ? 'text-primary font-semibold' : 'text-on-surface-variant',
                            ].join(' ')}>
                              {plan}
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
              <h5 className="font-headline text-2xl text-white font-bold mb-4">3) ተጨማሪ ፕሮግራሞች</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 px-4 py-4">
                  <p className="text-sm font-semibold">ሐሙስ እና ቅዳሜ</p>
                  <p className="text-sm opacity-95 mt-1">የመዝሙር ጥናት</p>
                  <p className="text-xs opacity-85 mt-1">ማታ 12:00</p>
                </div>
                <div className="rounded-lg bg-white/10 px-4 py-4">
                  <p className="text-sm font-semibold">አርብ ማታ</p>
                  <p className="text-sm opacity-95 mt-1">የመጽሐፍ ቅዱስ ጥናት</p>
                  <p className="text-xs opacity-85 mt-1">ማታ 12:00</p>
                </div>
              </div>
            </article>
          </div>

          <div className="md:col-span-12 text-center max-w-3xl mx-auto space-y-6 pt-6">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              format_quote
            </span>
            <blockquote className="font-headline text-3xl text-primary italic leading-relaxed">
              "ጥበብን የሚወድ አባቱን ደስ ያሰኛል፤ የጥበብ መጀመሪያ እግዚአብሔርን መፍራት ነው።"
            </blockquote>
            <cite className="block font-body text-xs tracking-[0.3em] uppercase text-on-surface-variant font-bold">መጽሐፈ ምሳሌ</cite>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-20 bg-surface-container-low/30 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="group aspect-[4/5] bg-surface-container-highest rounded-xl overflow-hidden vellum-shadow rotate-[-2deg] hover-lift-card">
              <img
                alt="Student studying ancient text"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Display_of_Procesional_Crosses,_Church_of_Bet_Maryam,_Lalibela,_Ethiopia_(3230772118).jpg"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 aspect-square bg-secondary-fixed rounded-xl vellum-shadow rotate-[6deg] p-4 flex items-end">
              <p className="text-on-secondary-fixed text-xs font-bold leading-tight">ትውልድን በቤተክርስቲያን ጥላ ስር ማፍራት።</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <h3 className="font-headline text-4xl text-primary leading-tight">የእውቀት እና የጥበብ ምንጭ</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">school</span>
                </div>
                <div>
                  <h5 className="font-bold text-primary">አካዳሚክ ድጋፍ</h5>
                  <p className="text-sm text-on-surface-variant mt-1">ተማሪዎች በትምህርታቸው ውጤታማ እንዲሆኑ መንፈሳዊና ስነ-ልቦናዊ ድጋፍ እናደርጋለን።</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">groups</span>
                </div>
                <div>
                  <h5 className="font-bold text-primary">ማህበራዊ ህይወት</h5>
                  <p className="text-sm text-on-surface-variant mt-1">ተማሪዎች እርስ በርሳቸው የሚረዳዱበትና የሚቀራረቡበትን መድረክ እናዘጋጃለን።</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedPrayerImage
        ? createPortal(
            <div
              className="fixed inset-0 z-[90] bg-[#151c27]/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
              onClick={() => setSelectedPrayerImage(null)}
            >
              <div
                className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={selectedPrayerImage.src}
                  alt={`${selectedPrayerImage.day} ፀሎት`}
                  className="w-full max-h-[78vh] object-contain bg-surface-container-lowest p-2 md:p-3 transition-transform duration-500 hover:scale-[1.01]"
                />

                <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-[#151c27]/80 via-[#151c27]/35 to-transparent text-white">
                  <p className="text-xs font-bold tracking-widest uppercase opacity-90">{selectedPrayerImage.day}</p>
                  <p className="text-sm md:text-base font-semibold mt-1">{selectedPrayerImage.plan}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPrayerImage(null)}
                  className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105"
                  aria-label="Close prayer image preview"
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
