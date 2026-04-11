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
        'email_or_username',
        'telegram',
        'section_id',
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
            'password'            => 'hashed',
            'is_active'           => 'boolean',
            'service_departments' => 'array',
            'talents'             => 'array',
            'email_verified_at'   => 'datetime',
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Relationships                                                      */
    /* ------------------------------------------------------------------ */

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /* ------------------------------------------------------------------ */
    /*  Accessors / Mutators                                               */
    /* ------------------------------------------------------------------ */

    public function getDisplayNameAttribute(): string
    {
        return $this->full_name ?: $this->username;
    }

    /* ------------------------------------------------------------------ */
    /*  Scopes                                                             */
    /* ------------------------------------------------------------------ */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (blank($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('full_name', 'ilike', "%{$search}%")
              ->orWhere('username', 'ilike', "%{$search}%")
              ->orWhere('mobile', 'ilike', "%{$search}%")
              ->orWhere('email_or_username', 'ilike', "%{$search}%");
        });
    }
}
