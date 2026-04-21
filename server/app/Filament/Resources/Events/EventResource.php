<?php

namespace App\Filament\Resources\Events;

use App\Filament\Resources\Events\Pages\ManageEvents;
use App\Models\Event;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
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
use UnitEnum;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static ?string $navigationLabel = 'Events';

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    protected static function canManageEvents(): bool
    {
        $user = auth('internal')->user();

        return $user instanceof User && $user->hasPermissionTo('manage events', 'web');
    }

    public static function canViewAny(): bool { return static::canManageEvents(); }
    public static function canCreate(): bool { return static::canManageEvents(); }
    public static function canEdit($record): bool { return static::canManageEvents(); }
    public static function canDelete($record): bool { return static::canManageEvents(); }
    public static function canDeleteAny(): bool { return static::canManageEvents(); }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->label('Title')
                ->required()
                ->maxLength(255),
            Textarea::make('description')
                ->label('Description')
                ->rows(3)
                ->nullable(),
            Select::make('department')
                ->label('Department')
                ->options([
                    'ትምህርት'      => 'ትምህርት',
                    'መዝሙር'       => 'መዝሙር',
                    'ልማት'        => 'ልማት',
                    'አባላት ጉዳይ'  => 'አባላት ጉዳይ',
                    'ፋይናንስ'      => 'ፋይናንስ',
                ])
                ->required(),
            DatePicker::make('date')
                ->label('Date')
                ->required(),
            TextInput::make('time')
                ->label('Time (e.g. 11:00 - 12:30)')
                ->nullable(),
            TextInput::make('location')
                ->label('Location')
                ->nullable(),
            Toggle::make('is_active')
                ->label('Active')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                TextColumn::make('department')
                    ->sortable()
                    ->badge(),
                TextColumn::make('date')
                    ->date()
                    ->sortable(),
                TextColumn::make('time')
                    ->placeholder('-'),
                TextColumn::make('location')
                    ->placeholder('-')
                    ->limit(40),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->defaultSort('date', 'asc')
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver(),
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
            'index' => ManageEvents::route('/'),
        ];
    }
}
