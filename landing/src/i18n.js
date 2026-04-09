import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const am = {
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    background: 'Background',
  },
  language: {
    label: 'Language',
    menuAria: 'Open language selector',
    en: 'English',
    am: 'Amharic',
    om: 'Afan Oromo',
    code: {
      en: 'EN',
      am: 'አማ',
      om: 'AFO',
    },
  },
  common: {
    logoAlt: 'HUGG logo',
    close: 'Close',
    previousImage: 'Previous image',
    nextImage: 'Next image',
  },
  home: {
    heroImageAlt: 'Sacred Orthodox architecture',
    established: 'Established 1954',
    titleLine1: 'የሐረማያ ዩኒቨርሲቲ',
    titleLine2: 'ግቢ ጉባኤ',
    intro:
      'እንኳን ወደ ሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በሰላም መጣችሁ። የእግዚአብሔር ቃል ለሕይወታችን ብርሃን፣ ለጉዟችንም መመሪያ ነው።',
    ctaReadMore: 'ቀጣይ ያንብቡ',
    ctaAbout: 'ስለ እኛ',
    historyTitle: 'የቤተክርስቲያን ታሪክ',
    historyDescription:
      'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ጥንታዊ ታሪክና በዩኒቨርሲቲያችን ያለውን የግቢ ጉባኤ አመሰራረት በጥልቀት ይረዱ።',
    viewMore: 'ተጨማሪ ይመልከቱ',
    nextSession: 'Next Session',
    weeklyProgramTitle: 'የሳምንቱ መርሃ ግብር',
    weeklyProgramHint: 'የኮርስ፣ የፀሎት እና የጥናት ዝርዝር መርሃ ግብር ከታች ተለይቶ ቀርቧል።',
    digitalLibraryTitle: 'ዲጂታል መጽሐፍ ቤት',
    digitalLibraryDescription: 'መንፈሳዊ መጻሕፍት፣ መዝሙሮችና ስብከቶች',
    detailedWeeklyProgram: 'ዝርዝር የሳምንቱ መርሃ ግብር',
    scheduleBadge: 'HU Gibi Gubae',
    courseScheduleTitle: '1) የኮርስ መርሃግብር',
    prayerScheduleTitle: '2) የፀሎት መርሃግብር',
    mainPrayer: 'Main Prayer',
    additionalProgramsTitle: '3) ተጨማሪ ፕሮግራሞች',
    additionalPrograms: [
      {
        day: 'ሐሙስ እና ቅዳሜ',
        title: 'የመዝሙር ጥናት',
        time: 'ማታ 12:00',
      },
      {
        day: 'አርብ ማታ',
        title: 'የመጽሐፍ ቅዱስ ጥናት',
        time: 'ማታ 12:00',
      },
    ],
    courseSchedule: [
      { day: 'ሰኞ', plan: 'የ1ኛ አመት' },
      { day: 'ማክሰኞ', plan: 'የ3ኛ አመት' },
      { day: 'ረቡዕ', plan: 'የ2ኛ አመት እና የ4ኛ እና 5ኛ አመት' },
    ],
    prayerSchedule: [
      { day: 'ሰኞ', plan: 'የመዝሙር እቅድ እና ሕፃናት' },
      { day: 'ማክሰኞ', plan: 'የት/ት ልማት እና ሒሳብና ንብረት' },
      { day: 'ረቡዕ', plan: 'የባች የሙያ የአባላት እና ቋንቋ' },
      { day: 'ሐሙስ', plan: 'የGC ፀሎት' },
      { day: 'አርብ', plan: 'አጠቃላይ የግቢ ጉባኤ ፀሎት' },
    ],
    quote:
      '"ጥበብን የሚወድ አባቱን ደስ ያሰኛል፤ የጥበብ መጀመሪያ እግዚአብሔርን መፍራት ነው።"',
    quoteSource: 'መጽሐፈ ምሳሌ',
    knowledgeTitle: 'የእውቀት እና የጥበብ ምንጭ',
    knowledgeNote: 'ትውልድን በቤተክርስቲያን ጥላ ስር ማፍራት።',
    knowledgeImageAlt: 'Student studying ancient text',
    knowledgeItems: [
      {
        title: 'አካዳሚክ ድጋፍ',
        description: 'ተማሪዎች በትምህርታቸው ውጤታማ እንዲሆኑ መንፈሳዊና ስነ-ልቦናዊ ድጋፍ እናደርጋለን።',
      },
      {
        title: 'ማህበራዊ ህይወት',
        description: 'ተማሪዎች እርስ በርሳቸው የሚረዳዱበትና የሚቀራረቡበትን መድረክ እናዘጋጃለን።',
      },
    ],
    aria: {
      zoomPrayerImage: '{{day}} ፀሎት ምስል በትልቅ ለማየት',
      prayerImageAlt: '{{day}} ፀሎት',
      closePrayerPreview: 'Close prayer image preview',
    },
  },
  about: {
    title: 'ስለ እኛ',
    subtitle: 'በሐረማያ ዩኒቨርሲቲ የኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን አማኞች ተማሪዎች ግቢ ጉባኤ ታሪክና ራዕይ።',
    historyChip: 'ታሪካችን',
    historyTitle: 'የግቢ ጉባኤያችን አመሰራረት',
    historyBody:
      'የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በአለማያ ዩኒቨርሲቲ ስም ይታወቅ በነበረበት ወቅት፣ ጥቂት ተማሪዎች በመሰባሰብ መንፈሳዊ አገልግሎትን በማኅበር ለመጀመር ካላቸው ጽኑ ፍላጎት የተነሳ የተመሰረተ ነው። ባለፉት ዓመታት በብዙ ፈተናዎችና ድሎች ውስጥ አልፎ ዛሬ ላይ በሺዎች የሚቆጠሩ ተማሪዎችን የሚያቀፍ ታላቅ መንፈሳዊ ተቋም ሆኗል።',
    missionTitle: 'ተልዕኳችን',
    missionBody:
      'ተማሪዎች በቆይታቸው የእግዚአብሔርን ቃል እየተማሩ፣ በሥነ-ምግባር ታንጸውና በቤተክርስቲያን ጥላ ስር ሆነው ለሀገርና ለወገን የሚጠቅሙ ዜጎች እንዲሆኑ ማስቻል ነው።',
    visionTitle: 'ራዕያችን',
    visionBody: 'በእውቀትና በሃይማኖት የዳበረ ትውልድ ተፈጥሮ ማየት።',
    values: [
      { title: 'ተዋሕዶ', description: 'የቀደመችውን እምነት ጠብቆ ማቆየት' },
      { title: 'ትምህርት', description: 'የነገረ መለኮትና ዘመናዊ እውቀት ቅንጅት' },
      { title: 'አንድነት', description: 'በፍቅር የታሰረ መንፈሳዊ ወንድማማችነት' },
      { title: 'አገልግሎት', description: 'ለቤተክርስቲያንና ለሰው ልጆች መሰጠት' },
    ],
    galleryTitle: 'አገልግሎቶቻችን በምስል',
    serviceGallery: [
      { title: 'ኮርስ', subtitle: 'የመሠረታዊ እምነት እና የቃል ትምህርት ክፍሎች' },
      { title: 'መዝሙር', subtitle: 'የምስጋና ዝማሬ እና የመንፈሳዊ ቅኔ ማዕከል' },
      { title: 'በገና', subtitle: 'ባህላዊ መንፈሳዊ ሙዚቃ እና ሥልጠና' },
      { title: 'ጥምቀት', subtitle: 'የበዓል ሥነ ሥርዓት እና የማኅበረሰብ አንድነት' },
      { title: 'ፍሬሽ እንኳን ደና መጣቹ', subtitle: 'አዲስ ተማሪዎች መቀበል እና መተዋወቅ' },
      { title: 'ምርቃት', subtitle: 'የማጠናቀቂያ ደስታ እና የምስጋና መንፈሳዊ በዓል' },
      { title: 'መስቀል', subtitle: 'የመስቀል ደመራ የእምነት እና የብርሃን በዓል' },
      { title: 'የማርያም ዝክር', subtitle: 'የእመቤታችን መታሰቢያ እና የጸሎት መድረክ' },
    ],
    joinTitle: 'የእኛ አካል ይሁኑ',
    joinBody: 'አብረን እንማር፣ አብረን እናገልግል፣ አብረን እንጽና።',
    joinCta: 'አሁኑኑ ይቀላቀሉ',
    infoCta: 'ተጨማሪ መረጃ',
    aria: {
      openFeatured: '{{title}} ምስል በትልቅ ለማየት',
      openMore: '{{title}} ተጨማሪ ምስል በትልቅ ለማየት',
      imageAlt: '{{title}} ምስል',
      closeGallery: 'Close gallery preview',
    },
  },
  background: {
    heroTitle: 'የታሪክ ማህደር',
    introTitle: 'መግቢያ',
    introBody:
      'የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ በሐረማያ ዩኒቨርሲቲ ውስጥ የሚገኙ የኦርቶዶክስ ተዋሕዶ አማኞች ተማሪዎች መንፈሳዊ ሕይወታቸውን የሚያሳድጉበትና ቤተክርስቲያናቸውን የሚያገለግሉበት ታላቅ መንፈሳዊ ተቋም ነው። ግቢ ጉባኤው ከተመሠረተበት ጊዜ ጀምሮ በርካታ ምሁራንን በሥነ-ምግባርና በሃይማኖት ኮትኩቶ በማሳደግ ረገድ ከፍተኛ ሚና እየተጫወተ ይገኛል።',
    serviceYears: 'ከ30 ዓመታት በላይ አገልግሎት',
    journeyTitle: 'የታሪክ ጉዞ',
    timeline: [
      {
        period: '1980ዎቹ',
        title: 'ምሥረታ',
        body: 'የግቢ ጉባኤው አመሠራረት በጥቂት ተማሪዎች ጸሎትና መንፈሳዊ ዝማሬ የተጀመረ ሲሆን፣ በአሁኑ ወቅት በሺዎች የሚቆጠሩ አባላትን ማፍራት ችሏል።',
      },
      {
        period: '1990ዎቹ',
        title: 'ዕድገትና መስፋፋት',
        body: 'የአባላት ቁጥር እየጨመረ በመምጣቱና የተለያዩ ንዑሳን ክፍላት በመደራጀታቸው ግቢ ጉባኤው ሥርዓታዊ በሆነ መንገድ አገልግሎቱን ማስፋፋት የጀመረበት ወቅት ነበር።',
      },
    ],
    purposeTitle: 'መሠረታዊ ዓላማ',
    purposeItems: [
      { title: 'መንፈሳዊ ዕውቀት', body: 'ተማሪዎች በቆይታቸው በቤተክርስቲያን ትምህርትና ሥርዓት ታንጸው እንዲወጡ ማድረግ።' },
      { title: 'ማኅበራዊ ትስስር', body: 'በተማሪዎች መካከል መንፈሳዊ ፍቅርና አንድነት እንዲሰፍን ምቹ ሁኔታዎችን መፍጠር።' },
      { title: 'የበጎ ፈቃድ አገልግሎት', body: 'አካባቢውንና ማኅበረሰቡን የሚያገለግሉበትን የልማትና የበጎ አድራጎት ሥራዎች ማከናወን።' },
    ],
    quote: '"ቤተክርስቲያን የሥነ ምግባር ምንጭ፣ የዕውቀት ማዕከል ናት።"',
    alt: {
      hero: 'Spiritual heritage',
      study: 'Students studying',
    },
  },
  black: {
    chip: 'የመንፈሳዊነት ጥልቀት',
    title: 'ጽድቅና ቅድስና',
    intro:
      '"ጽድቅ ለሕዝብ ከፍ ከፍ ታደርጋለች፤ ኃጢአት ግን ሕዝብን ያዋርዳል።" (ምሳሌ 14፡34) - በመንፈሳዊ ጉዟችን ውስጥ ያለው የጽድቅ ሚና እና በሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ የሚሰጡ ትምህርቶች።',
    meaningTitle: 'የጽድቅ ትርጓሜ በቤተክርስቲያን',
    meaningBody:
      'በኦርቶዶክሳዊት ተዋሕዶ ቤተክርስቲያን ትምህርት መሠረት ጽድቅ ማለት ከእግዚአብሔር ጋር በትክክለኛ ግንኙነት መኖር ማለት ነው። ይህም በሃይማኖትና በምግባር የታጀበ ሕይወትን ያጠቃልላል።',
    chips: ['ሃይማኖት', 'ምግባር', 'ትሕትና'],
    scriptureQuote: '"ፍሬያችሁ ቅድስና ሊሆን መጨረሻችሁም የዘላለም ሕይወት ነው"',
    scriptureRef: 'ሮሜ 6፡22',
    cards: [
      {
        title: 'መጽሐፍ ቅዱሳዊ ጥናት',
        desc: 'ስለ ጽድቅ የሚናገሩ የመጽሐፍ ቅዱስ ክፍሎች ዝርዝር ጥናት።',
      },
      {
        title: 'የአበው ትምህርት',
        desc: 'ቅዱሳን አባቶች ስለ ጽድቅ ሕይወት የሰጡን መመሪያዎች።',
      },
      {
        title: 'የሕይወት ተሞክሮ',
        desc: 'በግቢ ጉባኤ ቆይታችን ጽድቅን የምንለማመድባቸው መንገዶች።',
      },
    ],
    academicTitle: 'በአካዳሚክ ሕይወት ውስጥ የሚገለጥ ጽድቅ',
    academicParagraphs: [
      'እንደ ሐረማያ ዩኒቨርሲቲ ተማሪዎችነታችን፣ ጽድቅ የሚገለጸው በቤተክርስቲያን ብቻ ሳይሆን በክፍል ውስጥ፣ በፈተና ወቅትና ከጓደኞቻችን ጋር ባለን ግንኙነት ጭምር ነው። ታማኝነት፣ ታታሪነትና ትሕትና የጽድቅ መገለጫዎች ናቸው።',
      'እውቀትን ከእግዚአብሔር ጥበብ ጋር ማገናኘት የመንፈሳዊ ተማሪ ግዴታ ነው። "የጥበብ መጀመሪያ እግዚአብሔርን መፍራት ነው" እንደሚለው ቃሉ፣ እውነተኛ እውቀት ለጽድቅ ሕይወት መሠረት ይሆናል።',
    ],
    readMore: 'ተጨማሪ ያንብቡ',
    sideQuote: '"እውነትን ታውቃላችሁ እውነትም አርነት ያወጣችኋል"',
    alt: {
      hero: 'Spiritual depth',
      finalImage: 'Shadowy silhouette of an ancient building dome against a deep velvet sky, evoking a sense of solemnity and sacred silence',
    },
  },
}

