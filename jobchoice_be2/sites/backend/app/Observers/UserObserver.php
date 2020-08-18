<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Initialize User
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Method is triggered when ever the delete eloquent is used in Model User
     * @param  user $user Model binded by id
     */
    public function deleting(User $user)
    {
        if ($user->type == 'company') {
            //Seperate method on deleting company
            $this->deleteCompany($user);
        }

        if ($user->type == 'job_seeker') {
            //Seperate method on deleting job seeker
            $this->deleteJobSeeker($user);
        }
    }

    /**
     * Deletes a company user and all its relationship
     * @param  Object $user User to be deleted
     */
    public function deleteCompany($user)
    {
        //looking for company under this user
        $user->company()->each( function ($company) {
            //looking for geolocation under this company
            $company->geolocation()->each( function ($geolocation) {
                //deletes geolocation under this company
                $geolocation->delete();
            });

            //looking for jobs under this company
            $company->job()->each( function ($job) {
                // deletes job under this company
                // Created an Observer (JobObserver) for job that deletes all child relationship whenever specific job is deleted
                $job->delete();
            });
            // deletes company under this user
            $company->delete();
        });
    }

    /**
     * Deletes a job seeker user and all its relationship
     * @param  Object $user User to be deleted
     */
    public function deleteJobSeeker($user)
    {
        //looking for job seeker under this user
        $user->job_seeker()->each( function ($job_seeker) {
            //looking for geolocation under this job seeker
            $job_seeker->geolocation()->each( function ($geolocation) {
                //deletes geolocation under this job seeker
                $geolocation->delete();
            });

            $job_seeker->work_experience()->each( function ($work_experience) {
                //deletes work experince under this job seeker
                $work_experience->delete();
            });

            $job_seeker->job_seeker_skills()->each( function ($job_seeker_skill) {
                //deletes geolocation under this job seeker
                $job_seeker_skill->delete();
            });

            $job_seeker->educational_background()->each( function ($educational_background) {
                //deletes geolocation under this job seeker
                $educational_background->delete();
            });

            $job_seeker->job_question_job_seeker_answers()->each( function ($job_question_job_seeker_answer) {
                //deletes geolocation under this job seeker
                $job_question_job_seeker_answer->delete();
            });

            // deletes job_seeker under this user
            $job_seeker->delete();
        });

        // deletes all sns associated to this user
        $user->sns_user()->delete();
    }

}
