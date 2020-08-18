<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;
use App\Mail\Register\VerifyMail;

use Carbon\Carbon;
use Mail;

class TokenService
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
     * Logics and functions in saving Token
     * @param  Object $request input by user
     */
    public function store($request)
    {
        $token = $this->jobChoiceRepository->token()->create($request->toArray());

        if ($token) {
            Mail::to($request->email)->send(new VerifyMail($request));
        }
    }

    /**
     * Logics and functions verifying if token exists and is not expired
     * @param  Object $request        input by user
     * @return array  $result, $email boolean and string respectively
     */
    public function isTokenExisting($request)
    {
        $result = false;
        $email = null;
        $token_expiry_hour = Carbon::now()->subHours(2);

        $whereParams = [
            ['token', '=', $request->token],
            ['created_at', '>', $token_expiry_hour]
        ];

        $token = $this->jobChoiceRepository->token()->whereFirst($whereParams);

        if ($token) {
            $result = true;
            $email = $token->user->email;
        }

        return [$result, $email];
    }
    
}
