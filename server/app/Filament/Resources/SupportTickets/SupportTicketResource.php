<?php

namespace App\Filament\Resources\SupportTickets;

use App\Filament\Resources\SupportTickets\Pages\ManageSupportTickets;
use App\Filament\Resources\SupportTickets\Pages\SupportChatPage;
use App\Models\Member;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class SupportTicketResource extends Resource
{
    protected static ?string $model = SupportTicket::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static ?string $navigationLabel = 'Help & Support Desk';

    protected static string|UnitEnum|null $navigationGroup = 'Member Management';

    protected static ?int $navigationSort = 3;

    private static function authUser(): ?User
    {
        $u = auth('internal')->user();

        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool
    {
        return static::authUser() !== null;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('member_id')
                    ->label('Requesting Member')
                    ->relationship('member', 'full_name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Select::make('assigned_user_id')
                    ->label('Assigned Supporter')
                    ->relationship(
                        name: 'assignedUser',
                        titleAttribute: 'name',
                        modifyQueryUsing: fn (Builder $query): Builder => $query->where('is_supporter', true)->orWhereHas('roles', fn ($q) => $q->where('name', 'admin')),
                    )
                    ->searchable()
                    ->preload()
                    ->nullable(),

                TextInput::make('subject')
                    ->label('Topic / Subject')
                    ->required()
                    ->maxLength(255),

                Select::make('sector')
                    ->label('Support Sector')
                    ->options([
                        'Spiritual & Prayer'    => 'Spiritual & Prayer (መንፈሳዊ እና ጸሎት)',
                        'Academic & Campus'     => 'Academic & Campus (ትምህርት እና ግቢ)',
                        'Counseling & Personal' => 'Counseling & Personal (ምክር እና የግል ጉዳይ)',
                        'Charity & Financial'   => 'Charity & Financial (ልማት እና ድጋፍ)',
                        'Technical & Media'     => 'Technical & Media (ቴክኒክ እና ሚዲያ)',
                        'General Inquiries'     => 'General Inquiries (አጠቃላይ ጥያቄ)',
                    ])
                    ->required(),

                Select::make('status')
                    ->label('Ticket Status')
                    ->options([
                        'open'        => 'Open (አዲስ)',
                        'in_progress' => 'In Progress (በሂደት ላይ)',
                        'resolved'    => 'Resolved (ተፈትቷል)',
                        'closed'      => 'Closed (የተዘጋ)',
                    ])
                    ->default('open')
                    ->required(),

                Select::make('priority')
                    ->label('Priority Level')
                    ->options([
                        'low'    => 'Low',
                        'medium' => 'Medium',
                        'high'   => 'High',
                        'urgent' => 'Urgent',
                    ])
                    ->default('medium')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('#')
                    ->sortable(),

                TextColumn::make('subject')
                    ->label('Subject & Topic')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (SupportTicket $r): string => "Sector: {$r->sector}"),

                TextColumn::make('member.full_name')
                    ->label('Member')
                    ->searchable()
                    ->description(fn (SupportTicket $r): ?string => $r->member?->mobile ? 'Tel: ' . $r->member->mobile : $r->member?->email_or_username),

                TextColumn::make('assignedUser.name')
                    ->label('Assigned Supporter')
                    ->default('Unassigned')
                    ->badge()
                    ->color(fn (?string $state): string => $state && $state !== 'Unassigned' ? 'info' : 'gray'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'open'        => 'warning',
                        'in_progress' => 'info',
                        'resolved'    => 'success',
                        'closed'      => 'gray',
                        default       => 'gray',
                    }),

                TextColumn::make('priority')
                    ->label('Priority')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'urgent' => 'danger',
                        'high'   => 'warning',
                        'medium' => 'info',
                        'low'    => 'gray',
                        default  => 'gray',
                    }),

                TextColumn::make('messages_count')
                    ->label('Messages')
                    ->counts('messages')
                    ->badge()
                    ->color('primary')
                    ->alignCenter(),

                TextColumn::make('updated_at')
                    ->label('Last Activity')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'open'        => 'Open',
                        'in_progress' => 'In Progress',
                        'resolved'    => 'Resolved',
                        'closed'      => 'Closed',
                    ]),
                SelectFilter::make('sector')
                    ->options([
                        'Spiritual & Prayer'    => 'Spiritual & Prayer',
                        'Academic & Campus'     => 'Academic & Campus',
                        'Counseling & Personal' => 'Counseling & Personal',
                        'Charity & Financial'   => 'Charity & Financial',
                        'Technical & Media'     => 'Technical & Media',
                        'General Inquiries'     => 'General Inquiries',
                    ]),
            ])
            ->recordAction('chat')
            ->recordActions([
                ActionGroup::make([
                    Action::make('chat')
                        ->label('Open Chat')
                        ->icon(Heroicon::OutlinedChatBubbleBottomCenterText)
                        ->color('primary')
                        ->url(fn (SupportTicket $r): string => SupportTicketResource::getUrl('chat', ['record' => $r->id])),

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
            'index' => ManageSupportTickets::route('/'),
            'chat'  => SupportChatPage::route('/{record}/chat'),
        ];
    }
}
