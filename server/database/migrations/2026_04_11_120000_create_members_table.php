<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            // Credentials
            $table->string('email_or_username')->unique();
            $table->string('password');
            $table->rememberToken();

            // Basic identity
            $table->string('full_name');
            $table->string('christian_name')->nullable();
            $table->enum('gender', ['ወንድ', 'ሴት'])->nullable();
            $table->string('age')->nullable();
            $table->string('profile_photo')->nullable();

            // Campus & Academics
            $table->string('campus')->nullable();
            $table->string('field_of_study')->nullable();
            $table->string('batch');
            $table->string('dorm')->nullable();

            // Background & Participation
            $table->string('region')->nullable();
            $table->string('zone')->nullable();
            $table->string('woreda')->nullable();
            $table->string('native_language')->nullable();
            $table->string('extra_languages')->nullable();
            $table->string('previous_participation')->nullable();
            $table->string('local_church')->nullable();

            // Skills & Service
            $table->string('ordination')->nullable();
            $table->string('ordination_year')->nullable();
            $table->string('diocese')->nullable();
            $table->string('bishop')->nullable();
            $table->json('service_departments')->nullable();     // ["ትምህርት", "መዝሙር", ...]
            $table->json('talents')->nullable();                  // ["መዝሙር", "ድርሰት", ...]
            $table->text('talent_description')->nullable();

            // Contact & Social
            $table->string('mobile')->nullable();
            $table->string('telegram')->nullable();

            // Section assignment
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->boolean('is_assigned_to_family')->default(false);

            // Metadata
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
