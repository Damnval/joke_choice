<?php

use Carbon\Carbon;
use Faker\Generator as Faker;
use App\Models\JobSeekerSkill;

$factory->define(JobSeekerSkill::class, function (Faker $faker) {
    return [
        'job_seeker_id' => $faker->numberBetween(1, 5),
        'skill_id'	    => $faker->numberBetween(1, 29),
    ];
});
