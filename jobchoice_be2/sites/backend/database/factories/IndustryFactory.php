<?php

use Faker\Generator as Faker;
use App\Models\Industry;

$factory->define(Industry::class, function (Faker $faker) {
    return [
        'name' => $faker->company,
    ];
});
