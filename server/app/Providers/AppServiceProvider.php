<?php

namespace App\Providers;

use App\Filament\Pages\Auth\EditProfileForm;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use App\Livewire\SidebarHeader;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Livewire::component('edit_profile_fellowship_form', EditProfileForm::class);
        Livewire::component('sidebar-header', SidebarHeader::class);
    }
}
