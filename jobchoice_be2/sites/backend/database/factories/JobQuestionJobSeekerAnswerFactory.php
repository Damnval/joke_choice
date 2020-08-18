<?php

use App\Models\JobQuestionJobSeekerAnswer;
use Faker\Generator as Faker;

$factory->define(JobQuestionJobSeekerAnswer::class, function (Faker $faker) {

    $job_question_answer_id = $faker->randomElement(NULL, $faker->numberBetween(1, 30));
    $free_text_answer = ($job_question_answer_id) ? NULL : $faker->text;

    return [
        'job_seeker_id' => $faker->numberBetween(1, 5),
        'job_question_answer_id' => $job_question_answer_id,
        'free_text_answer' => $free_text_answer
    ];

});
