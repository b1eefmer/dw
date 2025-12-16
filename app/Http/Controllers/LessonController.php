<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Section;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'type' => 'required|in:video,text',
            'video_url' => ['nullable', 'url', 'required_if:type,video'],

            'content_json' => ['nullable', 'string', 'required_if:type,text'],
            'content_html' => ['nullable', 'string', 'required_if:type,text'],
            'content_text' => ['nullable', 'string'],
        ]);

        $data['slug'] = SlugService::uniqueSlug($data['title'], Lesson::class);

        if ($data['type'] === 'video') {
            $data['content_json'] = null;
            $data['content_html'] = null;
            $data['content_text'] = null;
        }

        if ($data['type'] === 'text') {
            $data['video_url'] = null;
        }

        $section = Section::query()->select(['id', 'course_id'])->findOrFail($data['section_id']);

        $data['course_id'] = $section->course_id;

        $data['order'] = Lesson::where('section_id', $section->id)->max('order') + 1;
        // dd($data);

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
            'type' => ['required', Rule::in(['text', 'video'])],

            'video_url' => ['nullable', 'url', 'required_if:type,video'],

            'content_json' => ['nullable', 'string', 'required_if:type,text'],
            'content_html' => ['nullable', 'string', 'required_if:type,text'],
            'content_text' => ['nullable', 'string'],
        ]);
        $data['slug'] = SlugService::uniqueSlug($data['title'], Lesson::class, $lesson->id ?? null);
        if ($data['type'] === 'video') {
            $data['content_json'] = null;
            $data['content_html'] = null;
            $data['content_text'] = null;
        }

        if ($data['type'] === 'text') {
            $data['video_url'] = null;
        }

        $lesson->update($data);

        $section = $lesson->section;

        return redirect()->route('sections.show', $section)->with('message', 'Lesson updated successfully.');

    }

    public function destroy(Lesson $lesson)
    {
        $section = $lesson->section;
        $lesson->delete();

        return redirect()->route('sections.show', $section)->with('message', 'Lesson deleted successfully.');
    }

    public function show(Lesson $lesson)
    {
        return Inertia::render('Lessons/Show', compact('lesson'));
    }
}
