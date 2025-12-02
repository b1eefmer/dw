import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a new course',
        href: '/courses/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/courses');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Creare a new course" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleSubmit} className='space-y-4'>
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
                    <Button type="submit" className='mt-4'>Create Course</Button>
                </form>
            </div>
        </AppLayout>
    );
}
