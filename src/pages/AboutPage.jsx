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
  const serviceGallery = [
    {
      key: 'fresh',
      title: 'ኮርስ',
      subtitle: 'የመሠረታዊ እምነት እና የቃል ትምህርት ክፍሎች',
      accent: 'from-[#5f0113] to-[#390007]',
      images: [course, course00, course01],
    },
    {
      key: 'mezmur',
      title: 'መዝሙር',
      subtitle: 'የምስጋና ዝማሬ እና የመንፈሳዊ ቅኔ ማዕከል',
      accent: 'from-[#7b5300] to-[#5f0113]',
      images: [mezmur, mezmur01],
    },
    {
      key: 'begena',
      title: 'በገና',
      subtitle: 'ባህላዊ መንፈሳዊ ሙዚቃ እና ሥልጠና',
      accent: 'from-[#2f3a4e] to-[#5f0113]',
      images: [begena, begena00, begena01, begena03, begena06],
    },
    {
      key: 'timket',
      title: 'ጥምቀት',
      subtitle: 'የበዓል ሥነ ሥርዓት እና የማኅበረሰብ አንድነት',
      accent: 'from-[#24526a] to-[#5f0113]',
      images: [timket1, timket2, timket3],
    },
    {
      key: 'fresh-welcome',
      title: 'ፍሬሽ እንኳን ደና መጣቹ',
      subtitle: 'አዲስ ተማሪዎች መቀበል እና መተዋወቅ',
      accent: 'from-[#6a1f33] to-[#9c6b00]',
      images: [freshWelcome, freshWelcome01, freshWelcome02, freshWelcome03, freshWelcome05],
    },
    {
      key: 'graduation',
      title: 'ምርቃት',
      subtitle: 'የማጠናቀቂያ ደስታ እና የምስጋና መንፈሳዊ በዓል',
      accent: 'from-[#2a5b4f] to-[#7b5300]',
      images: [graduation, graduation01],
    },
    {
      key: 'meskel',
      title: 'መስቀል',
      subtitle: 'የመስቀል ደመራ የእምነት እና የብርሃን በዓል',
      accent: 'from-[#9c6b00] to-[#5f0113]',
      images: [meskel],
    },
    {
      key: 'ziker-maryam',
      title: 'የማርያም ዝክር',
      subtitle: 'የእመቤታችን መታሰቢያ እና የጸሎት መድረክ',
      accent: 'from-[#4e345c] to-[#5f0113]',
      images: [zikerMaryam, zikerMaryam0, zikerMaryam00, zikerMaryam01],
    },
  ]

  return (
    <main className="min-h-screen pb-32 amharic-lh page-entrance">
      <section className="relative pt-12 px-6 md:px-10 lg:pl-20 lg:pr-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <img src={huggLogo} alt="HUGG logo" className="mx-auto h-24 w-24 md:h-28 md:w-28 object-contain vellum-shadow" />
          <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary tracking-tight leading-tight">ስለ እኛ</h2>
          <p className="amharic-text text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto">
            በሐረማያ ዩኒቨርሲቲ የኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን አማኞች ተማሪዎች ግቢ ጉባኤ ታሪክና ራዕይ።
          </p>
        </div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl -z-10" />
      </section>

      <section className="px-6 md:px-10 lg:pl-20 lg:pr-12 mt-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 vellum-shadow relative overflow-hidden group hover-lift-card">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs uppercase tracking-widest">
                ታሪካችን
              </div>
              <h3 className="font-headline text-3xl font-bold text-primary">የግቢ ጉባኤያችን አመሰራረት</h3>
              <p className="amharic-text text-on-surface leading-relaxed text-lg">
                የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በአለማያ ዩኒቨርሲቲ ስም ይታወቅ በነበረበት ወቅት፣ ጥቂት ተማሪዎች በመሰባሰብ መንፈሳዊ አገልግሎትን በማኅበር ለመጀመር ካላቸው ጽኑ ፍላጎት የተነሳ የተመሰረተ ነው። ባለፉት ዓመታት በብዙ ፈተናዎችና ድሎች ውስጥ አልፎ ዛሬ ላይ በሺዎች የሚቆጠሩ ተማሪዎችን የሚያቀፍ ታላቅ መንፈሳዊ ተቋም ሆኗል።
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
              <h3 className="font-headline text-2xl font-bold mb-4">ተልዕኳችን</h3>
              <p className="amharic-text text-on-primary-container text-base leading-relaxed">
                ተማሪዎች በቆይታቸው የእግዚአብሔርን ቃል እየተማሩ፣ በሥነ-ምግባር ታንጸውና በቤተክርስቲያን ጥላ ስር ሆነው ለሀገርና ለወገን የሚጠቅሙ ዜጎች እንዲሆኑ ማስቻል ነው።
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 vellum-shadow flex flex-col justify-center hover-lift-card">
            <h3 className="font-headline text-2xl font-bold text-primary mb-2">ራዕያችን</h3>
            <p className="amharic-text text-on-surface-variant">በእውቀትና በሃይማኖት የዳበረ ትውልድ ተፈጥሮ ማየት።</p>
          </div>

          <div className="md:col-span-8 bg-surface-container-highest/30 rounded-xl p-10 grid grid-cols-2 gap-8 vellum-shadow hover-lift-card">
            {[
              ['church', 'ተዋሕዶ', 'የቀደመችውን እምነት ጠብቆ ማቆየት'],
              ['school', 'ትምህርት', 'የነገረ መለኮትና ዘመናዊ እውቀት ቅንጅት'],
              ['group', 'አንድነት', 'በፍቅር የታሰረ መንፈሳዊ ወንድማማችነት'],
              ['volunteer_activism', 'አገልግሎት', 'ለቤተክርስቲያንና ለሰው ልጆች መሰጠት'],
            ].map(([icon, title, desc]) => (
              <div className="space-y-2" key={title}>
                <span className="material-symbols-outlined text-secondary">{icon}</span>
                <h4 className="font-bold text-primary">{title}</h4>
                <p className="amharic-text text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-20 px-0 max-w-7xl mx-auto">
          <h3 className="font-headline text-4xl font-bold text-primary text-center mb-12">አገልግሎቶቻችን በምስል</h3>
          <div className="space-y-10">
            {serviceGallery.map((section, sectionIndex) => {
              const [featuredImage, ...restImages] = section.images
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
                    <span className={`inline-flex h-1.5 w-36 rounded-full bg-gradient-to-r ${section.accent}`} aria-hidden="true" />
                  </div>

                  <div className="grid lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-surface-container-lowest">
                      <img
                        src={featuredImage}
                        alt={`${section.title} featured`}
                        className="w-full h-56 md:h-72 object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {restImages.map((imageSrc, index) => (
                        <div key={`${section.key}-${index}`} className="rounded-xl overflow-hidden bg-surface-container-lowest">
                          <img src={imageSrc} alt={`${section.title} ${index + 1}`} className="w-full h-32 md:h-36 object-cover transition-transform duration-400 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-24 px-6 max-w-4xl mx-auto text-center pb-20">
          <div className="p-12 bg-surface-container-low rounded-[2rem] vellum-shadow relative overflow-hidden hover-lift-card">
            <h3 className="font-headline text-3xl font-bold text-primary mb-6">የእኛ አካል ይሁኑ</h3>
            <p className="amharic-text text-lg text-on-surface-variant mb-8">አብረን እንማር፣ አብረን እናገልግል፣ አብረን እንጽና።</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link className="bg-gradient-to-br from-primary-container to-primary text-on-primary px-8 py-4 rounded-md font-bold hover:scale-105 transition-transform text-center" to="/background">
                አሁኑኑ ይቀላቀሉ
              </Link>
              <Link className="bg-surface-container-lowest px-8 py-4 rounded-md text-primary font-bold hover:bg-surface-container-highest transition-colors text-center" to="/">
                ተጨማሪ መረጃ
              </Link>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl" />
          </div>
        </section>
      </section>
    </main>
  )
}
