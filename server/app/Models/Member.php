<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Member extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'email_or_username',
        'password',
        'full_name',
        'christian_name',
        'gender',
        'age',
        'profile_photo',
        'campus',
        'field_of_study',
        'batch',
        'dorm',
        'region',
        'zone',
        'woreda',
        'native_language',
        'extra_languages',
        'previous_participation',
        'local_church',
        'ordination',
        'ordination_year',
        'diocese',
        'bishop',
        'service_departments',
        'talents',
        'talent_description',
        'mobile',
        'telegram',
        'section_id',
        'is_assigned_to_family',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'              => 'hashed',
            'is_active'             => 'boolean',
            'is_assigned_to_family' => 'boolean',
            'service_departments'   => 'array',
            'talents'               => 'array',
            'email_verified_at'     => 'datetime',
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Relationships                                                      */
    /* ------------------------------------------------------------------ */

    public function section(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Section::class);
    }

    /**
     * Find the family this member belongs to (via JSON scan).
     */
    public function family(): ?\App\Models\Family
    {
        return \App\Models\Family::whereJsonContains('members_data', [['member_id' => $this->id]])->first();
    }

    /* ------------------------------------------------------------------ */
    /*  Accessors / Mutators                                               */
    /* ------------------------------------------------------------------ */

    public function getDisplayNameAttribute(): string
    {
        return $this->full_name ?: $this->email_or_username;
    }

    /* ------------------------------------------------------------------ */
    /*  Scopes                                                             */
    /* ------------------------------------------------------------------ */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeUnassigned($query)
    {
        return $query->where('is_assigned_to_family', false);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (blank($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('full_name', 'ilike', "%{$search}%")
              ->orWhere('email_or_username', 'ilike', "%{$search}%")
              ->orWhere('mobile', 'ilike', "%{$search}%");
        });
    }
}
