<?php

namespace App\Mail\Register;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyMailSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $subject = '【JOBチョイス：通知】JOBチョイスへようこそ！';

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
        $this->subject = $this->subject;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from(config('app.job_choice_support_email'))
                    ->view('emails.verifyUserSuccess')
                    ->to($this->user['email'])
                    ->subject($this->subject);
    }

}
