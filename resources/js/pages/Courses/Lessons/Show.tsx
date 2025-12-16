import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    description: string | null;
    type: 'text' | 'video';
    video_url: string | null;
    content_html: string | null;
}

interface LessonNavItem {
    id: number;
    title: string;
    url: string;
}

interface PageProps {
    lesson: Lesson;
    navigation: {
        previous: LessonNavItem | null;
        next: LessonNavItem | null;
    };
}


const isValidYoutubeUrl = (url: string) => {
    try {
        const parsed = new URL(url);

        // youtube.com/watch?v=...
        if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) return true;

        // youtu.be/<id>
        if (parsed.hostname === 'youtu.be' && parsed.pathname.length > 1) return true;

        return false;
    } catch {
        return false;
    }
};

export default function Show() {
    const { lesson, navigation } = usePage<PageProps>().props;

    console.log('navigation:', navigation);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Sections', href: '/sections' },
        { title: `Section ${lesson.section_id}`, href: `/sections/${lesson.section_id}` },
        { title: lesson.title, href: `/lessons/${lesson.id}` },
    ];

    const videoUrl = (lesson.video_url ?? '').trim();
    const canShowVideo = lesson.type === 'video' && videoUrl && isValidYoutubeUrl(videoUrl);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />

            <div className="w-8/12 p-4 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">{lesson.title}</h1>
                    {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}
                </div>

                {lesson.type === 'video' && (
                    <div className="space-y-2">
                        {canShowVideo ? (
                            <VideoPlayer src={videoUrl} poster={undefined} title={lesson.title} />
                        ) : (
                            <div className="rounded-md border p-4 text-sm">
                                Video link is missing or invalid.
                                {videoUrl ? (
                                    <>
                                        <div className="mt-2">
                                            Link: <a className="underline" href={videoUrl} target="_blank" rel="noreferrer">{videoUrl}</a>
                                        </div>
                                    </>
                                ) : null}
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
            <div className="flex items-center justify-between pt-8">
                {navigation.previous ? (
                    <Link
                        href={navigation.previous.url}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                    >
                        ← {navigation.previous.title}
                    </Link>
                ) : (
                    <div />
                )}

                {navigation.next && (
                    <Link
                        href={navigation.next.url}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                    >
                        {navigation.next.title} →
                    </Link>
                )}
            </div>
        </AppLayout>
    );
}
