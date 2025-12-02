import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

interface Course {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
}

interface PageProps {
    flash: {
        message?: string;
    },
    courses: Course[];
}

export default function Index() {
    const { courses, flash } = usePage().props as PageProps;

    const { processing, delete: destroy } = useForm();


    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the course: ${id}, ${title}?`)) {
            destroy(`/courses/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className='m-4'>
                <Link href="/courses/create"><Button>Create a course</Button></Link>
            </div>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone />
                            <AlertTitle>Notification!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {courses.length > 0 && (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent courses.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>User id</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow>
                                    <TableCell className="font-medium"><Link href={`/courses/${course.id}`}>{course.id}</Link></TableCell>
                                    <TableCell>{course.user_id}</TableCell>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.slug}</TableCell>
                                    <TableCell>{course.description}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={`/courses/${course.id}/edit`}><Button disabled={processing} className='bg-slate-600 hover:bg-slate-700 text-white'>Edit</Button></Link>
                                        <Button disabled={processing} onClick={() => handleDelete(course.id, course.title)} className='bg-red-500 hover:bg-red-700 text-white'>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
