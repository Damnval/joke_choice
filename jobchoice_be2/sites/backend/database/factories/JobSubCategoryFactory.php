<?php

use Faker\Generator as Faker;
use App\Models\JobSubCategory;

$factory->define(JobSubCategory::class, function (Faker $faker) {
    return [
        'description' => $faker->text,
    ];
});
