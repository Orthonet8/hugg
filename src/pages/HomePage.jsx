import { Link } from 'react-router-dom'
import huggLogo from '../assets/hugg-logo.png'
import mainPic from '../assets/main pic.jpg'

export default function HomePage() {
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
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
            <p className="text-sm opacity-90">እሁድ ከሰዓት 8:30 ጀምሮ በግቢው አዳራሽ እንገናኝ።</p>
          </div>

          <div className="md:col-span-4 md:row-span-1 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between vellum-shadow hover-lift-card">
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
            <div>
              <h4 className="font-headline text-xl text-primary font-bold">ዲጂታል መጽሐፍ ቤት</h4>
              <p className="text-xs text-on-surface-variant mt-2">መንፈሳዊ መጻሕፍት፣ መዝሙሮችና ስብከቶች</p>
            </div>
          </div>

          <div className="md:col-span-12 mt-12 text-center max-w-3xl mx-auto space-y-6">
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
    </main>
  )
}
