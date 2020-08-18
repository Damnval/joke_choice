<?php

use Faker\Generator as Faker;
use App\Models\HatarakiKataResource;

$factory->define(HatarakiKataResource::class, function (Faker $faker) {
    return [
        'hataraki_kata_id' => $faker->numberBetween(1, 36),
        'taggable_id' => $faker->numberBetween(1, 5),
        'taggable_type' => $faker->randomElement(['JobSeeker' ,'Job']),
    ];
});
