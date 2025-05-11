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
        Schema::table('jobs', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('company_id')->constrained()->nullOnDelete();
            $table->string('status')->default('draft')->after('is_active');
            $table->json('skills')->nullable()->after('benefits');
            $table->date('deadline')->nullable()->after('submission_deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
            $table->dropColumn('status');
            $table->dropColumn('skills');
            $table->dropColumn('deadline');
        });
    }
};
