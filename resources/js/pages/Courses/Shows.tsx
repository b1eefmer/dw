import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    slug: string;
    description?: string;
    order?: number;
}

interface Section {
    id: number;
    course_id: number;
    title: string;
    description?: string;
    lessons: Lesson[];
}

interface Course {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
    sections: Section[];
}

interface PageProps {
    flash: {
        message?: string;
    };
    course: Course;
}

export default function Show() {
    const { course, flash } = usePage().props as PageProps;
    const { processing } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: course.title,
            href: `/courses/${course.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="m-4 space-y-4">
                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">{course.title}</h1>
                            <div className="space-x-2">
                                <Link href="/courses">
                                    <Button variant="outline">Back to list</Button>
                                </Link>
                                <Link href={`/courses/${course.id}/edit`}>
                                    <Button
                                        disabled={processing}
                                        className="bg-slate-600 hover:bg-slate-700 text-white"
                                    >
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold">ID:</span> {course.id}
                            </div>
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold">User ID:</span> {course.user_id}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-600">Slug</div>
                                <div className="text-sm">{course.slug}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-600">Description</div>
                                <p className="text-sm whitespace-pre-line">
                                    {course.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <aside className="w-full lg:w-[420px] border rounded-lg p-4 bg-slate-900/40">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-white">
                                Sections & Lessons
                            </h2>
                            <Link href={`/sections/${course.id}/create`}>
                            </Link>
                        </div>

                        {course.sections.length === 0 && (
                            <div className="text-sm text-slate-400">
                                This course has no sections yet.
                            </div>
                        )}

                        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                            {course.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="rounded-md bg-slate-800/80 p-3 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-white">
                                                {section.title}
                                            </div>
                                            {section.description && (
                                                <div className="text-xs text-slate-300">
                                                    {section.description}
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/sections/${section.id}`}>
                                            <Button size="xs" variant="outline">
                                                Open
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="space-y-1 mt-2">
                                        {section.lessons.length === 0 && (
                                            <div className="text-xs text-slate-400">
                                                No lessons in this section.
                                            </div>
                                        )}

                                        {section.lessons.map((lesson) => (
                                            <Link
                                                key={lesson.id}
                                                href={`/lessons/${lesson.id}`}
                                                className="block rounded px-2 py-1 text-xs bg-slate-900/70 hover:bg-slate-700 text-slate-100 transition"
                                            >
                                                <div className="font-medium truncate">
                                                    {lesson.title}
                                                </div>
                                                {lesson.description && (
                                                    <div className="text-[10px] text-slate-300 truncate">
                                                        {lesson.description}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
