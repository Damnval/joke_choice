<?php

use Faker\Generator as Faker;
use App\Models\RecruitmentTag;

$factory->define(RecruitmentTag::class, function (Faker $faker) {
    return [
        'hataraki_kata_id' => $faker->numberBetween(1, 64),
        'job_id' => $faker->numberBetween(1, 10)
    ];
});
