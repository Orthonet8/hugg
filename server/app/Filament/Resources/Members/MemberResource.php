<?php

namespace App\Filament\Resources\Members;

use App\Filament\Resources\Members\Pages\ManageMembers;
use App\Models\Member;
use App\Models\Section;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
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

    public static function canViewAny(): bool { return static::canManageMembers(); }
    public static function canCreate(): bool { return static::canManageMembers(); }
    public static function canEdit($record): bool { return static::canManageMembers(); }
    public static function canDelete($record): bool { return static::canManageMembers(); }
    public static function canDeleteAny(): bool { return static::canManageMembers(); }

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
                BadgeColumn::make('batch')
                    ->label('Batch')
                    ->placeholder('—'),
                BadgeColumn::make('is_assigned_to_family')
                    ->label('Family')
                    ->formatStateUsing(fn (Member $r): string => $r->is_assigned_to_family ? 'Assigned' : 'Not Assigned')
                    ->color(fn (Member $r): string => $r->is_assigned_to_family ? 'success' : 'danger'),
                TextColumn::make('mobile')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('batch')
                    ->label('Batch')
                    ->placeholder('—')
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
                SelectFilter::make('batch')
                    ->label('Batch')
                    ->options(function (): array {
                        return ['__empty__' => 'Empty'] + Member::query()
                            ->whereNotNull('batch')
                            ->where('batch', '!=', '')
                            ->distinct()
                            ->orderBy('batch')
                            ->pluck('batch', 'batch')
                            ->all();
                    })
                    ->searchable()
                    ->query(function (Builder $query, array $data): Builder {
                        $value = $data['value'] ?? null;

                        if (blank($value)) {
                            return $query;
                        }

                        if ($value === '__empty__') {
                            return $query->where(function (Builder $nested): void {
                                $nested->whereNull('batch')->orWhere('batch', '');
                            });
                        }

                        return $query->where('batch', $value);
                    }),
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver()->modalWidth('7xl'),
                    ViewAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                static::formFamilyBulkAction(),
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Form Family Bulk Action                                            */
    /* ------------------------------------------------------------------ */

    protected static function formFamilyBulkAction(): BulkAction
    {
        return BulkAction::make('formFamily')
            ->label('Form Family')
            ->icon(Heroicon::OutlinedUsers)
            ->color('info')
            ->modalHeading('Form a New Family')
            ->modalWidth('3xl')
            ->requiresConfirmation()
            ->form(function (array $data): array {
                $records = $data['records'] ?? [];
                $members = Member::whereIn('id', $records)->get();

                $repeaterItems = [];
                foreach ($members as $member) {
                    $repeaterItems[] = [
                        'member_id'   => $member->id,
                        'member_name' => $member->full_name,
                        'role'        => null,
                    ];
                }

                return [
                    TextInput::make('family_name')
                        ->label('Family Name')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('e.g., The Tesfaye Family'),
                    Repeater::make('family_members')
                        ->label('Family Members')
                        ->schema([
                            TextInput::make('member_name')
                                ->label('Member')
                                ->readOnly()
                                ->disabled(),
                            Select::make('role')
                                ->label('Role')
                                ->options([
                                    'father' => 'Father',
                                    'mother' => 'Mother',
                                    'child'  => 'Child',
                                ])
                                ->required(),
                        ])
                        ->columns(2)
                        ->reorderable(false)
                        ->deletable(false)
                        ->addable(false)
                        ->default($repeaterItems)
                        ->hiddenLabel(false),
                ];
            })
            ->action(function (array $data): void {
                $records = $data['records'] ?? [];

                // Check if any selected member is already assigned
                $alreadyAssigned = Member::whereIn('id', $records)
                    ->where('is_assigned_to_family', true)
                    ->get();

                if ($alreadyAssigned->isNotEmpty()) {
                    Notification::make()
                        ->title('Error')
                        ->body('One or more selected members are already assigned to a family.')
                        ->danger()
                        ->send();

                    return;
                }

                // Build members_data JSON
                $membersData = [];
                foreach ($data['family_members'] ?? [] as $entry) {
                    $membersData[] = [
                        'member_id' => (int) $entry['member_id'],
                        'role'      => $entry['role'],
                    ];
                }

                // Create family
                \App\Models\Family::create([
                    'family_name'  => $data['family_name'],
                    'members_data' => $membersData,
                ]);

                // Update members
                Member::whereIn('id', $records)
                    ->update(['is_assigned_to_family' => true]);

                Notification::make()
                    ->title('Family Created')
                    ->body("Family \"{$data['family_name']}\" has been formed with " . count($records) . ' members.')
                    ->success()
                    ->send();
            })
            ->deselectRecordsAfterCompletion();
    }

    /* ------------------------------------------------------------------ */
    /*  Form (tabbed)                                                      */
    /* ------------------------------------------------------------------ */

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Tabs::make('Member Details')
                    ->columnSpanFull()
                    ->tabs([
                        \Filament\Schemas\Components\Tabs\Tab::make('Credentials')
                            ->icon(Heroicon::OutlinedKey)
                            ->schema([
                                TextInput::make('email_or_username')
                                    ->label('Email or Username')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                TextInput::make('password')
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

                        \Filament\Schemas\Components\Tabs\Tab::make('Personal Info')
                            ->icon(Heroicon::OutlinedUser)
                            ->schema([
                                TextInput::make('full_name')
                                    ->label('Full Name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('christian_name')
                                    ->label('Christian Name')
                                    ->maxLength(255),
                                Select::make('gender')
                                    ->options([
                                        'ወንድ' => 'ወንድ',
                                        'ሴት' => 'ሴት',
                                    ]),
                                TextInput::make('age')
                                    ->maxLength(10),
                            ])->columns(2),

                        \Filament\Schemas\Components\Tabs\Tab::make('Campus & Academics')
                            ->icon(Heroicon::OutlinedAcademicCap)
                            ->schema([
                                TextInput::make('campus')
                                    ->maxLength(255),
                                TextInput::make('field_of_study')
                                    ->maxLength(255),
                                TextInput::make('batch')
                                    ->label('Batch (Academic Year)')
                                    ->placeholder('e.g., 2018, 2019')
                                    ->maxLength(20),
                                TextInput::make('dorm')
                                    ->maxLength(255),
                            ])->columns(2),

                        \Filament\Schemas\Components\Tabs\Tab::make('Background')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                TextInput::make('region')
                                    ->maxLength(255),
                                TextInput::make('zone')
                                    ->maxLength(255),
                                TextInput::make('woreda')
                                    ->maxLength(255),
                                TextInput::make('native_language')
                                    ->maxLength(255),
                                TextInput::make('extra_languages')
                                    ->helperText('Comma-separated')
                                    ->maxLength(255),
                                TextInput::make('previous_participation')
                                    ->maxLength(255),
                                TextInput::make('local_church')
                                    ->maxLength(255),
                            ])->columns(2),

                        \Filament\Schemas\Components\Tabs\Tab::make('Skills & Service')
                            ->icon(Heroicon::OutlinedHandRaised)
                            ->schema([
                                TextInput::make('ordination')
                                    ->maxLength(255),
                                TextInput::make('ordination_year')
                                    ->maxLength(255),
                                TextInput::make('diocese')
                                    ->maxLength(255),
                                TextInput::make('bishop')
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

                        \Filament\Schemas\Components\Tabs\Tab::make('Contact')
                            ->icon(Heroicon::OutlinedPhone)
                            ->schema([
                                TextInput::make('mobile')
                                    ->maxLength(50),
                                TextInput::make('telegram')
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

    public static function getPages(): array
    {
        return [
            'index' => ManageMembers::route('/'),
        ];
    }
}
