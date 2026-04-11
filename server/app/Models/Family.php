<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    protected $fillable = [
        'family_name',
        'members_data',
    ];

    protected $casts = [
        'members_data' => 'array',
    ];

    protected static function booted(): void
    {
        static::deleting(function (Family $family): void {
            $memberIds = collect($family->members_data ?? [])
                ->pluck('member_id')
                ->filter()
                ->map(fn ($id): int => (int) $id)
                ->unique()
                ->values()
                ->all();

            if (empty($memberIds)) {
                return;
            }

            Member::query()
                ->whereIn('id', $memberIds)
                ->update(['is_assigned_to_family' => false]);
        });
    }

    /**
     * Get all members linked to this family via JSON.
     * members_data format: [{ "member_id": 1, "role": "father" }, ...]
     */
    public function members()
    {
        $ids = collect($this->members_data ?? [])
            ->pluck('member_id')
            ->filter()
            ->all();

        return Member::whereIn('id', $ids)->get();
    }

    public function getFatherAttribute(): ?Member
    {
        return $this->memberByRole('father');
    }

    public function getMotherAttribute(): ?Member
    {
        return $this->memberByRole('mother');
    }

    public function getChildrenAttribute(): Collection
    {
        $childrenData = collect($this->members_data ?? [])
            ->where('role', 'child')
            ->pluck('member_id')
            ->all();

        if (empty($childrenData)) {
            return collect();
        }

        return Member::whereIn('id', $childrenData)->get();
    }

    /**
     * Find a member by role in the JSON data.
     */
    protected function memberByRole(string $role): ?Member
    {
        $memberId = collect($this->members_data ?? [])
            ->where('role', $role)
            ->first()['member_id'] ?? null;

        if (! $memberId) {
            return null;
        }

        return Member::find($memberId);
    }

    /**
     * Get formatted members list with role info.
     */
    public function getMembersWithRolesAttribute()
    {
        return collect($this->members_data ?? [])
            ->map(function ($entry) {
                $member = Member::find($entry['member_id'] ?? null);

                return [
                    'member' => $member,
                    'role' => $entry['role'] ?? 'unknown',
                    'member_id' => $entry['member_id'] ?? null,
                ];
            })
            ->filter(fn ($item) => $item['member'] !== null);
    }
}
