<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum SectionType: string implements HasLabel
{
    case BIBLE = 'bible';
    case MEZMUR = 'mezmur';
    case YOUTH = 'youth';
    case CHILDREN = 'children';
    case PRAYER = 'prayer';
    case EVANGELISM = 'evangelism';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::BIBLE => 'Bible Study | የመጽሐፍ ቅዱስ ጥናት | Qo\'annaa Macaafa Qulqulluu',
            self::MEZMUR => 'Mezmur (Choir) | መዘምራን | Faarfannaa',
            self::YOUTH => 'Youth | ወጣቶች | Dargaggoota',
            self::CHILDREN => 'Children | ህጻናት | Ijoollee',
            self::PRAYER => 'Prayer | ጸሎት | Kadhannaa',
            self::EVANGELISM => 'Evangelism | ወንጌል አገልግሎት | Wangeela',
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::BIBLE => 'Deep diving into the word. | የቃል ጥናት አገልግሎት። | Qo\'annaa dubbii Waaqayyoo gad fageenyaan.',
            self::MEZMUR => 'Praise and worship team. | የምስጋና እና የአምልኮ ቡድን። | Garee galataa fi waaqeffannaa.',
            self::YOUTH => 'Mentoring and serving young believers. | ወጣቶችን የሚያበረታታ እና የሚያገለግል ክፍል። | Kutaa dargaggoota jajjabeessu fi tajaajilu.',
            self::CHILDREN => 'Children teaching and discipleship. | የህጻናት ትምህርት እና ደቀ መዝሙርነት። | Barnoota fi duuka-buutummaa ijoollee.',
            self::PRAYER => 'Intercession and prayer gatherings. | የምልጃ እና የጸሎት ስብሰባዎች። | Kadhannaa fi araarsaa walga\'iiwwan.',
            self::EVANGELISM => 'Reaching out with the gospel. | በወንጌል ለሰዎች መድረስ። | Wangeelaan namoota bira ga\'uu.',
        };
    }

    public function defaults(): array
    {
        return match ($this) {
            self::BIBLE => [
                'name_am' => 'የመጽሐፍ ቅዱስ ጥናት',
                'name_en' => 'Bible Study',
                'name_or' => 'Qo\'annaa Macaafa Qulqulluu',
            ],
            self::MEZMUR => [
                'name_am' => 'መዘምራን',
                'name_en' => 'Mezmur (Choir)',
                'name_or' => 'Faarfannaa',
            ],
            self::YOUTH => [
                'name_am' => 'ወጣቶች',
                'name_en' => 'Youth',
                'name_or' => 'Dargaggoota',
            ],
            self::CHILDREN => [
                'name_am' => 'ህጻናት',
                'name_en' => 'Children',
                'name_or' => 'Ijoollee',
            ],
            self::PRAYER => [
                'name_am' => 'ጸሎት',
                'name_en' => 'Prayer',
                'name_or' => 'Kadhannaa',
            ],
            self::EVANGELISM => [
                'name_am' => 'ወንጌል አገልግሎት',
                'name_en' => 'Evangelism',
                'name_or' => 'Wangeela',
            ],
        } + [
            'description_am' => explode(' | ', $this->getDescription())[1] ?? null,
            'description_en' => explode(' | ', $this->getDescription())[0] ?? null,
            'description_or' => explode(' | ', $this->getDescription())[2] ?? null,
        ];
    }

    public function nameFor(string $language): string
    {
        return (string) ($this->defaults()['name_'.$language] ?? '');
    }

    public function descriptionFor(string $language): string
    {
        return (string) ($this->defaults()['description_'.$language] ?? '');
    }

    public static function nameOptionsFor(string $language): array
    {
        $options = [];

        foreach (self::cases() as $type) {
            $value = $type->nameFor($language);

            if ($value !== '') {
                $options[$value] = $value;
            }
        }

        return $options;
    }

    public static function descriptionOptionsFor(string $language): array
    {
        $options = [];

        foreach (self::cases() as $type) {
            $value = $type->descriptionFor($language);

            if ($value !== '') {
                $options[$value] = $value;
            }
        }

        return $options;
    }
}
