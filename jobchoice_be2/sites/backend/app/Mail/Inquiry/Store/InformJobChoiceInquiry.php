<?php

namespace App\Mail\Inquiry\Store;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class InformJobChoiceInquiry extends Mailable
{
    use Queueable, SerializesModels;

    public $inquiry;
    public $jobchoice_lang;
    public $email_template = 'emails.informJobChoiceInquiry';
    public $subject = '【JOBチョイス：通知】お問い合わせを受理いたしました。';
    public $admins;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($inquiry)
    {
        $this->inquiry = $inquiry;
        $this->admins = $this->getAdmin();
        $this->email_template = $this->email_template;
        $this->subject = $this->subject;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from($this->inquiry->email)
                    ->view($this->email_template)
                    ->to($this->admins);
    }

    public function getAdmin()
    {
        $params = [
            'type' => 'admin'
        ];

        $admins = User::where($params)->get()->pluck('email')->toArray();

        return $admins;
    }

}
