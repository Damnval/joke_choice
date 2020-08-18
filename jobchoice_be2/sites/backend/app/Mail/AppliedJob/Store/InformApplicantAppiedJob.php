<?php

namespace App\Mail\AppliedJob\Store;

use App\Models\Job;
use App\Models\JobSeeker;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Repositories\JobChoiceRepository;
use Illuminate\Contracts\Queue\ShouldQueue;

class InformApplicantAppiedJob extends Mailable
{
    use Queueable, SerializesModels;

    public $applied_job;
    public $job;
    public $job_seeker;
    public $company;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($applied_job)
    {
        $this->applied_job = $applied_job;
        $this->job = $this->getJobDetail($applied_job->job_id);
        $this->job_seeker = $this->getJobSeekerDetail($applied_job->job_seeker_id);
        $this->company = $this->job->company;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from(config('app.job_choice_info_email'))
                    ->view('emails.informApplicant')
                    ->to($this->job_seeker->user->email);
    }

    /**
     * get Job Object
     * @param  Int $job_id
     * @return Object Job Object
     */
    public function getJobDetail($job_id)
    {
        return Job::with('publication', 'company.user', 'company.geolocation')
                    ->find($job_id);
    }

    /**
     * get Job Seeker Object
     * @param  Int $job_seeker_id
     * @return Object Job seeker object
     */
    public function getJobSeekerDetail($job_seeker_id)
    {
        return JobSeeker::with('user')
                        ->find($job_seeker_id);
    }

}
