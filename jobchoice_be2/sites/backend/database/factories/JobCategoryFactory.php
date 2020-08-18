<?php

use Faker\Generator as Faker;
use App\Models\JobCategory;

$factory->define(JobCategory::class, function (Faker $faker) {
    return [
        'description' => $faker->text
    ];
});
