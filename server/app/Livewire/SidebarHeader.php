<?php

namespace App\Livewire;

use Livewire\Component;

class SidebarHeader extends Component
{
    public string $fellowshipName = '';

    public string $motto = '';

    public ?string $logo = null;

    public function mount(): void
    {
        $user = filament()->auth()->user();

        $this->fellowshipName = (string) ($user?->fellowship_name ?: config('app.name', 'Fellowship'));
        $this->motto = (string) ($user?->motto ?: '');
        $this->logo = $user?->logo ? asset('storage/' . ltrim((string) $user->logo, '/')) : asset('images/logo.png');
    }

    public function render()
    {
        return view('livewire.sidebar-header');
    }
}
