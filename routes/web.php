<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\CourseLessonController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\MyCoursesController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/courses', [CourseController::class, 'index'])->middleware('teacher')->name('courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->middleware('teacher')->name('courses.store');
    Route::get('/courses/create', [CourseController::class, 'create'])->middleware('teacher')->name('courses.create');
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->middleware('teacher')->name('courses.edit');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->middleware('teacher')->name('courses.update');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->middleware('teacher')->name('courses.destroy');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->middleware('teacher')->name('courses.show');
    // Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');

    Route::get('/lessons/{section}/create', [LessonController::class, 'create'])->middleware('teacher')->name('lessons.create');
    Route::get('/lessons', [LessonController::class, 'index'])->middleware('teacher')->name('lessons.index');
    Route::post('/lessons', [LessonController::class, 'store'])->middleware('teacher')->name('lessons.store');
    Route::get('/lessons/{lesson}/edit', [LessonController::class, 'edit'])->middleware('teacher')->name('lessons.edit');
    Route::put('/lessons/{lesson}', [LessonController::class, 'update'])->middleware('teacher')->name('lessons.update');
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->middleware('teacher')->name('lessons.destroy');

    Route::post('/sections', [SectionController::class, 'store'])->middleware('teacher')->name('sections.store');
    Route::get('/sections/{course}/create', [SectionController::class, 'create'])->middleware('teacher')->name('sections.create');
    Route::delete('/sections/{section}', [SectionController::class, 'destroy'])->middleware('teacher')->name('sections.destroy');
    Route::get('/sections/{section}/edit', [SectionController::class, 'edit'])->middleware('teacher')->name('sections.edit');
    Route::put('/sections/{section}', [SectionController::class, 'update'])->middleware('teacher')->name('sections.update');
    Route::get('/sections/{section}', [SectionController::class, 'show'])->middleware('teacher')->name('sections.show');

    Route::get('index', [CourseController::class, 'grid'])->name('courses.grid');
    Route::get('courses/{course}/lessons', [CourseController::class, 'shows'])->middleware('teacher')->name('courses.shows');

    Route::post('/courses/{course}/enroll', [CourseEnrollmentController::class, 'store']);
    Route::delete('/courses/{course}/enroll', [CourseEnrollmentController::class, 'destroy']);
    Route::get('/my-courses', [MyCoursesController::class, 'index'])->name('my-courses');

    Route::post('/uploads/images', [UploadController::class, 'image']);
    Route::post('/uploads/videos', [UploadController::class, 'video']);

    Route::get('/lessons/{lesson}/preview', [LessonController::class, 'show'])->middleware('teacher')->name('lessons.show');

    Route::get('/courses/{course}/lessons', [CourseLessonController::class, 'index'])
        ->name('courses.lessons.index');
    Route::get('/courses/{course}/lessons/{lesson:order}', [CourseLessonController::class, 'show'])
        ->name('courses.lessons.show');

    Route::patch('lessons/{lesson}/progress', [LessonProgressController::class, 'update'])->name('lessons.progress.update');;
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
