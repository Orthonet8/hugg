export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  monthNameAm: string;
  monthNameEn: string;
  monthNameOm: string;
  formattedAm: string;
  formattedEn: string;
  formattedOm: string;
  iso: string; // YYYY-MM-DD in Ethiopian date
}

export const ETHIOPIAN_MONTHS: Record<
  number,
  { am: string; en: string; om: string; days: (year: number) => number }
> = {
  1: { am: "መስከረም", en: "Meskerem", om: "Fulbaana", days: () => 30 },
  2: { am: "ጥቅምት", en: "Tikimt", om: "Onkololeessa", days: () => 30 },
  3: { am: "ኅዳር", en: "Hidar", om: "Sadaasa", days: () => 30 },
  4: { am: "ታኅሣሥ", en: "Tahsas", om: "Muddee", days: () => 30 },
  5: { am: "ጥር", en: "Tir", om: "Amajjii", days: () => 30 },
  6: { am: "የካቲት", en: "Yekatit", om: "Guraandhala", days: () => 30 },
  7: { am: "መጋቢት", en: "Megabit", om: "Bitooteessa", days: () => 30 },
  8: { am: "ሚያዝያ", en: "Miyazya", om: "Ebla", days: () => 30 },
  9: { am: "ግንቦት", en: "Ginbot", om: "Caamsaa", days: () => 30 },
  10: { am: "ሰኔ", en: "Sene", om: "Waxabajjii", days: () => 30 },
  11: { am: "ሐምሌ", en: "Hamle", om: "Adooleessa", days: () => 30 },
  12: { am: "ነሐሴ", en: "Nehase", om: "Hagayya", days: () => 30 },
  13: {
    am: "ጳጉሜን",
    en: "Pagume",
    om: "Qaammee",
    days: (year: number) => (year % 4 === 3 ? 6 : 5),
  },
};

/**
 * Convert Gregorian Y-M-D to Julian Day Number (JDN)
 */
function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Convert Julian Day Number (JDN) to Gregorian Date
 */
function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

/**
 * Convert JDN to Ethiopian Year, Month, Day (Using standard Andegna algorithm)
 */
function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const year =
    4 * Math.floor((jdn - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return { year, month, day };
}

/**
 * Convert Ethiopian Year, Month, Day to JDN
 */
function ethiopianToJdn(year: number, month: number, day: number): number {
  return (
    1723856 +
    365 +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * month +
    day -
    31
  );
}

/**
 * Convert any Date or ISO date string to rich Ethiopian Date details.
 */
export function toEthiopianDate(input: Date | string | number): EthiopianDate {
  let dateObj: Date;

  if (typeof input === "string") {
    // Treat YYYY-MM-DD as local date to prevent timezone shifting
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [y, m, d] = input.split("-").map(Number);
      dateObj = new Date(y, m - 1, d);
    } else {
      dateObj = new Date(input);
    }
  } else if (typeof input === "number") {
    dateObj = new Date(input);
  } else {
    dateObj = input;
  }

  const gYear = dateObj.getFullYear();
  const gMonth = dateObj.getMonth() + 1;
  const gDay = dateObj.getDate();

  const jdn = gregorianToJdn(gYear, gMonth, gDay);
  const { year, month, day } = jdnToEthiopian(jdn);

  const mInfo = ETHIOPIAN_MONTHS[month] || {
    am: `ወር ${month}`,
    en: `Month ${month}`,
    om: `Ji'a ${month}`,
  };

  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    year,
    month,
    day,
    monthNameAm: mInfo.am,
    monthNameEn: mInfo.en,
    monthNameOm: mInfo.om,
    formattedAm: `${mInfo.am} ${day}፣ ${year} ዓ.ም.`,
    formattedEn: `${mInfo.en} ${day}, ${year} E.C.`,
    formattedOm: `${mInfo.om} ${day}, ${year} Dh.K.`,
    iso,
  };
}

/**
 * Convert Ethiopian Year, Month, Day back to Gregorian Date
 */
export function fromEthiopianDate(
  year: number,
  month: number,
  day: number
): { date: Date; iso: string } {
  const jdn = ethiopianToJdn(year, month, day);
  const { year: gY, month: gM, day: gD } = jdnToGregorian(jdn);

  const iso = `${String(gY).padStart(4, "0")}-${String(gM).padStart(2, "0")}-${String(gD).padStart(2, "0")}`;
  const date = new Date(gY, gM - 1, gD);

  return { date, iso };
}

/**
 * Get days count in an Ethiopian month
 */
export function getDaysInEthiopianMonth(year: number, month: number): number {
  if (month >= 1 && month <= 12) return 30;
  if (month === 13) return year % 4 === 3 ? 6 : 5;
  return 30;
}
