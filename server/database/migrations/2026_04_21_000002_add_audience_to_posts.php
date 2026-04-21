<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // audience_type: 'all' = visible to everyone, 'sections' = only listed sections
        Schema::table('posts', function (Blueprint $table) {
            $table->string('audience_type')->default('all')->after('is_active'); // 'all' | 'sections'
        });

        Schema::create('post_section', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->primary(['post_id', 'section_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_section');
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('audience_type');
        });
    }
};
