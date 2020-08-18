<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;

use App\Models\SnSUser;

use Carbon\Carbon;

class SnSUserService
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
     * Logics and functions involving SnS Users
     * @param  Object $request Input by user
     * @return Object $data sns User
     */
    public function store($request)
    {
        $slug = true;
        validateInput($request->toArray(), SnSUser::createRules());
        $sns_user = $this->getSnSUser($request);

        if (!$sns_user) {
            $user = $this->getUser($request);
            // returns null and soft deletes user object if the user was not email verified
            $user = $this->isVerified($user);

            if (!$user) {
                $user = $this->saveUser($request);
                $job_seeker = $this->saveJobSeeker($user);
                $this->saveSnSUser($user, $request);
                $this->saveBankAccount($job_seeker);
                $this->saveGeolocation($job_seeker);
                $slug = false;
            } else {        
                $this->saveSnSUser($user, $request);                    
            } 
            $results['results']['message'] = 'SNS Account created successfully.';
        } else {
            $user = $sns_user->user;
            $results['results']['message'] = 'SNS Login successful.';
        }

        $results['results']['token'] = $user->createToken('MyApp')->accessToken;

        return [$results, $user, $slug];
    }

    /**
     * Function to save user 
     * @param  Object $request User client input
     * @return Object $user    User collection
     */
    public function saveUser($request)
    {
        $data['email'] = ($request->email) ? $request->email : $this->generateEmail();
        $data['email_verified_at'] = Carbon::now();
        $data['sms_verified_at'] = Carbon::now();
        $data['contact_no'] = '+810000000000';
        $data['first_name'] = $request->first_name;
        $data['type'] = 'job_seeker';
        
        return  $this->jobChoiceRepository->user()->create($data);
    }

    /**
     * Function to save jobseeker 
     * @param  Object $user  User collection
     */
    public function saveJobSeeker($user)
    {
        $data = [
            'user_id' => $user->id,
        ];

        return $this->jobChoiceRepository->job_seeker()->create($data);
    }

    /**
     * Function to save SnS User 
     * @param  Object $request User client input
     * @param  Object $user    User collection
     */
    public function saveSnSUser($user, $request)
    {
        $data = [
            'user_id'   => $user->id,
            'provider'  => $request->type,
            'social_id' => $request->job_seeker['social_id']
        ];

        $this->jobChoiceRepository->sns_user()->create($data);
    }

    /**
     * Function to save bank account for sns users
     * @param  Object $client User client input
     */
    public function saveBankAccount($client)
    {
        $data = [];

        $this->jobChoiceRepository->bank_account()->createModel($data, $client);
    }

    /**
     * Function to save geolocation for sns users
     * @param  Object $client User client input
     */
    public function saveGeolocation($client)
    {
        $data = [];

        $this->jobChoiceRepository->geolocation()->createMorph($data, $client);
    }

    /**
     * Generates a random unique email
     *
     * @return string $email Email if it exsists
     */
    public function generateEmail()
    {
        return 'random'.str_random(5).uniqid().'@jobchoice.com';
    }

    /**
     * Checks if the email and sms of the user is verified or not
     * @param  Object $user Input by user
     * @return Object $user
     */
    public function isVerified($user)
    {    
        if ($user) {
            // user finished registration process but did not verify with phone number
            if (isset($user->email_verified_at) && is_null($user->sms_verified_at)) {
                // verifies the sms and finishes registration process
                $this->verifySms($user);
            }
            // user created but did not continue with the normal registration process
            if (is_null($user->email_verified_at)) {
            // hard deletes token, soft deletes the email and creates a new user for proper creation of job seeker relationships
                $this->jobChoiceRepository->token()->destroy($user->custom_token->id);
                $this->jobChoiceRepository->user()->forceDelete($user);
                $user = null;            
            }
        }

        return $user;
    }

    /**
     * Function that updates sms of user to be verified with a timestamp
     * @param  Object $user Input by user
     */
    public function verifySms($user)
    {
        $params = [
            'sms_verified_at' => Carbon::now()
        ];

        $this->jobChoiceRepository->user()->update($params, $user->id);
    }

    /**
     * Gets the user given parameter
     * @param  Object $request Input by user
     * @return Object $user returns a user object
     */
    public function getUser($request)
    {
        $params = [
            'email' => $request->email
        ];

        return $this->jobChoiceRepository->user()->whereFirst($params);
    }

    /**
     * Gets the sns user given parameters
     * @param  Object $request Input by user
     * @return Object $user returns a user object
     */
    public function getSnSUser($request)
    {
        $params = [
            'provider'   => $request->type,
            'social_id'  => $request->job_seeker['social_id']
        ];

        return $this->jobChoiceRepository->sns_user()->where($params);
    }

}
