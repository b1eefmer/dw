<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    //
    public function create($courseId)
    {
        return inertia('Sections/Create', ['courseId' => $courseId]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
        ]);
        $section = Section::create($data);

        $section->lessons()->create([
            'title' => 'Introduction',
            'slug' => 'introduction',
            'content' => 'This is your first lesson.',
            'order' => 1,
            'course_id' => $section->course_id,
        ]);

        $course = Course::findOrFail($data['course_id']);

        return redirect()->route('courses.show', $course)->with('message', 'Section created successfully.');
    }

    public function edit(Section $section)
    {
        return Inertia::render('Sections/Edit', compact('section'));
    }

    public function update(Request $request, Section $section)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        // $section = Section::findOrFail($section->id);
        $section->update([
            'title' => $data['title'],
            'description' => $data['description'],
        ]);

        $course = $section->course;

        return redirect()->route('courses.show', $course)->with('message', 'Section updated successfully.');

    }

    public function destroy(Section $section)
    {
        $course = $section->course;
        $section->delete();

        return redirect()->route('courses.show', $course)->with('message', 'Section deleted successfully.');
    }

    public function show(Section $section)
    {
        // dd($section);
        $section->load('lessons');

        return Inertia::render('Sections/Show', compact('section'));
    }
}
