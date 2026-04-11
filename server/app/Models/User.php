<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser, HasAvatar
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'username',
        'fellowship_name',
        'logo',
        'motto',
        'avatar_url',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $panel->getId() === 'admin';
    }

    public function getFilamentAvatarUrl(): ?string
    {
        $col = config('filament-edit-profile.avatar_column', 'avatar_url');
        $disk = config('filament-edit-profile.disk', 'public');
        /** @var FilesystemAdapter $storage */
        $storage = Storage::disk($disk);

        return $this->$col ? $storage->url($this->$col) : null;
    }
}
