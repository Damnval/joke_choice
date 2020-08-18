<?php

use App\Models\JobStrength;
use Faker\Generator as Faker;

$factory->define(JobStrength::class, function (Faker $faker) {
	return [
        'item' => $faker->text($maxNbChars = 50),
        'description' => $faker->text,
        'job_id' => $faker->numberBetween(1, 10)
    ];
});
