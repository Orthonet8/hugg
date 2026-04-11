<?php

namespace App\Filament\Resources\Sections;

use App\Filament\Resources\Sections\Pages\ManageSections;
use App\Models\Section;
use App\Models\User;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class SectionResource extends Resource
{
    protected static ?string $model = Section::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Sections';

    protected static string|UnitEnum|null $navigationGroup = 'Section Management';

    protected static ?int $navigationSort = 2;

    protected static function canManageSections(): bool
    {
        $user = auth('internal')->user();

        return $user instanceof User && $user->hasPermissionTo('manage sections', 'web');
    }

    public static function canViewAny(): bool
    {
        return static::canManageSections();
    }

    public static function canCreate(): bool
    {
        return static::canManageSections();
    }

    public static function canEdit($record): bool
    {
        return static::canManageSections();
    }

    public static function canDelete($record): bool
    {
        return static::canManageSections();
    }

    public static function canDeleteAny(): bool
    {
        return static::canManageSections();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name_am')
                    ->label('Name (Amharic)')
                    ->maxLength(255)
                    ->requiredWithoutAll(['name_en', 'name_or']),
                TextInput::make('name_en')
                    ->label('Name (English)')
                    ->maxLength(255)
                    ->requiredWithoutAll(['name_am', 'name_or']),
                TextInput::make('name_or')
                    ->label('Name (Oromo)')
                    ->maxLength(255)
                    ->requiredWithoutAll(['name_am', 'name_en']),
                Textarea::make('description_am')
                    ->label('Description (Amharic)')
                    ->rows(3),
                Textarea::make('description_en')
                    ->label('Description (English)')
                    ->rows(3),
                Textarea::make('description_or')
                    ->label('Description (Oromo)')
                    ->rows(3),
                Select::make('primary_language')
                    ->label('Primary Language')
                    ->options([
                        'am' => 'Amharic',
                        'en' => 'English',
                        'or' => 'Oromo',
                        'other' => 'Other',
                    ])
                    ->default('am')
                    ->required()
                    ->live(),
                TextInput::make('other_language')
                    ->label('Other Language')
                    ->maxLength(100)
                    ->visible(fn ($get): bool => $get('primary_language') === 'other')
                    ->required(fn ($get): bool => $get('primary_language') === 'other'),
                Select::make('leader_id')
                    ->label('Leader')
                    ->relationship(
                        name: 'leader',
                        titleAttribute: 'name',
                        modifyQueryUsing: fn (Builder $query): Builder => $query->whereDoesntHave('roles', fn (Builder $roleQuery): Builder => $roleQuery->where('name', 'admin')),
                    )
                    ->nullable()
                    ->preload()
                    ->searchable(),
                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('display_name')
                    ->label('Section')
                    ->searchable(['name_am', 'name_en', 'name_or'])
                    ->sortable(),
                TextColumn::make('leader.name')
                    ->label('Leader')
                    ->placeholder('-')
                    ->searchable(),
                TextColumn::make('primary_language')
                    ->label('Language')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'am' => 'Amharic',
                        'en' => 'English',
                        'or' => 'Oromo',
                        default => 'Other',
                    })
                    ->badge(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSections::route('/'),
        ];
    }
}
