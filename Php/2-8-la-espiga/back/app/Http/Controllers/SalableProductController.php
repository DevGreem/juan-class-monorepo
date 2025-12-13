<?php

namespace App\Http\Controllers;

use App\Models\SalableProduct;

class SalableProductController extends Controller
{
    public function index()
    {
        $items = SalableProduct::with(['product.categories'])
            ->whereHas('product', fn ($query) => $query->where('is_active', true))
            ->orderBy('id')
            ->get();

        return response()->json($items);
    }
}
