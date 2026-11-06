<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\ManageUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section as FormSection;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;
use UnitEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Manage Users';

    protected static string|UnitEnum|null $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 3;

    private static function authUser(): ?User
    {
        $u = auth('internal')->user();
        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool   { return static::authUser()?->hasPermissionTo('view users', 'web') ?? false; }
    public static function canCreate(): bool    { return static::authUser()?->hasPermissionTo('create users', 'web') ?? false; }
    public static function canEdit($record): bool   { return static::authUser()?->hasPermissionTo('edit users', 'web') ?? false; }
    public static function canDelete($record): bool { return static::authUser()?->hasPermissionTo('delete users', 'web') ?? false; }
    public static function canDeleteAny(): bool { return static::authUser()?->hasPermissionTo('delete users', 'web') ?? false; }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                FormSection::make('Account Credentials & Basic Info')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('username')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        TextInput::make('password')
                            ->password()
                            ->revealable()
                            ->rule(Password::default())
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state)),
                        Select::make('roles')
                            ->label('Role')
                            ->relationship(
                                name: 'roles',
                                titleAttribute: 'name',
                                modifyQueryUsing: fn (Builder $query): Builder => $query->where('name', '!=', 'admin'),
                            )
                            ->multiple()
                            ->maxItems(1)
                            ->preload()
                            ->searchable()
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->label('Role name')
                                    ->required()
                                    ->maxLength(255)
                                    ->rules(['not_in:admin']),
                            ])
                            ->createOptionUsing(function (array $data): string {
                                $role = Role::findOrCreate($data['name'], 'web');

                                return (string) $role->getKey();
                            }),
                    ])->columns(2),

                FormSection::make('General Contact Details (Common for Users/Supporters)')
                    ->description('Contact channels visible to members who need help & support.')
                    ->schema([
                        FileUpload::make('avatar_url')
                            ->label('Profile Photo')
                            ->avatar()
                            ->image()
                            ->disk('public')
                            ->directory('avatars/users')
                            ->maxSize(2048),
                        TextInput::make('phone')
                            ->label('Phone Number')
                            ->tel()
                            ->maxLength(50),
                        TextInput::make('telegram_username')
                            ->label('Telegram Username')
                            ->prefix('@')
                            ->maxLength(100),
                        TextInput::make('email')
                            ->label('Email Address')
                            ->email()
                            ->maxLength(255),
                    ])->columns(2),

                FormSection::make('Help & Support Profile')
                    ->description('Enable this user to appear as an assigned supporter for fellowship members.')
                    ->schema([
                        Toggle::make('is_supporter')
                            ->label('Active Help & Support Provider')
                            ->helperText('When enabled, members can see this supporter for assistance and match with them.')
                            ->default(false),
                        CheckboxList::make('support_sectors')
                            ->label('Help & Support Sectors')
                            ->helperText('Select which sectors this user can assist members with.')
                            ->options([
                                'Spiritual & Prayer'    => 'Spiritual & Prayer (መንፈሳዊ እና ጸሎት)',
                                'Academic & Campus'     => 'Academic & Campus (ትምህርት እና ግቢ)',
                                'Counseling & Personal' => 'Counseling & Personal (ምክር እና የግል ጉዳይ)',
                                'Charity & Financial'   => 'Charity & Financial (ልማት እና ድጋፍ)',
                                'Technical & Media'     => 'Technical & Media (ቴክኒክ እና ሚዲያ)',
                                'General Inquiries'     => 'General Inquiries (አጠቃላይ ጥያቄ)',
                            ])
                            ->columns(2),
                        Textarea::make('support_bio')
                            ->label('About / Availability')
                            ->placeholder('Brief note describing how this supporter can guide members, office hours, or preferred contact times...')
                            ->rows(3)
                            ->maxLength(1000)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar_url')
                    ->label('Photo')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(fn (User $u): ?string => $u->getFilamentAvatarUrl()),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (User $u): ?string => $u->phone ? 'Tel: ' . $u->phone : null),
                TextColumn::make('username')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('roles.name')
                    ->label('Role')
                    ->badge()
                    ->separator(','),
                IconColumn::make('is_supporter')
                    ->label('Supporter')
                    ->boolean()
                    ->trueIcon(Heroicon::OutlinedShieldCheck)
                    ->falseIcon(Heroicon::OutlinedXMark)
                    ->trueColor('success')
                    ->falseColor('gray'),
                TextColumn::make('support_sectors')
                    ->label('Help Sectors')
                    ->badge()
                    ->separator(',')
                    ->color('info')
                    ->toggleable(isToggledHiddenByDefault: false),
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
                    EditAction::make(),
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

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->whereDoesntHave('roles', fn (Builder $query): Builder => $query->where('name', 'admin'));
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageUsers::route('/'),
        ];
    }
}
