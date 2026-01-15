import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Section {
    id: number;
    course_id: number;
    title: string;
    description?: string;
    order: number;
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
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the section: ${id}, ${title}?`)) {
            destroy(`/sections/${id}`);
        }
    };

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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{course.title}</h1>
                    <div className="space-x-2">
                        <Link href="/courses">
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
                <h2 className="text-white">Sections</h2>
                <Table>
                    <TableCaption>A list of your recent courses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {course.sections.map(section => (
                            <TableRow>
                                <TableCell>{section.title}</TableCell>
                                <TableCell>{section.description?.length && section.description.length > 50
                                    ? section.description.slice(0, 50) + "…"
                                    : section.description}</TableCell>
                                <TableCell>{section.order}</TableCell>
                                <TableCell className="text-center space-x-2">
                                    <Link href={`/sections/${section.id}`}><Button disabled={processing} className='bg-blue-500 hover:bg-blue-700 text-white'>Section info</Button></Link>
                                    <Link href={`/sections/${section.id}/edit`}><Button disabled={processing} className='bg-slate-600 hover:bg-slate-700 text-white'>Edit</Button></Link>
                                    <Button disabled={processing} onClick={() => handleDelete(section.id, section.title)} className='bg-red-500 hover:bg-red-700 text-white'>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <Link href={`/sections/${course.id}/create`}><Button>Create a section</Button></Link>
            </div>
        </AppLayout>
    );
}
