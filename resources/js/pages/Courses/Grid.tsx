import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { route } from 'ziggy-js';

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
    enrolledCourseIds: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

export default function CourseGrid() {
    const { courses, flash, enrolledCourseIds } = usePage().props as PageProps;
    const { processing, delete: destroy, post } = useForm();

    const handleEnroll = (id: number) => {
        post(`/courses/${id}/enroll`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['enrolledCourseIds', 'courses', 'flash'] });
            },
        });
    };

    const handleUnenroll = (courseId: number) => {
        if (!confirm('Are you sure?')) return;

        destroy(`/courses/${courseId}/enroll`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['enrolledCourseIds', 'courses', 'flash'] });
            },
        });
    };

    const isEnrolled = (id: number) => {
        return Array.isArray(enrolledCourseIds) && enrolledCourseIds.includes(id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses Grid" />

            {flash.message && (
                <div className="m-4 ">
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
                            <Link href={
                                isEnrolled(course.id)
                                    ? route('courses.continue', course.id)
                                    : route('courses.lessons.index', course.id)
                            } className="hover:underline">
                                {course.title}
                            </Link>
                        </h3>

                        <p className="text-sm text-slate-900 mb-3">{course.description}</p>
                        <div className="flex gap-2 mt-4">
                            {isEnrolled(course.id) ? (
                                <>
                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        onClick={() => handleUnenroll(course.id)}
                                    >
                                        Unenroll
                                    </Button>
                                </>
                            ) : (

                                <Button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => handleEnroll(course.id)}
                                >
                                    Enroll
                                </Button>


                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
