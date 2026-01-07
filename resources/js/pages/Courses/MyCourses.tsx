import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
}

interface PageProps {
    courses: Course[];
}

export default function MyCourses() {
    const { courses, flash } = usePage().props as PageProps;

    const { delete: destroy, processing } = useForm({});

    const handleUnenroll = (courseId: number) => {
        if (!confirm('Are you sure?')) return;

        destroy(`/courses/${courseId}/enroll`);
    };


    return (
        <AppLayout breadcrumbs={[{ title: 'My Courses', href: '/my-courses' }]}>
            <Head title="My Courses" />

            <h1 className="text-2xl font-bold mb-4">My courses</h1>

            <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 && (
                    <p className="text-gray-600">No enroll yet</p>
                )}

                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="border rounded-lg p-4 bg-white shadow hover:shadow-xl transition"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            <Link href={`/courses/${course.id}/lessons/1`} className="hover:underline">
                                {course.title}
                            </Link>
                        </h3>

                        <p className="text-sm text-gray-700 mb-3">{course.description}</p>

                        <Button
                            variant="destructive"
                            disabled={processing}
                            onClick={() => handleUnenroll(course.id)}
                        >
                            Unenroll
                        </Button>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}