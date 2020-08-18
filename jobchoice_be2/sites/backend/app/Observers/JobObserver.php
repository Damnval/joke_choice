<?php

namespace App\Observers;

use App\Models\Job;

class JobObserver
{
    /**
     * Initialize Job
     * @param job $job
     */
    public function __construct(Job $job)
    {
        $this->job = $job;
    }

    /**
     * Method is triggered when ever the delete eloquent is used in Model job
     * @param  job $job Model binded by id
     */
    public function deleting(Job $job)
    {
        // delete all hataraki_kata_resource under this job
        $job->hataraki_kata_resource()->each( function ($hataraki_kata_resource) {
            $hataraki_kata_resource->delete();
        });

        // delete all galleries under this job
        $job->galleries()->each( function ($galleries) {
            $galleries->delete();
        });

        // delete all job_job_sub_categories under this job
        $job->job_job_sub_categories()->each( function ($job_job_sub_categories) {
            $job_job_sub_categories->delete();
        });

        // delete all job_questions under this job
        $job->job_questions()->each( function ($job_question) {
            // delete all job_question_answers under this job_question
            // Created an Observer (JobQuestionObserver) for JobQuestion that deletes all child relationship whenever specific JobQuestion is deleted
            $job_question->delete();
        });

        // delete all job_reasons_to_hire under this job
        $job->job_reasons_to_hire()->each( function ($job_reasons_to_hire) {
            $job_reasons_to_hire->delete();
        });

        // delete all job_strengths under this job
        $job->job_strengths()->each( function ($job_strengths) {
            $job_strengths->delete();
        });

        // delete all job_welfares under this job
        $job->job_welfares()->each( function ($job_welfares) {
            $job_welfares->delete();
        });

        // delete all nearest_station under this job
        $job->nearest_station()->each( function ($nearest_station) {
            $nearest_station->delete();
        });

        // delete all other_hataraki_kata under this job
        $job->other_hataraki_kata()->each( function ($other_hataraki_kata) {
            $other_hataraki_kata->delete();
        });

        // delete all publication under this job
        $job->publication()->each( function ($publication) {
            $publication->delete();
        });

        // delete all geolocation under this job
        $job->geolocation()->each( function ($geolocation) {
            $geolocation->delete();
        });
    }

}
