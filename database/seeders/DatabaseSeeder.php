<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Section;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user1 = User::firstOrCreate(
            ['email' => 'yevheniilukianenko@gmail.com'],
            [
                'name' => 'Yevhenii Lukianenko',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user2 = User::firstOrCreate(
            ['email' => 'teacher@gmail.com'],
            [
                'name' => 'Teacher',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        Course::factory(50)->create([
            'user_id' => $user->id,
        ]);
        Course::factory(50)->create([
            'user_id' => $user1->id,
        ]);
        Course::factory(50)->create([
            'user_id' => $user2->id,
        ]);

        Section::factory(10)->create([
            'course_id' => Course::all()->first()->id,
        ]);

        // Lesson::factory(10)->create([
        //     'section_id' => Section::all()->first()->id,
        // ]);
    }
}
