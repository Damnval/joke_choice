<?php

use App\Models\JobQuestion;
use Illuminate\Database\Seeder;
use App\Models\JobQuestionAnswer;
use App\Models\JobQuestionJobSeekerAnswer;

class JobQuestionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(JobQuestion::class, 20)->create([
            'answer_type' => 'single'
        ])->each(function($job_question) {
            factory(JobQuestionAnswer::class, 3)->create([
                'job_question_id' => $job_question->id
            ]);
        });

        for ($x = 1; $x < 21; $x++) {
            factory(JobQuestionJobSeekerAnswer::class)->create([
                'job_question_id' => $x,                
                'job_question_answer_id' => mt_rand($x * 3 - 2, $x * 3), // only will get answer ids relating to job question
                'free_text_answer' => NULL
            ]);
        }
    }
}
