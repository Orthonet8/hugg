import huggLogo from '../assets/hugg-logo.png'

export default function BackgroundPage() {
  return (
    <main className="min-h-screen pb-32 amharic-lh page-entrance">
      <section className="relative h-[353px] w-full flex items-end px-6 md:px-10 lg:pl-20 lg:pr-12 py-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Spiritual heritage" className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Bet_Amanuel_church,_Lalibela.jpg" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/22 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <img
            src={huggLogo}
            alt="HUGG logo"
            className="h-20 w-20 md:h-24 md:w-24 object-contain mb-4 rounded-full bg-white/90 p-2 shadow-[0_12px_30px_rgba(21,28,39,0.22)]"
          />
          <h2 className="font-headline text-5xl md:text-6xl text-white font-bold leading-tight mb-4 italic">የታሪክ ማህደር</h2>
          <div className="h-1 w-24 bg-secondary-fixed" />
        </div>
      </section>

      <div className="px-6 md:px-10 lg:pl-20 lg:pr-12 py-12 max-w-5xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
            <h3 className="font-headline text-3xl text-primary font-bold mb-6">መግቢያ</h3>
            <p className="text-on-surface/90 text-lg">
              የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በሐረማያ ዩኒቨርሲቲ ውስጥ የሚገኙ የኦርቶዶክስ ተዋሕዶ አማኞች ተማሪዎች መንፈሳዊ ሕይወታቸውን የሚያሳድጉበትና ቤተክርስቲያናቸውን የሚያገለግሉበት ታላቅ መንፈሳዊ ተቋም ነው። ግቢ ጉባኤው ከተመሠረተበት ጊዜ ጀምሮ በርካታ ምሁራንን በሥነ-ምግባርና በሃይማኖት ኮትኩቶ በማሳደግ ረገድ ከፍተኛ ሚና እየተጫወተ ይገኛል።
            </p>
          </div>
          <div className="md:col-span-4 bg-primary-container text-on-primary-container p-8 rounded-xl vellum-shadow flex flex-col justify-center items-center text-center space-y-4 hover-lift-card">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              history_edu
            </span>
            <p className="font-bold text-2xl font-headline">ከ30 ዓመታት በላይ አገልግሎት</p>
          </div>
        </div>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/30" />
            <h3 className="font-headline text-2xl font-bold text-secondary uppercase tracking-widest px-4">የታሪክ ጉዞ</h3>
            <div className="h-px flex-1 bg-outline-variant/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 md:mt-12">
              <div className="bg-surface-container-low p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
                <span className="text-secondary font-bold text-sm tracking-tighter block mb-2">1980ዎቹ</span>
                <h4 className="font-headline text-xl font-bold text-primary mb-3">ምሥረታ</h4>
                <p className="text-on-surface-variant">የግቢ ጉባኤው አመሠራረት በጥቂት ተማሪዎች ጸሎትና መንፈሳዊ ዝማሬ የተጀመረ ሲሆን፣ በአሁኑ ወቅት በሺዎች የሚቆጠሩ አባላትን ማፍራት ችሏል።</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-surface-container-low p-8 rounded-xl vellum-shadow amharic-lh hover-lift-card">
                <span className="text-secondary font-bold text-sm tracking-tighter block mb-2">1990ዎቹ</span>
                <h4 className="font-headline text-xl font-bold text-primary mb-3">ዕድገትና መስፋፋት</h4>
                <p className="text-on-surface-variant">የአባላት ቁጥር እየጨመረ በመምጣቱና የተለያዩ ንዑሳን ክፍላት በመደራጀታቸው ግቢ ጉባኤው ሥርዓታዊ በሆነ መንገድ አገልግሎቱን ማስፋፋት የጀመረበት ወቅት ነበር።</p>
              </div>
              <div className="bg-surface-container-lowest p-1 rounded-xl vellum-shadow">
                <img alt="Students studying" className="w-full h-64 object-cover rounded-lg" src="https://commons.wikimedia.org/wiki/Special:FilePath/Display_of_Procesional_Crosses,_Church_of_Bet_Maryam,_Lalibela,_Ethiopia_(3230772118).jpg" />
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
            <h3 className="font-headline text-4xl text-primary font-bold mb-8 italic">መሠረታዊ ዓላማ</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">auto_awesome</span>
                <div>
                  <span className="font-bold text-lg text-primary block">መንፈሳዊ ዕውቀት</span>
                  <p className="text-on-surface-variant">ተማሪዎች በቆይታቸው በቤተክርስቲያን ትምህርትና ሥርዓት ታንጸው እንዲወጡ ማድረግ።</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">diversity_3</span>
                <div>
                  <span className="font-bold text-lg text-primary block">ማኅበራዊ ትስስር</span>
                  <p className="text-on-surface-variant">በተማሪዎች መካከል መንፈሳዊ ፍቅርና አንድነት እንዲሰፍን ምቹ ሁኔታዎችን መፍጠር።</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-secondary pt-1">volunteer_activism</span>
                <div>
                  <span className="font-bold text-lg text-primary block">የበጎ ፈቃድ አገልግሎት</span>
                  <p className="text-on-surface-variant">አካባቢውንና ማኅበረሰቡን የሚያገለግሉበትን የልማትና የበጎ አድራጎት ሥራዎች ማከናወን።</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="text-center py-12">
          <blockquote className="font-headline text-2xl md:text-4xl text-primary/80 italic font-medium max-w-3xl mx-auto leading-relaxed">
            "ቤተክርስቲያን የሥነ ምግባር ምንጭ፣ የዕውቀት ማዕከል ናት።"
          </blockquote>
        </section>
      </div>
    </main>
  )
}
