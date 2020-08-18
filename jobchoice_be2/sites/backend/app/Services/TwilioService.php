<?php

namespace App\Services;

use Twilio\Rest\Client;
use App\Repositories\JobChoiceRepository;
use InvalidArgumentException;
use Auth;
use App\Models\User;
use Carbon\Carbon;

class TwilioService
{
    /**
     * @var string
     */
    public $sid;

    /**
     * @var string
     */
    public $token;

    /**
     * @var Twilio\Rest\Client
     */
    protected $client;

    /**
     * @var App\Repositories\JobChoiceRepository
     */
    private $jobChoiceRepository;

    /**
     * Class Constructor
     */
    public function __construct(JobChoiceRepository $jobChoiceRepository) 
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Store the data twilio table in the database
     * 
     * @param App\Http\Request $request
     * @return App\Model\Twilio $twilio
     */
    public function store($request) 
    {

        // Validate Contact Number
        if(strlen($request['contact_no']) < 1) {
            throw new \Exception('Invalid Phone Number');
        }

        // Generate six digit random numbers
        $code = generateRandomInt(6);

        // Set Data
        $data = [ 
            'user_id' => $request['user_id'], 
            'code' => $code, 
            'usage' => 1 
        ];

        $twilio = $this->jobChoiceRepository->twilio()->create($data);

        // Validate Twilio
        if($twilio->count()) {
            // Set the message
            $message = 'Your Job Choice Verification Code is '.$code;
            
            if(strtoupper($request['lang']) == 'JP') {
                $message = '「'.$code .'」'. ' があなたのJobチョイスの認証コード';
            }

            // Send the verification code
            $this->send($request['contact_no'], $message, config('app.twilio_from_phone_number'));
        }

        return $twilio;
    }

    /**
     * Update the code twilio code usage in the database
     * 
     * @param App\Http\Request $request
     * @return App\Models\Twilio $twilio
     */
    public function update($request) 
    {

        // Validate Request Code not empty
        if(strlen($request->code) < 1) {
            throw new \Exception('Verification Code is empty.');
        }

        // Validate Request Token not empty
        if(strlen($request->token) < 1) {
            throw new \Exception('User Token is empty.');
        }

        // Set the params token
        $tokenParams = [
            'token' => $request->token,
        ];

        // Validate, what token type passed either registration token or login token 
        $token = $this->jobChoiceRepository->token()->whereFirst($tokenParams);

        // Validate token 
        // and get user according to it's token
        if(isset($token)) {

            $user = $this->jobChoiceRepository->user()->show($token->user_id);
        } else {
            $user = auth()->guard('api')->user();
        }
        
        // Validate Verification Code Exists
        $twilio = $this->isTwilioCodeExist($request->code, $user->id);

         // Check if the user enter the correct 
         // verification code and its according to its user id, we are checking it 
         // by checking the token of the user
         if($user->id != $twilio->user_id) {

            throw new \Exception('You have entered an invalid verification code. Please verify if this is the one we sent.');
         }

        // Update Code
        $data = [ 'usage' => 0 ];
        $result = $this->jobChoiceRepository->twilio()->update($data, $twilio->id);

        // Update User SMS Verification Column
        $user->sms_verified_at = Carbon::now();
        $this->jobChoiceRepository->user()->update($user->toArray(), $user->id);

        return $twilio;            
    }

    /**
     * Resend the verification code 
     * 
     * @param object $request
     * @return Boolean $twilio
     */
    public function resend($request) {

        // Set the params token
        $token_params = [
            'token' => $request->token,
        ];

        // Validate, what token type passed either registration token or login token 
        $token = $this->jobChoiceRepository->token()->whereFirst($token_params);

        // Validate token and get user according to it's token
        if(isset($token)) {

            $user = $this->jobChoiceRepository->user()->show($token->user_id);
        } else {
            $user = auth()->guard('api')->user();
        }
        
        // Validate Phone Number
        if(strlen($user->contact_no) < 1 || !preg_match('/([+81]?\d{12})/', $user->contact_no)) {
            throw new InvalidArgumentException('Invalid Phone Number');
        }  

        // set param
        $prev_user_data = [ 'user_id' => $user->id ];

        // Find User ID in twilio
        $user_data_twilio = $this->jobChoiceRepository->twilio()->whereFirst($prev_user_data);

        // Generate new verification code
        $code = generateRandomInt(6);

        // Set Params 
        $data = [ 'code' => $code ];

        // Update the code 
        $twilio = $this->jobChoiceRepository->twilio()->update($data, $user_data_twilio->id);

        // Validate if resend code successfully update
        if($twilio) {
            // Set the message
            $message = 'Your Job Choice Verification Code is '.$code;
            
            if(strtoupper($request['lang']) == 'JP') {
                $message = '「'.$code .'」'. ' があなたのJobチョイスの認証コード';
            }
    
            // Send the verification code
            $this->send($user->contact_no, $message, config('app.twilio_from_phone_number'));
        }
        
        return $twilio;
    }

    /**
     * Sends message to twilio.
     *
     * @param string $to
     * @param string $message
     * @param string $from
     */
    private function send($to, $message, $from = '')
    {
        // verify if parameter meets the contract
        if (strlen($to) < 1) {
            throw new InvalidArgumentException('Invalid parameter to passed, must be a string.');
        }

        // verify if parameter meets the contract
        if (strlen($message) < 1) {
            throw new InvalidArgumentException('Invalid parameter message passed, must be a string.');
        }

        // Validate Twilio Config
        $this->verifyTwilioConfiguration();

        try {

            $message = $this->client->messages->create(
                $to,
                [
                    'from' => $from,
                    'body' => $message
                ]
            );

        } catch (\Exception $e) {
            throw new \Exception('Cannot send message because of '. $e->getMessage());
        }

        return $message;
    }

    /**
     * Helper Method 
     * Verify Client Credentials in Twilio
     */
    private function verifyTwilioConfiguration() 
    {
        try {

            $this->client = new Client(config('app.twilio_sid'), config('app.twilio_token'));

        } catch (\Exception $e) {
            throw new \Exception('Invalid sid/token passed. Please check your credentials.');
        }
    }

    /**
     * Helper method to verify if the twilio code exists in the database 
     * 
     * @param string $code
     * @return App\Model\Twilio $twilio
     */
    public function isTwilioCodeExist($code, $user_id) {
        // Set Data
        $data = [
            'code' => $code, 
            'user_id' => $user_id
        ];

        // Lookup twilio code
        $twilio = $this->jobChoiceRepository->twilio()->whereFirst($data);
        
        // Validate twilio code exists and usage
        if(!$twilio || $twilio->usage == 0) {

            throw new \Exception('This is an invalid verification code.');
        }
        
        return $twilio;
    }

    /**
     * Helper Method 
     * Verify User Phone Number Valid in Twilio to send a messaage
     * 
     * @param App\Http\Request $request
     * @return Twilio\Rest\Client\LooUp\V1\PhoneNumbers $result
     */
    public function verifyPhoneNumber($request) {
        try {

            if(strlen($request->contact_no) < 1 || !preg_match('/[+81]{2}[0-9]{11}/', $request->contact_no) ) {
                throw new \Exception('Invalid Phone Number');
            }

            $this->client = new Client(config('app.twilio_sid'), config('app.twilio_token'));
            $result = $this->client->lookups->v1->phoneNumbers($request->contact_no)->fetch();

        } catch(\Exception $e) {
            throw new \Exception('Invalid Phone Number');
        }
        return $result;
    }
}
