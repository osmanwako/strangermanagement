<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\WeaponController;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

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

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'getUsers']);
        Route::post('/users', [AuthController::class, 'createUser']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
        Route::post('/appointments/{appointment}/postpone', [AppointmentController::class, 'postpone']);
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    });

    // Secretary only routes
    Route::middleware('role:secretary')->group(function () {
        Route::post('/visitors', [VisitorController::class, 'store']);
        Route::post('/weapons', [WeaponController::class, 'store']);
        Route::post('/weapons/{weapon}/return', [WeaponController::class, 'returnWeapon']);
        Route::post('/visitors/{visitor}/weapons/{weapon}/return', [VisitorController::class, 'returnWeapon']);
    });

    // Shared routes (both admin and secretary)
    Route::get('/visitors', [VisitorController::class, 'index']);
    Route::get('/visitors/{visitor}', [VisitorController::class, 'show']);
    Route::get('/visitors/export', [VisitorController::class, 'export']);
    Route::post('/visitors/{visitor}/archive', [VisitorController::class, 'archive']);

    Route::get('/weapons', [WeaponController::class, 'index']);
    Route::get('/weapons/{weapon}', [WeaponController::class, 'show']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);

    Route::get('/dashboard/stats', [VisitorController::class, 'stats']);
});