<?php

namespace App\Mail\Register;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyMailSuccessInformSecretariat extends Mailable
{
    use Queueable, SerializesModels;

    public $user; 
    public $subject = '【JOBチョイス登録連絡】ユーザー登録がありました。';

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
        return $this->from(config('app.job_choice_email'))
                    ->view('emails.verifyUserSuccessInformSecretariat')
                    ->to(config('app.job_choice_email'))
                    ->subject($this->subject);
    }

}
