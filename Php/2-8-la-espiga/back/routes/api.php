<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalableProductController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['status' => 'ok']);

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('products/salable', [SalableProductController::class, 'index']);
Route::apiResource('categories', CategoryController::class)->except(['show']);
Route::apiResource('products', ProductController::class);


Route::get('sales', [SaleController::class, 'index']);
Route::post('sales/preview', [SaleController::class, 'preview']);
Route::post('sales', [SaleController::class, 'store']);
Route::get('sales/{sale}', [SaleController::class, 'show']);

