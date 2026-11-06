<?php

namespace App\Filament\Resources\Members;

use App\Filament\Resources\Members\Pages\ManageMembers;
use App\Models\Family;
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
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
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

    protected static function authUser(): ?User
    {
        $u = auth('internal')->user();
        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool   { return static::authUser()?->hasPermissionTo('view members', 'web') ?? false; }
    public static function canCreate(): bool    { return static::authUser()?->hasPermissionTo('create members', 'web') ?? false; }
    public static function canEdit($record): bool   { return static::authUser()?->hasPermissionTo('edit members', 'web') ?? false; }
    public static function canDelete($record): bool { return static::authUser()?->hasPermissionTo('delete members', 'web') ?? false; }
    public static function canDeleteAny(): bool { return static::authUser()?->hasPermissionTo('delete members', 'web') ?? false; }
    protected static function leaderSectionIds(): array
    {
        $user = auth('internal')->user();

        if (! $user instanceof User) {
            return [];
        }

        return $user->ledSections()->pluck('id')->map(fn ($id): int => (int) $id)->all();
    }

    public static function table(Table $table): Table
    {
        $leaderSectionIds = static::leaderSectionIds();

        return $table
            ->columns([
                ImageColumn::make('profile_photo')
                    ->label('Photo')
                    ->circular()
                    ->disk('public')
                    ->size(40),
                TextColumn::make('full_name')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Member $r): string => $r->email_or_username),
                ToggleColumn::make('is_active')
                    ->label('Active')
                    ->onColor('success')
                    ->offColor('gray')
                    ->updateStateUsing(function (Member $record, bool $state): bool {
                        $record->update(['is_active' => $state]);

                        return $state;
                    }),
                BadgeColumn::make('is_assigned_to_family')
                    ->label('Family')
                    ->formatStateUsing(fn (Member $r): string => $r->is_assigned_to_family ? 'Assigned' : 'Not Assigned')
                    ->color(fn (Member $r): string => $r->is_assigned_to_family ? 'success' : 'danger'),
                BadgeColumn::make('batch')
                    ->color('info')
                    ->searchable(),
                TextColumn::make('contact')
                    ->label('Contact')
                    ->state(function (Member $record): string {
                        $phone = e($record->mobile ?: '—');
                        $telegramRaw = trim((string) ($record->telegram ?? ''));
                        $telegramDisplay = $telegramRaw === ''
                            ? '—'
                            : (str_starts_with($telegramRaw, '@') ? $telegramRaw : '@'.$telegramRaw);
                        $telegram = e($telegramDisplay);

                        return <<<HTML
<div class="flex flex-col gap-1.5">
    <div class="inline-flex items-center gap-1.5">
        <span class="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">Phone</span>
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">{$phone}</span>
    </div>
    <div class="inline-flex items-center gap-1.5">
        <span class="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">Telegram</span>
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">{$telegram}</span>
    </div>
</div>
HTML;
                    })
                    ->html()
                    ->wrap()
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('mobile', 'ilike', "%{$search}%")
                            ->orWhere('telegram', 'ilike', "%{$search}%");
                    }),
                TextColumn::make('section.display_name')
                    ->label('Section')
                    ->placeholder('—')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('section', function (Builder $sectionQuery) use ($search): void {
                            $sectionQuery
                                ->where('name_am', 'ilike', "%{$search}%")
                                ->orWhere('name_en', 'ilike', "%{$search}%")
                                ->orWhere('name_or', 'ilike', "%{$search}%");
                        });
                    }),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->since()
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([
                SelectFilter::make('batch')
                    ->label('Batch')
                    ->options(fn (): array => Member::query()
                        ->whereNotNull('batch')
                        ->where('batch', '!=', '')
                        ->distinct()
                        ->orderBy('batch')
                        ->pluck('batch', 'batch')
                        ->toArray())
                    ->searchable()
                    ->preload(),
                SelectFilter::make('section_id')
                    ->label('Section')
                    ->options(function () use ($leaderSectionIds): array {
                        $query = Section::query()->orderBy('name_am');

                        if (! empty($leaderSectionIds)) {
                            $query->whereIn('id', $leaderSectionIds);
                        }

                        return $query
                            ->get()
                            ->mapWithKeys(fn (Section $section): array => [$section->id => $section->display_name])
                            ->toArray();
                    })
                    ->searchable()
                    ->preload(),
            ])
            ->recordAction('view')
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver()->modalWidth('7xl'),
                    ViewAction::make('view')
                        ->label('View Registration Details')
                        ->icon(Heroicon::OutlinedEye)
                        ->modalHeading(fn (Member $record): string => "Member Profile: {$record->full_name}")
                        ->modalDescription('Full registration and onboarding details for this fellowship member.')
                        ->modalWidth('5xl')
                        ->schema([])
                        ->modalContent(fn (Member $record) => view('filament.resources.members.member-details-modal', ['record' => $record])),
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

    protected static function formFamilyBulkAction(): BulkAction
    {
        return BulkAction::make('formFamily')
            ->label('Form Family')
            ->icon(Heroicon::OutlinedUsers)
            ->color('info')
            ->modalHeading('Form a New Family')
            ->modalWidth('3xl')
            ->form(function ($livewire): array {
                $selectedIds = $livewire->getSelectedTableRecords()->pluck('id')->all();
                $members = Member::whereIn('id', $selectedIds)->get();

                $repeaterItems = [];
                $index = 0;
                foreach ($members as $member) {
                    if ($index === 0) {
                        $role = 'father';
                    } elseif ($index === 1) {
                        $role = 'mother';
                    } else {
                        $role = 'child';
                    }

                    $repeaterItems[] = [
                        'member_id' => $member->id,
                        'member_name' => $member->full_name,
                        'role' => $role,
                    ];
                    $index++;
                }

                return [
                    TextInput::make('family_name')
                        ->label('Family Name')
                        ->required()
                        ->maxLength(255),
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
                                    'child' => 'Child',
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
            ->action(function (array $data, $livewire): void {
                $ids = $livewire->getSelectedTableRecords()->pluck('id')->all();

                if (count($ids) < 5) {
                    Notification::make()
                        ->title('Not enough members')
                        ->body('At least 5 members must be selected to form a family.')
                        ->danger()
                        ->send();

                    return;
                }

                $alreadyAssigned = Member::whereIn('id', $ids)
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

                $membersData = [];
                foreach ($data['family_members'] ?? [] as $entry) {
                    $membersData[] = [
                        'member_id' => (int) $entry['member_id'],
                        'role' => $entry['role'],
                    ];
                }

                Family::create([
                    'family_name' => $data['family_name'],
                    'members_data' => $membersData,
                ]);

                Member::whereIn('id', $ids)
                    ->update(['is_assigned_to_family' => true]);

                Notification::make()
                    ->title('Family Created')
                    ->body("Family \"{$data['family_name']}\" has been formed with ".count($ids).' members.')
                    ->success()
                    ->send();
            })
            ->deselectRecordsAfterCompletion();
    }

    public static function form(Schema $schema): Schema
    {
        $leaderSectionIds = static::leaderSectionIds();

        return $schema
            ->components([
                Tabs::make('Member Details')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Credentials')
                            ->icon(Heroicon::OutlinedKey)
                            ->schema([
                                TextInput::make('email_or_username')
                                    ->label('Username or Email')
                                    ->helperText('This is the login name the member uses.')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                TextInput::make('password')
                                    ->label('New Password')
                                    ->helperText('Leave blank to keep the current password.')
                                    ->password()
                                    ->revealable()
                                    ->required(fn (string $operation): bool => $operation === 'create')
                                    ->dehydrated(fn (?string $state): bool => filled($state))
                                    ->autocomplete('new-password')
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                FileUpload::make('profile_photo')
                                    ->image()
                                    ->disk('public')
                                    ->directory('avatars/members')
                                    ->maxSize(2048)
                                    ->columnSpan(2),
                            ])->columns(2),

                        Tab::make('Personal Info')
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

                        Tab::make('Campus & Academics')
                            ->icon(Heroicon::OutlinedAcademicCap)
                            ->schema([
                                TextInput::make('campus')->maxLength(255),
                                TextInput::make('field_of_study')->maxLength(255),
                                TextInput::make('dorm')->maxLength(255),
                            ])->columns(3),

                        Tab::make('Background')
                            ->icon(Heroicon::OutlinedGlobeAlt)
                            ->schema([
                                TextInput::make('region')->maxLength(255),
                                TextInput::make('zone')->maxLength(255),
                                TextInput::make('woreda')->maxLength(255),
                                TextInput::make('native_language')->maxLength(255),
                                TextInput::make('extra_languages')->helperText('Comma-separated')->maxLength(255),
                                TextInput::make('previous_participation')->maxLength(255),
                                TextInput::make('local_church')->maxLength(255),
                            ])->columns(2),

                        Tab::make('Skills & Service')
                            ->icon(Heroicon::OutlinedHandRaised)
                            ->schema([
                                TextInput::make('ordination')->maxLength(255),
                                TextInput::make('ordination_year')->maxLength(255),
                                TextInput::make('diocese')->maxLength(255),
                                TextInput::make('bishop')->maxLength(255),
                                Textarea::make('service_departments')->helperText('Comma-separated')->maxLength(500),
                                Textarea::make('talents')->helperText('Comma-separated')->maxLength(500),
                                Textarea::make('talent_description')->maxLength(1000),
                            ])->columns(2),

                        Tab::make('Contact')
                            ->icon(Heroicon::OutlinedPhone)
                            ->schema([
                                TextInput::make('mobile')->maxLength(50),
                                TextInput::make('telegram')->maxLength(255),
                                Select::make('section_id')
                                    ->label('Section')
                                    ->relationship('section', 'name_am')
                                    ->options(function () use ($leaderSectionIds): array {
                                        $query = Section::query();

                                        if (! empty($leaderSectionIds)) {
                                            $query->whereIn('id', $leaderSectionIds);
                                        }

                                        return $query->pluck('name_am', 'id')->toArray();
                                    })
                                    ->nullable()
                                    ->preload()
                                    ->searchable(),
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true),
                            ])->columns(2),

                        Tab::make('Emergency & Account')
                            ->icon(Heroicon::OutlinedShieldCheck)
                            ->schema([
                                TextInput::make('parent_phone')
                                    ->label('Parent Phone')
                                    ->tel()
                                    ->maxLength(50),
                                TextInput::make('emergency_contacts')
                                    ->label('Emergency Contacts')
                                    ->helperText('Separate multiple phone numbers with commas.')
                                    ->maxLength(2000),
                                TextInput::make('account_number')
                                    ->label('Bank Account Number')
                                    ->maxLength(50),
                                TextInput::make('account_name')
                                    ->label('Account Holder Name')
                                    ->maxLength(255),
                                TextInput::make('account_type')
                                    ->label('Bank / Account Type (e.g. CBE, Telebirr)')
                                    ->maxLength(100),
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

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $leaderSectionIds = static::leaderSectionIds();

        if (! empty($leaderSectionIds)) {
            $query->whereIn('section_id', $leaderSectionIds);
        }

        return $query;
    }
}
