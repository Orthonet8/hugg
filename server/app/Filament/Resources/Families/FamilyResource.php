<?php

namespace App\Filament\Resources\Families;

use App\Filament\Resources\Families\Pages\ManageFamilies;
use App\Models\Family;
use App\Models\Member;
use App\Models\User;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
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
                TextColumn::make('family_overview')
                    ->label('Family')
                    ->state(fn (Family $record): string => static::renderFamilyOverview($record))
                    ->html()
                    ->wrap()
                    ->searchable(['family_name'])
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderBy('family_name', $direction);
                    }),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->since()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
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
        $father = static::renderMemberCard($record->father, 'Father');
        $mother = static::renderMemberCard($record->mother, 'Mother');
        $children = static::renderChildrenGrid($record);

        return <<<HTML
<div class="space-y-1.5">
    <div class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">{$familyName}</div>
    <div class="grid gap-1 sm:grid-cols-2">
        {$father}
        {$mother}
    </div>
    <div>
        <div class="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">Children</div>
        {$children}
    </div>
</div>
HTML;
    }

    protected static function renderMemberCard(?Member $member, string $role): string
    {
        $name = e($member?->full_name ?? '—');

        if (! $member) {
            return '<div class="rounded-md border border-slate-200 bg-white px-1.5 py-1"><div class="flex items-center gap-1.5"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-500">'.static::placeholderIconSvg().'</span><div class="min-w-0"><div class="text-[9px] font-semibold uppercase tracking-wide text-slate-500">'.e($role).'</div><div class="truncate text-[11px] font-semibold leading-4 text-slate-900">—</div></div></div></div>';
        }

        $photo = $member->profile_photo
            ? asset('storage/'.$member->profile_photo)
            : static::placeholderImageUrl();

        return sprintf(
            '<div class="rounded-md border border-slate-200 bg-white px-1.5 py-1"><div class="flex items-center gap-1.5"><img src="%s" alt="%s" class="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200" /><div class="min-w-0"><div class="text-[9px] font-semibold uppercase tracking-wide text-slate-500">%s</div><div class="truncate text-[11px] font-semibold leading-4 text-slate-900">%s</div></div></div></div>',
            e($photo),
            $name,
            e($role),
            $name,
        );
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
            return '<span class="text-xs text-slate-500">—</span>';
        }

        return '<div class="grid grid-cols-2 gap-1 lg:grid-cols-4">'
            .$children->map(function (Member $child): string {
                $photo = $child->profile_photo
                    ? asset('storage/'.$child->profile_photo)
                    : static::placeholderImageUrl();

                return sprintf(
                    '<div class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1"><img src="%s" alt="%s" class="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200" /><span class="truncate text-[10px] font-medium leading-4 text-slate-900">%s</span></div>',
                    e($photo),
                    e($child->full_name),
                    e($child->full_name),
                );
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
