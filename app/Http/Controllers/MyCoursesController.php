<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MyCoursesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $courses = $user->enrolledCourses()->get();

        // return Inertia::render('Courses/Grid', compact('courses'));

        return Inertia::render('Courses/MyCourses', ['courses' => $courses]);

    }
}
