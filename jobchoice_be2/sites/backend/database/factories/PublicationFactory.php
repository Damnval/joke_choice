<?php

use Faker\Generator as Faker;
use App\Models\Publication  ;

$factory->define(Publication::class, function (Faker $faker) {
    return [
        'published_start_date' => $faker->dateTimeBetween('-1 years', '+1 month'),
        'published_end_date' => $faker->dateTimeBetween('+1 month', '+1 years'),
        'draft' => $faker->numberBetween(0, 1),
        'status' => $faker->randomElement([
    		'private',
            'published'
        ]),
    ];
});
