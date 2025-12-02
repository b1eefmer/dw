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
        title: 'Lessons',
        href: '/lessons',
    },
];

interface Lesson {
    id: number;
    section_id: number;
    title: string;
    slug: string;
    description: string;
}

interface PageProps {
    flash: {
        message?: string;
    },
    lessons: Lesson[];
}

export default function Index() {
    const { lessons, flash } = usePage().props as PageProps;

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the lesson: ${id}, ${title}?`)) {
            destroy(`/lessons/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lessons" />
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
            {lessons.length > 0 && (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your all lessons.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>Section ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lessons.map((lesson) => (
                                <TableRow>
                                    <TableCell className="font-medium">{lesson.id}</TableCell>
                                    <TableCell><Link href={`sections/${lesson.section_id}`}>{lesson.section_id}</Link></TableCell>
                                    <TableCell>{lesson.title}</TableCell>
                                    <TableCell>{lesson.slug}</TableCell>
                                    <TableCell>{lesson.description}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={`/lessons/${lesson.id}/edit`}><Button disabled={processing} className='bg-slate-600 hover:bg-slate-700 text-white'>Edit</Button></Link>
                                        <Button disabled={processing} onClick={() => handleDelete(lesson.id, lesson.title)} className='bg-red-500 hover:bg-red-700 text-white'>Delete</Button>
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
