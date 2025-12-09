<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return $user->enrolledCourses()->get();
    }

    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        $user->enrolledCourses()->syncWithoutDetaching([$course->id]);

        return redirect()
            ->route('courses.grid')
            ->with('message', 'You enroll in course: '.$course->title);

        // return response()->json([
        //     'message' => 'You have enrolled in the course',
        // ]);
    }

    public function destroy(Request $request, Course $course)
    {
        $user = $request->user();

        $user->enrolledCourses()->detach($course->id);

        $referer = $request->headers->get('referer');
        // dd($referer);

        if (str_contains($referer, '/my-courses')) {
            return redirect()
                ->route('my-courses')
                ->with('message', 'You unenroll from course: '.$course->title);
        }

        return redirect()
            ->route('courses.grid')
            ->with('message', 'You unenroll from course: '.$course->title);

        // return response()->json([
        //     'message' => 'You have unenrolled from the course',
        // ]);
    }
    //
}
