<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalableProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->input('limit', 200);
        $limit = max(1, min($limit, 500));

        $salesQuery = DB::table('v_sales')
            ->select('v_sales.*', 'users.name as user_name', 'users.email as user_email')
            ->join('users', 'users.id', '=', 'v_sales.user_id')
            ->orderByDesc('paid_at')
            ->orderByDesc('v_sales.id');

        if ($request->filled('user_id')) {
            $salesQuery->where('user_id', (int) $request->input('user_id'));
        }

        $sales = $salesQuery->limit($limit)->get();

        if ($sales->isEmpty()) {
            return response()->json([]);
        }

        $lineCounts = DB::table('sale_items')
            ->select('sale_id', DB::raw('COUNT(*) as line_count'), DB::raw('SUM(quantity) as units_count'))
            ->whereIn('sale_id', $sales->pluck('id'))
            ->groupBy('sale_id')
            ->get()
            ->keyBy('sale_id');

        $payload = $sales->map(function ($row) use ($lineCounts) {
            $counts = $lineCounts->get($row->id);
            return $this->formatSaleRow($row, $counts);
        });

        return response()->json($payload);
    }

    public function show(Sale $sale)
    {
        return response()->json($this->buildSaleResponse($sale->id));
    }

    public function preview(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.salable_product_id' => ['required', 'exists:salable_products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.taxes' => ['nullable', 'numeric', 'min:0'],
            'taxes' => ['nullable', 'numeric', 'min:0'],
        ]);

        $defaultTax = $data['taxes'] ?? 0.18;

        $items = collect($data['items']);
        $salableProducts = SalableProduct::with('product')
            ->whereIn('id', $items->pluck('salable_product_id'))
            ->get()
            ->keyBy('id');

        $previewItems = $items->map(function (array $item) use ($salableProducts, $defaultTax) {
            $salable = $salableProducts->get($item['salable_product_id']);
            if (!$salable) {
                abort(422, 'Producto vendible no encontrado.');
            }

            $quantity = (int) $item['quantity'];
            $taxRate = array_key_exists('taxes', $item) ? (float) $item['taxes'] : $defaultTax;

            $unitPrice = (float) $salable->price;
            $lineSubtotal = round($unitPrice * $quantity, 2);
            $lineTax = round($lineSubtotal * $taxRate, 2);
            $lineTotal = round($lineSubtotal + $lineTax, 2);

            return [
                'salable_product_id' => $salable->id,
                'quantity' => $quantity,
                'tax_rate' => $taxRate,
                'unit_price' => $unitPrice,
                'subtotal' => $lineSubtotal,
                'tax_amount' => $lineTax,
                'total' => $lineTotal,
                'product' => [
                    'id' => $salable->product->id,
                    'name' => $salable->product->name,
                    'description' => $salable->product->description,
                    'stock' => $salable->product->stock,
                ],
            ];
        });

        $summary = [
            'subtotal' => round($previewItems->sum('subtotal'), 2),
            'taxes' => round($previewItems->sum('tax_amount'), 2),
            'total' => round($previewItems->sum('total'), 2),
        ];

        return response()->json([
            'items' => $previewItems->values(),
            'summary' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.salable_product_id' => ['required', 'exists:salable_products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.taxes' => ['nullable', 'numeric', 'min:0'],
            'taxes' => ['nullable', 'numeric', 'min:0'],
        ]);

        $defaultTax = $data['taxes'] ?? 0.18;

        $items = collect($data['items']);
        $salableProducts = SalableProduct::with('product')
            ->whereIn('id', $items->pluck('salable_product_id'))
            ->get()
            ->keyBy('id');

        $sale = DB::transaction(function () use ($data, $items, $salableProducts, $defaultTax) {
            $sale = Sale::create([
                'user_id' => $data['user_id'],
                'status' => 'PAID',
                'paid_at' => now(),
                   'code' => str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            ]);

            foreach ($items as $item) {
                $salable = $salableProducts->get($item['salable_product_id']);
                if (!$salable) {
                    abort(422, 'Producto vendible no encontrado.');
                }

                $product = Product::whereKey($salable->product_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $quantity = (int) $item['quantity'];

                if ($product->stock < $quantity) {
                    abort(422, 'Stock insuficiente para ' . $product->name);
                }

                $taxRate = array_key_exists('taxes', $item) ? (float) $item['taxes'] : $defaultTax;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'salable_product_id' => $salable->id,
                    'quantity' => $quantity,
                    'taxes' => $taxRate,
                ]);

                $product->decrement('stock', $quantity);
            }

            return $sale;
        });

        return response()->json($this->buildSaleResponse($sale->id), 201);
    }

    private function buildSaleResponse(int $saleId): array
    {
        $saleRow = DB::table('v_sales')
            ->select('v_sales.*', 'users.name as user_name', 'users.email as user_email')
            ->join('users', 'users.id', '=', 'v_sales.user_id')
            ->where('v_sales.id', $saleId)
            ->first();
        if (!$saleRow) {
            abort(404, 'Venta no encontrada');
        }

        $items = DB::table('v_sale_items as vsi')
            ->join('salable_products as sp', 'sp.id', '=', 'vsi.salable_product_id')
            ->join('products as p', 'p.id', '=', 'sp.product_id')
            ->select(
                'vsi.id',
                'vsi.sale_id',
                'vsi.salable_product_id',
                'vsi.quantity',
                'vsi.taxes',
                'vsi.unit_price',
                'vsi.subtotal',
                'vsi.total',
                'p.id as product_id',
                'p.name as product_name',
                'p.description as product_description'
            )
            ->where('vsi.sale_id', $saleId)
            ->orderBy('vsi.id')
            ->get()
            ->map(fn ($row) => $this->formatSaleItemRow($row))
            ->values();

        $lineCounts = DB::table('sale_items')
            ->select('sale_id', DB::raw('COUNT(*) as line_count'), DB::raw('SUM(quantity) as units_count'))
            ->where('sale_id', $saleId)
            ->groupBy('sale_id')
            ->first();

        $sale = $this->formatSaleRow($saleRow, $lineCounts);

        return [
            'sale' => $sale,
            'items' => $items,
        ];
    }

    private function formatSaleRow(object $row, ?object $counts = null): array
    {
        $data = [
            'id' => (int) $row->id,
            'user_id' => (int) $row->user_id,
            'user_name' => $row->user_name ?? null,
            'user_email' => $row->user_email ?? null,
            'status' => $row->status,
            'paid_at' => $row->paid_at,
            'code' => $row->code,
            'subtotal' => round((float) $row->subtotal, 2),
            'total' => round((float) $row->total, 2),
            'tax_total' => round((float) $row->total - (float) $row->subtotal, 2),
            'created_at' => $row->created_at,
            'updated_at' => $row->updated_at,
        ];

        if ($counts) {
            $data['line_count'] = (int) $counts->line_count;
            $data['units_count'] = (int) $counts->units_count;
        }

        return $data;
    }

    private function formatSaleItemRow(object $row): array
    {
        return [
            'id' => (int) $row->id,
            'sale_id' => (int) $row->sale_id,
            'salable_product_id' => (int) $row->salable_product_id,
            'quantity' => (int) $row->quantity,
            'taxes' => $row->taxes !== null ? round((float) $row->taxes, 4) : null,
            'unit_price' => round((float) $row->unit_price, 2),
            'subtotal' => round((float) $row->subtotal, 2),
            'total' => round((float) $row->total, 2),
            'tax_amount' => round((float) $row->total - (float) $row->subtotal, 2),
            'product' => [
                'id' => (int) $row->product_id,
                'name' => $row->product_name,
                'description' => $row->product_description,
            ],
        ];
    }
}
