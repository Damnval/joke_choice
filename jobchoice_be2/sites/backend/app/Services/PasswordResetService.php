<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use Mail;
use App\Repositories\JobChoiceRepository;
use App\Mail\PasswordReset\PasswordResetRequest;
use App\Mail\PasswordReset\PasswordResetSuccess;


class PasswordResetService
{
    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */
    public function __construct(JobChoiceRepository $jobChoiceRepository)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Logics and functions involving password resets
     * @param Object $user
     */
    public function store($user)
    {
        $params = [
            'user_id' => $user->id,
            'token' => str_random(20).uniqId().str_random(20),
            'active' => 1,
        ];

        $password_reset_token = $this->jobChoiceRepository->password_reset()->create($params);

        if (!$password_reset_token) {
            throw new \Exception('Server error occured sending your reset token.');
        }

        $subject = '【JOBチョイス：通知】パスワード変更URLのお知らせ';
        // Sends password reset link to user's email
        Mail::send(new PasswordResetRequest($password_reset_token, $user, $subject));
    }

    /**
     * Updates the user with a new password and sends a successful response email
     * @param  Object $request Parameters of where clause
     */
    public function resetPassword($request)
    {
        $password_reset_token = $this->getToken($request);
        $user = $this->jobChoiceRepository->user()->update($request->all(), $password_reset_token->user_id);

        if (!$user) {
            throw new \Exception('Server error occured resetting your password.');
        }

        // Deactivates the tokens
        $this->deactivateTokens($password_reset_token);

        $subject = '【JOBチョイス：通知】パスワード変更のお知らせ';
        // Sends a response email that the password was succesfully changed 
        Mail::send(new PasswordResetSuccess($user, $subject));
    }

    /**
     * Gets the token with email
     * @param  Object $request input by user
     * @return Object $password_reset_token
     */
    public function getToken($request)
    {
        $params = [
            'token' => $request->token,
            'active' => 1,
        ];
        
        $password_reset_token = $this->jobChoiceRepository->password_reset()->where($params);

        if (!$password_reset_token) {
            throw new \Exception('Password reset token is invalid.');
        }

        return $password_reset_token;
    }

    /**
     * Deactivates all the reset password tokens of user
     * @param Object $password_reset_token input by user
     */
    public function deactivateTokens($password_reset_token)
    {
        $updateParams = [
            'active' => 0
        ];

        $whereParams = [
            'user_id' => $password_reset_token->user_id
        ];

        $this->jobChoiceRepository->password_reset()->updateWhere($updateParams, $whereParams);
    }

}
