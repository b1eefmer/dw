<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function update(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'position_seconds' => ['nullable', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'is_completed' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();

        $progress = LessonProgress::firstOrNew([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);

        if ($lesson->type === 'text') {
            $progress->is_completed = (bool) ($data['is_completed'] ?? false);
        } else {
            if (! $progress->is_completed) {
                $progress->is_completed = (bool) ($data['is_completed'] ?? false);
            }
        }

        $progress->position_seconds = $data['position_seconds'] ?? $progress->position_seconds ?? 0;
        $progress->duration_seconds = $data['duration_seconds'] ?? $progress->duration_seconds;

        if ($progress->is_completed && ! $progress->completed_at) {
            $progress->completed_at = now();
        }

        $progress->save();

        return response()->json([
            'ok' => true,
            'progress' => [
                'position_seconds' => $progress->position_seconds,
                'is_completed' => $progress->is_completed,
            ],
        ]);
    }
}
