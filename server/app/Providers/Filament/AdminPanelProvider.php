<?php

namespace App\Providers\Filament;

use App\Filament\Auth\Login;
use App\Filament\Pages\Auth\EditPasswordForm;
use App\Filament\Pages\Auth\EditProfileForm;
use App\Filament\Pages\Dashboard;
use App\Filament\Widgets\BeautifulAccountWidget;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\MenuItem;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin;
use Joaopaulolndev\FilamentEditProfile\Pages\EditProfilePage;
use Livewire\Livewire;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->authGuard('internal')
            ->login(Login::class)
            ->colors([
                'primary' => Color::Amber,
            ])
            ->brandName('ግቢ ጉባኤ')
            ->sidebarCollapsibleOnDesktop()
            ->sidebarWidth('16rem')
            ->viteTheme('resources/css/filament/theme.css')
            ->renderHook(
                PanelsRenderHook::SIDEBAR_LOGO_BEFORE,
                fn (): string => Livewire::mount('sidebar-header')
            )
            ->renderHook(
                PanelsRenderHook::SIDEBAR_FOOTER,
                fn (): string => Blade::render('@livewire(\\App\\Livewire\\SidebarColorPicker::class)')
            )
            ->navigationGroups([
                'Main',
                'User Management',
                'Section Management',
                'Member Management',
                'Content',
                'Account',
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                BeautifulAccountWidget::class,
                \App\Filament\Widgets\FellowshipStatsOverview::class,
                \App\Filament\Widgets\MemberBatchesChart::class,
                \App\Filament\Widgets\MemberGenderDistributionChart::class,
                \App\Filament\Widgets\LatestMembersWidget::class,
            ])
            ->userMenuItems([
                'profile' => MenuItem::make()
                    ->label(fn () => filament()->auth()->user()?->name)
                    ->url(fn (): string => EditProfilePage::getUrl())
                    ->icon('heroicon-m-user-circle'),
            ])
            ->plugins([
                FilamentEditProfilePlugin::make()
                    ->setNavigationGroup('Account')
                    ->setSort(1000)
                    ->shouldShowEditProfileForm(false)
                    ->shouldShowEditPasswordForm(false)
                    ->shouldShowEmailForm(false)
                    ->customProfileComponents([
                        EditProfileForm::class,
                        EditPasswordForm::class,
                    ])
                    ->shouldShowAvatarForm(
                        value: true,
                        directory: 'avatars/admins',
                        rules: 'image|max:2048'
                    )
                    ->slug('my-profile')
                    ->setTitle('My Profile')
                    ->shouldShowDeleteAccountForm(value: false)
                    ->setIcon('heroicon-o-user-circle'),
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
