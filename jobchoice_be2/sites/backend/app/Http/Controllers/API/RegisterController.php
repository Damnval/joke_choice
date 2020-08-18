<?php

namespace App\Http\Controllers\API;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;

use Illuminate\Mail\Mailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

use App\Models\User;
use App\Models\SnSUser;
use App\Services\JobChoiceService;

use DB;
use Validator;

class RegisterController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Registration API that recieves only an email and creates user
     * @param  object $request Input by user end
     * @return \Illuminate\Http\Response
     */
    public function registerEmail(Request $request)
    {
        DB::beginTransaction();

        try {
            validateInput($request->all(), User::createRules());

            $user = $this->jobChoiceService->user()->store($request);
            $user->user_id = $user->id;
            $this->jobChoiceService->token()->store($user);
            $this->data['results']['message'] = "Registered email succesfully, follow instructions in your email to continue.";
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error']  = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Registration API that creates a user and social User
     * @param  object $request Input by user end
     * @return \Illuminate\Http\Response
     */
    public function registerSocial(Request $request)
    {
        DB::beginTransaction();

        try {
            validateInput($request->all(), SnSUser::createRules());
            list($results, $user, $slug) = $this->jobChoiceService->sns_user()->store($request);

            if ($slug == false) {
                $this->jobChoiceService->slug()->store($user);
            }

            $this->data = $results;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error']  = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

     /**
     * Registration API that continues filling out user details and verifies
     * @param  object $request Input by user end
     * @return \Illuminate\Http\Response
     */
    public function registerDetails(Request $request)
    {
        DB::beginTransaction();

        try {
            validateInput($request->all(), User::updateRulesOnRegister());

            $user = $this->jobChoiceService->user()->verifyUser($request);
            Auth::loginUsingId($user->id);
            $this->jobChoiceService->user()->saveClientType($request, $user);

            $this->data['results']['token'] =  $user->createToken('JobChoice')->accessToken;
            $this->jobChoiceService->slug()->store($user);
            $user = $this->jobChoiceService->user()->updateUserOnRegister($request, $user->id);
            $this->data['results']['message'] = "Successfully registered";
            $this->data['results']['user'] = $user;
            $this->data['status'] = 200;

            // Validate User ID
            if($user->type == 'job_seeker') {
                // Set Data
                $data = [
                    'user_id' => $user->id,
                    'contact_no' => $request->contact_no,
                    'action' => 'send',
                    'lang' => $request->lang
                ];
                // Send Verification Code
                $twilio = $this->jobChoiceService->twilio()->store($data);
            }

            Auth::logout();

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        // return 'let me know';
        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    public function line(Request $request)
    {
        $client = new \GuzzleHttp\Client(['base_uri' => 'https://api.line.me/oauth2/v2.1/token']);

        $response = $client->request('POST', '', [
            'headers' => ['Content-Type' => 'application/x-www-form-urlencoded; charset=utf-8'],
            'form_params' => ['grant_type' => $request->grant_type,
                'code' => $request->code,
                'redirect_uri'=> $request->redirect_uri,
                'client_id' => $request->client_id,
                'client_secret' => $request->client_secret,]
        ]);

        return $response;

    }

}
