<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;

class SidebarHeader extends Component
{
    public string $fellowshipName = '';

    public string $motto = '';

    public ?string $logo = null;

    public function mount(): void
    {
        $this->loadSidebarInfo();
    }

    #[On('refresh-sidebar-header')]
    #[On('refresh-topbar')]
    public function refreshSidebarHeader(): void
    {
        $this->loadSidebarInfo();
    }

    protected function loadSidebarInfo(): void
    {
        $user = filament()->auth()->user();

        $this->fellowshipName = (string) ($user?->fellowship_name ?: config('app.name', 'Fellowship'));
        $this->motto = (string) ($user?->motto ?: '');

        if ($user?->logo) {
            $this->logo = asset('storage/' . ltrim((string) $user->logo, '/'));
        } elseif ($user?->avatar_url) {
            $this->logo = asset('storage/' . ltrim((string) $user->avatar_url, '/'));
        } else {
            $this->logo = asset('images/logo.png');
        }
    }

    public function render()
    {
        return view('livewire.sidebar-header');
    }
}
