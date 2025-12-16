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
import { CssBaseline, Grid, Typography } from '@mui/material';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';

interface Lesson {
    id: number;
    title: string;
    description: string | null;
    type: 'text' | 'video';
    video_url: string | null;
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
        video_url: lesson.video_url ?? '',

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

                    {/* TITLE */}
                    <div>
                        <Label>Lesson title</Label>
                        <Input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <Label>Lesson type</Label>
                        <select
                            className="border rounded-md px-3 py-2 w-full"
                            value={data.type}
                            onChange={(e) =>
                                setData('type', e.target.value as 'text' | 'video')
                            }
                        >
                            <option value="text">Text lesson</option>
                            <option value="video">Video lesson</option>
                        </select>
                    </div>

                    {/* TEXT LESSON */}
                    {data.type === 'text' && (
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Grid container spacing={2}>
                                {/* <Grid item>
                                    <Typography variant="h5">Lesson content</Typography>
                                </Grid> */}

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

                    {/* VIDEO LESSON */}
                    {data.type === 'video' && (
                        <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input
                                placeholder="https://www.youtube.com/..."
                                value={data.video_url}
                                onChange={(e) => setData('video_url', e.target.value)}
                            />

                            {data.video_url && (
                                <VideoPlayer
                                    src={data.video_url}
                                    poster={undefined}
                                    title="Video preview"
                                />
                            )}
                        </div>
                    )}

                    <Button type="submit" disabled={processing}>
                        Update lesson
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
