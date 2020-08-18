<?php

use App\Models\JobQuestion;
use Faker\Generator as Faker;

$factory->define(JobQuestion::class, function (Faker $faker) {
    return [
    	'question' => $faker->text($maxNbChars = 100),
        'answer_type' => $faker->randomElement([
        	'single',
        	'multiple',
        	'free_text'
        ]),
    	'required_answer' => $faker->numberBetween(0, 1),
        'job_id' => $faker->numberBetween(1, 10)
    ];
});
