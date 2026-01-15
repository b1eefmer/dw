<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseContinueController extends Controller
{
    public function show(Request $request, Course $course)
    {
        $user = $request->user();

        $lessons = Lesson::whereHas('section', function ($q) use ($course) {
            $q->where('course_id', $course->id);
        })
            ->orderBy('order')
            ->get(['id', 'title']);

        if ($lessons->isEmpty()) {
            return redirect()->route('courses.lessons.index', $course);
        }

        $lessonIds = $lessons->pluck('id')->all();

        $completedIds = DB::table('lesson_progress')
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->where('is_completed', 1)
            ->pluck('lesson_id')
            ->all();

        $completedSet = array_flip($completedIds);

        $target = null;
        foreach ($lessons as $l) {
            if (! isset($completedSet[$l->id])) {
                $target = $l;
                break;
            }
        }

        if (! $target) {
            $target = $lessons->last();
        }

        return redirect()->route('courses.lessons.show', [$course, $target->id]);
    }
}
