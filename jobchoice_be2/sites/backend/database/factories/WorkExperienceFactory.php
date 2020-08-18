<?php

use App\Models\WorkExperience;
use Faker\Generator as Faker;

$factory->define(WorkExperience::class, function (Faker $faker) {
    return [
    	'company'       => $faker->company,
        'position'      => $faker->jobTitle,
        'job_seeker_id' => $faker->numberBetween(1,5),     
        'start_date'    => $faker->dateTimeBetween('-25 years', '-1 month'),
        'end_date'      => $faker->dateTimeBetween('-3 years', 'now'),       
    ];
});
