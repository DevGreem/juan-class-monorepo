<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        DB::statement(<<<SQL

            CREATE OR REPLACE VIEW v_categories AS
            SELECT
                c.id,
                c.name,
                c.description,
                LOWER(REPLACE(c.name, ' ', '-')) AS slug,
                c.created_at,
                c.updated_at
            FROM categories c;
        SQL);
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS v_categories');
        Schema::dropIfExists('categories');
    }
};
