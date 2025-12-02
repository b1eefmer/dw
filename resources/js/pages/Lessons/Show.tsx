import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    slug: string;
    description?: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    lesson: Lesson;      // текущий урок
    lessons: Lesson[];   // все уроки курса
}

export default function Show() {
    const { lesson, lessons, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Lessons',
            href: '/lessons',
        },
        {
            title: lesson.title,
            href: `/lessons/${lesson.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the lesson: ${lesson.id}, ${lesson.title}?`)) {
            destroy(`/lessons/${lesson.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />

            <div className="m-4 space-y-4">
                {/* Flash */}
                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Основной лейаут: слева контент урока, справа список уроков */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Левая часть – текущий урок */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">{lesson.title}</h1>
                            <div className="space-x-2">
                                <Link href="/lessons">
                                    <Button variant="outline">Back to lessons</Button>
                                </Link>
                                <Link href={`/lessons/${lesson.id}/edit`}>
                                    <Button
                                        disabled={processing}
                                        className="bg-slate-600 hover:bg-slate-700 text-white"
                                    >
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    disabled={processing}
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold">ID:</span> {lesson.id}
                            </div>
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold">Section ID:</span> {lesson.section_id}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-600">Slug</div>
                                <div className="text-sm">{lesson.slug}</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-600">Description</div>
                                <p className="text-sm whitespace-pre-line">
                                    {lesson.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть – список всех уроков курса */}
                    <aside className="w-full lg:w-80 border rounded-lg p-4 bg-slate-900/40">
                        <h2 className="text-lg font-semibold text-white mb-3">
                            Lessons of this course
                        </h2>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {lessons.map((item) => {
                                const isActive = item.id === lesson.id;

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/lessons/${item.id}`}
                                        className={`block rounded-md px-3 py-2 text-sm transition ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                                            }`}
                                    >
                                        <div className="font-medium truncate">{item.title}</div>
                                        {item.description && (
                                            <div className="text-xs text-slate-300 truncate">
                                                {item.description}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}

                            {lessons.length === 0 && (
                                <div className="text-sm text-slate-400">
                                    No lessons for this course yet.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
