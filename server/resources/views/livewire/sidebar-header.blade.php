@php
    $collapseLabel = __('filament-panels::layout.actions.sidebar.collapse.label');
    $expandLabel = __('filament-panels::layout.actions.sidebar.expand.label');
    $isRtl = __('filament-panels::layout.direction') === 'rtl';
    $iconCollapse = $isRtl ? 'heroicon-o-chevron-right' : 'heroicon-o-chevron-left';
    $iconExpand = $isRtl ? 'heroicon-o-chevron-left' : 'heroicon-o-chevron-right';
@endphp

<div
    wire:key="sidebar-header-brand-{{ filament()->getId() }}"
    class="app-sidebar-head-interact relative isolate w-full min-w-0 py-0.5"
    title="{{ e($title) }}{{ $motto ? ' - ' . e($motto) : '' }}"
>
    <div class="app-sidebar-head-brand">
        <div class="app-sidebar-brand-wrap flex w-full min-w-0 flex-col items-center gap-1.5 text-center">
            <div class="app-sidebar-brand-logo flex w-full max-w-full shrink-0 justify-center px-1">
                <img
                    src="{{ $logo }}"
                    alt="{{ $title }}"
                    class="app-sidebar-brand-logo-img max-h-28 w-auto max-w-full rounded-xl object-contain shadow-md ring-1 ring-white/10"
                >
            </div>

            <div class="app-sidebar-brand-text w-full min-w-0 px-0.5">
                <h3 class="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">{{ $title }}</h3>
                @if ($motto)
                    <p class="mt-0.5 line-clamp-2 text-xs italic leading-snug text-white/65">{{ $motto }}</p>
                @endif
            </div>
        </div>
    </div>

    <div class="app-sidebar-head-overlay absolute inset-0 z-10 flex items-center justify-center">
        <div wire:ignore class="relative" x-data="{}">
            <button
                type="button"
                class="fi-sidebar-header-hover-btn"
                x-on:click="$store.sidebar.isOpen ? $store.sidebar.close() : $store.sidebar.open()"
                x-bind:aria-label="$store.sidebar.isOpen ? @js($collapseLabel) : @js($expandLabel)"
            >
                <span
                    x-show="$store.sidebar.isOpen"
                    x-cloak
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <x-filament::icon :icon="$iconCollapse" class="size-5" />
                </span>
                <span
                    x-show="! $store.sidebar.isOpen"
                    x-cloak
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <x-filament::icon :icon="$iconExpand" class="size-5" />
                </span>
            </button>
        </div>
    </div>
</div>
