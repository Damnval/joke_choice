<?php

namespace App\Mail\Inquiry\Store;

use App\Models\Job;
use App\Models\JobSeeker;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Repositories\JobChoiceRepository;
use Illuminate\Contracts\Queue\ShouldQueue;

class InformInquirerInquiry extends Mailable
{
    use Queueable, SerializesModels;

    public $inquiry;
    public $jobchoice_lang;
    public $email_template = 'emails.informInquirerInquiry';
    public $subject = '【JOBチョイス：通知】お問い合わせを受理いたしました。';

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($inquiry, $jobchoice_lang)
    {
        $this->inquiry = $inquiry;
        $this->jobchoice_lang = $jobchoice_lang;
        $this->email_template = $this->email_template;
        $this->subject = $this->subject;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        // Validate FE User Language set
        if(strtoupper($this->jobchoice_lang) == 'US') {
            $this->email_template = 'emails.informInquirerInquiry_en';
            $this->subject = '【Job Choice: Notification】We received your inquiry';
        }
        return $this->from(config('app.job_choice_info_email'))
                    ->view($this->email_template)
                    ->to($this->inquiry->email);
    }
}
