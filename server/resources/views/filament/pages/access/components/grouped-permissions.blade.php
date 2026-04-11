@php
/** @var array<string, array<string, string>> $groups */
$groups = $groups ?? [];
$roleId = (int) ($roleId ?? 0);
$initialPermissions = array_values($initialPermissions ?? []);
$isReadOnly = (bool) ($isReadOnly ?? false);
@endphp

<div
    class="space-y-4"
    x-data="{
            selectedState: @entangle('data.role_permissions.' . $roleId).live,
            initialState: @js($initialPermissions),
            normalize(values) {
                return Array.from(new Set((Array.isArray(values) ? values : [])
                    .filter(Boolean)
                    .map((value) => String(value))))
                    .sort();
            },
            get selected() {
                return this.normalize(this.selectedState);
            },
            set selected(value) {
                this.selectedState = this.normalize(value);
            },
            hasPermission(value) {
                return this.selected.includes(String(value));
            },
            togglePermission(value) {
                const permission = String(value);

                if (this.hasPermission(permission)) {
                    this.selected = this.selected.filter((item) => item !== permission);

                    return;
                }

                this.selected = [...this.selected, permission];
            },
            toggleGroup(options) {
                const groupOptions = this.normalize(options);
                const current = this.selected;
                const allSelected = groupOptions.length > 0 && groupOptions.every((option) => current.includes(option));

                if (allSelected) {
                    this.selected = current.filter((value) => !groupOptions.includes(value));
                    return;
                }

                this.selected = [...current, ...groupOptions];
            },
            groupSelected(options) {
                const groupOptions = this.normalize(options);

                return groupOptions.length > 0 && groupOptions.every((option) => this.selected.includes(option));
            },
            get hasChanges() {
                return JSON.stringify(this.selected) !== JSON.stringify(this.normalize(this.initialState));
            },
            selectedCount(options) {
                return this.normalize(options).filter((option) => this.selected.includes(option)).length;
            },
        }"
    x-on:role-permissions-saved.window="if ($event.detail.roleId === {{ $roleId }}) { initialState = normalize($event.detail.permissions); selectedState = normalize($event.detail.permissions); }"
    x-on:role-permissions-discarded.window="if ($event.detail.roleId === {{ $roleId }}) { initialState = normalize($event.detail.permissions); selectedState = normalize($event.detail.permissions); }"
>
    <div class="sticky top-0 z-10 -mx-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:mx-0">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">Permission controls</p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Use chips to bulk select or fine tune below, then save.</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                @if ($isReadOnly)
                    <div class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Admin role is read only and synced to all permissions.
                    </div>
                @else
                    <div
                        x-show="hasChanges"
                        x-cloak
                        class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-sm dark:bg-amber-500/15 dark:text-amber-200"
                    >
                        Unsaved changes
                    </div>

                    <button
                        type="button"
                        x-on:click="$wire.discardRoleChanges({{ $roleId }})"
                        x-bind:disabled="!hasChanges"
                        x-bind:class="hasChanges
                            ? 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800'
                            : 'cursor-not-allowed bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700'"
                        class="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition"
                    >
                        Discard
                    </button>

                    <button
                        type="button"
                        x-on:click="$wire.saveRolePermissions({{ $roleId }})"
                        x-bind:disabled="!hasChanges"
                        x-bind:class="hasChanges
                            ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-500 focus-visible:outline-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400'
                            : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'"
                        class="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Save changes
                    </button>
                @endif
            </div>
        </div>
    </div>

    <div class="space-y-2">
        @foreach ($groups as $groupLabel => $options)
            <section class="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                <div class="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                    <div class="min-w-0">
                        <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ $groupLabel }}</h3>
                        <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span x-text="selectedCount(@js(array_keys($options)))"></span>/{{ count($options) }} selected
                        </p>
                    </div>

                    @if (! $isReadOnly)
                        <button
                            type="button"
                            x-on:click="toggleGroup(@js(array_keys($options)))"
                            class="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-400"
                        >
                            <span x-text="groupSelected(@js(array_keys($options))) ? 'Clear group' : 'Select group'"></span>
                        </button>
                    @endif
                </div>

                <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                    @foreach ($options as $value => $label)
                        <div wire:key="role-{{ $roleId }}-permission-{{ str_replace('.', '-', $value) }}">
                            <label
                                @if (! $isReadOnly)
                                    x-on:click.prevent="togglePermission(@js($value))"
                                @endif
                                x-bind:class="hasPermission(@js($value))
                                    ? 'border-primary-400/70 bg-primary-50 text-primary-800 shadow-sm dark:border-primary-400/50 dark:bg-primary-900/30 dark:text-primary-100'
                                    : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500/60 dark:hover:bg-primary-900/20'"
                                class="group flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-150 {{ $isReadOnly ? 'cursor-default' : 'cursor-pointer' }}"
                            >
                                <span
                                    x-bind:class="hasPermission(@js($value))
                                        ? 'border-primary-500 bg-primary-500'
                                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950'"
                                    class="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-150"
                                >
                                    <input
                                        type="checkbox"
                                        value="{{ $value }}"
                                        x-bind:checked="hasPermission(@js($value))"
                                        class="absolute h-full w-full cursor-pointer opacity-0"
                                    />

                                    <svg
                                        x-cloak
                                        x-show="hasPermission(@js($value))"
                                        class="pointer-events-none h-2.5 w-2.5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="4"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>

                                <span
                                    x-bind:class="hasPermission(@js($value))
                                        ? 'text-primary-800 dark:text-primary-100'
                                        : 'text-slate-700 dark:text-slate-200'"
                                    class="pointer-events-none text-xs font-semibold leading-5 transition-colors"
                                >
                                    {{ $label }}
                                </span>
                            </label>
                        </div>
                    @endforeach
                </div>
            </section>
        @endforeach
    </div>
</div>
