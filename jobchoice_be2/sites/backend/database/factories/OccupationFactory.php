<?php

use Faker\Generator as Faker;
use App\Models\Occupation;

$factory->define(Occupation::class, function (Faker $faker) {
    return [
        'name' => $faker->jobTitle,
    ];
});
