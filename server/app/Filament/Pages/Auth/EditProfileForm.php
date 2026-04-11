<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Exceptions\Halt;
use Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin;
use Joaopaulolndev\FilamentEditProfile\Concerns\HasUser;
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

        $fields = ['name', 'username', 'fellowship_name', 'motto'];

        if ($plugin->getShouldShowAvatarForm()) {
            $fields[] = config('filament-edit-profile.avatar_column', 'avatar_url');
        }

        $fields[] = 'logo';

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
                            ->placeholder('e.g. ግቢ ጉባኤ'),
                        FileUpload::make('logo')
                            ->label('Fellowship Logo')
                            ->image()
                            ->imageEditor()
                            ->disk(config('filament-edit-profile.disk', 'public'))
                            ->visibility(config('filament-edit-profile.visibility', 'public'))
                            ->directory('logos'),
                        TextInput::make('motto')
                            ->label('Motto')
                            ->placeholder('e.g. ዓለምን ሁሉ ወደ ክርስቶስ'),
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
            $data = $this->form->getState();
            $this->user->update($data);
            $this->form->fill($this->user->only(['name', 'username', 'fellowship_name', 'logo', 'motto']));
            $this->dispatch('refresh-topbar');
        } catch (Halt $exception) {
            return;
        }

        Notification::make()
            ->success()
            ->title(__('filament-edit-profile::default.saved_successfully'))
            ->send();
    }
}
