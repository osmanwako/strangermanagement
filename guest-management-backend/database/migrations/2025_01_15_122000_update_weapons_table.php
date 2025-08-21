<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weapons', function (Blueprint $table) {
            $table->text('description')->nullable()->after('serial');
            $table->enum('status', ['stored', 'returned'])->default('stored')->after('description');
            $table->timestamp('returned_at')->nullable()->after('status');
            $table->foreignId('returned_by')->nullable()->constrained('users')->after('returned_at');
        });
    }

    public function down(): void
    {
        Schema::table('weapons', function (Blueprint $table) {
            $table->dropForeign(['returned_by']);
            $table->dropColumn(['description', 'status', 'returned_at', 'returned_by']);
        });
    }
};