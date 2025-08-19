<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Weapon;
use Illuminate\Support\Facades\Validator;

class WeaponController extends Controller
{
    public function index()
    {
        $weapons = Weapon::with('visitor')->latest()->get();
        return response()->json($weapons);
    }

    public function show(Weapon $weapon)
    {
        return response()->json($weapon->load('visitor'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'visitor_id' => 'required|exists:visits,id',
            'weapon_type' => 'required|string|max:255',
            'weapon_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $weapon = Weapon::create($request->all());

        return response()->json([
            'message' => 'Weapon registered successfully.',
            'weapon' => $weapon->load('visitor')
        ], 201);
    }

    public function update(Request $request, Weapon $weapon)
    {
        $validator = Validator::make($request->all(), [
            'weapon_type' => 'sometimes|required|string|max:255',
            'weapon_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $weapon->update($request->only(['weapon_type', 'weapon_description']));

        return response()->json([
            'message' => 'Weapon updated successfully.',
            'weapon' => $weapon->load('visitor')
        ]);
    }

    public function destroy(Weapon $weapon)
    {
        $weapon->delete();
        return response()->json(['message' => 'Weapon deleted successfully.']);
    }
}
