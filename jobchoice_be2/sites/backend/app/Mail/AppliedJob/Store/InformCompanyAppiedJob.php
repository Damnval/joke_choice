<?php

namespace App\Mail\AppliedJob\Store;

use App\Models\Job;
use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Repositories\JobChoiceRepository;
use Illuminate\Contracts\Queue\ShouldQueue;

class InformCompanyAppiedJob extends Mailable
{
    use Queueable, SerializesModels;

    public $applied_job;
    public $job;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($applied_job)
    {
        $this->applied_job = $applied_job;
        $this->job = $this->getJobDetail($applied_job->job_id);
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from(config('app.job_choice_info_email'))
                    ->view('emails.informCompany')
                    ->to($this->job->company->user->email);
    }

    /**
     * get Job Object
     * @param  Int $job_id
     * @return Object Job Object
     */
    public function getJobDetail($job_id)
    {
        return Job::with('publication', 'company.user')
                    ->find($job_id);
    }
}
