<?php

namespace App\Filament\Resources\Members\Pages;

use App\Filament\Resources\Members\MemberResource;
use App\Models\Member;
use App\Models\Section;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageMembers extends ManageRecords
{
    protected static string $resource = MemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->slideOver()
                ->modalWidth('7xl')
                ->label('Add Member'),
        ];
    }

    protected function getTableQuery(): Builder
    {
        return Member::with('section');
    }

    public function getTabs(): array
    {
        $tabs = [
            'all' => Tab::make('All')
                ->icon('heroicon-o-users')
                ->badge((string) Member::query()->count())
                ->badgeColor('primary'),
        ];

        $batches = Member::query()
            ->whereNotNull('batch')
            ->where('batch', '!=', '')
            ->distinct()
            ->orderBy('batch')
            ->pluck('batch');

        foreach ($batches as $batch) {
            $tabs['batch_'.$batch] = Tab::make('Batch: '.$batch)
                ->icon('heroicon-o-calendar-days')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('batch', $batch))
                ->badge((string) Member::query()->where('batch', $batch)->count())
                ->badgeColor('info');
        }

        $sections = Section::query()
            ->orderBy('name_am')
            ->get();

        foreach ($sections as $section) {
            $sectionId = $section->id;
            $tabs['section_'.$sectionId] = Tab::make('Section: '.$section->display_name)
                ->icon('heroicon-o-squares-2x2')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('section_id', $sectionId))
                ->badge((string) Member::query()->where('section_id', $sectionId)->count())
                ->badgeColor('success');
        }

        return $tabs;
    }

    public function getTabsContentComponent(): Component
    {
        return Tabs::make()
            ->key('memberTabs')
            ->livewireProperty('activeTab')
            ->contained(true)
            ->tabs($this->getCachedTabs())
            ->hidden(empty($this->getCachedTabs()));
    }
}
