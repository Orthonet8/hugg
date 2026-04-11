<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Andegna\DateTimeFactory;
use Filament\Facades\Filament;
use Filament\Models\Contracts\HasAvatar;
use Filament\Widgets\Widget;
use Illuminate\Support\Str;

class BeautifulAccountWidget extends Widget
{
    protected $listeners = [
        'refresh-beautiful-account-widget' => '$refresh',
        'refresh-topbar' => '$refresh',
    ];

    protected string $view = 'filament.widgets.beautiful-account-widget';

    protected static ?int $sort = -1000;

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        $panel = Filament::getCurrentOrDefaultPanel();
        $user = Filament::auth()->user();
        $avatar = $user instanceof HasAvatar ? $user->getFilamentAvatarUrl() : null;
        $panelName = $panel?->getId() ? ucfirst((string) $panel->getId()) : __('Dashboard');

        $identity = $user?->username ?? $user?->email ?? __('Account');
        $subtitle = $user?->fellowship_name ?: $identity;
        $roleLabel = __('User');

        if ($user instanceof User) {
            $primaryRole = $user->getRoleNames()->first();

            if (filled($primaryRole)) {
                $roleLabel = Str::headline((string) $primaryRole);
            }
        }

        try {
            $ethiopianNow = DateTimeFactory::now();
            $ethiopianDateNice = $ethiopianNow->format('F d, Y');
        } catch (\Throwable $exception) {
            $ethiopianDateNice = '';
        }

        $hour = (int) now()->format('H');
        $greeting = match (true) {
            $hour < 12 => 'Good morning',
            $hour < 18 => 'Good afternoon',
            default    => 'Good evening',
        };

        return [
            'user' => $user,
            'avatar' => $avatar,
            'greeting' => $greeting,
            'panelName' => $panelName,
            'identity' => $identity,
            'subtitle' => $subtitle,
            'roleLabel' => $roleLabel,
            'ethiopianDateNice' => $ethiopianDateNice,
        ];
    }
}
