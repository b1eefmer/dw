<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SectionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    // Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');

    Route::get('/lessons/{section}/create', [LessonController::class, 'create'])->name('lessons.create');
    Route::get('/lessons', [LessonController::class, 'index'])->name('lessons.index');
    Route::post('/lessons', [LessonController::class, 'store'])->name('lessons.store');
    Route::get('/lessons/{lesson}/edit', [LessonController::class, 'edit'])->name('lessons.edit');
    Route::put('/lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');

    Route::post('/sections', [SectionController::class, 'store'])->name('sections.store');
    Route::get('/sections/{course}/create', [SectionController::class, 'create'])->name('sections.create');
    Route::delete('/sections/{section}', [SectionController::class, 'destroy'])->name('sections.destroy');
    Route::get('/sections/{section}/edit', [SectionController::class, 'edit'])->name('sections.edit');
    Route::put('/sections/{section}', [SectionController::class, 'update'])->name('sections.update');
    Route::get('/sections/{section}', [SectionController::class, 'show'])->name('sections.show');

    Route::get('index', [CourseController::class, 'grid'])->name('courses.grid');
    Route::get('courses/{course}/lessons', [CourseController::class, 'shows'])->name('courses.shows');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
