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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->foreignId('job_application_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('job_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Created by
            $table->string('location')->nullable(); // Can be physical or virtual (Zoom, Google Meet, etc.)
            $table->string('meeting_link')->nullable();
            $table->string('type')->nullable(); // Interview, Test, etc.
            $table->string('status')->nullable(); // Scheduled, Completed, Cancelled, etc.
            $table->json('attendees')->nullable(); // JSON array of attendee user IDs or email addresses
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