const en = {
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    background: 'Background',
  },
  language: {
    label: 'Language',
    menuAria: 'Open language selector',
    en: 'English',
    am: 'Amharic',
    om: 'Afan Oromo',
    code: {
      en: 'EN',
      am: 'AM',
      om: 'AFO',
    },
  },
  common: {
    logoAlt: 'HUGG logo',
    close: 'Close',
    previousImage: 'Previous image',
    nextImage: 'Next image',
  },
  home: {
    heroImageAlt: 'Sacred Orthodox architecture',
    established: 'Established 1954',
    titleLine1: 'Haramaya University',
    titleLine2: 'Campus Fellowship',
    intro:
      'Welcome to Haramaya University Campus Fellowship. The word of God is light for our life and guidance for our journey.',
    ctaReadMore: 'Read More',
    ctaAbout: 'About Us',
    historyTitle: 'Church History',
    historyDescription:
      'Learn the ancient history of the Ethiopian Orthodox Tewahedo Church and the establishment of our university campus fellowship in depth.',
    viewMore: 'View More',
    nextSession: 'Next Session',
    weeklyProgramTitle: 'Weekly Program',
    weeklyProgramHint: 'Detailed schedules for courses, prayer, and study are provided below.',
    digitalLibraryTitle: 'Digital Library',
    digitalLibraryDescription: 'Spiritual books, hymns, and sermons',
    detailedWeeklyProgram: 'Detailed Weekly Program',
    scheduleBadge: 'HU Gibi Gubae',
    courseScheduleTitle: '1) Course Schedule',
    prayerScheduleTitle: '2) Prayer Schedule',
    mainPrayer: 'Main Prayer',
    additionalProgramsTitle: '3) Additional Programs',
    additionalPrograms: [
      {
        day: 'Thursday and Saturday',
        title: 'Hymn Study',
        time: '12:00 PM',
      },
      {
        day: 'Friday Evening',
        title: 'Bible Study',
        time: '12:00 PM',
      },
    ],
    courseSchedule: [
      { day: 'Monday', plan: '1st Year' },
      { day: 'Tuesday', plan: '3rd Year' },
      { day: 'Wednesday', plan: '2nd Year and 4th & 5th Year' },
    ],
    prayerSchedule: [
      { day: 'Monday', plan: 'Hymn Program and Children' },
      { day: 'Tuesday', plan: 'Education Development, Finance and Property' },
      { day: 'Wednesday', plan: 'Batch Career Members and Language' },
      { day: 'Thursday', plan: 'GC Prayer' },
      { day: 'Friday', plan: 'General Campus Fellowship Prayer' },
    ],
    quote: '"Whoever loves wisdom makes his father glad; the fear of the Lord is the beginning of wisdom."',
    quoteSource: 'Book of Proverbs',
    knowledgeTitle: 'Source of Knowledge and Wisdom',
    knowledgeNote: 'Nurturing generations under the shelter of the Church.',
    knowledgeImageAlt: 'Student studying ancient text',
    knowledgeItems: [
      {
        title: 'Academic Support',
        description: 'We provide spiritual and psychosocial support so students can succeed in their studies.',
      },
      {
        title: 'Social Life',
        description: 'We prepare a platform where students support one another and build close relationships.',
      },
    ],
    aria: {
      zoomPrayerImage: 'View {{day}} prayer image in larger size',
      prayerImageAlt: '{{day}} prayer',
      closePrayerPreview: 'Close prayer image preview',
    },
  },
  about: {
    title: 'About Us',
    subtitle: 'The history and vision of Orthodox Tewahedo believing students at Haramaya University Campus Fellowship.',
    historyChip: 'Our History',
    historyTitle: 'Foundation of Our Campus Fellowship',
    historyBody:
      'Haramaya University Campus Fellowship was founded when the university was known as Alemaya University, through the strong desire of a few students who gathered to begin spiritual service in community. Through many trials and victories over the years, it has become a major spiritual institution embracing thousands of students today.',
    missionTitle: 'Our Mission',
    missionBody:
      'To help students, during their stay, learn the word of God, grow in character, remain under the shelter of the Church, and become citizens who benefit their country and people.',
    visionTitle: 'Our Vision',
    visionBody: 'To see a generation developed in both knowledge and faith.',
    values: [
      { title: 'Tewahedo', description: 'Preserving the ancient faith faithfully' },
      { title: 'Education', description: 'Integrating theology with modern knowledge' },
      { title: 'Unity', description: 'A spiritual brotherhood bound in love' },
      { title: 'Service', description: 'Dedication to Church and humanity' },
    ],
    galleryTitle: 'Our Services in Pictures',
    serviceGallery: [
      { title: 'Course', subtitle: 'Classes on foundational faith and the word' },
      { title: 'Hymn', subtitle: 'Center of praise singing and spiritual chants' },
      { title: 'Begena', subtitle: 'Traditional spiritual music and training' },
      { title: 'Timket', subtitle: 'Festival liturgy and community unity' },
      { title: 'Fresh Welcome', subtitle: 'Welcoming and orienting new students' },
      { title: 'Graduation', subtitle: 'A spiritual celebration of completion and thanksgiving' },
      { title: 'Meskel', subtitle: 'Festival of faith and light at Demera' },
      { title: 'Maryam Memorial', subtitle: 'Commemoration and prayer gathering in honor of St. Mary' },
    ],
    joinTitle: 'Become Part of Us',
    joinBody: 'Let us learn together, serve together, and stand firm together.',
    joinCta: 'Join Now',
    infoCta: 'More Information',
    aria: {
      openFeatured: 'View {{title}} image in larger size',
      openMore: 'View more {{title}} images in larger size',
      imageAlt: '{{title}} image',
      closeGallery: 'Close gallery preview',
    },
  },
  background: {
    heroTitle: 'Historical Archive',
    introTitle: 'Introduction',
    introBody:
      'Haramaya University Campus Fellowship is a major spiritual institution where Orthodox Tewahedo believing students at Haramaya University nurture their spiritual life and serve their Church. Since its foundation, the fellowship has played a significant role in raising many scholars in both moral character and faith.',
    serviceYears: 'More Than 30 Years of Service',
    journeyTitle: 'Historical Journey',
    timeline: [
      {
        period: '1980s',
        title: 'Foundation',
        body: 'The fellowship began with prayer and spiritual singing by a few students, and has now grown to thousands of members.',
      },
      {
        period: '1990s',
        title: 'Growth and Expansion',
        body: 'As membership increased and various sub-groups were organized, this was a period when services expanded in a structured way.',
      },
    ],
    purposeTitle: 'Core Purpose',
    purposeItems: [
      { title: 'Spiritual Knowledge', body: 'To ensure students graduate grounded in Church teaching and order.' },
      { title: 'Social Bond', body: 'To create favorable conditions for spiritual love and unity among students.' },
      { title: 'Volunteer Service', body: 'To carry out development and charity work that serves the local community.' },
    ],
    quote: '"The Church is a source of moral character and a center of knowledge."',
    alt: {
      hero: 'Spiritual heritage',
      study: 'Students studying',
    },
  },
  black: {
    chip: 'Depth of Spirituality',
    title: 'Righteousness and Holiness',
    intro:
      '"Righteousness exalts a nation, but sin is a reproach to any people." (Proverbs 14:34) - The role of righteousness in our spiritual journey and teachings given in Haramaya University Campus Fellowship.',
    meaningTitle: 'Meaning of Righteousness in the Church',
    meaningBody:
      'According to Orthodox Tewahedo Church teaching, righteousness means living in a right relationship with God. This includes a life adorned by faith and moral conduct.',
    chips: ['Faith', 'Character', 'Humility'],
    scriptureQuote: '"Your fruit is holiness, and the end everlasting life."',
    scriptureRef: 'Romans 6:22',
    cards: [
      {
        title: 'Biblical Study',
        desc: 'A detailed study of biblical passages that speak about righteousness.',
      },
      {
        title: 'Teachings of the Fathers',
        desc: 'Guidance from holy fathers on the life of righteousness.',
      },
      {
        title: 'Life Practice',
        desc: 'Ways we practice righteousness during our time in campus fellowship.',
      },
    ],
    academicTitle: 'Righteousness Expressed in Academic Life',
    academicParagraphs: [
      'As Haramaya University students, righteousness is expressed not only in church, but also in the classroom, during exams, and in our relationships with friends. Integrity, diligence, and humility are marks of righteousness.',
      'Connecting knowledge with Godly wisdom is a duty of a spiritual student. As scripture says, "The fear of the Lord is the beginning of wisdom"; true knowledge becomes a foundation for a righteous life.',
    ],
    readMore: 'Read More',
    sideQuote: '"You shall know the truth, and the truth shall set you free."',
    alt: {
      hero: 'Spiritual depth',
      finalImage: 'Shadowy silhouette of an ancient building dome against a deep velvet sky, evoking a sense of solemnity and sacred silence',
    },
  },
}

