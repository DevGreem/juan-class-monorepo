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
        DB::statement(<<<SQL

            CREATE OR REPLACE VIEW v_sale_items as
            SELECT
                si.id,
                si.sale_id,
                si.salable_product_id,
                si.quantity,
                si.taxes,
                sp.price AS unit_price,
                sp.price * si.quantity as subtotal,
                sp.price * si.quantity * (1 + si.taxes) AS total,
                si.created_at,
                si.updated_at
            FROM sale_items si
                JOIN salable_products sp ON sp.id = si.salable_product_id;
        SQL);

        DB::statement(<<<SQL

            CREATE OR REPLACE VIEW v_sales as
            SELECT
                s.id,
                s.user_id,
                s.status,
                s.paid_at,
                s.code,
                SUM(si.subtotal) AS subtotal,
                SUM(si.total) AS total,
                s.created_at,
                s.updated_at
            FROM sales s
                JOIN v_sale_items si ON si.sale_id = s.id
            GROUP BY s.id;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(<<<SQL
            DROP VIEW IF EXISTS v_sale_items CASCADE;
        SQL);

        DB::statement(<<<SQL
            DROP VIEW IF EXISTS v_sales CASCADE;
        SQL);
    }
};
