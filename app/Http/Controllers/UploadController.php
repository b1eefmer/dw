<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function image(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB
        ]);

        $path = $request->file('image')->store('lesson-images', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'path' => $path,
        ]);
    }

    public function video(Request $request)
    {
        $request->validate([
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/ogg', 'max:51200'], // 50MB
        ]);

        $path = $request->file('video')->store('lesson-videos', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
        ]);
    }
}
