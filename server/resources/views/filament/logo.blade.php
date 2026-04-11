@php
    $user = filament()->auth()->user();
    $logoUrl = $user?->logo
        ? \Illuminate\Support\Facades\Storage::disk('public')->url($user->logo)
        : asset('images/logo.png');
@endphp
<img src="{{ $logoUrl }}" alt="Logo" class="h-8 w-auto">
