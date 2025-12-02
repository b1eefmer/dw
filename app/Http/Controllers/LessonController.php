<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Section;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function index()
    {
        // $lessons = Lesson::all();

        $lessons = auth()->user()
            ->courses()
            ->with('sections.lessons')
            ->get()
            ->pluck('sections')
            ->flatten()
            ->pluck('lessons')
            ->flatten();

        return Inertia::render('Lessons/Index', compact('lessons'));
        // return Inertia::render('Lessons/Index', []);
    }

    public function create($sectionId)
    {
        return inertia('Lessons/Create', ['sectionId' => $sectionId]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'section_id' => 'required|exists:sections,id',
        ]);

        $data['slug'] = SlugService::uniqueSlug($data['title'], Lesson::class);

        Lesson::create($data);

        $section = Section::findOrFail($data['section_id']);

        return redirect()->route('sections.show', $section)->with('message', 'Lesson created successfully.');
    }

    public function edit(Lesson $lesson)
    {
        return Inertia::render('Lessons/Edit', compact('lesson'));
    }

    public function update(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $lesson->update([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']),
            'description' => $data['description'],
        ]);

        $section = $lesson->section;

        return redirect()->route('sections.show', $section)->with('message', 'Lesson updated successfully.');

    }

    public function destroy(Lesson $lesson)
    {
        $section = $lesson->section;
        $lesson->delete();

        return redirect()->route('sections.show', $section)->with('message', 'Lesson deleted successfully.');
    }

    
}
