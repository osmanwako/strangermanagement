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
        Schema::create('visitors', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('id_number');
    $table->string('id_type')->nullable();
    $table->string('wereda')->nullable();
    $table->string('subcity')->nullable();
    $table->longText('photo_url')->nullable();
    $table->string('destination');
    $table->string('visit_purpose');
    $table->boolean('vip')->default(false);
    $table->timestamp('archived_at')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
