<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Section;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function index()
    {
        $lessons = auth()->user()
            ->courses()
            ->with('sections.lessons')
            ->get()
            ->pluck('sections')
            ->flatten()
            ->pluck('lessons')
            ->flatten();

        return Inertia::render('Lessons/Index', compact('lessons'));
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

            'video_source' => ['nullable', Rule::in(['youtube', 'upload'])],

            'video_url' => [
                'nullable',
                'url',
                Rule::requiredIf(
                    fn () => $request->input('type') === 'video' &&
                        $request->input('video_source', 'youtube') === 'youtube'
                ),
            ],

            'video_path' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    fn () => $request->input('type') === 'video' &&
                        $request->input('video_source') === 'upload'
                ),
            ],

            'content_json' => ['nullable', 'string', 'required_if:type,text'],
            'content_html' => ['nullable', 'string', 'required_if:type,text'],
            'content_text' => ['nullable', 'string'],
        ]);

        $data['slug'] = SlugService::uniqueSlug($data['title'], Lesson::class);

        if ($data['type'] === 'video') {
            $data['content_json'] = null;
            $data['content_html'] = null;
            $data['content_text'] = null;
            $data['video_source'] = $data['video_source'] ?? 'youtube';

            if ($data['video_source'] === 'youtube') {
                $data['video_path'] = null;
            } else {
                $data['video_url'] = null;
            }
        } else {
            $data['video_source'] = null;
            $data['video_url'] = null;
            $data['video_path'] = null;
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

            'video_source' => ['nullable', Rule::in(['youtube', 'upload'])],

            'video_url' => [
                'nullable',
                'url',
                Rule::requiredIf(
                    fn () => $request->input('type') === 'video'
                        && $request->input('video_source', $lesson->video_source ?? 'youtube') === 'youtube'
                ),
            ],

            'video_path' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    fn () => $request->input('type') === 'video'
                        && $request->input('video_source', $lesson->video_source) === 'upload'
                ),
            ],

            'content_json' => ['nullable', 'string', 'required_if:type,text'],
            'content_html' => ['nullable', 'string', 'required_if:type,text'],
            'content_text' => ['nullable', 'string'],
        ]);

        $data['slug'] = SlugService::uniqueSlug($data['title'], Lesson::class, $lesson->id ?? null);
        if ($data['type'] === 'video') {
            $data['content_json'] = null;
            $data['content_html'] = null;
            $data['content_text'] = null;

            $data['video_source'] = $data['video_source'] ?? ($lesson->video_source ?? 'youtube');

            if ($data['video_source'] === 'youtube') {
                $data['video_path'] = null;
            } else {
                $data['video_url'] = null;
            }
        } else {
            $data['video_source'] = null;
            $data['video_url'] = null;
            $data['video_path'] = null;
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
        $videoKind = null;
        $videoSrc = null;
        $progress = null;

        if ($lesson->type === 'video') {
            if ($lesson->video_source === 'upload' && $lesson->video_path) {
                $videoKind = 'file';
                $videoSrc = Storage::disk('public')->url($lesson->video_path);
            } elseif ($lesson->video_source === 'youtube' && $lesson->video_url) {
                $videoKind = 'youtube';
                $videoSrc = $lesson->video_url;
            }
            if (auth()->check()) {
                $progress = \DB::table('lesson_progress')
                    ->where('user_id', auth()->id())
                    ->where('lesson_id', $lesson->id)
                    ->first();
            }
        }

        return Inertia::render('Lessons/Show', [
            'lesson' => $lesson,
            'progress' => $progress ? [
                'position_seconds' => $progress->position_seconds,
                'is_completed' => (bool) $progress->is_completed,
            ] : null,
            'videoKind' => $videoKind,
            'videoSrc' => $videoSrc,
        ]);
    }
}
