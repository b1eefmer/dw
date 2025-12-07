<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        if ((auth()->id()!=1) && (auth()->id()!=2) && (auth()->id()!=3))
        {
            abort(403);
        }
        $courses = auth()->user()->courses;

        return Inertia::render('Courses/Index', compact('courses'));
    }

    public function grid()
    {
        $courses = auth()->user()->courses;

        return Inertia::render('Courses/Grid', compact('courses'));
    }

    public function show(Course $course)
    {
        $course->load('sections');

        return Inertia::render('Courses/Show', compact('course'));
    }

    public function create()
    {
        return Inertia::render('Courses/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $data['user_id'] = auth()->id();
        $data['slug'] = SlugService::uniqueSlug($data['title'], Course::class);
        $course = Course::create($data);

        $course->sections()->create([
            'title' => 'Introduction',
            'content' => 'This is your first section.',
            'order' => 1,
        ]);

        return redirect()->route('courses.index')->with('message', 'Course created successfully.');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Courses/Edit', compact('course'));
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $course->update([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']),
            'description' => $data['description'],
        ]);

        return redirect()->route('courses.index')->with('message', 'Course updated successfully.');

    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')->with('message', 'Course deleted successfully.');
    }
}
