<?php

namespace App\Filament\Resources\Posts;

use App\Filament\Resources\Posts\Pages\ManagePosts;
use App\Models\Post;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
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

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;

    protected static ?string $navigationLabel = 'News / Posts';

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 2;

    private static function authUser(): ?User
    {
        $u = auth('internal')->user();
        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool   { return static::authUser()?->hasPermissionTo('view posts', 'web') ?? false; }
    public static function canCreate(): bool    { return static::authUser()?->hasPermissionTo('create posts', 'web') ?? false; }
    public static function canEdit($record): bool   { return static::authUser()?->hasPermissionTo('edit posts', 'web') ?? false; }
    public static function canDelete($record): bool { return static::authUser()?->hasPermissionTo('delete posts', 'web') ?? false; }
    public static function canDeleteAny(): bool { return static::authUser()?->hasPermissionTo('delete posts', 'web') ?? false; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->required()->maxLength(255),
            Textarea::make('content')->rows(5)->nullable(),
            Select::make('department')
                ->options([
                    'ትምህርት'     => 'ትምህርት',
                    'መዝሙር'      => 'መዝሙር',
                    'ልማት'       => 'ልማት',
                    'አባላት ጉዳይ' => 'አባላት ጉዳይ',
                    'ፋይናንስ'     => 'ፋይናንስ',
                ])
                ->required(),
            TextInput::make('author')->nullable(),
            FileUpload::make('image_urls')
                ->label('Images (Multiple)')
                ->image()
                ->multiple()
                ->reorderable()
                ->appendFiles()
                ->panelLayout('grid')
                ->imagePreviewHeight('160')
                ->removeUploadedFileButtonPosition('right top')
                ->uploadButtonPosition('left bottom')
                ->uploadProgressIndicatorPosition('center bottom')
                ->openable()
                ->downloadable()
                ->maxFiles(10)
                ->maxSize(10240) // 10MB per image
                ->disk('public')
                ->directory('posts')
                ->visibility('public')
                ->helperText('Upload one or more images. Click the (X) at top right of any image to remove it.')
                ->nullable(),
            DateTimePicker::make('published_at')->nullable()->default(now()),
            Toggle::make('is_active')->label('Active')->default(true),
            Select::make('audience_type')
                ->label('Audience')
                ->options(['all' => 'All Members', 'sections' => 'Specific Sections'])
                ->default('all')
                ->live()
                ->required(),
            Select::make('sections')
                ->label('Target Sections')
                ->relationship('sections', 'name_en')
                ->getOptionLabelFromRecordUsing(fn ($record) => $record->name_am ?: $record->name_en ?: $record->name_or)
                ->multiple()
                ->preload()
                ->visible(fn ($get) => $get('audience_type') === 'sections'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->searchable()->sortable()->limit(50),
                TextColumn::make('department')->badge()->sortable(),
                TextColumn::make('author')->placeholder('-'),
                TextColumn::make('published_at')->dateTime()->sortable(),
                TextColumn::make('audience_type')->label('Audience')->badge()
                    ->color(fn (string $state) => $state === 'all' ? 'success' : 'warning'),
                IconColumn::make('is_active')->label('Active')->boolean(),
            ])
            ->defaultSort('published_at', 'desc')
            ->recordActions([
                ActionGroup::make([
                    EditAction::make()->slideOver(),
                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePosts::route('/'),
        ];
    }
}
