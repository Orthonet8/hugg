<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use App\Models\Family;
use App\Models\Member;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestMembersWidget extends BaseWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Recent Member Registrations')
            ->query(
                Member::query()->latest()->limit(6)
            )
            ->columns([
                TextColumn::make('full_name')
                    ->label('Member Name')
                    ->weight('bold')
                    ->description(fn (Member $m): string => (string) $m->email_or_username),

                TextColumn::make('gender')
                    ->label('Gender')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'ወንድ' => 'info',
                        'ሴት' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('batch')
                    ->label('Batch')
                    ->badge()
                    ->color('warning'),

                TextColumn::make('section.name')
                    ->label('Section')
                    ->default('Unassigned')
                    ->color(fn (?string $state): string => $state ? 'success' : 'gray'),

                TextColumn::make('is_assigned_to_family')
                    ->label('Family Status')
                    ->badge()
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Assigned' : 'Unassigned')
                    ->color(fn (bool $state): string => $state ? 'success' : 'gray'),

                TextColumn::make('created_at')
                    ->label('Joined')
                    ->since()
                    ->color('gray'),
            ])
            ->paginated(false);
    }
}
