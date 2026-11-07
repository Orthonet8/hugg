<?php

namespace App\Filament\Resources\Events;

use App\Filament\Resources\Events\Pages\ManageEvents;
use App\Models\Event;
use App\Models\User;
use App\Services\EthiopianCalendarService;
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

    private static function authUser(): ?User
    {
        $u = auth('internal')->user();
        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool   { return static::authUser()?->hasPermissionTo('view events', 'web') ?? false; }
    public static function canCreate(): bool    { return static::authUser()?->hasPermissionTo('create events', 'web') ?? false; }
    public static function canEdit($record): bool   { return static::authUser()?->hasPermissionTo('edit events', 'web') ?? false; }
    public static function canDelete($record): bool { return static::authUser()?->hasPermissionTo('delete events', 'web') ?? false; }
    public static function canDeleteAny(): bool { return static::authUser()?->hasPermissionTo('delete events', 'web') ?? false; }

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
            Select::make('calendar_type')
                ->label('Calendar Input Mode (የቀን አቆጣጠር መምረጫ)')
                ->options([
                    'ethiopian' => '🇪🇹 Ethiopian Calendar (የኢትዮጵያ ቀን አቆጣጠር)',
                    'gregorian' => '🌐 Gregorian Calendar (የፈረንጅ ቀን አቆጣጠር)',
                ])
                ->default('ethiopian')
                ->live()
                ->dehydrated(false)
                ->columnSpanFull(),

            // Ethiopian Calendar Selectors (Active when 'ethiopian' mode is chosen)
            Select::make('eth_year')
                ->label('Year (ዓ.ም.)')
                ->options(function () {
                    $currentYear = 2019; // Current Ethiopian year
                    $years = [];
                    for ($y = $currentYear - 2; $y <= $currentYear + 5; $y++) {
                        $years[$y] = "{$y} ዓ.ም.";
                    }
                    return $years;
                })
                ->default(2019)
                ->live()
                ->visible(fn ($get) => $get('calendar_type') === 'ethiopian')
                ->afterStateUpdated(function ($state, $get, $set) {
                    $year = (int) ($state ?: 2019);
                    $month = (int) ($get('eth_month') ?: 1);
                    $day = (int) ($get('eth_day') ?: 1);
                    $greg = EthiopianCalendarService::toGregorian($year, $month, $day);
                    if ($greg) $set('date', $greg);
                })
                ->dehydrated(false),

            Select::make('eth_month')
                ->label('Month (ወር)')
                ->options([
                    1  => '1. መስከረም (Meskerem)',
                    2  => '2. ጥቅምት (Tikimt)',
                    3  => '3. ኅዳር (Hidar)',
                    4  => '4. ታኅሣሥ (Tahsas)',
                    5  => '5. ጥር (Tir)',
                    6  => '6. የካቲት (Yekatit)',
                    7  => '7. መጋቢት (Megabit)',
                    8  => '8. ሚያዝያ (Miyazya)',
                    9  => '9. ግንቦት (Ginbot)',
                    10 => '10. ሰኔ (Sene)',
                    11 => '11. ሐምሌ (Hamle)',
                    12 => '12. ነሐሴ (Nehase)',
                    13 => '13. ጳጉሜን (Pagume)',
                ])
                ->default(2)
                ->live()
                ->visible(fn ($get) => $get('calendar_type') === 'ethiopian')
                ->afterStateUpdated(function ($state, $get, $set) {
                    $year = (int) ($get('eth_year') ?: 2019);
                    $month = (int) ($state ?: 1);
                    $day = (int) ($get('eth_day') ?: 1);
                    $greg = EthiopianCalendarService::toGregorian($year, $month, $day);
                    if ($greg) $set('date', $greg);
                })
                ->dehydrated(false),

            Select::make('eth_day')
                ->label('Day (ቀን)')
                ->options(function ($get) {
                    $month = (int) ($get('eth_month') ?: 1);
                    $max = ($month === 13) ? 6 : 30;
                    $days = [];
                    for ($d = 1; $d <= $max; $d++) {
                        $days[$d] = (string) $d;
                    }
                    return $days;
                })
                ->default(1)
                ->live()
                ->visible(fn ($get) => $get('calendar_type') === 'ethiopian')
                ->afterStateUpdated(function ($state, $get, $set) {
                    $year = (int) ($get('eth_year') ?: 2019);
                    $month = (int) ($get('eth_month') ?: 1);
                    $day = (int) ($state ?: 1);
                    $greg = EthiopianCalendarService::toGregorian($year, $month, $day);
                    if ($greg) $set('date', $greg);
                })
                ->dehydrated(false),

            DatePicker::make('date')
                ->label('Gregorian Date (የፈረንጅ ቀን / Actual Stored Date)')
                ->live()
                ->helperText(function ($state) {
                    if (blank($state)) {
                        return 'Select a date or use Ethiopian date selector above.';
                    }
                    $eth = EthiopianCalendarService::toEthiopian($state);
                    return $eth ? "🇪🇹 ተመጣጣኝ የኢትዮጵያ ቀን: {$eth['formatted']} ({$eth['month_en']} / {$eth['month_om']})" : null;
                })
                ->afterStateHydrated(function ($component, $state, $set) {
                    if (filled($state)) {
                        $eth = EthiopianCalendarService::toEthiopian($state);
                        if ($eth) {
                            $set('eth_year', $eth['year']);
                            $set('eth_month', $eth['month']);
                            $set('eth_day', $eth['day']);
                        }
                    }
                })
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
                    ->label('Date (ቀን)')
                    ->date('M j, Y')
                    ->description(fn (Event $r): string => EthiopianCalendarService::toEthiopian($r->date)['formatted'] ?? '')
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
