<?php

namespace Database\Factories;

use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_id' => Section::factory(),
            'title' => $this->faker->sentence(1),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->sentence(2),
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
