<?php

namespace App\Filament\Resources\Members\Pages;

use App\Filament\Resources\Members\MemberResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;
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

    protected function getScopedMembersQuery(): Builder
    {
        return MemberResource::getEloquentQuery()->with('section');
    }
}
