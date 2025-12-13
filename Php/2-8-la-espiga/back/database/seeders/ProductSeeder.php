<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIdsByName = Category::pluck('id', 'name');

        $catalog = [
            [
                'name' => 'Hogaza masa madre',
                'sku' => 'PAN-001',
                'categories' => ['Pan', 'Artesanal'],
                'description' => 'Fermentacion lenta 24h, corteza crujiente.',
                'cost' => 38.50,
                'price' => 90.00,
                'stock' => 40,
            ],
            [
                'name' => 'Baguette rustica',
                'sku' => 'PAN-002',
                'categories' => ['Pan', 'Artesanal'],
                'description' => 'Miga aireada y corteza dorada.',
                'cost' => 18.50,
                'price' => 48.00,
                'stock' => 60,
            ],
            [
                'name' => 'Pan de semillas',
                'sku' => 'PAN-003',
                'categories' => ['Pan', 'Artesanal'],
                'description' => 'Linaza, girasol y avena.',
                'cost' => 24.90,
                'price' => 65.00,
                'stock' => 35,
            ],
            [
                'name' => 'Croissant mantequilla',
                'sku' => 'DUL-001',
                'categories' => ['Dulces'],
                'description' => 'Laminado a mano, mantequilla local.',
                'cost' => 15.20,
                'price' => 38.00,
                'stock' => 50,
            ],
            [
                'name' => 'Rol de canela',
                'sku' => 'DUL-002',
                'categories' => ['Dulces'],
                'description' => 'Glaseado de vainilla y especias suaves.',
                'cost' => 18.70,
                'price' => 44.00,
                'stock' => 45,
            ],
            [
                'name' => 'Cafe latte',
                'sku' => 'CAF-001',
                'categories' => ['Bebidas'],
                'description' => 'Espresso doble con leche vaporizada.',
                'cost' => 19.80,
                'price' => 55.00,
                'stock' => 999,
            ],
            [
                'name' => 'Cold brew',
                'sku' => 'CAF-002',
                'categories' => ['Bebidas'],
                'description' => 'Infusion en frio 18h, servido con hielo.',
                'cost' => 22.40,
                'price' => 65.00,
                'stock' => 120,
            ],
            [
                'name' => 'Masa madre base',
                'sku' => 'INS-001',
                'categories' => ['Insumos'],
                'description' => 'Cultivo para uso interno, no se vende.',
                'cost' => 85.00,
                'price' => null,
                'stock' => 10,
            ],
            [
                'name' => 'Charola de acero',
                'sku' => 'INS-002',
                'categories' => ['Insumos'],
                'description' => 'Charolas para horneado, inventario interno.',
                'cost' => 480.00,
                'price' => null,
                'stock' => 15,
            ],
            [
                'name' => 'Caja para llevar',
                'sku' => 'INS-003',
                'categories' => ['Insumos'],
                'description' => 'Empaque para pan dulce, control interno.',
                'cost' => 6.50,
                'price' => null,
                'stock' => 200,
            ],
        ];

        foreach ($catalog as $item) {
            $categoryIds = collect($item['categories'] ?? [])
                ->map(function ($name) use ($categoryIdsByName) {
                    return $categoryIdsByName[$name] ?? Category::firstOrCreate(['name' => $name])->id;
                })
                ->all();

            $product = Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'cost' => $item['cost'],
                    'stock' => $item['stock'],
                    'thumbnail' => null,
                    'is_active' => true,
                ]
            );

            if (array_key_exists('price', $item) && $item['price'] !== null) {
                $product->salable()->updateOrCreate(
                    ['product_id' => $product->id],
                    ['price' => $item['price']]
                );
            } else {
                $product->salable()->delete();
            }

            $product->categories()->sync($categoryIds);
        }
    }
}
