<?php

use Faker\Generator as Faker;
use App\Models\AppliedJob;

$factory->define(AppliedJob::class, function (Faker $faker) {
    return [
        'work_exp_comment'   => $faker->text,
        'disclosed'=> $faker->numberBetween(0, 1),
    ];
});
