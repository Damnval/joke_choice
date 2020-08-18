<?php

use App\Models\SharedJob;
use App\Models\Slug;
use Faker\Generator as Faker;

$factory->define(SharedJob::class, function (Faker $faker) {
    $slugs = Slug::where('sluggable_type', 'User')->pluck('id');

    return [
    	'slug_id'     => $faker->randomElement($slugs),
        'href'	      => $faker->url,
    ];
});
