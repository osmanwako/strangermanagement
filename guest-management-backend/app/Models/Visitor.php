<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'id_number',
        'id_type',
        'wereda',
        'subcity',
        'phone',
        'email',
        'photo_url',
        'destination',
        'visit_purpose',
        'vip',
        'archived_at',
    ];

    protected $dates = ['archived_at'];

    public function weapons()
    {
        return $this->hasMany(Weapon::class);
    }

    public function getWeaponsCountAttribute()
    {
        return $this->weapons()->count();
    }
}