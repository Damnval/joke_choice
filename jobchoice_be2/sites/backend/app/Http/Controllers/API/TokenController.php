<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class TokenController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Checks if the resource exists.
     * @param  \Illuminate\Http\Request  $request     
     * @return \Illuminate\Http\Response
     */
    public function isTokenExisting(Request $request)
    {
        try {
            list($token, $email) = $this->jobChoiceService->token()->isTokenExisting($request);
            $this->data['results']['token'] = $token;
            $this->data['results']['email'] = $email;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
