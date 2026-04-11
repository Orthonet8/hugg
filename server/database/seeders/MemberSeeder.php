<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Seed 100 members: user00 to user99.
     */
    public function run(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $username = sprintf('user%02d', $i);
            $batches = ['2016', '2017', '2018'];

            Member::updateOrCreate(
                ['email_or_username' => $username],
                [
                    'password' => '123456',
                    'full_name' => 'Member '.sprintf('%02d', $i),
                    'christian_name' => 'Christian '.sprintf('%02d', $i),
                    'gender' => $i % 2 === 0 ? 'ወንድ' : 'ሴት',
                    'age' => (string) (18 + ($i % 20)),
                    'batch' => $batches[array_rand($batches)],
                    'is_active' => true,
                    'section_id' => null,
                ],
            );
        }
    }
}
