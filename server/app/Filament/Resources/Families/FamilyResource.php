<?php

namespace App\Filament\Resources\Families;

use App\Models\Member;
use App\Models\Family;
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

    protected static function canManageFamilies(): bool
    {
        $user = auth('internal')->user();
        return $user instanceof User && $user->hasPermissionTo('manage families', 'web');
    }

    public static function canViewAny(): bool { return static::canManageFamilies(); }
    public static function canCreate(): bool { return static::canManageFamilies(); }
    public static function canEdit($record): bool { return static::canManageFamilies(); }
    public static function canDelete($record): bool { return static::canManageFamilies(); }
    public static function canDeleteAny(): bool { return static::canManageFamilies(); }

    /* ------------------------------------------------------------------ */
    /*  Table                                                              */
    /* ------------------------------------------------------------------ */

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('family_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('members_count')
                    ->label('Members')
                    ->state(fn (Family $r): int => count($r->members_data ?? []))
                    ->badge()
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderByRaw('jsonb_array_length(members_data) ' . $direction);
                    }),
                TextColumn::make('father_display')
                    ->label('Father')
                    ->state(fn (Family $record): string => static::renderMemberCard($record->father))
                    ->html()
                    ->wrap(),
                TextColumn::make('mother_display')
                    ->label('Mother')
                    ->state(fn (Family $record): string => static::renderMemberCard($record->mother))
                    ->html()
                    ->wrap(),
                TextColumn::make('children_display')
                    ->label('Children')
                    ->state(fn (Family $record): string => static::renderChildrenGrid($record))
                    ->html()
                    ->wrap(),
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

    protected static function renderMemberCard(?Member $member): string
    {
        $name = e($member?->full_name ?? '—');

        if (! $member) {
            return '<div class="flex flex-col items-start gap-2"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">'.static::placeholderIconSvg().'</span><span class="text-sm font-semibold text-slate-900">—</span></div>';
        }

        $photo = $member->profile_photo
            ? asset('storage/' . $member->profile_photo)
            : static::placeholderImageUrl();

        return sprintf(
            '<div class="flex flex-col items-start gap-2"><img src="%s" alt="%s" class="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200" /><span class="text-sm font-semibold text-slate-900">%s</span></div>',
            e($photo),
            $name,
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
            return '<span class="text-sm text-slate-500">—</span>';
        }

        return '<div class="grid grid-cols-2 gap-3">'
            . $children->map(function (Member $child): string {
                $photo = $child->profile_photo
                    ? asset('storage/' . $child->profile_photo)
                    : static::placeholderImageUrl();

                return sprintf(
                    '<div class="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-3"><img src="%s" alt="%s" class="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200" /><span class="text-sm font-medium text-slate-900">%s</span></div>',
                    e($photo),
                    e($child->full_name),
                    e($child->full_name),
                );
            })->implode('')
            . '</div>';
    }

    protected static function placeholderIconSvg(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/></svg>';
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

        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\Families\Pages\ManageFamilies::route('/'),
        ];
    }
}
