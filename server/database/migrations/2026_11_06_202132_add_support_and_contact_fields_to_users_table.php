<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // General contact info
            $table->string('phone')->nullable();
            $table->string('telegram_username')->nullable();
            $table->string('email')->nullable();

            // Supporter / Help profile
            $table->boolean('is_supporter')->default(false);
            $table->json('support_sectors')->nullable(); // e.g. ["Spiritual", "Academic", "Finance & Charity", "Counseling", "Technical"]
            $table->text('support_bio')->nullable();      // About how they can help & availability
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'telegram_username',
                'email',
                'is_supporter',
                'support_sectors',
                'support_bio',
            ]);
        });
    }
};
