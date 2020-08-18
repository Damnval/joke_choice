<?php

namespace App\Mail\Register;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $sender = ($this->user->type == 'company')?config('app.job_choice_sales_email'):config('app.job_choice_support_email');

        return $this->from($sender)
                    ->subject('【JOBチョイス：通知】登録URLのお知らせ')
                    ->view('emails.verifyUser');
    }
}
