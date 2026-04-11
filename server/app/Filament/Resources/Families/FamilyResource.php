<?php

namespace App\Filament\Resources\Families;

use App\Models\Family;
use App\Models\User;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class FamilyResource extends Resource
{
    protected static ?string $model = Family::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHomeModern;

    protected static ?string $navigationLabel = 'Family Management';

    protected static string|UnitEnum|null $navigationGroup = 'Member Management';

    protected static ?int $navigationSort = 2;

    protected static function canManageFamilies(): bool
    {
        $user = auth('internal')->user();
        return $user instanceof User && $user->hasPermissionTo('manage families', 'web');
    }

    public static function canViewAny(): bool { return static::canManageFamilies(); }
    public static function canCreate(): bool { return static::canManageFamilies(); }
    public static function canEdit($record): bool { return static::canManageFamilies(); }
    public static function canDelete($record): bool { return static::canManageFamilies(); }
    public static function canDeleteAny(): bool { return static::canManageFamilies(); }

    /* ------------------------------------------------------------------ */
    /*  Table                                                              */
    /* ------------------------------------------------------------------ */

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('family_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('members_count')
                    ->label('Members')
                    ->state(fn (Family $r): int => count($r->members_data ?? []))
                    ->badge()
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderByRaw('jsonb_array_length(members_data) ' . $direction);
                    }),
                TextColumn::make('father_name')
                    ->label('Father')
                    ->state(fn (Family $r): string => $r->father?->full_name ?? '—')
                    ->placeholder('—'),
                TextColumn::make('mother_name')
                    ->label('Mother')
                    ->state(fn (Family $r): string => $r->mother?->full_name ?? '—')
                    ->placeholder('—'),
                TextColumn::make('children_count')
                    ->label('Children')
                    ->state(fn (Family $r): int => count($r->children))
                    ->badge(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->since()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Infolist — Custom Family View                                      */
    /* ------------------------------------------------------------------ */

    public static function infolist(Schema $schema): Schema
    {
        return $schema;
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\Families\Pages\ManageFamilies::route('/'),
        ];
    }
}
