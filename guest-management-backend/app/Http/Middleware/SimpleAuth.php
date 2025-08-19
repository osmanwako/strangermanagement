<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class SimpleAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'No token provided'], 401);
        }

        $user = User::where('remember_token', $token)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        // Add user to request
        $request->merge(['user' => $user]);
        
        return $next($request);
    }
} 