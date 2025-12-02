<?php

namespace App\Services;

use Illuminate\Support\Str;

class SlugService
{
    public static function uniqueSlug($title, $model)
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while ($model::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }
}
