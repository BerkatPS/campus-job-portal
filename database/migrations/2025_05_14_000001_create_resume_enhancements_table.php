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
        Schema::create('resume_enhancements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('resume_version_id')->nullable()->constrained('resume_versions')->onDelete('set null');
            $table->text('original_content')->nullable();
            $table->text('enhanced_content')->nullable();
            $table->json('enhancement_suggestions')->nullable();
            $table->json('keyword_analysis')->nullable();
            $table->json('format_suggestions')->nullable();
            $table->json('skill_suggestions')->nullable();
            $table->text('overall_feedback')->nullable();
            $table->integer('score')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resume_enhancements');
    }
};
