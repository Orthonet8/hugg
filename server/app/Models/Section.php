<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [
        'name_am',
        'name_en',
        'name_or',
        'description_am',
        'description_en',
        'description_or',
        'leader_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function getDisplayNameAttribute(): string
    {
        return (string) ($this->name_am ?: $this->name_en ?: $this->name_or ?: 'Section');
    }
}
