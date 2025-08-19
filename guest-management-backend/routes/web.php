<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;


use App\Http\Controllers\AuthController;


Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});


Route::get('/', function () {
    return response()->json(['message' => 'Laravel is working']);
});


Route::get('/debug-session', function () {
    return response()->json([
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
        'cookie' => request()->cookie(),
    ]);
});


//Route::post('/api/login', [AuthController::class, 'login']);

Route::middleware('web')->group(function () {

  
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});
