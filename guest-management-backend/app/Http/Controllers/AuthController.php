<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
   
public function login(Request $request)
{
    
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Username or password error'], 401);
    }

     $user = User::where('email', $request->email)->first();
     $token = $user->createToken('auth_token')->plainTextToken;

     return response()->json([
        'token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ]);
}
    
public function logout(Request $request)
{
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
}


    public function user(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
            'name' => $request->user()->name,
        ]);
    }
}
