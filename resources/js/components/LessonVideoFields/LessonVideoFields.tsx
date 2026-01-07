import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';

type VideoSource = 'youtube' | 'upload';

type Props = {
    video_source: VideoSource;
    video_url: string;
    video_path: string;

    onChangeSource: (v: VideoSource) => void;
    onChangeUrl: (v: string) => void;
    onUploaded: (path: string) => void;

    onClearUpload: () => void;
    onClearYoutube: () => void;
};

export default function LessonVideoFields({
    video_source,
    video_url,
    video_path,
    onChangeSource,
    onChangeUrl,
    onUploaded,
    onClearUpload,
    onClearYoutube,
}: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleSourceChange = (next: VideoSource) => {
        onChangeSource(next);
        setError(null);

        if (next === 'youtube') {
            setPreviewUrl(null);
            onClearUpload();
        } else {
            onClearYoutube();
        }
    };

    const uploadVideo = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('video', file);

            const csrf =
                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)
                    ?.content ?? '';

            const res = await fetch('/uploads/videos', {
                method: 'POST',
                body: form,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Upload failed');
            }

            const json = (await res.json()) as { url: string; path: string };

            setPreviewUrl(json.url);
            onUploaded(json.path);
        } catch (e) {
            console.error(e);
            setError('Ошибка загрузки видео');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadVideo(file);
    };

    return (
        <div className="space-y-4">
            {/* source selector */}
            <div className="space-y-2">
                <Label>Video source</Label>
                <select
                    className="border rounded-md px-3 py-2 w-full"
                    value={video_source}
                    onChange={(e) => handleSourceChange(e.target.value as VideoSource)}
                >
                    <option value="youtube">YouTube</option>
                    <option value="upload">Upload from device</option>
                </select>
            </div>

            {/* YOUTUBE */}
            {video_source === 'youtube' && (
                <div className="space-y-2">
                    <Label htmlFor="video_url">YouTube URL</Label>
                    <Input
                        id="video_url"
                        type="url"
                        value={video_url}
                        onChange={(e) => onChangeUrl(e.target.value)}
                    />

                    {video_url && (
                        <VideoPlayer
                            kind="youtube"
                            src={video_url}
                            title="Lesson video"
                        />
                    )}
                </div>
            )}

            {/* UPLOAD */}
            {video_source === 'upload' && (
                <div className="space-y-2">
                    <Label>Upload video</Label>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        hidden
                        onChange={handleFileChange}
                    />

                    <Button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading…' : 'Choose video file'}
                    </Button>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    {(previewUrl || video_path) && (
                        <VideoPlayer
                            kind="file"
                            src={previewUrl ?? `/storage/${video_path}`}
                            title="Lesson video"
                        />
                    )}
                </div>
            )}
        </div>
    );
}
