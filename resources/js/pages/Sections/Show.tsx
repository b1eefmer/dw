import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    slug: string;
    description?: string;
    order: number;
}

interface Section {
    id: number;
    course_id: number;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface PageProps {
    flash: {
        message?: string;
    };
    section: Section;
}

export default function Show() {
    const { section, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the lesson: ${id}, ${title}?`)) {
            destroy(`/lessons/${id}`);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: section.course.title,
            href: `/courses/${section.course_id}`,
        },
        {
            title: section.title,
            href: `/sections/${section.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={section.title} />

            <div className="m-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{section.title}</h1>
                    <div className="space-x-2">
                        <Link href={`/courses/${section.course_id}`}>
                            <Button variant="outline">Back to list</Button>
                        </Link>
                    </div>
                </div>

                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <div className="rounded-lg border p-4 space-y-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-600">Description</div>
                        <p className="text-sm whitespace-pre-line">
                            {section.description}
                        </p>
                    </div>
                </div>
                <h2 className="text-white">Lessons</h2>
                <Table>
                    <TableCaption>A list of your recent courses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {section.lessons.map(lesson => (
                            <TableRow>
                                <TableCell>{lesson.title}</TableCell>
                                <TableCell>{lesson.slug}</TableCell>
                                <TableCell>{lesson.description?.length && lesson.description.length > 50
                                    ? lesson.description.slice(0, 50) + "…"
                                    : lesson.description}</TableCell>
                                <TableCell>{lesson.order}</TableCell>
                                <TableCell className="text-center space-x-2">
                                    <Link href={`/lessons/${lesson.id}/preview`}><Button disabled={processing} className='bg-blue-500 hover:bg-blue-700 text-white'>Show</Button></Link>
                                    <Link href={`/lessons/${lesson.id}/edit`}><Button disabled={processing} className='bg-slate-600 hover:bg-slate-700 text-white'>Edit</Button></Link>
                                    <Button disabled={processing} onClick={() => handleDelete(lesson.id, lesson.title)} className='bg-red-500 hover:bg-red-700 text-white'>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <Link href={`/lessons/${section.id}/create`}><Button>Create a lesson</Button></Link>
            </div>
        </AppLayout>
    );
}
