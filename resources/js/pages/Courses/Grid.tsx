import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

interface Course {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
}

interface PageProps {
    flash: { message?: string };
    courses: Course[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

export default function CourseGrid() {
    const { courses, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the course: ${id}, ${title}?`)) {
            destroy(`/courses/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses Grid" />

            {flash.message && (
                <div className="m-4">
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="border rounded-lg p-4 bg-white text-black shadow hover:shadow-xl transition"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            <Link href={`/courses/${course.id}/lessons`} className="hover:underline">
                                {course.title}
                            </Link>
                        </h3>

                        <p className="text-sm text-slate-900 mb-3">{course.description}</p>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
