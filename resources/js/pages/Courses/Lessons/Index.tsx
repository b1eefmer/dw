interface Lesson {
    id: number;
    title: string;
    description?: string;
}

interface PageProps {
    course: {
        id: number;
        title: string;
    };
    lessons: Lesson[];
}

export default function CourseLessons({ course, lessons }: PageProps) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Lessons for: {course.title}
            </h1>

            <ul className="space-y-2">
                {lessons.map(lesson => (
                    <li
                        key={lesson.id}
                        className="border p-4 rounded hover:bg-slate-50"
                    >
                        {lesson.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
