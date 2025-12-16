<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Inertia\Inertia;

class CourseLessonController extends Controller
{
    public function index(Course $course)
    {
        // Если нужно — проверка доступа
        // $this->authorize('view', $course);

        $lessons = $course->lessons()
            ->orderBy('id')
            ->get();

        return Inertia::render('Courses/Lessons/Index', [
            'course' => $course,
            'lessons' => $lessons,
        ]);
    }

    public function show(Course $course, Lesson $lesson)
    {
        // Все уроки курса в правильном порядке
        $lessons = Lesson::whereHas('section', function ($q) use ($course) {
            $q->where('course_id', $course->id);
        })
            ->orderBy('order')
            ->get();

        $currentIndex = $lessons->search(fn ($l) => $l->id === $lesson->id);

        $previousLesson = $currentIndex > 0
            ? $lessons[$currentIndex - 1]
            : null;

        $nextLesson = $currentIndex < $lessons->count() - 1
            ? $lessons[$currentIndex + 1]
            : null;

        return Inertia::render('Courses/Lessons/Show', [
            'lesson' => [
                'id' => $lesson->id,
                'section_id' => $lesson->section_id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'type' => $lesson->type,
                'video_url' => $lesson->video_url,
                'content_html' => $lesson->content_html,
            ],

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
