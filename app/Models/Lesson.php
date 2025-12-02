<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'order',
        'section_id',
    ];

    public function section()
    {
        // hasOne, hasMany, belongsTo, belongsToMany
        return $this->belongsTo(Section::class);
    }
}
