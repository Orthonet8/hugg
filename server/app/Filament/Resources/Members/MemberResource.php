<?php

namespace App\Filament\Resources\Members;

use App\Filament\Resources\Members\Pages\ManageMembers;
use App\Models\Member;
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
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class MemberResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static ?string $navigationLabel = 'Member Management';

    protected static string|UnitEnum|null $navigationGroup = 'Member Management';

    protected static ?int $navigationSort = 1;

    protected static function canManageMembers(): bool
    {
        $user = auth('internal')->user();
        return $user instanceof User && $user->hasPermissionTo('manage members', 'web');
    }

    public static function canViewAny(): bool
    {
        return static::canManageMembers();
    }

    public static function canCreate(): bool
    {
        return static::canManageMembers();
    }

    public static function canEdit($record): bool
    {
        return static::canManageMembers();
    }

    public static function canDelete($record): bool
    {
        return static::canManageMembers();
    }

    public static function canDeleteAny(): bool
    {
        return static::canManageMembers();
    }

    /* ------------------------------------------------------------------ */
    /*  Table                                                              */
    /* ------------------------------------------------------------------ */

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('profile_photo')
                    ->label('Photo')
                    ->circular()
                    ->defaultImageUrl(fn (Member $r): ?string => $r->profile_photo ? asset('storage/' . $r->profile_photo) : null)
                    ->size(40),
                TextColumn::make('full_name')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Member $r): string => $r->email_or_username),
                TextColumn::make('mobile')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('section.display_name')
                    ->label('Section')
                    ->placeholder('—')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->since()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver()->modalWidth('7xl'),
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

    /* ------------------------------------------------------------------ */
    /*  Form (tabbed)                                                      */
    /* ------------------------------------------------------------------ */

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                /* ── Tab 1: Credentials ── */
                \Filament\Schemas\Components\Tabs::make('Member Details')
                    ->columnSpanFull()
                    ->tabs([
                        \Filament\Schemas\Components\Tabs\Tab::make('Credentials')
                            ->icon(Heroicon::OutlinedKey)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('email_or_username')
                                    ->label('Email or Username')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                \Filament\Forms\Components\TextInput::make('password')
                                    ->password()
                                    ->revealable()
                                    ->required(fn (string $operation): bool => $operation === 'create')
                                    ->dehydrated(fn (?string $state): bool => filled($state))
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                \Filament\Forms\Components\FileUpload::make('profile_photo')
                                    ->image()
                                    ->directory('avatars/members')
                                    ->maxSize(2048)
                                    ->columnSpan(2),
                            ])->columns(2),

                        /* ── Tab 2: Personal Info ── */
                        \Filament\Schemas\Components\Tabs\Tab::make('Personal Info')
                            ->icon(Heroicon::OutlinedUser)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('full_name')
                                    ->label('Full Name')
                                    ->required()
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('christian_name')
                                    ->label('Christian Name')
                                    ->maxLength(255),
                                \Filament\Forms\Components\Select::make('gender')
                                    ->options([
                                        'ወንድ' => 'ወንድ',
                                        'ሴት' => 'ሴት',
                                    ]),
                                \Filament\Forms\Components\TextInput::make('age')
                                    ->maxLength(10),
                            ])->columns(2),

                        /* ── Tab 3: Campus & Academics ── */
                        \Filament\Schemas\Components\Tabs\Tab::make('Campus & Academics')
                            ->icon(Heroicon::OutlinedAcademicCap)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('campus')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('field_of_study')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('dorm')
                                    ->maxLength(255),
                            ])->columns(3),

                        /* ── Tab 4: Background & Participation ── */
                        \Filament\Schemas\Components\Tabs\Tab::make('Background')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('region')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('zone')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('woreda')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('native_language')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('extra_languages')
                                    ->helperText('Comma-separated')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('previous_participation')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('local_church')
                                    ->maxLength(255),
                            ])->columns(2),

                        /* ── Tab 5: Skills & Service ── */
                        \Filament\Schemas\Components\Tabs\Tab::make('Skills & Service')
                            ->icon(Heroicon::OutlinedHandRaised)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('ordination')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('ordination_year')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('diocese')
                                    ->maxLength(255),
                                \Filament\Forms\Components\TextInput::make('bishop')
                                    ->maxLength(255),
                                \Filament\Forms\Components\Textarea::make('service_departments')
                                    ->helperText('Comma-separated: ትምህርት,መዝሙር,ልማት')
                                    ->maxLength(500),
                                \Filament\Forms\Components\Textarea::make('talents')
                                    ->helperText('Comma-separated: መዝሙር,ድርሰት')
                                    ->maxLength(500),
                                \Filament\Forms\Components\Textarea::make('talent_description')
                                    ->maxLength(1000),
                            ])->columns(2),

                        /* ── Tab 6: Contact & Social ── */
                        \Filament\Schemas\Components\Tabs\Tab::make('Contact')
                            ->icon(Heroicon::OutlinedPhone)
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('mobile')
                                    ->maxLength(50),
                                \Filament\Forms\Components\TextInput::make('telegram')
                                    ->maxLength(255),
                                Select::make('section_id')
                                    ->label('Section')
                                    ->relationship('section', 'name_am')
                                    ->options(Section::query()->pluck('name_am', 'id'))
                                    ->nullable()
                                    ->preload()
                                    ->searchable(),
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true),
                            ])->columns(2),
                    ]),
            ]);
    }

    /* ------------------------------------------------------------------ */
    /*  View Schema                                                         */
    /* ------------------------------------------------------------------ */

    public static function getPages(): array
    {
        return [
            'index'  => ManageMembers::route('/'),
        ];
    }
}
