<?php

namespace App\Providers;

use App\Filament\Pages\Auth\EditProfileForm;
use App\Livewire\SidebarHeader;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Livewire::component('edit_profile_fellowship_form', EditProfileForm::class);
        Livewire::component('sidebar-header', SidebarHeader::class);
    }
}
