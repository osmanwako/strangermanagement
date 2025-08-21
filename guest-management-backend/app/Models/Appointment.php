<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_name',
        'visitor_phone',
        'visitor_email',
        'appointment_date',
        'appointment_time',
        'destination',
        'purpose',
        'notes',
        'status',
        'created_by',
        'postponed_from',
        'postponed_reason',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function visitor()
    {
        return $this->belongsTo(Visitor::class, 'visitor_id');
    }
}