<?php

namespace App\Mail\Job\Update;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendCompanyJobApprovalStatus extends Mailable
{
    use Queueable, SerializesModels;

    public $approval_status;
    public $job;
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($approval_status, $job, $subject)
    {
        $this->approval_status = $approval_status;
        $this->job = $job;
        $this->subject = $subject;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from(config('app.job_choice_sales_email'))
                    ->view('emails.approvalStatus')
                    ->to($this->job['company']['user']['email'])
                    ->subject($this->subject);
    }

}
