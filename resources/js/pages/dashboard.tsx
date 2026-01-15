import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { log } from 'console';
import { type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';


type User = {
    id: number;
    name: string;
    role?: string; // 'teacher' | 'student' | etc
};

type LoadState = "idle" | "loading" | "ready" | "error";

type DashboardProps = {
    user: User;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <p>
                        Welcome, {auth.user.name}
                    </p>
                    <br />
                    <p>Ready to learn something new? </p>
                    <br />
                    <Link href="/index" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Go to the courses page.</Link>
                </div>

                {auth.user.id <= 3 && (
                    <div>
                        <p>Teacher Panel</p>
                        <br />
                        <Link href="/courses" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Go to create some courses
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
