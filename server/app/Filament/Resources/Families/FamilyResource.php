<?php

namespace App\Filament\Resources\Families;

use App\Filament\Resources\Families\Pages\ManageFamilies;
use App\Models\Family;
use App\Models\Member;
use App\Models\User;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class FamilyResource extends Resource
{
    protected static ?string $model = Family::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHomeModern;

    protected static ?string $navigationLabel = 'Family Management';

    protected static string|UnitEnum|null $navigationGroup = 'Member Management';

    protected static ?int $navigationSort = 2;

    private static function authUser(): ?User
    {
        $u = auth('internal')->user();
        return $u instanceof User ? $u : null;
    }

    public static function canViewAny(): bool   { return static::authUser()?->hasPermissionTo('view families', 'web') ?? false; }
    public static function canCreate(): bool    { return static::authUser()?->hasPermissionTo('create families', 'web') ?? false; }
    public static function canEdit($record): bool   { return static::authUser()?->hasPermissionTo('edit families', 'web') ?? false; }
    public static function canDelete($record): bool { return static::authUser()?->hasPermissionTo('delete families', 'web') ?? false; }
    public static function canDeleteAny(): bool { return static::authUser()?->hasPermissionTo('delete families', 'web') ?? false; }

    protected static function leaderSectionIds(): array
    {
        $user = auth('internal')->user();

        if (! $user instanceof User) {
            return [];
        }

        return $user->ledSections()->pluck('id')->map(fn ($id): int => (int) $id)->all();
    }

    /* ------------------------------------------------------------------ */
    /*  Table */
    /* ------------------------------------------------------------------ */

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('family_name')
                    ->label('Family Name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->icon(Heroicon::OutlinedHomeModern)
                    ->iconColor('primary'),

                TextColumn::make('father.full_name')
                    ->label('Father (አባት)')
                    ->default('—')
                    ->badge()
                    ->color('info')
                    ->description(fn (Family $record): ?string => $record->father?->mobile),

                TextColumn::make('mother.full_name')
                    ->label('Mother (እናት)')
                    ->default('—')
                    ->badge()
                    ->color('danger')
                    ->description(fn (Family $record): ?string => $record->mother?->mobile),

                TextColumn::make('members_count')
                    ->label('Total Members')
                    ->state(fn (Family $record): int => count($record->members_data ?? []))
                    ->badge()
                    ->color('warning')
                    ->alignCenter(),

                TextColumn::make('created_at')
                    ->label('Formed Date')
                    ->dateTime('M d, Y')
                    ->since()
                    ->color('gray')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordAction('view')
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make('view')
                        ->label('View Details & Contacts')
                        ->icon(Heroicon::OutlinedEye)
                        ->modalHeading(fn (Family $record): string => "Family: {$record->family_name}")
                        ->modalDescription('View family heads, children, mobile numbers, and telegram contacts.')
                        ->modalWidth('3xl')
                        ->modalContent(fn (Family $record) => view('filament.resources.families.family-modal', ['record' => $record])),

                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    protected static function renderFamilyOverview(Family $record): string
    {
        $familyName = e($record->family_name);
        $membersData = collect($record->members_data ?? []);
        $totalMembers = $membersData->count();
        $father = static::renderMemberCard($record->father, 'Father', 'border-sky-200 bg-sky-50/50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300');
        $mother = static::renderMemberCard($record->mother, 'Mother', 'border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300');
        $children = static::renderChildrenGrid($record);

        return <<<HTML
<div class="my-2 overflow-hidden rounded-xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-primary-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80">
    <div class="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
        <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-amber-600 text-white shadow-sm ring-2 ring-primary-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            </span>
            <div>
                <h3 class="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">{$familyName}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Family Fellowship Unit</p>
            </div>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-950/40 dark:text-primary-300">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
            {$totalMembers} Members
        </span>
    </div>

    <div class="grid gap-2.5 sm:grid-cols-2">
        {$father}
        {$mother}
    </div>

    <div class="mt-3.5 rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800/60 dark:bg-gray-900/40">
        <div class="mb-2 flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Children / Members</span>
        </div>
        {$children}
    </div>
</div>
HTML;
    }

    protected static function renderMemberCard(?Member $member, string $role, string $badgeClass): string
    {
        $name = e($member?->full_name ?? 'Not Assigned');

        if (! $member) {
            return <<<HTML
<div class="flex items-center gap-3 rounded-xl border border-dashed border-gray-300/80 bg-gray-50/50 p-2.5 dark:border-gray-700/60 dark:bg-gray-800/30">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200/70 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
    </span>
    <div class="min-w-0 flex-1">
        <div class="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider {$badgeClass}">{$role}</div>
        <div class="mt-0.5 truncate text-xs italic text-gray-400">No member assigned</div>
    </div>
</div>
HTML;
        }

        $photo = $member->profile_photo
            ? asset('storage/'.$member->profile_photo)
            : static::placeholderImageUrl();
        $batch = $member->batch ? ' · Batch ' . e($member->batch) : '';

        return <<<HTML
<div class="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white p-2.5 shadow-xs transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/90">
    <img src="{$photo}" alt="{$name}" class="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary-500/20 shadow-xs" />
    <div class="min-w-0 flex-1">
        <div class="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider {$badgeClass}">{$role}</div>
        <div class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{$name}</div>
        <div class="text-[11px] text-gray-500 dark:text-gray-400">{$member->email_or_username}{$batch}</div>
    </div>
</div>
HTML;
    }

    protected static function renderChildrenGrid(Family $record): string
    {
        $children = collect($record->members_data ?? [])
            ->filter(fn (array $entry): bool => ($entry['role'] ?? null) === 'child')
            ->map(function (array $entry): ?Member {
                return Member::find($entry['member_id'] ?? null);
            })
            ->filter();

        if ($children->isEmpty()) {
            return '<span class="text-xs italic text-gray-400">No children added yet</span>';
        }

        return '<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">'
            .$children->map(function (Member $child): string {
                $photo = $child->profile_photo
                    ? asset('storage/'.$child->profile_photo)
                    : static::placeholderImageUrl();
                $name = e($child->full_name);
                $batch = $child->batch ? e($child->batch) : '—';

                return <<<HTML
<div class="flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white px-2.5 py-1.5 shadow-2xs transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900">
    <img src="{$photo}" alt="{$name}" class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
    <div class="min-w-0 flex-1">
        <div class="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">{$name}</div>
        <div class="text-[10px] text-gray-400">Batch {$batch}</div>
    </div>
</div>
HTML;
            })->implode('')
            .'</div>';
    }

    protected static function placeholderIconSvg(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/></svg>';
    }

    protected static function placeholderImageUrl(): string
    {
        $svg = <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="32" fill="#E5E7EB"/>
  <path d="M32 34.5c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13Z" fill="#9CA3AF"/>
  <path d="M13 54c2.1-7.7 9.2-13 19-13s16.9 5.3 19 13" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round"/>
</svg>
SVG;

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageFamilies::route('/'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $leaderSectionIds = static::leaderSectionIds();

        if (empty($leaderSectionIds)) {
            return $query;
        }

        $memberIds = Member::query()
            ->whereIn('section_id', $leaderSectionIds)
            ->pluck('id')
            ->map(fn ($id): int => (int) $id)
            ->all();

        if (empty($memberIds)) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where(function (Builder $familyQuery) use ($memberIds): void {
            foreach ($memberIds as $memberId) {
                $familyQuery->orWhereJsonContains('members_data', [['member_id' => $memberId]]);
            }
        });
    }
}
