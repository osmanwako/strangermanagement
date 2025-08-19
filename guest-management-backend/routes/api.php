<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\WeaponController;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/test', function (\Illuminate\Http\Request $request) {
    return response()->json(['ok' => true, 'data' => $request->all()]);
});
Route::get('/test', function () {
    return response()->json(['ok' => true, 'data' => 'API is working on get method']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/visitors', [VisitorController::class, 'index']);
    Route::post('/visitors', [VisitorController::class, 'store']);
    Route::get('/visitors/{visitor}', [VisitorController::class, 'show']);
    Route::put('/visitors/{visitor}', [VisitorController::class, 'update']);
    Route::delete('/visitors/{visitor}', [VisitorController::class, 'destroy']);

    Route::get('/weapons', [WeaponController::class, 'index']);
    Route::post('/weapons', [WeaponController::class, 'store']);
    Route::get('/weapons/{weapon}', [WeaponController::class, 'show']);
    Route::put('/weapons/{weapon}', [WeaponController::class, 'update']);
    Route::delete('/weapons/{weapon}', [WeaponController::class, 'destroy']);
});
