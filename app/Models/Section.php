<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    /** @use HasFactory<\Database\Factories\SectionFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'order',
        'course_id',
    ];

    public function course()
    {
        // hasOne, hasMany, belongsTo, belongsToMany
        return $this->belongsTo(Course::class);
    }
    
    public function lessons()
    {
        // hasOne, hasMany, belongsTo, belongsToMany
        return $this->hasMany(Lesson::class);
    }
}
