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
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('role')->nullable()->after('type');
            $table->string('organization')->nullable()->after('role');
            $table->json('skills')->nullable()->after('organization');
            $table->json('achievements')->nullable()->after('skills');
            $table->string('media_type')->nullable()->after('repository_url');
            $table->string('media_url')->nullable()->after('media_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'organization',
                'skills',
                'achievements',
                'media_type',
                'media_url',
            ]);
        });
    }
};
