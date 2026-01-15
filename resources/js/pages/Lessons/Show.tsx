import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import React from 'react';
import { route } from 'ziggy-js';


type VideoKind = 'youtube' | 'file';

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    description: string | null;
    type: 'text' | 'video';
    content_html: string | null;

    video_url?: string | null;
    video_path?: string | null;
    video_source?: 'youtube' | 'upload' | null;
}

interface Progress {
    position_seconds: number;
    is_completed: boolean;
}

interface PageProps {
    lesson: Lesson;
    videoKind: VideoKind | null;
    videoSrc: string | null;
    progress: Progress | null;
}

export default function Show() {
    const { lesson, videoKind, videoSrc, progress } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Sections', href: '/sections' },
        { title: `Section ${lesson.section_id}`, href: `/sections/${lesson.section_id}` },
        { title: lesson.title, href: `/lessons/${lesson.id}` },
    ];

    const saveProgress = async (positionSeconds: number, durationSeconds?: number, ended?: boolean) => {
        await fetch(route('lessons.progress.update', lesson.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
            body: JSON.stringify({
                position_seconds: positionSeconds,
                duration_seconds: durationSeconds,
                is_completed: ended ? true : false,
            }),
        });
    };

    const lastSentRef = React.useRef(0);
    const handleProgress = (p: { positionSeconds: number; durationSeconds?: number; ended?: boolean }) => {
        const now = Date.now();
        const shouldSend = p.ended || (now - lastSentRef.current > 5000);
        if (!shouldSend) return;

        lastSentRef.current = now;
        saveProgress(p.positionSeconds, p.durationSeconds, p.ended);
    };

    console.log('progress from server:', progress?.position_seconds);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />

            <div className="w-8/12 p-4 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">{lesson.title}</h1>
                    {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}

                    <div className="flex gap-2">
                        <Link className="text-sm underline" href={`/lessons/${lesson.section_id}/create`}>
                            + Add lesson
                        </Link>
                        <span className="text-sm text-muted-foreground">•</span>
                        <Link className="text-sm underline" href={`/lessons/${lesson.id}/edit`}>
                            Edit
                        </Link>
                    </div>
                </div>

                {lesson.type === 'video' && (
                    <div className="space-y-2">
                        {videoKind && videoSrc ? (
                            <VideoPlayer
                                key={`${lesson.id}-${videoSrc ?? ''}`}
                                kind={videoKind}
                                src={videoSrc}
                                title={lesson.title}
                                startAtSeconds={progress?.position_seconds ?? 0}
                                onProgress={handleProgress}
                            />
                        ) : (
                            <div className="rounded-md border p-4 text-sm">
                                Video is missing.
                            </div>
                        )}
                    </div>
                )}

                {lesson.type === 'text' && (
                    <div className="prose max-w-none rounded-md border p-4">
                        {lesson.content_html ? (
                            <div dangerouslySetInnerHTML={{ __html: lesson.content_html }} />
                        ) : (
                            <p className="text-sm text-muted-foreground">No content yet.</p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
