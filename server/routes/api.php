<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PublicTrackingController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::get('/track/{query}', [PublicTrackingController::class, 'track']);
Route::get('/public/services', [ServiceController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Memerlukan Bearer Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard & Statistik
    Route::get('/dashboard', [DashboardController::class, 'stats']);

    // Master Data Pelanggan & Layanan
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('services', ServiceController::class);

    // Manajemen Transaksi Laundry
    Route::apiResource('orders', OrderController::class);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/payments', [OrderController::class, 'addPayment']);
});
