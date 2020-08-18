<?php

namespace App\Mail\PasswordReset;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PasswordResetRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $password_reset_token;
    public $user;
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($password_reset_token, $user, $subject)
    {
        $this->password_reset_token = $password_reset_token;
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
                    ->view('emails.passwordResetRequest')
                    ->to($this->user['email'])
                    ->subject($this->subject);
    }

}
