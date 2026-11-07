<?php

namespace App\Services;

use Andegna\DateTimeFactory;
use DateTimeInterface;
use Throwable;

class EthiopianCalendarService
{
    /**
     * Ethiopian month names in Amharic, English transliteration, and Afaan Oromoo.
     */
    public const MONTHS = [
        1  => ['am' => 'መስከረም', 'en' => 'Meskerem', 'om' => 'Fulbaana'],
        2  => ['am' => 'ጥቅምት',  'en' => 'Tikimt',   'om' => 'Onkololeessa'],
        3  => ['am' => 'ኅዳር',   'en' => 'Hidar',    'om' => 'Sadaasa'],
        4  => ['am' => 'ታኅሣሥ',  'en' => 'Tahsas',   'om' => 'Muddee'],
        5  => ['am' => 'ጥር',    'en' => 'Tir',      'om' => 'Amajjii'],
        6  => ['am' => 'የካቲት',  'en' => 'Yekatit',  'om' => 'Guraandhala'],
        7  => ['am' => 'መጋቢት',  'en' => 'Megabit',  'om' => 'Bitooteessa'],
        8  => ['am' => 'ሚያዝያ', 'en' => 'Miyazya',  'om' => 'Ebla'],
        9  => ['am' => 'ግንቦት',  'en' => 'Ginbot',   'om' => 'Caamsaa'],
        10 => ['am' => 'ሰኔ',    'en' => 'Sene',     'om' => 'Waxabajjii'],
        11 => ['am' => 'ሐምሌ',   'en' => 'Hamle',    'om' => 'Adooleessa'],
        12 => ['am' => 'ነሐሴ',   'en' => 'Nehase',   'om' => 'Hagayya'],
        13 => ['am' => 'ጳጉሜን',  'en' => 'Pagume',   'om' => 'Qaammee'],
    ];

    /**
     * Convert Gregorian date (string/DateTime) to Ethiopian calendar components.
     *
     * @return array{year: int, month: int, day: int, month_name: string, formatted: string, amharic: string}
     */
    public static function toEthiopian(string|DateTimeInterface|null $date): ?array
    {
        if (blank($date)) {
            return null;
        }

        try {
            $dt = $date instanceof DateTimeInterface
                ? $date
                : new \DateTime($date);

            $eth = DateTimeFactory::fromDateTime($dt);
            $year = $eth->getYear();
            $month = $eth->getMonth();
            $day = $eth->getDay();

            $monthInfo = self::MONTHS[$month] ?? ['am' => $eth->format('F'), 'en' => "Month $month", 'om' => "Ji'a $month"];

            return [
                'year'       => $year,
                'month'      => $month,
                'day'        => $day,
                'month_name' => $monthInfo['am'],
                'month_en'   => $monthInfo['en'],
                'month_om'   => $monthInfo['om'],
                'amharic'    => "{$monthInfo['am']} {$day}፣ {$year}",
                'formatted'  => "{$monthInfo['am']} {$day}, {$year} ዓ.ም.",
                'iso'        => sprintf('%04d-%02d-%02d', $year, $month, $day),
            ];
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Convert Ethiopian Year, Month, Day to Gregorian string 'Y-m-d'.
     */
    public static function toGregorian(int $year, int $month, int $day): ?string
    {
        try {
            $eth = DateTimeFactory::of($year, $month, $day);
            return $eth->toGregorian()->format('Y-m-d');
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Format dual display string, e.g. "Nov 7, 2026 (ጥቅምት 28, 2019)"
     */
    public static function formatDual(string|DateTimeInterface|null $date): string
    {
        if (blank($date)) {
            return '-';
        }

        try {
            $dt = $date instanceof DateTimeInterface ? $date : new \DateTime($date);
            $gregorian = $dt->format('M j, Y');
            $eth = self::toEthiopian($dt);

            if (! $eth) {
                return $gregorian;
            }

            return "{$gregorian} ({$eth['formatted']})";
        } catch (Throwable) {
            return (string) $date;
        }
    }
}
