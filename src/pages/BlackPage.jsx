import huggLogo from '../assets/hugg-logo.png'

export default function BlackPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-6 md:px-10 lg:pl-20 lg:pr-12 py-8 pb-32 amharic-lh page-entrance">
      <section className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary-container p-8 mb-12 vellum-shadow min-h-[400px] flex flex-col justify-end hover-lift-card">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Ark_of_the_Covenant_church_in_Axum_Ethiopia.jpg" alt="Spiritual depth" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/14 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <img src={huggLogo} alt="HUGG logo" className="h-20 w-20 md:h-24 md:w-24 object-contain mb-4 rounded-full bg-white/90 p-1.5" />
          <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">
            የመንፈሳዊነት ጥልቀት
          </span>
          <h2 className="text-5xl md:text-7xl font-headline font-bold italic mb-6 leading-tight text-white">ጽድቅና ቅድስና</h2>
          <p className="text-lg md:text-xl font-body font-light amharic-text opacity-90 leading-relaxed">
            "ጽድቅ ለሕዝብ ከፍ ከፍ ታደርጋለች፤ ኃጢአት ግን ሕዝብን ያዋርዳል።" (ምሳሌ 14፡34) - በመንፈሳዊ ጉዟችን ውስጥ ያለው የጽድቅ ሚና እና በሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ የሚሰጡ ትምህርቶች።
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 vellum-shadow flex flex-col justify-between hover-lift-card">
          <div>
            <h3 className="text-3xl font-headline font-bold text-primary mb-4 amharic-text">የጽድቅ ትርጓሜ በቤተክርስቲያን</h3>
            <p className="text-on-surface-variant amharic-text text-lg mb-8">
              በኦርቶዶክሳዊት ተዋሕዶ ቤተክርስቲያን ትምህርት መሠረት ጽድቅ ማለት ከእግዚአብሔር ጋር በትክክለኛ ግንኙነት መኖር ማለት ነው። ይህም በሃይማኖትና በምግባር የታጀበ ሕይወትን ያጠቃልላል።
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full text-xs">ሃይማኖት</span>
            <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full text-xs">ምግባር</span>
            <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full text-xs">ትሕትና</span>
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container rounded-xl p-8 flex flex-col justify-center items-center text-center hover-lift-card">
          <span className="material-symbols-outlined text-5xl mb-6 opacity-50">format_quote</span>
          <p className="font-headline italic text-2xl amharic-text leading-snug">"ፍሬያችሁ ቅድስና ሊሆን መጨረሻችሁም የዘላለም ሕይወት ነው"</p>
          <div className="h-px w-12 bg-secondary-container my-6" />
          <p className="text-sm font-bold tracking-widest uppercase opacity-70">ሮሜ 6፡22</p>
        </div>

        {[
          ['book_2', 'መጽሐፍ ቅዱሳዊ ጥናት', 'ስለ ጽድቅ የሚናገሩ የመጽሐፍ ቅዱስ ክፍሎች ዝርዝር ጥናት።'],
          ['history_edu', 'የአበው ትምህርት', 'ቅዱሳን አባቶች ስለ ጽድቅ ሕይወት የሰጡን መመሪያዎች።'],
          ['church', 'የሕይወት ተሞክሮ', 'በግቢ ጉባኤ ቆይታችን ጽድቅን የምንለማመድባቸው መንገዶች።'],
        ].map(([icon, title, desc]) => (
          <div className="bg-surface-container-lowest rounded-xl p-6 vellum-shadow flex items-start gap-4 hover-lift-card" key={title}>
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">{icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-primary amharic-text">{title}</h4>
              <p className="text-sm text-on-surface-variant amharic-text">{desc}</p>
            </div>
          </div>
        ))}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12 md:col-span-3 bg-surface-container-low/40 rounded-3xl px-6 md:px-10 lg:px-12 vellum-shadow hover-lift-card">
          <div>
            <h2 className="text-4xl font-headline font-bold text-primary mb-8 amharic-text">በአካዳሚክ ሕይወት ውስጥ የሚገለጥ ጽድቅ</h2>
            <div className="space-y-6 text-on-surface-variant amharic-text text-lg leading-relaxed">
              <p>
                እንደ ሐረማያ ዩኒቨርሲቲ ተማሪዎችነታችን፣ ጽድቅ የሚገለጸው በቤተክርስቲያን ብቻ ሳይሆን በክፍል ውስጥ፣ በፈተና ወቅትና ከጓደኞቻችን ጋር ባለን ግንኙነት ጭምር ነው። ታማኝነት፣ ታታሪነትና ትሕትና የጽድቅ መገለጫዎች ናቸው።
              </p>
              <p>
                እውቀትን ከእግዚአብሔር ጥበብ ጋር ማገናኘት የመንፈሳዊ ተማሪ ግዴታ ነው። "የጥበብ መጀመሪያ እግዚአብሔርን መፍራት ነው" እንደሚለው ቃሉ፣ እውነተኛ እውቀት ለጽድቅ ሕይወት መሠረት ይሆናል።
              </p>
            </div>
            <a className="mt-10 inline-flex px-8 py-3 bg-gradient-to-r from-primary-container to-primary text-on-primary rounded-md font-bold text-sm tracking-wide amharic-text" href="/about">
              ተጨማሪ ያንብቡ
            </a>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden vellum-shadow">
              <img className="w-full h-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Gondar_Fasiladas_Bath_Timket.jpg" alt="shadowy silhouette of an ancient building dome against a deep velvet sky, evoking a sense of solemnity and sacred silence" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-secondary-container p-6 rounded-xl vellum-shadow max-w-xs">
              <p className="font-headline font-bold text-on-secondary-container text-xl amharic-text italic">"እውነትን ታውቃላችሁ እውነትም አርነት ያወጣችኋል"</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
