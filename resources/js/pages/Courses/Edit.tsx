import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    //slug: string;
    description: string;
}

interface Props {
    course: Course;
}

export default function Edit({ course }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: course.title,
        //slug: course.slug,
        description: course.description,
    });
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/courses/${course.id}`); //route('courses.update', course.id);
    }
    return (
        <AppLayout breadcrumbs={[{ title: 'Edit a course', href: `/courses/${course.id}/edit` }]}>
            <Head title="Update a course" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleUpdate} className='space-y-4'>
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <Terminal />
                            <AlertTitle>Errors!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className='gap-1.5'>
                        <Label htmlFor="title">Course Title</Label>
                        <Input placeholder='Title' value={data.title} onChange={(e) => setData('title', e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="description">Course Description</Label>
                        <Textarea placeholder='Description' value={data.description} onChange={(e) => setData('description', e.target.value)}></Textarea>
                    </div>
                    <Button type="submit" className='mt-4'>Update Course</Button>
                </form>
            </div>
        </AppLayout>
    );
}
