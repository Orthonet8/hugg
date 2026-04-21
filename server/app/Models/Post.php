<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'department',
        'author',
        'image_urls',
        'is_active',
        'published_at',
        'audience_type',
    ];

    protected $casts = [
        'image_urls'   => 'array',
        'is_active'    => 'boolean',
        'published_at' => 'datetime',
    ];

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'post_section');
    }
}
