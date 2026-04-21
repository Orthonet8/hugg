<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            // Users
            'view users', 'create users', 'edit users', 'delete users',
            // Roles
            'manage roles',
            // Members
            'view members', 'create members', 'edit members', 'delete members',
            // Families
            'view families', 'create families', 'edit families', 'delete families',
            // Sections
            'view sections', 'create sections', 'edit sections', 'delete sections',
            // Events
            'view events', 'create events', 'edit events', 'delete events',
            // Posts
            'view posts', 'create posts', 'edit posts', 'delete posts',
        ];

        foreach ($permissions as $permissionName) {
            Permission::findOrCreate($permissionName, 'web');
        }

        $adminRole = Role::findOrCreate('admin', 'web');
        $adminRole->syncPermissions(Permission::all());

        $firstUser = User::query()->orderBy('id')->first();

        if ($firstUser) {
            $firstUser->syncRoles([$adminRole->name]);
        }
    }
}
