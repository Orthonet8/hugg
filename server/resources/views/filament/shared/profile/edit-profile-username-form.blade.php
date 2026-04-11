<form wire:submit="updateProfile" class="fi-sc-form">
    {{ $this->form }}

    <div class="fi-form-actions flex justify-end mt-4">
        <x-filament::button type="submit">
            {{ __('filament-edit-profile::default.save') }}
        </x-filament::button>
    </div>

    <x-filament-actions::modals />
</form>
