<?php

namespace App\Filament\Resources\Members\Pages;

use App\Filament\Resources\Members\MemberResource;
use App\Models\Section;
use App\Models\User;
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
        return $this->getScopedMembersQuery();
    }

    public function getTabs(): array
    {
        $scopedQuery = $this->getScopedMembersQuery();

        $tabs = [
            'all' => Tab::make('All')
                ->icon('heroicon-o-users')
                ->badge((string) (clone $scopedQuery)->count())
                ->badgeColor('primary'),
        ];

        $batches = (clone $scopedQuery)
            ->whereNotNull('batch')
            ->where('batch', '!=', '')
            ->distinct()
            ->orderBy('batch')
            ->pluck('batch');

        foreach ($batches as $batch) {
            $tabs['batch_'.$batch] = Tab::make('Batch: '.$batch)
                ->icon('heroicon-o-calendar-days')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('batch', $batch))
                ->badge((string) (clone $scopedQuery)->where('batch', $batch)->count())
                ->badgeColor('info');
        }

        $leaderSectionIds = $this->getLeaderSectionIds();
        $sectionsQuery = Section::query()->orderBy('name_am');

        if (! empty($leaderSectionIds)) {
            $sectionsQuery->whereIn('id', $leaderSectionIds);
        }

        $sections = $sectionsQuery->get();

        foreach ($sections as $section) {
            $sectionId = $section->id;
            $tabs['section_'.$sectionId] = Tab::make('Section: '.$section->display_name)
                ->icon('heroicon-o-squares-2x2')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('section_id', $sectionId))
                ->badge((string) (clone $scopedQuery)->where('section_id', $sectionId)->count())
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

    protected function getScopedMembersQuery(): Builder
    {
        return MemberResource::getEloquentQuery()->with('section');
    }

    /**
     * @return array<int, int>
     */
    protected function getLeaderSectionIds(): array
    {
        $user = auth('internal')->user();

        if (! $user instanceof User) {
            return [];
        }

        return $user->ledSections()->pluck('id')->map(fn ($id): int => (int) $id)->all();
    }
}
