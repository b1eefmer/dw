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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->costrained()->cascadeOnDelete();
            $table->foreignId('course_id')->costrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->enum('type', ['text', 'video'])->default('text');
            $table->string('video_url')->nullable();
            $table->longText('content_json')->nullable();
            $table->longText('content_html')->nullable();
            $table->text('content_text')->nullable();
            // $table->string('content_type')->default('text');
            // $table->longText('content')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
