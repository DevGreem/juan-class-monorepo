<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['categories', 'salable'])->orderBy('name')->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'categories' => ['sometimes', 'array'],
            'categories.*' => ['integer', 'exists:categories,id'],
        ]);

        $productData = collect($data)->except(['price', 'categories'])->toArray();
        $product = Product::create($productData);

        if (array_key_exists('price', $data)) {
            $product->salable()->create(['price' => $data['price']]);
        }

        if (!empty($data['categories'])) {
            $product->categories()->sync($data['categories']);
        }

        return response()->json($product->load(['categories', 'salable']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['categories', 'salable']));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['sometimes', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'description' => ['nullable', 'string'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'categories' => ['sometimes', 'array'],
            'categories.*' => ['integer', 'exists:categories,id'],
        ]);

        $productData = collect($data)->except(['price', 'categories'])->toArray();
        $product->update($productData);

        if (array_key_exists('price', $data)) {
            if ($data['price'] === null) {
                $product->salable()->delete();
            } else {
                $product->salable()->updateOrCreate(
                    ['product_id' => $product->id],
                    ['price' => $data['price']]
                );
            }
        }

        if (array_key_exists('categories', $data)) {
            $product->categories()->sync($data['categories'] ?? []);
        }

        return response()->json($product->fresh(['categories', 'salable']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['deleted' => true]);
    }
}
