<?php

use Faker\Generator as Faker;
use App\Models\Guest;

$factory->define(Guest::class, function (Faker $faker) {
    return [
        'email' => $faker->unique()->safeEmail,
    ];
});
