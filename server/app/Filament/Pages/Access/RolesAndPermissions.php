<?php

namespace App\Filament\Pages\Access;

use App\Models\User;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissions extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.access.roles-and-permissions';

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedKey;

    protected static ?string $title = 'Roles & Permissions';

    protected static ?string $slug = 'roles-and-permissions';

    public array $roles = [];

    public ?array $data = [];

    public array $initialRolePermissions = [];

    public ?int $activeRoleId = null;

    public function getHeaderSubheading(): ?string
    {
        return 'Manage existing roles and permissions from this page.';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Account';
    }

    public static function getNavigationSort(): ?int
    {
        return 2;
    }

    public static function canAccess(): bool
    {
        return static::canManageRoles();
    }

    protected static function canManageRoles(): bool
    {
        $user = auth('internal')->user();

        return $user instanceof User && $user->hasPermissionTo('manage roles', 'web');
    }

    public function mount(): void
    {
        $this->rebuildFormState();
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function selectRole(int $roleId): void
    {
        if (! collect($this->roles)->contains(fn (array $role): bool => (int) $role['id'] === $roleId)) {
            return;
        }

        $this->activeRoleId = $roleId;
    }

    public function saveRolePermissions(int $roleId): void
    {
        $role = Role::query()->find($roleId);

        if (! $role) {
            Notification::make()
                ->title('Role not found')
                ->danger()
                ->send();

            return;
        }

        if ($this->isAdminRole($role)) {
            $syncedPermissions = $this->syncAdminRolePermissions($role);
            $roleKey = (string) $roleId;

            $this->data['role_permissions'][$roleKey] = $syncedPermissions;
            $this->initialRolePermissions[$roleKey] = $syncedPermissions;

            $this->dispatch('role-permissions-saved', roleId: $roleId, permissions: $syncedPermissions);

            Notification::make()
                ->title('Admin role is read only')
                ->body('Admin remains synced with all available permissions.')
                ->info()
                ->send();

            return;
        }

        $roleKey = (string) $roleId;
        $rolePermissions = (array) ($this->data['role_permissions'] ?? []);
        $requestedPermissions = $this->normalizePermissionList($rolePermissions[$roleKey] ?? []);

        $this->syncRolePermissions($roleId, $requestedPermissions);

        $this->data['role_permissions'][$roleKey] = $requestedPermissions;
        $this->initialRolePermissions[$roleKey] = $requestedPermissions;

        $roleName = collect($this->roles)
            ->firstWhere('id', $roleId)['name'] ?? 'role';

        $this->dispatch('role-permissions-saved', roleId: $roleId, permissions: $requestedPermissions);

        Notification::make()
            ->title('Saved')
            ->body("Permissions updated for {$roleName}.")
            ->success()
            ->send();
    }

    public function discardRoleChanges(int $roleId): void
    {
        $roleKey = (string) $roleId;
        $rolePermissions = (array) ($this->data['role_permissions'] ?? []);
        $savedPermissions = $this->normalizePermissionList($this->initialRolePermissions[$roleKey] ?? []);

        $rolePermissions[$roleKey] = $savedPermissions;

        $this->form->fill([
            'role_permissions' => $rolePermissions,
        ]);

        $this->dispatch('role-permissions-discarded', roleId: $roleId, permissions: $savedPermissions);

        Notification::make()
            ->title('Discarded')
            ->body('Unsaved role permission changes have been reverted.')
            ->success()
            ->send();
    }

    public function getActiveRole(): ?array
    {
        return collect($this->roles)
            ->first(fn (array $role): bool => (int) $role['id'] === (int) $this->activeRoleId);
    }

    public function getAssignedPermissionCount(int $roleId): int
    {
        return count((array) ($this->data['role_permissions'][(string) $roleId] ?? []));
    }

    public function getAvailablePermissionCount(string $guardName): int
    {
        return Permission::query()
            ->where('guard_name', $guardName)
            ->count();
    }

    /**
     * @return array<string, array<string, string>>
     */
    public function getActiveRolePermissionGroups(): array
    {
        $activeRole = $this->getActiveRole();

        if (! $activeRole) {
            return [];
        }

        return $this->getGroupedPermissionOptions((string) $activeRole['guard_name']);
    }

    /**
     * @return array<string, array<string, string>>
     */
    public function getGroupedPermissionOptions(string $guardName): array
    {
        $names = Permission::query()
            ->where('guard_name', $guardName)
            ->pluck('name')
            ->all();

        $actionOrder = [
            'view' => 10,
            'create' => 20,
            'update' => 30,
            'edit' => 30,
            'delete' => 40,
        ];

        $rows = collect($names)
            ->map(function (string $name) use ($actionOrder): array {
                $module = $name;
                $action = '';

                if (str_contains($name, '.')) {
                    [$module, $action] = explode('.', $name, 2);
                }

                $moduleLabel = Str::headline(str_replace(['-', '_'], ' ', $module));
                $actionLabel = $action !== ''
                    ? Str::headline(str_replace(['-', '_'], ' ', $action))
                    : '';

                $actionKey = $action !== '' ? strtolower($action) : '';
                $rank = $actionKey !== '' ? ($actionOrder[$actionKey] ?? 999) : 999;

                return [
                    'name' => $name,
                    'module' => $moduleLabel,
                    'action' => $actionLabel,
                    'rank' => $rank,
                ];
            })
            ->sortBy([
                ['module', 'asc'],
                ['rank', 'asc'],
                ['action', 'asc'],
            ])
            ->values();

        return $rows
            ->groupBy('module')
            ->map(function ($items): array {
                return $items
                    ->mapWithKeys(fn (array $row): array => [
                        $row['name'] => $row['action'] !== '' ? $row['action'] : $row['name'],
                    ])
                    ->all();
            })
            ->all();
    }

    private function refreshRoles(): void
    {
        $this->roles = Role::query()
            ->orderBy('guard_name')
            ->orderBy('name')
            ->get(['id', 'name', 'guard_name'])
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
            ])
            ->all();
    }

    private function rebuildFormState(): void
    {
        $this->refreshRoles();

        $this->ensureActiveRoleIsSelected();

        $rolePermissions = collect($this->roles)
            ->mapWithKeys(fn (array $role) => [
                (string) $role['id'] => Role::query()
                    ->with('permissions')
                    ->find($role['id'])
                    ?->permissions
                    ?->pluck('name')
                    ?->values()
                    ?->all() ?? [],
            ])
            ->all();

        $this->initialRolePermissions = $this->normalizeRolePermissionsMap($rolePermissions);
        $this->form->fill([
            'role_permissions' => $this->initialRolePermissions,
        ]);
    }

    private function ensureActiveRoleIsSelected(): void
    {
        if (empty($this->roles)) {
            $this->activeRoleId = null;

            return;
        }

        $activeRoleExists = collect($this->roles)
            ->contains(fn (array $role): bool => (int) $role['id'] === (int) $this->activeRoleId);

        if ($activeRoleExists) {
            return;
        }

        $this->activeRoleId = (int) $this->roles[0]['id'];
    }

    /**
     * @param  array<int|string, mixed>  $permissionNames
     * @return array<int, string>
     */
    private function normalizePermissionList(array $permissionNames): array
    {
        return collect($permissionNames)
            ->map(fn ($name) => (string) $name)
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    /**
     * @param  array<int|string, mixed>  $rolesAndPermissions
     * @return array<string, array<int, string>>
     */
    private function normalizeRolePermissionsMap(array $rolesAndPermissions): array
    {
        return collect($rolesAndPermissions)
            ->mapWithKeys(function ($permissions, $roleId): array {
                $items = is_array($permissions) ? $permissions : [];

                return [(string) $roleId => $this->normalizePermissionList($items)];
            })
            ->sortKeys()
            ->all();
    }

    /**
     * @param  array<int, string>  $permissionNames
     */
    private function syncRolePermissions(int $roleId, array $permissionNames): void
    {
        $role = Role::query()->find($roleId);

        if (! $role) {
            return;
        }

        $normalizedRequested = collect($this->normalizePermissionList($permissionNames));

        $currentNames = $role->permissions()
            ->where('guard_name', $role->guard_name)
            ->pluck('name')
            ->sort()
            ->values();

        if ($currentNames->values()->all() === $normalizedRequested->values()->all()) {
            return;
        }

        $permissions = Permission::query()
            ->where('guard_name', $role->guard_name)
            ->whereIn('name', $normalizedRequested->all())
            ->get();

        $role->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * @return array<int, string>
     */
    private function syncAdminRolePermissions(Role $role): array
    {
        $allPermissions = Permission::query()
            ->where('guard_name', $role->guard_name)
            ->get();

        $role->syncPermissions($allPermissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $allPermissions
            ->pluck('name')
            ->sort()
            ->values()
            ->all();
    }

    private function isAdminRole(Role $role): bool
    {
        return mb_strtolower($role->name) === 'admin';
    }
}
