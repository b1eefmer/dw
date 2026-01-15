import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import React from 'react';
import { route } from 'ziggy-js';
import { BookCheck } from 'lucide-react';

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

interface LessonNavItem {
    id: number;
    title: string;
    url: string;
}

interface Progress {
    position_seconds: number;
    is_completed: boolean;
}

interface PageProps {
    course: {
        id: number;
        title: string;
    };
    lesson: Lesson;
    videoKind: VideoKind | null;
    videoSrc: string | null;
    progress: Progress | null;
    navigation: {
        previous: LessonNavItem | null;
        next: LessonNavItem | null;
    };
}

export default function Show() {
    const { course, lesson, videoKind, videoSrc, progress, navigation } = usePage<PageProps>().props;
    //const { lesson, navigation } = usePage<PageProps>().props;

    // const [textCompleted, setTextCompleted] = React.useState<boolean>(progress?.is_completed ?? false);
    const [isCompleted, setIsCompleted] = React.useState<boolean>(progress?.is_completed ?? false);


    React.useEffect(() => {
        setIsCompleted(progress?.is_completed ?? false);
    }, [progress?.is_completed]);
    
    console.log('navigation:', navigation);
    const markTextLesson = async (completed: boolean) => {
        const res = await fetch(route('lessons.progress.update', lesson.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN':
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
            body: JSON.stringify({
                position_seconds: 0,
                duration_seconds: null,
                is_completed: completed,
            }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        return json.progress as Progress | null;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Courses', href: '/index' },
        { title: course.title, href: `/courses/${course.id}/lessons` },
        { title: lesson.title, href: `/lessons/${lesson.id}` },
    ];



    const saveProgress = async (positionSeconds: number, durationSeconds?: number, ended?: boolean) => {
        const res = await fetch(route('lessons.progress.update', lesson.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
            body: JSON.stringify({
                position_seconds: positionSeconds,
                duration_seconds: durationSeconds,
                is_completed: ended || (positionSeconds / (durationSeconds || 1) >= 0.9) ? true : false,
            }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        return json.progress as Progress | null;
    };

    const lastSentRef = React.useRef(0);
    const handleProgress = async (p: { positionSeconds: number; durationSeconds?: number; ended?: boolean }) => {
        const now = Date.now();
        const shouldSend = p.ended || (now - lastSentRef.current > 5000);
        if (!shouldSend) return;

        lastSentRef.current = now; 
        
        try {
            const updated = await saveProgress(p.positionSeconds, p.durationSeconds, p.ended);
            if (updated) {
                setIsCompleted(updated.is_completed);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />

            <div className="w-8/12 p-4 space-y-6">
                <h1 className="text-2xl font-semibold">{lesson.title}</h1>

                {lesson.type === 'video' && (
                    <div className="space-y-2">
                        {isCompleted && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <BookCheck className="h-5 w-5" />
                                <span>Lesson completed</span>
                            </div>
                        )}
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
                    <>

                        <div className="prose max-w-none rounded-md border p-4">
                            {lesson.content_html ? (
                                <div dangerouslySetInnerHTML={{ __html: lesson.content_html }} />
                            ) : (
                                <p className="text-sm text-muted-foreground">No content yet.</p>
                            )}
                        </div>
                        <hr className="my-6" />
                        <div className="space-y-2">

                            {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}
                        </div>
                        <div className="not-prose flex items-center gap-3">
                            <input
                                id="lesson-completed"
                                type="checkbox"
                                checked={isCompleted}
                                onChange={async (e) => {
                                    const next = e.target.checked;
                                    setIsCompleted(next);
                                    try {
                                        const updated = await markTextLesson(next);
                                        if (updated) {
                                            setIsCompleted(updated.is_completed);
                                        }
                                    } catch (err) {
                                        setIsCompleted(!next);
                                        console.error(err);
                                        alert('Failed to save progress. Please try again.');
                                    }
                                }}
                            />
                            <label htmlFor="lesson-completed" className="text-sm">
                                Mark lesson as completed
                            </label>

                            {isCompleted && <BookCheck className="h-5 w-5 text-green-600" />}
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center justify-between pt-8">
                {navigation.previous ? (
                    <Link
                        href={navigation.previous.url}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                    >
                        {navigation.previous.title}
                    </Link>
                ) : (
                    <div />
                )}

                {navigation.next && (
                    <Link
                        href={navigation.next.url}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                    >
                        {navigation.next.title}
                    </Link>
                )}
            </div>
        </AppLayout>
    );
}
