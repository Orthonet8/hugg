<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Exceptions\Halt;
use Illuminate\Support\Arr;
use Joaopaulolndev\FilamentEditProfile\Concerns\HasUser;
use Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin;
use Joaopaulolndev\FilamentEditProfile\Livewire\BaseProfileForm;

class EditProfileForm extends BaseProfileForm
{
    use HasUser;

    protected string $view = 'filament.shared.profile.edit-profile-username-form';

    public ?array $data = [];

    protected static int $sort = 10;

    public function getName(): string
    {
        return 'edit_profile_fellowship_form';
    }

    public function mount(): void
    {
        $this->user = $this->getUser();
        $plugin = $this->getPlugin();
        $canEditBranding = $this->canEditBranding();

        $fields = ['name', 'username'];

        if ($canEditBranding) {
            $fields[] = 'fellowship_name';
            $fields[] = 'motto';
            $fields[] = 'logo';
        }

        if ($plugin->getShouldShowAvatarForm()) {
            $fields[] = config('filament-edit-profile.avatar_column', 'avatar_url');
        }

        $this->form->fill($this->user->only($fields));
    }

    public function form(Schema $schema): Schema
    {
        $plugin = $this->getPlugin();

        return $schema
            ->components([
                Section::make(__('filament-edit-profile::default.profile_information'))
                    ->aside()
                    ->description('Update your account name, username, and fellowship info.')
                    ->schema([
                        FileUpload::make(config('filament-edit-profile.avatar_column', 'avatar_url'))
                            ->label(__('filament-edit-profile::default.avatar'))
                            ->avatar()
                            ->imageEditor()
                            ->disk(config('filament-edit-profile.disk', 'public'))
                            ->visibility(config('filament-edit-profile.visibility', 'public'))
                            ->directory($plugin->getAvatarDirectory())
                            ->rules($plugin->getAvatarRules())
                            ->hidden(! $plugin->getShouldShowAvatarForm()),
                        TextInput::make('name')
                            ->label(__('filament-edit-profile::default.name'))
                            ->required(),
                        TextInput::make('username')
                            ->label('Username')
                            ->required()
                            ->unique(table: 'users', column: 'username', ignorable: fn () => $this->user),
                        TextInput::make('fellowship_name')
                            ->label('Fellowship Name')
                            ->placeholder('e.g. ግቢ ጉባኤ')
                            ->visible(fn (): bool => $this->canEditBranding()),
                        FileUpload::make('logo')
                            ->label('Fellowship Logo')
                            ->image()
                            ->imageEditor()
                            ->disk(config('filament-edit-profile.disk', 'public'))
                            ->visibility(config('filament-edit-profile.visibility', 'public'))
                            ->directory('logos')
                            ->visible(fn (): bool => $this->canEditBranding()),
                        TextInput::make('motto')
                            ->label('Motto')
                            ->placeholder('e.g. ዓለምን ሁሉ ወደ ክርስቶስ')
                            ->visible(fn (): bool => $this->canEditBranding()),
                    ]),
            ])
            ->statePath('data');
    }

    private function getPlugin(): FilamentEditProfilePlugin
    {
        /** @var FilamentEditProfilePlugin $plugin */
        $plugin = filament('filament-edit-profile');

        return $plugin;
    }

    protected function getFormActions(): array
    {
        return [];
    }

    public function updateProfile(): void
    {
        try {
            $plugin = $this->getPlugin();
            $data = $this->form->getState();

            if (! $this->canEditBranding()) {
                $data = Arr::except($data, ['fellowship_name', 'logo', 'motto']);
            }

            $this->user->update($data);
            $this->user->refresh();

            $fields = ['name', 'username'];

            if ($this->canEditBranding()) {
                $fields[] = 'fellowship_name';
                $fields[] = 'logo';
                $fields[] = 'motto';
            }

            if ($plugin->getShouldShowAvatarForm()) {
                $fields[] = config('filament-edit-profile.avatar_column', 'avatar_url');
            }

            $this->form->fill($this->user->only($fields));
            $this->dispatch('refresh-topbar');
            $this->dispatch('refresh-sidebar-header');
            $this->dispatch('refresh-beautiful-account-widget');
        } catch (Halt $exception) {
            return;
        }

        Notification::make()
            ->success()
            ->title(__('filament-edit-profile::default.saved_successfully'))
            ->send();
    }

    protected function canEditBranding(): bool
    {
        return $this->user?->hasRole('admin', 'web') ?? false;
    }
}
