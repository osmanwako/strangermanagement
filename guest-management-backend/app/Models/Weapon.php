<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weapon extends Model
{
    protected $fillable = [
        'visitor_id',
        'weapon_type',
        'weapon_description',
    ];

    public function visitor()
    {
        return $this->belongsTo(Visit::class, 'visitor_id');
    }
}

