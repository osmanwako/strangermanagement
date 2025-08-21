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
        // Only secretary can register weapons
        if ($request->user()->role !== 'secretary') {
            return response()->json(['message' => 'Unauthorized. Only secretaries can register weapons.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'visitor_id' => 'required|exists:visitors,id',
            'type' => 'required|string|max:255',
            'serial' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $weapon = Weapon::create([
            'visitor_id' => $request->visitor_id,
            'type' => $request->type,
            'serial' => $request->serial,
            'description' => $request->description,
            'status' => 'stored',
        ]);

        return response()->json([
            'message' => 'Weapon registered successfully.',
            'weapon' => $weapon->load('visitor')
        ], 201);
    }

    public function update(Request $request, Weapon $weapon)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|string|max:255',
            'serial' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $weapon->update($request->only(['type', 'serial', 'description']));

        return response()->json([
            'message' => 'Weapon updated successfully.',
            'weapon' => $weapon->load('visitor')
        ]);
    }

    public function returnWeapon(Request $request, Weapon $weapon)
    {
        // Only secretary can return weapons
        if ($request->user()->role !== 'secretary') {
            return response()->json(['message' => 'Unauthorized. Only secretaries can return weapons.'], 403);
        }

        if ($weapon->status === 'returned') {
            return response()->json(['message' => 'Weapon already returned'], 400);
        }

        $weapon->update([
            'status' => 'returned',
            'returned_at' => now(),
            'returned_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Weapon returned successfully',
            'weapon' => $weapon->load('visitor')
        ]);
    }

    public function destroy(Weapon $weapon)
    {
        $weapon->delete();
        return response()->json(['message' => 'Weapon deleted successfully.']);
    }
}