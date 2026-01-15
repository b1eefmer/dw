import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import EditorWrapper from '@/components/Editor/EditorWrapper';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { CssBaseline, Grid } from '@mui/material';
import LessonVideoFields from '@/components/LessonVideoFields/LessonVideoFields';

interface Lesson {
    id: number;
    title: string;
    description: string | null;
    type: 'text' | 'video';

    video_source: 'youtube' | 'upload' | null;
    video_url: string | null;
    video_path: string | null;

    content_json: string | null;
    content_html: string | null;
    content_text: string | null;
}

interface Props {
    lesson: Lesson;
}

export default function Edit({ lesson }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: lesson.title ?? '',
        description: lesson.description ?? '',
        type: lesson.type ?? 'text',

        video_source: (lesson.video_source ?? 'youtube') as 'youtube' | 'upload',
        video_url: lesson.video_url ?? '',
        video_path: lesson.video_path ?? '',

        content_json: lesson.content_json ?? '',
        content_html: lesson.content_html ?? '',
        content_text: lesson.content_text ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/lessons/${lesson.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Lessons', href: '/lessons' },
                { title: 'Edit lesson', href: `/lessons/${lesson.id}/edit` },
            ]}
        >
            <Head title="Edit lesson" />

            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <Terminal />
                            <AlertTitle>Errors</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div>
                        <Label>Lesson title</Label>
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>

                    <div>
                        <Label>Lesson type</Label>
                        <select
                            className="border rounded-md px-3 py-2 w-full"
                            value={data.type}
                            onChange={(e) => {
                                const t = e.target.value as 'text' | 'video';
                                setData('type', t);

                                if (t === 'text') {
                                    setData('video_url', '');
                                    setData('video_path', '');
                                }
                            }}
                        >
                            <option value="text">Text lesson</option>
                            <option value="video">Video lesson</option>
                        </select>
                    </div>

                    {data.type === 'text' && (
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <EditorWrapper
                                        initialJson={data.content_json}
                                        onChange={({ json, html, text }) => {
                                            setData('content_json', json);
                                            setData('content_html', html);
                                            setData('content_text', text);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    )}

                    {data.type === 'video' && (
                        <LessonVideoFields
                            video_source={data.video_source}
                            video_url={data.video_url}
                            video_path={data.video_path}
                            onChangeSource={(v) => setData('video_source', v)}
                            onChangeUrl={(v) => setData('video_url', v)}
                            onUploaded={(path) => setData('video_path', path)}
                            onClearUpload={() => setData('video_path', '')}
                            onClearYoutube={() => setData('video_url', '')}
                        />
                    )}

                    <Button type="submit" disabled={processing}>
                        Update lesson
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
