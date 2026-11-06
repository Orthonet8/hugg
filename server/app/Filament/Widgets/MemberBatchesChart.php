<?php

namespace App\Filament\Widgets;

use App\Models\Member;
use Filament\Widgets\ChartWidget;

class MemberBatchesChart extends ChartWidget
{
    protected ?string $heading = 'Members by Academic Batch';

    protected static ?int $sort = 2;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $batches = Member::query()
            ->selectRaw('COALESCE(batch, \'Unknown\') as batch_name, count(*) as count')
            ->groupBy('batch_name')
            ->orderBy('batch_name', 'asc')
            ->pluck('count', 'batch_name')
            ->all();

        return [
            'datasets' => [
                [
                    'label' => 'Registered Members',
                    'data' => array_values($batches),
                    'backgroundColor' => [
                        'rgba(59, 130, 246, 0.75)',
                        'rgba(16, 185, 129, 0.75)',
                        'rgba(245, 158, 11, 0.75)',
                        'rgba(139, 92, 246, 0.75)',
                        'rgba(236, 72, 153, 0.75)',
                    ],
                    'borderRadius' => 8,
                ],
            ],
            'labels' => array_map(fn ($b) => 'Batch ' . $b, array_keys($batches)),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
