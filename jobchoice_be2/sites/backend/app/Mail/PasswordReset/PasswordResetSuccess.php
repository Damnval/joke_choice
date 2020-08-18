<?php

namespace App\Mail\PasswordReset;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PasswordResetSuccess extends Mailable
{
    use Queueable, SerializesModels;

    public $user; 
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $subject)
    {
        $this->user = $user;
        $this->subject = $subject; 
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->from(config('app.job_choice_support_email'))
                    ->view('emails.passwordResetSuccess')
                    ->to($this->user['email'])
                    ->subject($this->subject);
    }

}
