<?php

namespace App\Observers;

use App\Models\JobQuestion;

class JobQuestionObserver
{
    /**
     * Initialize JobQuestion
     * @param Object $job_question
     */
    public function __construct(JobQuestion $job_question)
    {
        $this->job_question = $job_question;
    }

    /**
     * Method is triggered when ever the delete eloquent is used in Model JObQuestion
     * @param Object $job_question Model binded by id
     */
    public function deleting(JobQuestion $job_question)
    {
        $job_question->job_question_answers()->each( function ($job_question_answer) {
            $job_question_answer->delete();
        });

        $job_question->job_question_job_seeker_answers()->each( function ($job_question_job_seeker_answer) {
            $job_question_job_seeker_answer->delete();
        });
    }

}
