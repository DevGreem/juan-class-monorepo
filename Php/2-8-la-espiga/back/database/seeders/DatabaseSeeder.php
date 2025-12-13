<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// Seeders
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(
            ['name' => 'admin'],
            ['description' => 'Administrador']
        );

        DB::table('roles')->updateOrInsert(
            ['name' => 'customer'],
            ['description' => 'Cliente']
        );

        $adminRoleId = (int) DB::table('roles')->where('name', 'admin')->value('id');
        $customerRoleId = (int) DB::table('roles')->where('name', 'customer')->value('id');

        User::updateOrCreate(
            ['email' => 'admin@laespiga.do'],
            [
                'name' => 'Admin La Espiga',
                'phone' => '5550000001',
                'role_id' => $adminRoleId,
                'password' => Hash::make('password'),
                'remember_token' => null,
            ]
        );

        User::updateOrCreate(
            ['email' => 'cliente@laespiga.do'],
            [
                'name' => 'Cliente La Espiga',
                'phone' => '5550000002',
                'role_id' => $customerRoleId,
                'password' => Hash::make('password'),
                'remember_token' => null,
            ]
        );

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
