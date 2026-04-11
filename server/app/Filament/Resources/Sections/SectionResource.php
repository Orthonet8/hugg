<?php

namespace App\Filament\Resources\Sections;

use App\Filament\Resources\Sections\Pages\ManageSections;
use App\Enums\SectionType;
use App\Models\Section;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use UnitEnum;

class SectionResource extends Resource
{
    protected const NEW_OPTION_PREFIX = '__new__:';

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

    protected static function localizedOptions(string $column, array $enumOptions): array
    {
        $storedOptions = Section::query()
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->pluck($column, $column)
            ->all();

        return $enumOptions + $storedOptions;
    }

    protected static function localizedSearchOptions(string $column, array $enumOptions, string $search): array
    {
        $options = static::localizedOptions($column, $enumOptions);
        $search = trim($search);

        if ($search === '') {
            return $options;
        }

        $needle = Str::lower($search);

        $filtered = collect($options)
            ->filter(function (string $label, string $value) use ($needle): bool {
                return Str::contains(Str::lower($value), $needle)
                    || Str::contains(Str::lower($label), $needle);
            })
            ->all();

        if (! array_key_exists($search, $options)) {
            $filtered[static::NEW_OPTION_PREFIX.$search] = 'Add "'.$search.'"';
        }

        return $filtered;
    }

    protected static function localizedOptionLabel(string $column, array $enumOptions, ?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if (str_starts_with($value, static::NEW_OPTION_PREFIX)) {
            return substr($value, strlen(static::NEW_OPTION_PREFIX));
        }

        $options = static::localizedOptions($column, $enumOptions);

        return $options[$value] ?? $value;
    }

    protected static function normalizeNewOptionState(string $field, callable $set, ?string $state): void
    {
        if (filled($state) && str_starts_with($state, static::NEW_OPTION_PREFIX)) {
            $set($field, substr($state, strlen(static::NEW_OPTION_PREFIX)));
        }
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('name_am')
                    ->label('Name (Amharic)')
                    ->options(fn (): array => static::localizedOptions('name_am', SectionType::nameOptionsFor('am')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('name_am', SectionType::nameOptionsFor('am'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('name_am', SectionType::nameOptionsFor('am'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('name_am', $set, $state))
                    ->requiredWithoutAll(['name_en', 'name_or']),
                Select::make('name_en')
                    ->label('Name (English)')
                    ->options(fn (): array => static::localizedOptions('name_en', SectionType::nameOptionsFor('en')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('name_en', SectionType::nameOptionsFor('en'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('name_en', SectionType::nameOptionsFor('en'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('name_en', $set, $state))
                    ->requiredWithoutAll(['name_am', 'name_or']),
                Select::make('name_or')
                    ->label('Name (Oromo)')
                    ->options(fn (): array => static::localizedOptions('name_or', SectionType::nameOptionsFor('or')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('name_or', SectionType::nameOptionsFor('or'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('name_or', SectionType::nameOptionsFor('or'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('name_or', $set, $state))
                    ->requiredWithoutAll(['name_am', 'name_en']),
                Select::make('description_am')
                    ->label('Description (Amharic)')
                    ->options(fn (): array => static::localizedOptions('description_am', SectionType::descriptionOptionsFor('am')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('description_am', SectionType::descriptionOptionsFor('am'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('description_am', SectionType::descriptionOptionsFor('am'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('description_am', $set, $state)),
                Select::make('description_en')
                    ->label('Description (English)')
                    ->options(fn (): array => static::localizedOptions('description_en', SectionType::descriptionOptionsFor('en')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('description_en', SectionType::descriptionOptionsFor('en'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('description_en', SectionType::descriptionOptionsFor('en'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('description_en', $set, $state)),
                Select::make('description_or')
                    ->label('Description (Oromo)')
                    ->options(fn (): array => static::localizedOptions('description_or', SectionType::descriptionOptionsFor('or')))
                    ->searchable()
                    ->preload()
                    ->getSearchResultsUsing(fn (string $search): array => static::localizedSearchOptions('description_or', SectionType::descriptionOptionsFor('or'), $search))
                    ->getOptionLabelUsing(fn (?string $value): ?string => static::localizedOptionLabel('description_or', SectionType::descriptionOptionsFor('or'), $value))
                    ->afterStateUpdated(fn (callable $set, ?string $state) => static::normalizeNewOptionState('description_or', $set, $state)),
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
                TextColumn::make('names')
                    ->label('Names (AM | EN | OR)')
                    ->state(fn (Section $record): string => collect([
                        $record->name_am,
                        $record->name_en,
                        $record->name_or,
                    ])->filter()->implode(' | '))
                    ->wrap()
                    ->limit(90)
                    ->tooltip(fn (Section $record): string => collect([
                        $record->name_am,
                        $record->name_en,
                        $record->name_or,
                    ])->filter()->implode(' | '))
                    ->searchable(['name_am', 'name_en', 'name_or'])
                    ->sortable(),
                TextColumn::make('descriptions')
                    ->label('Descriptions (AM | EN | OR)')
                    ->state(fn (Section $record): string => collect([
                        $record->description_am,
                        $record->description_en,
                        $record->description_or,
                    ])->filter()->implode(' | '))
                    ->wrap()
                    ->limit(110)
                    ->tooltip(fn (Section $record): string => collect([
                        $record->description_am,
                        $record->description_en,
                        $record->description_or,
                    ])->filter()->implode(' | ')),
                TextColumn::make('leader.name')
                    ->label('Leader')
                    ->placeholder('-')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver(),
                    ViewAction::make(),
                    DeleteAction::make(),
                ]),
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