const om = {
  nav: {
    home: 'Mana',
    about: 'Waa Nuyi',
    blog: 'Barreeffama',
    background: 'Seenaa',
  },
  language: {
    label: 'Afaan',
    menuAria: 'Filannoo afaanii banuu',
    en: 'Ingiliffaa',
    am: 'Amaariffaa',
    om: 'Afaan Oromoo',
    code: {
      en: 'EN',
      am: 'AM',
      om: 'AFO',
    },
  },
  common: {
    logoAlt: 'Mallattoo HUGG',
    close: 'Cufi',
    previousImage: 'Suuraa duraanii',
    nextImage: 'Suuraa itti aanu',
  },
  home: {
    heroImageAlt: 'Ijaarsa qulqulluu Ortodoksii',
    established: 'Hundeeffame 1954',
    titleLine1: 'Yuunivarsiitii Haramayaa',
    titleLine2: 'Gubee Kaampaasii',
    intro:
      'Nagaadhaan gara Gubee Kaampaasii Yuunivarsiitii Haramayaa dhuftan. Dubbii Waaqayyoo jireenya keenyaaf ifa, imala keenyaafis qajeelfama dha.',
    ctaReadMore: 'Dubbisaa Itti Fufi',
    ctaAbout: 'Waa Nuyi',
    historyTitle: 'Seenaa Mana Kiristaanaa',
    historyDescription:
      'Seenaa durii Mana Kiristaanaa Ortodoksii Tawaahidoo Itoophiyaa fi hundeeffama gubee kaampaasii keenya balinaan baradhaa.',
    viewMore: 'Dabalataan Ilaalaa',
    nextSession: 'Sagantaa Itti Aanu',
    weeklyProgramTitle: 'Sagantaa Torbanichaa',
    weeklyProgramHint: 'Sagantaaleen koorsii, kadhannaa fi qoʼannaa balinaan gadii keessatti dhiyaataniiru.',
    digitalLibraryTitle: 'Mana Kitaabaa Dijitaalaa',
    digitalLibraryDescription: 'Kitaabota hafuuraa, faarfannaa fi barsiisa',
    detailedWeeklyProgram: 'Sagantaa Torbanichaa Balʼaa',
    scheduleBadge: 'HU Gibi Gubae',
    courseScheduleTitle: '1) Sagantaa Koorsii',
    prayerScheduleTitle: '2) Sagantaa Kadhannaa',
    mainPrayer: 'Kadhannaa Ijoo',
    additionalProgramsTitle: '3) Sagantaalee Dabalataa',
    additionalPrograms: [
      {
        day: 'Kamisa fi Sanbata',
        title: 'Qorannoo Faarfannaa',
        time: 'Saʼaatii 12:00 galgala',
      },
      {
        day: 'Jimaata galgala',
        title: 'Qorannoo Macaafa Qulqulluu',
        time: 'Saʼaatii 12:00 galgala',
      },
    ],
    courseSchedule: [
      { day: 'Wiixata', plan: 'Waggaa 1ffaa' },
      { day: 'Qibxata', plan: 'Waggaa 3ffaa' },
      { day: 'Roobii', plan: 'Waggaa 2ffaa fi 4ffaa akkasumas 5ffaa' },
    ],
    prayerSchedule: [
      { day: 'Wiixata', plan: 'Karoorri faarfannaa fi daaʼimman' },
      { day: 'Qibxata', plan: 'Misooma barnootaa, herrega fi qabeenya' },
      { day: 'Roobii', plan: 'Koree ogummaa baachii fi afaanii' },
      { day: 'Kamisa', plan: 'Kadhannaa GC' },
      { day: 'Jimaata', plan: 'Kadhannaa waliigalaa gubee kaampaasii' },
    ],
    quote: '"Namni ogummaa jaallatu abbaa isaa gammachiisa; jalqabi ogummaa Waaqayyoon sodaachuu dha."',
    quoteSource: 'Macaafa Fakkeenyaa',
    knowledgeTitle: 'Madda Beekumsaa fi Ogummaa',
    knowledgeNote: 'Dhaloota gaaddisa Mana Kiristaanaa jalatti guddisuu.',
    knowledgeImageAlt: 'Barataa barruu durii qorachaa jiru',
    knowledgeItems: [
      {
        title: 'Deeggarsa Barnootaa',
        description: 'Barattoonni barnoota isaanii keessatti milkaaʼina akka argatan deeggarsa hafuuraa fi sammuu ni kennina.',
      },
      {
        title: 'Jireenya Hawaasummaa',
        description: 'Barattoonni wal gargaaranii walitti dhihaatanidhaaf waltajji ni qopheessina.',
      },
    ],
    aria: {
      zoomPrayerImage: 'Suuraa kadhannaa {{day}} guddistee ilaaluuf',
      prayerImageAlt: 'Kadhannaa {{day}}',
      closePrayerPreview: 'Mulʼata suuraa kadhannaa cufi',
    },
  },
  about: {
    title: 'Waa Nuyi',
    subtitle: 'Seenaa fi mulʼata barattoota amantoota Ortodoksii Tawaahidoo Yuunivarsiitii Haramayaa Kaampaasii Gubee.',
    historyChip: 'Seenaa Keenya',
    historyTitle: 'Hundeeffama Gubee Kaampaasii Keenyaa',
    historyBody:
      'Yuunivarsiitii Haramayaa Kaampaasii Gubee bara durii maqaa Yuunivarsiitii Aalamaayaa jedhamuun beekamu keessatti, fedhii cimaa barattoota muraasaa walitti dhufanii tajaajila hafuuraa jalqabuuf qaban irraa hundeeffame. Waggoota darban keessatti qormaata fi injifannoo hedduu keessa darbee harʼa dhaabbata hafuuraa guddaa barattoota kumaatamaan lakkaaʼaman hammatu taʼeera.',
    missionTitle: 'Ergama Keenya',
    missionBody:
      'Barattoonni yeroo turtii isaanii dubbii Waaqayyoo baratanii, naamusa gaariidhaan ijaaraman, gaaddisa Mana Kiristaanaa jalatti taʼanii biyya fi ummata isaanii tajaajilan gochuu dha.',
    visionTitle: 'Mulʼata Keenya',
    visionBody: 'Dhaloota beekumsaa fi amantiidhaan guddate arguu.',
    values: [
      { title: 'Tawaahidoo', description: 'Amantii durii amanamummaadhaan eeguu' },
      { title: 'Barnoota', description: 'Beekumsa amantii fi beekumsa ammayyaa walitti fiduu' },
      { title: 'Tokkummaa', description: 'Obbolummaa hafuuraa jaalalaan hidhame' },
      { title: 'Tajaajila', description: 'Mana Kiristaanaa fi namoomaaf of kennuu' },
    ],
    galleryTitle: 'Tajaajiloota Keenya Suuraadhaan',
    serviceGallery: [
      { title: 'Koorsii', subtitle: 'Kutaa amantii buʼuuraa fi barnoota dubbii' },
      { title: 'Faarfannaa', subtitle: 'Giddugala galata faaruu fi weedduu hafuuraa' },
      { title: 'Bageenaa', subtitle: 'Muziqaa hafuuraa aadaa fi leenjii' },
      { title: 'Ximqet', subtitle: 'Sirna ayyaanaa fi tokkummaa hawaasaa' },
      { title: 'Baga Nagaan Dhuftan Barattoota Haaraa', subtitle: 'Barattoota haaraa simachuu fi wal barsiisuu' },
      { title: 'Eebbifama', subtitle: 'Ayyaana gammachuu xumuraa fi galata hafuuraa' },
      { title: 'Masqalaa', subtitle: 'Ayyaana ifaa fi amantii Damaraa' },
      { title: 'Yaadannoo Maariyaam', subtitle: 'Yaadannoo fi waltajjii kadhannaa kabaja St. Maariyaam' },
    ],
    joinTitle: 'Qaama Keenya Taʼaa',
    joinBody: 'Waliin haa barannu, waliin haa tajaajillu, waliin haa cimu.',
    joinCta: 'Amma Itti Makamaa',
    infoCta: 'Odeeffannoo Dabalataa',
    aria: {
      openFeatured: 'Suuraa {{title}} guddistee ilaaluuf',
      openMore: 'Suuraalee dabalataa {{title}} guddistee ilaaluuf',
      imageAlt: 'Suuraa {{title}}',
      closeGallery: 'Mulʼata suuraa cufi',
    },
  },
  background: {
    heroTitle: 'Kuusaa Seenaa',
    introTitle: 'Seensa',
    introBody:
      'Yuunivarsiitii Haramayaa Kaampaasii Gubee dhaabbata hafuuraa guddaa barattoota amantoota Ortodoksii Tawaahidoo Yuunivarsiitii Haramayaa keessatti argamanii jireenya hafuuraa isaanii guddisanii Mana Kiristaanaa isaanii tajaajilan dha. Erga hundeeffame irraa kaasee, naamusaa fi amantiin hayyoota hedduu guddifachuun gahee olaanaa taphataa jira.',
    serviceYears: 'Waggaa 30 Ol Tajaajila',
    journeyTitle: 'Imala Seenaa',
    timeline: [
      {
        period: '1980moota',
        title: 'Hundeeffama',
        body: 'Gubee kaampaasii kun kadhannaa fi faarfannaa hafuuraa barattoota muraasaan jalqabamee harʼa miseensota kumaatama qaba.',
      },
      {
        period: '1990moota',
        title: 'Guddinaa fi Balʼina',
        body: 'Lakkoofsi miseensotaa dabalaa dhufe, kutaan xixiqqaan adda addaa ijaaramee tajaajilli karaa sirna qabeessa taʼeen balʼachuu jalqabe.',
      },
    ],
    purposeTitle: 'Kaayyoo Buʼuuraa',
    purposeItems: [
      { title: 'Beekumsa Hafuuraa', body: 'Barattoonni barnoota fi sirna Mana Kiristaanaatiin ijaaraman baʼanii akka bahaniif gochuu.' },
      { title: 'Hidhaa Hawaasummaa', body: 'Jaalalaa fi tokkummaan hafuuraa barattoota gidduutti akka babalʼatu haala mijataa uumuu.' },
      { title: 'Tajaajila Fedhii Tola', body: 'Hojii misoomaa fi gargaarsa namoomaa naannoo fi hawaasa tajaajilu raawwachuu.' },
    ],
    quote: '"Mana Kiristaanaa madda naamusaa fi giddugala beekumsaa dha."',
    alt: {
      hero: 'Dhaala hafuuraa',
      study: 'Barattoota barachaa jiran',
    },
  },
  black: {
    chip: 'Qulqullina Hafuuraa Gad Fageenya',
    title: 'Qajeelummaa fi Qulqullummaa',
    intro:
      '"Qajeelummaan saba ol kaasa; cubbuun garuu saba salphisa." (Fakkeenya 14:34) - Gahee qajeelummaa imala hafuuraa keenya keessatti fi barsiisa Yuunivarsiitii Haramayaa Kaampaasii Gubee keessatti kennamu.',
    meaningTitle: 'Hiika Qajeelummaa Mana Kiristaanaa Keessatti',
    meaningBody:
      'Barsiisa Mana Kiristaanaa Ortodoksii Tawaahidoo keessatti qajeelummaan jechuun Waaqayyoo wajjin hariiroo sirrii qabaatanii jiraachuu dha. Kunis jireenya amantii fi naamusa gaariin miidhame of keessaa qaba.',
    chips: ['Amantii', 'Naamusa', 'Gad Of Qabuu'],
    scriptureQuote: '"Firii keessan qulqullummaa, dhumni keessanis jireenya bara baraa dha."',
    scriptureRef: 'Roomaa 6:22',
    cards: [
      {
        title: 'Qorannoo Macaafa Qulqulluu',
        desc: 'Kutaa Macaafa Qulqulluu qajeelummaa irratti dubbatan balʼinaan qorachuu.',
      },
      {
        title: 'Barsiisa Abbootii',
        desc: 'Abbootiin qulqulloonni jireenya qajeelummaa irratti nuuf kennaan qajeelfama.',
      },
      {
        title: 'Muuxannoo Jireenyaa',
        desc: 'Yeroo turtii gubee kaampaasii keessatti qajeelummaa itti shaakalnu.',
      },
    ],
    academicTitle: 'Qajeelummaan Jireenya Barnootaa Keessatti Mulʼatu',
    academicParagraphs: [
      'Akka barattoota Yuunivarsiitii Haramayaa, qajeelummaan mana kiristaanaa qofa keessatti osoo hin taane kutaa keessatti, yeroo qorumsaa fi hariiroo hiriyoota keenya waliin qabnu keessatti ni mulʼata. Amanamummaa, hojii cimaa fi gad of qabuu mallattoolee qajeelummaa dha.',
      'Beekumsa ogummaa Waaqayyoo waliin walqabsiisuun dirqama barataa hafuuraa dha. Akkuma jedhu "jalqabi ogummaa Waaqayyoon sodaachuu dha"; beekumsi dhugaa jireenya qajeelaaaf buʼuura taʼa.',
    ],
    readMore: 'Dabalataan Dubbisaa',
    sideQuote: '"Dhugaa ni beektu, dhugaanis bilisa isin baasa."',
    alt: {
      hero: 'Gad fageenya hafuuraa',
      finalImage: 'Boca gamoo durii samii dimmaatti fakkaatu, callisuu fi ulfina hafuuraa agarsiisu',
    },
  },
}

const storedLanguage = localStorage.getItem('hugg-language')

i18n.use(initReactI18next).init({
  resources: {
    am: { translation: am },
    en: { translation: en },
    om: { translation: om },
  },
  lng: storedLanguage || 'am',
  fallbackLng: 'am',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
