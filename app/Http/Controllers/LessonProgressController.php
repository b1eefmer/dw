<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function update(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'position_seconds' => ['required', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'is_completed' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();

        $progress = \DB::table('lesson_progress')->where([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ])->first();

        $isCompleted = (bool)($data['is_completed'] ?? false);

        if ($progress) {
            \DB::table('lesson_progress')
                ->where('id', $progress->id)
                ->update([
                    'position_seconds' => $data['position_seconds'],
                    'duration_seconds' => $data['duration_seconds'] ?? $progress->duration_seconds,
                    'is_completed' => $isCompleted ? 1 : $progress->is_completed,
                    'completed_at' => $isCompleted && !$progress->completed_at ? now() : $progress->completed_at,
                    'updated_at' => now(),
                ]);
        } else {
            \DB::table('lesson_progress')->insert([
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
                'position_seconds' => $data['position_seconds'],
                'duration_seconds' => $data['duration_seconds'] ?? null,
                'is_completed' => $isCompleted ? 1 : 0,
                'completed_at' => $isCompleted ? now() : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
