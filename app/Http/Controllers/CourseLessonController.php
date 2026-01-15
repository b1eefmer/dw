<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseLessonController extends Controller
{
    public function index(Course $course)
    {
        $lessons = $course->lessons()
            ->orderBy('id')
            ->get(['id', 'title']);

        $completedByLessonId = [];

        if (auth()->check() && $lessons->isNotEmpty()) {
            $completedByLessonId = DB::table('lesson_progress')
                ->where('user_id', auth()->id())
                ->whereIn('lesson_id', $lessons->pluck('id'))
                ->pluck('is_completed', 'lesson_id')
                ->all();
        }

        $lessonsPayload = $lessons->map(function ($lesson) use ($completedByLessonId) {
            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'is_completed' => (bool) ($completedByLessonId[$lesson->id] ?? false),
            ];
        });

        return Inertia::render('Courses/Lessons/Index', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
            ],
            'lessons' => $lessonsPayload,
        ]);
    }

    public function show(Course $course, Lesson $lesson)
    {
        $lessons = Lesson::where('course_id', $course->id)
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        $currentIndex = $lessons->search(fn ($l) => $l->id === $lesson->id);

        $previousLesson = $currentIndex > 0
            ? $lessons[$currentIndex - 1]
            : null;

        $nextLesson = $currentIndex < $lessons->count() - 1
            ? $lessons[$currentIndex + 1]
            : null;

        $videoKind = null;
        $videoSrc = null;

        if ($lesson->type === 'video') {
            if ($lesson->video_source === 'upload' && $lesson->video_path) {
                $videoKind = 'file';
                $videoSrc = Storage::disk('public')->url($lesson->video_path);
            } elseif ($lesson->video_source === 'youtube' && $lesson->video_url) {
                $videoKind = 'youtube';
                $videoSrc = $lesson->video_url;
            } elseif ($lesson->video_url) {
                $videoKind = 'youtube';
                $videoSrc = $lesson->video_url;
            }
        }

        // progress
        $progress = auth()->check()
    ? LessonProgress::where('user_id', auth()->id())
        ->where('lesson_id', $lesson->id)
        ->first()
    : null;

        return Inertia::render('Courses/Lessons/Show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
            ],
            'lesson' => [
                'id' => $lesson->id,
                'section_id' => $lesson->section_id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'type' => $lesson->type,
                'content_html' => $lesson->content_html,
            ],

            'videoKind' => $videoKind,
            'videoSrc' => $videoSrc,

            'progress' => $progress,

            'navigation' => [
                'previous' => $previousLesson
                    ? [
                        'id' => $previousLesson->id,
                        'title' => $previousLesson->title,
                        'url' => route('courses.lessons.show', [$course, $previousLesson]),
                    ]
                    : null,

                'next' => $nextLesson
                    ? [
                        'id' => $nextLesson->id,
                        'title' => $nextLesson->title,
                        'url' => route('courses.lessons.show', [$course, $nextLesson]),
                    ]
                    : null,
            ],
        ]);
    }
}
