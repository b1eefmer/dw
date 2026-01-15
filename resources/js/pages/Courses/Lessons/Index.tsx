import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { BookCheck } from 'lucide-react';


interface Lesson {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
}

interface PageProps {
    course: {
        id: number;
        title: string;
    };
    lessons: Lesson[];
}

export default function CourseLessons({ course, lessons }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Courses', href: '/index' },
        { title: course.title, href: `/courses/${course.id}/lessons` },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    {course.title}
                </h1>
                {lessons.length === 0 ? (
                    <div className="rounded-md border p-4 text-sm text-muted-foreground">
                        No lessons yet.
                    </div>
                ) : (
                    <>
                        <ul className="space-y-2">
                            {lessons.map(lesson => (
                                <li
                                    key={lesson.id}
                                >
                                    <Link
                                        href={route('courses.lessons.show', [course.id, lesson.id])}
                                        className="block border p-4 rounded hover:bg-slate-50"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span>{lesson.title}</span>
                                            {lesson.is_completed && (
                                                <BookCheck
                                                    className="h-5 w-5 text-green-600"
                                                    aria-label="Lesson completed"
                                                    title="Lesson completed"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex">
                            <Link
                                href={route('courses.continue', course.id)}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Continue
                            </Link>
                        </div></>
                )}
            </div>
        </AppLayout >
    );
}
