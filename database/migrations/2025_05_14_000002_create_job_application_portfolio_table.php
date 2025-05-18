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
        Schema::create('job_application_portfolio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
            $table->foreignId('portfolio_item_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a portfolio item can only be attached once to a job application
            $table->unique(['job_application_id', 'portfolio_item_id'], 'jap_unique_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_application_portfolio');
    }
};
