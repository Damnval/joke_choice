<?php

use Faker\Generator as Faker;
use App\Models\Note;

$factory->define(Note::class, function (Faker $faker) {
    return [
        'notes' => $faker->text,
        'taggable_id' => $faker->numberBetween(1, 100),
        'taggable_type' => $faker->randomElement(['JobSeeker' ,'Job']),
    ];
});
