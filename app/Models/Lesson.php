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
        'course_id',
        'section_id',
        'type',
        'video_source',
        'video_url',
        'video_path',
        'content_json',
        'content_html',
        'content_text',
    ];

    public function section()
    {
        // hasOne, hasMany, belongsTo, belongsToMany
        return $this->belongsTo(Section::class);
    }

    public function course()
    {
        // hasOne, hasMany, belongsTo, belongsToMany
        return $this->belongsTo(Course::class);
    }
}
