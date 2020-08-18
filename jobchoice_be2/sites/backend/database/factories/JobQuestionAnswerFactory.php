<?php

use Faker\Generator as Faker;
use App\Models\JobQuestionAnswer;

$factory->define(JobQuestionAnswer::class, function (Faker $faker) {
    return [
    	'answer' => $faker->text
    ];
});
