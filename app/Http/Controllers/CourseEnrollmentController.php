<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // return $user->enrolledCourses()->get();
        return response()->json([
            'courses' => $user->enrolledCourses()->get(),
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        $user->enrolledCourses()->syncWithoutDetaching([$course->id]);

        return redirect()
            ->route('courses.grid')
            ->with('message', 'You enroll in course: '.$course->title);
    }

    public function destroy(Request $request, Course $course)
    {
        $request->user()->enrolledCourses()->detach($course->id);

        $redirectTo = $request->input('redirect_to', route('courses.grid'));

        return redirect()->back()->with('message', 'You unenroll from course: '.$course->title);

    }
    //
}
