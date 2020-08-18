<?php

namespace App\Services;

use Auth;
use Carbon\Carbon;
use App\Repositories\JobChoiceRepository;
use App\Models\JobQuestionJobSeekerAnswer;

class JobQuestionJobSeekerAnswerService
{
    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */

    public function __construct(JobChoiceRepository $jobChoiceRepository)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Service and logics that saves job seeker's answer from a specific job question in job_question_job_seeker_answers Table
     * @param  Object $request User client input
     */
    public function store($request)
    {
        $job_questions = $request->job_questions;
        foreach ($job_questions as $job_question => $value) {
            $value['job_seeker_id'] = Auth::user()->job_seeker->id;
            validateInput($value, JobQuestionJobSeekerAnswer::createRules());
            $data[] = [
                        'job_question_id' => $value['job_question_id'],
                        'job_question_answer_id' => $value['job_question_answer_id'],
                        'job_seeker_id' => $value['job_seeker_id'],
                        'free_text_answer' => $value['free_text_answer'],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ];
        }
        $this->jobChoiceRepository->job_question_job_seeker_answer()->insert($data);
    }

}
