<?php

namespace App\Filament\Widgets;

use App\Models\Member;
use Filament\Widgets\ChartWidget;

class MemberGenderDistributionChart extends ChartWidget
{
    protected ?string $heading = 'Gender Distribution';

    protected static ?int $sort = 3;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $distribution = Member::query()
            ->selectRaw('COALESCE(gender, \'Not Specified\') as gender_label, count(*) as count')
            ->groupBy('gender_label')
            ->pluck('count', 'gender_label')
            ->all();

        return [
            'datasets' => [
                [
                    'label' => 'Members',
                    'data' => array_values($distribution),
                    'backgroundColor' => [
                        '#3b82f6', // Male / blue
                        '#ec4899', // Female / pink
                        '#94a3b8', // Other / gray
                    ],
                ],
            ],
            'labels' => array_keys($distribution),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
