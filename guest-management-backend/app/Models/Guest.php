<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $fillable = [
        'full_name',
        'phone_number',
        'id_number',
        'organization',
    ];

    public function weapons()
    {
        return $this->hasMany(Weapon::class);
    }

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
