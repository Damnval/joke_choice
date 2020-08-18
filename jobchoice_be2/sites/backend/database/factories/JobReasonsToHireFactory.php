<?php

use Faker\Generator as Faker;
use App\Models\JobReasonsToHire;

$factory->define(JobReasonsToHire::class, function (Faker $faker) {
    return [
        'reason' => $faker->text,
    ];
});
