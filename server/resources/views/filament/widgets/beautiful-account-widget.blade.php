@php
    $greeting = match (true) {
        now()->format('H') < 12 => __('Good morning'),
        now()->format('H') < 18 => __('Good afternoon'),
        default => __('Good evening'),
    };
@endphp

<div class="col-span-full relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-primary-500/20 dark:bg-gray-900 md:p-8">
    <div class="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-500/5 blur-3xl"></div>

    <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="shrink-0 relative mx-auto lg:mx-0">
            <a href="{{ \Joaopaulolndev\FilamentEditProfile\Pages\EditProfilePage::getUrl() }}">
                @if ($avatar)
                    <img
                        src="{{ $avatar }}"
                        alt="Avatar"
                        class="h-24 w-24 rounded-full object-cover shadow-md ring-4 ring-white dark:ring-gray-800 md:h-28 md:w-28"
                    >
                @else
                    <div class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-md ring-4 ring-white dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-800 md:h-28 md:w-28">
                        <x-heroicon-s-user class="h-10 w-10" />
                    </div>
                @endif
            </a>

            <span class="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900"></span>
        </div>

        <div class="min-w-0 flex-1">
            <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div class="min-w-0 text-center lg:text-left">
                    <div class="mb-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                        <span class="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {{ __('Role:') }} Admin
                        </span>

                        <span class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                            {{ $panelName }}
                        </span>
                    </div>

                    <h2 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                        {{ __('Welcome back,') }}
                        <span class="text-primary-600 dark:text-primary-400">{{ $user?->name ?? __('User') }}</span>
                    </h2>

                    <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        {{ $identity }}
                    </p>

                    @if (filled($subtitle) && $subtitle !== $identity)
                        <p class="mb-2 text-xs text-gray-500 dark:text-gray-400 lg:mb-0">
                            {{ $subtitle }}
                        </p>
                    @endif
                </div>

                <div class="flex flex-col items-center gap-4 lg:items-end">
                    <div class="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 lg:justify-end">
                        <x-heroicon-o-calendar-days class="h-4 w-4" />
                        @if (filled($ethiopianDateNice))
                            <span>{{ __('Today (E.C.):') }} <span class="font-semibold text-gray-700 dark:text-gray-300">{{ $ethiopianDateNice }}</span></span>
                        @else
                            <span>{{ $greeting }}</span>
                        @endif
                    </div>

                    <div class="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                        <a
                            href="{{ \Joaopaulolndev\FilamentEditProfile\Pages\EditProfilePage::getUrl() }}"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                        >
                            <x-heroicon-m-pencil-square class="h-4 w-4" />
                            {{ __('Edit Profile') }}
                        </a>

                        <form action="{{ filament()->getLogoutUrl() }}" method="post" class="m-0">
                            @csrf
                            <button
                                type="submit"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950"
                            >
                                <x-heroicon-m-arrow-right-on-rectangle class="h-4 w-4" />
                                {{ __('Logout') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
