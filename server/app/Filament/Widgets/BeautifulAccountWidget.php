<?php

namespace App\Filament\Widgets;

use Filament\Facades\Filament;
use Filament\Models\Contracts\HasAvatar;
use Filament\Widgets\Widget;

class BeautifulAccountWidget extends Widget
{
    protected string $view = 'filament.widgets.beautiful-account-widget';

    protected static ?int $sort = -1000;

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        $user = Filament::auth()->user();
        $avatar = $user instanceof HasAvatar ? $user->getFilamentAvatarUrl() : null;

        $hour = (int) now()->format('H');
        $greeting = match (true) {
            $hour < 12 => 'Good morning',
            $hour < 18 => 'Good afternoon',
            default    => 'Good evening',
        };

        return [
            'user'     => $user,
            'avatar'   => $avatar,
            'greeting' => $greeting,
        ];
    }
}
