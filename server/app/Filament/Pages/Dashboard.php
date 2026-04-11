<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as PackageDashboard;

class Dashboard extends PackageDashboard
{
    public static function getNavigationGroup(): ?string
    {
        return 'Main';
    }

    protected static ?string $navigationLabel = 'Dashboard';

    protected static ?string $title = 'Admin Dashboard';

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-home';
    }
}
