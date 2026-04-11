<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('fellowship_name')->nullable()->after('name');
            $table->string('logo')->nullable()->after('fellowship_name');
            $table->string('motto')->nullable()->after('logo');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['fellowship_name', 'logo', 'motto']);
        });
    }
};
