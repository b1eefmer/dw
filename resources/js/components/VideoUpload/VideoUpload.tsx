import React from 'react';
import { Button } from '../ui/button';

interface VideoUploadProps {
    onUploaded: (payload: { path: string; url: string }) => void;
}

export default function VideoUpload({ onUploaded }: VideoUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const upload = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('video', file);

            const res = await fetch('/upload/video', {
                method: 'POST',
                body: form,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Upload failed');
            }

            const json = await res.json(); 
            setPreviewUrl(json.url);
            onUploaded({ path: json.path, url: json.url });
        } catch (e: any) {
            setError('Upload error');
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        upload(file);
    };

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                hidden
                onChange={handleFileChange}
            />

            <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Choose video file'}
            </Button>

            {error && <div className="text-sm text-red-600">{error}</div>}

            {previewUrl && <video src={previewUrl} controls className="w-full rounded-lg mt-2" />}
        </div>
    );
}
