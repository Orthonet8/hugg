<x-filament-panels::page>
    @php
        $activeRole = $this->getActiveRole();
    @endphp
    <div class="flex flex-col gap-4 md:flex-row">
        <aside class="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:w-60 md:shrink-0">
            <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div>
                    <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Roles</p>
                    <h2 class="mt-1 text-sm font-semibold text-slate-950 dark:text-white">Manage access</h2>
                </div>
            </div>

            <div class="max-h-[72vh] space-y-1.5 overflow-visible p-3">
                @forelse ($this->roles as $role)
                    @php
                        $roleId = (int) $role['id'];
                        $isActive = $this->activeRoleId === $roleId;
                        $assignedCount = $this->getAssignedPermissionCount($roleId);
                        $availableCount = $this->getAvailablePermissionCount((string) $role['guard_name']);
                    @endphp

                    <div
                        wire:key="role-card-{{ $roleId }}"
                        @class([
                            'w-full rounded-xl border px-3 py-2.5 transition-all duration-200',
                            'border-primary-300 bg-primary-50 shadow-sm ring-1 ring-primary-100 dark:border-primary-500/60 dark:bg-primary-500/10 dark:ring-primary-500/20' => $isActive,
                            'border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-400/50 dark:hover:bg-primary-500/10' => ! $isActive,
                        ])
                    >
                        <div class="flex items-start justify-between gap-3">
                            <button type="button" wire:click="selectRole({{ $roleId }})" class="min-w-0 flex-1 text-left">
                                <div class="flex items-center gap-1.5">
                                    <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ $role['name'] }}</p>
                                </div>
                                <p class="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $role['guard_name'] }}</p>
                            </button>

                            <div class="flex items-center gap-1.5">
                                <span @class([
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-sm',
                                    'bg-primary-600 text-white' => $isActive,
                                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' => ! $isActive,
                                ])>
                                    {{ $assignedCount }}/{{ $availableCount }}
                                </span>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        No roles available yet.
                    </div>
                @endforelse
            </div>
        </aside>

        <section class="min-w-0 md:flex-1">
            @if ($activeRole)
                @php
                    $availablePermissions = $this->getAvailablePermissionCount((string) $activeRole['guard_name']);
                    $assignedPermissions = $this->getAssignedPermissionCount((int) $activeRole['id']);
                @endphp

                <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Permissions · {{ $activeRole['guard_name'] }}</p>
                                <h2 class="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{{ $activeRole['name'] }}</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Toggle access by group or individual action.
                                </p>
                            </div>

                            <div class="flex items-center gap-3">
                                <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right dark:border-slate-700 dark:bg-slate-800">
                                    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Assigned</p>
                                    <p class="mt-1 text-base font-semibold text-slate-950 dark:text-white">{{ $assignedPermissions }}</p>
                                </div>
                                <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right dark:border-slate-700 dark:bg-slate-800">
                                    <p class="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Available</p>
                                    <p class="mt-1 text-base font-semibold text-slate-950 dark:text-white">{{ $availablePermissions }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="max-h-[72vh] overflow-y-auto px-5 py-5" wire:key="permissions-panel-{{ $activeRole['id'] }}">
                        @include('filament.pages.access.components.grouped-permissions', [
                            'groups' => $this->getActiveRolePermissionGroups(),
                            'roleId' => (int) $activeRole['id'],
                            'initialPermissions' => $this->initialRolePermissions[(string) $activeRole['id']] ?? [],
                            'isReadOnly' => strtolower((string) $activeRole['name']) === 'admin',
                        ])
                    </div>
                </div>
            @else
                <div class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-gray-900">
                    <h2 class="text-lg font-semibold text-gray-950 dark:text-white">No role selected</h2>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create a role or choose one from the sidebar to start assigning permissions.</p>
                </div>
            @endif
        </section>
    </div>
</x-filament-panels::page>
