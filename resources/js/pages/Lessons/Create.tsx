import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import EditorWrapper from '@/components/Editor/EditorWrapper';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme'
import { CssBaseline, Typography, Grid } from '@mui/material';


interface PageProps {
    sectionId: number;
}

export default function Index() {
    const { sectionId } = usePage().props as PageProps;
    const { data, setData, post, processing, errors } = useForm({
        section_id: sectionId,
        title: '',
        description: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lessons');
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create a new lesson for section ',
            href: `/lesson/${sectionId}/create`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Creare a new section" />
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
                        <Label htmlFor="title">Section Title</Label>
                        <Input placeholder='Title' value={data.title} onChange={(e) => setData('title', e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="description">Section Description</Label>
                        <Textarea placeholder='Description' value={data.description} onChange={(e) => setData('description', e.target.value)}></Textarea>
                    </div>
                    <div className='gap-1.5'>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Grid container>
                                <Grid item>
                                    <Typography variant='h4'>Lexical Editor App</Typography>
                                </Grid>
                                <Grid item xs={9} sx={{width: "100%", mt: 5}}>
                                    <EditorWrapper />
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    </div>
                    <Button type="submit" className='mt-4'>Create Section</Button>
                </form>
            </div>
        </AppLayout>
    );
}
