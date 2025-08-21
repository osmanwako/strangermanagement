<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with('creator');
        
        // Filter by date range if provided
        if ($request->has('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                             ->orderBy('appointment_time', 'desc')
                             ->get();

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'visitor_name' => 'required|string|max:255',
            'visitor_phone' => 'required|string|max:20',
            'visitor_email' => 'nullable|email|max:255',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|string',
            'destination' => 'required|string|max:255',
            'purpose' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::create([
            ...$request->all(),
            'status' => 'pending',
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment->load('creator')
        ], 201);
    }

    public function show(Appointment $appointment)
    {
        return response()->json($appointment->load('creator'));
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validator = Validator::make($request->all(), [
            'visitor_name' => 'sometimes|required|string|max:255',
            'visitor_phone' => 'sometimes|required|string|max:20',
            'visitor_email' => 'nullable|email|max:255',
            'appointment_date' => 'sometimes|required|date',
            'appointment_time' => 'sometimes|required|string',
            'destination' => 'sometimes|required|string|max:255',
            'purpose' => 'sometimes|required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update($request->all());

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment->load('creator')
        ]);
    }

    public function postpone(Request $request, Appointment $appointment)
    {
        // Only admin can postpone appointments
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'new_date' => 'required|date|after:today',
            'new_time' => 'required|string',
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update([
            'postponed_from' => $appointment->appointment_date . ' ' . $appointment->appointment_time,
            'appointment_date' => $request->new_date,
            'appointment_time' => $request->new_time,
            'postponed_reason' => $request->reason,
            'status' => 'postponed',
        ]);

        return response()->json([
            'message' => 'Appointment postponed successfully',
            'appointment' => $appointment->load('creator')
        ]);
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        // Only admin can delete appointments
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}