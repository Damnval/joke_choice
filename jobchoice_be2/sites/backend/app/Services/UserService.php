<?php

namespace App\Services;

use Mail;
use Auth;
use Carbon\Carbon;
use App\Models\Job;
use App\Models\User;
use App\Models\Company;
use App\Models\JobSeeker;
use App\Models\AppliedJob;
use App\Models\SharedJob;
use App\Models\BankAccount;
use App\Models\JobSeekerSkill;
use App\Models\WorkExperience;
use App\Services\UploadService;
use App\Models\EducationalBackground;
use App\Mail\Register\VerifyMailSuccess;
use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;
use App\Mail\Register\VerifyMailSuccessInformSecretariat;

class UserService
{
    protected $user;

    /**
     * Initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */
    public function __construct(JobChoiceRepository $jobChoiceRepository, UploadService $uploadService)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
        $this->uploadService = $uploadService;
    }

    /**
     * Logic and Service to store User
     * @param  Object $request Input by user
     * @return Object User User Collection
     */
    public function store($request)
    {
        $data = [
            'email' => $request->email,
        ];

        // validation for email is done here and not in model since soft deletes are being used
        $user_exists = $this->jobChoiceRepository->user()->whereFirst($data); 

        if ($user_exists) {
            // check if user is already verified otherwise return it for token generation
            if ($user_exists->email_verified_at) {
                throw new \Exception('Email already exists.');
            } else {
                // updates the type of user in case of wrong registration type
                $user = $this->jobChoiceRepository->user()->update($request->all(), $user_exists->id);
            }
        } else {
            // creates user if no existing user was found
            $user = $this->jobChoiceRepository->user()->create($request->all());
        }

        return $user;
    }

    /**
     * Logic and service to store User Geolocation
     * @param  Object $request User Client input
     * @param  Object $client  Polymoprh type
     */
    public function saveGeolocation($geolocation, $client)
    {
        if (isset($geolocation['address'])) {
            $addresses = $geolocation['address'];
            $isAllEmpty = true;
            foreach ($addresses as $key => $value) {
                if (isset($key) || !empty($key)) {
                    $isAllEmpty = false;
                    break;
                }
            }
            if ($isAllEmpty){
                return;
            }

            $data = $geolocation['address'];
            $this->jobChoiceRepository->geolocation()->createMorph($data, $client);
        }
    }

    /**
     * Logic and service to store Job Seeker Skills
     * @param  array $skill Job Seekers skills parameters
     * @param  Object $client Client to be saved
     */
    public function saveJobSeekerSkill($skills, $client)
    {
        foreach ($skills as $skill_id) {
            $data[] = new JobSeekerSkill([
                            'skill_id' => $skill_id
                        ]);
        }
        $this->jobChoiceRepository->job_seeker_skill()->saveMany($data, $client);
    }

    /**
     * Logic and service to store work experience
     * @param  array $skill Job Seekers skills parameters
     * @param  Object $client Client to be saved
     */
    public function saveWorkExperience($work_exp, $client)
    {
        foreach ($work_exp as $work) {
            $data[] = new WorkExperience([
                            'company'    => $work['company'],
                            'position'   => $work['position'],
                            'start_date' => $work['start_date'],
                            'end_date'   => $work['end_date'],
                        ]);
        }
        $this->jobChoiceRepository->work_experience()->saveMany($data, $client);
    }

    /**
     * Logic and service to store educational background
     * @param  array $skill Job Seekers skills parameters
     * @param  Object $client Client to be saved
     */
    public function saveEducationalBackground($education_bg, $client)
    {
        foreach ($education_bg as $education) {
            $data[] = new EducationalBackground([
                            'school' => $education['school'],
                            'year'   => $education['year'],
                            'month'  => $education['month'],
                        ]);
        }
        $this->jobChoiceRepository->educational_background()->saveMany($data, $client);
    }

    /**
     * Logic and service to store user bank account
     * @param  array $bank_account User Client input
     * @param  Object $client  to be saved
     */
    public function saveBankAccount($bank_account, $client)
    {
        $result = isFieldArrayNull($bank_account);

        if(!$result) {
            validateInput($bank_account, BankAccount::createRules());
        }

        $this->jobChoiceRepository->bank_account()->createModel($bank_account, $client);
    }

    /**
     * Validates token then update user resource
     * @param  array $params Parameters of where clause
     * @return Object $user
     */
    public function verifyUser($request)
    {
        //set expiry 2 hours
        $token_expiry_hour = Carbon::now()->subHours(2);

        $whereParams = [
            ['token', '=', $request->token],
            ['created_at', '>', $token_expiry_hour]
        ];

        $token = $this->jobChoiceRepository->token()->whereFirst($whereParams);
        //check if token exists
        if (isset($token)) {
            $user = $this->jobChoiceRepository->user()->show($token->user_id);
            if (!$user->email_verified_at) {

                // Validate user type
                if($user->type == 'company') {
                    $user->sms_verified_at = Carbon::now();
                }

                $user->email_verified_at = Carbon::now();
                $this->jobChoiceRepository->user()->update($user->toArray(), $user->id);
            } else {
                throw new \Exception('Email already verified.');
            }
        } else {
            throw new \Exception('Token doesn\'t exist or has been expired');
        }

        return $user;
    }

     /**
     * Service logic to remove user from resource
     * This method was created for admin deleting user accounts
     * @param  Object $request Input by user
     * @return Object User User Collection
     */
    public function delete($id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to delete.');
        }

        $user =  $this->jobChoiceRepository->user()->destroy($id);

        if (!$user) {
            throw new \Exception('User doesn\'t exist.');
        }

        return $user;
    }

    /**
     * Service to Update User on Register
     * @param  Object $request Input by user
     * @param Int $id user id
     * @return Object User User Collection
     */
    public function updateUserOnRegister($request, $id)
    {
        $user = $this->jobChoiceRepository->user()->update($request->all(), $id);

        // Sends verification succesful email to user's personal email
        Mail::send(new VerifyMailSuccess($user));
        // Sends verification succesful email to job choice secretariat
        Mail::send(new VerifyMailSuccessInformSecretariat($user));        

        return $user;
    }

    /**
     * Service to Update User
     * @param  Object $request Input by user
     * @param Int $id user id
     * @return Object User User Collection
     */
    public function update($request, $id)
    {
        if (Auth::id() != 1) {
            if (Auth::id() != $id) {
                throw new \Exception('You don\'t have the rights to update this user.');
            }
        }

        $this->isCompanyOrJobSeekerValidator($request);
        validateInput($request->all(), User::updateRules(Auth::id()));
        $user = $this->jobChoiceRepository->user()->update($request->all(), $id);

        if ($user) {
            $where = [
                'user_id' => $user->id
            ];

            if (!isset($request->company) && !isset($request->job_seeker)) {
                throw new \Exception('Please set company or job seeker fields.');
            }

            if ($request->company) {
                $this->jobChoiceRepository->company()->updateWhere($request->company, $where);
                $this->jobChoiceRepository->geolocation()->updateMorph($request->company['address'], $user->company);
            } else {
                $data = $request->job_seeker;

                if (!is_null($request['job_seeker']['profile_picture'])) {
                    $file = $this->uploadService->upload($request['job_seeker']['profile_picture'], $user->id);
                    $data['profile_picture'] = $file;
                }

                $this->jobChoiceRepository->job_seeker()->updateWhere($data, $where);

                if (!empty($request->job_seeker['address'])) {
                    $this->jobChoiceRepository->geolocation()->updateMorph($request->job_seeker['address'], $user->job_seeker);
                }

                if (!isset($request->skills)) {
                    throw new \Exception('Skills field is missing');
                } else {
                    $this->jobChoiceRepository->job_seeker_skill()->deleteMany($user->job_seeker);

                    if (!isFieldArrayNull($request->skills)) {
                        $this->saveJobSeekerSkill($request->skills, $user->job_seeker);
                    }                    
                }

                if (!isset($request->work_exp)) {
                    throw new \Exception('Work experience field is missing');
                } else {
                    $this->jobChoiceRepository->work_experience()->deleteMany($user->job_seeker);
                    
                    if (!isFieldArrayNull($request->work_exp)) {
                        $this->saveWorkExperience($request->work_exp, $user->job_seeker);
                    }                    
                }

                if (!isset($request->educational_bg)) {
                    throw new \Exception('Educational background field is missing.');
                } else {
                    $this->jobChoiceRepository->educational_background()->deleteMany($user->job_seeker);

                    if (!isFieldArrayNull($request->educational_bg)) {
                        $this->saveEducationalBackground($request->educational_bg, $user->job_seeker);
                    }
                }

                if(!isset($request->bank_account)) {
                    throw new \Exception('Bank account field is missing.');
                } else {
                    if (!isFieldArrayNull($request->bank_account)) {
                        validateInput($request->bank_account, BankAccount::createRules());
                    }

                    $this->jobChoiceRepository->bank_account()->updateModel($request->bank_account, $user->job_seeker);
                }
            }
        }

        return $user;
    }

     /**
     * Service that gets specific User and its relationship
     * @param  Int $id
     * @return Object User Collection
     */
    public function show($id)
    {
        if (is_null($id)) {
            // @codeCoverageIgnoreStart
            throw new \Exception('Please provide an ID parameter to find a user.');
            // @codeCoverageIgnoreEnd
        }

        if (!(int)$id) {
            throw new \Exception('Input is not an integer');
        }
        if (Auth::id() != 1) {
            if (Auth::id() != $id) {
                throw new \Exception('You don\'t have the rights to get this user.');
            }
        }

        $user = $this->jobChoiceRepository->user()->show($id);

        return $user;
    }

    /**
     * Check if user client updates the Company or JobSeeker
     * @param  Object  $request User client input
     * @return Array List of arrays
     */
    public function isCompanyOrJobSeekerValidator($request)
    {
        if ($request->company) {
            $rules = Company::createRules();
            $data = $request->company;
        } else {
            $rules = JobSeeker::createRules();
            $data = $request->job_seeker;
        }

        validateInput($data, $rules);
    }

    /**
     * Check what validator to use
     * @param  $request $request User client input
     * @param  int $id
     * @return array Validator Rules
     */
    public function validatorToUse($request, $id)
    {
        if (isset($request->password)) {
            return [
                'email'           => 'required|email|unique:users,id,'. $id,
                'first_name'      => 'nullable|min:1|max:50',
                'first_name_kana' => 'nullable|min:1|max:50',
                'last_name'       => 'nullable|min:1|max:50',
                'last_name_kana'  => 'nullable|min:1|max:50',
                'password'        => 'required|min:8',
                'c_password'      => 'required|min:8|same:password',
                'contact_no'      => 'required|string|min:1|max:15'
            ];
        }

        return [
                'email'           => 'required|email|unique:users,id,'. $id,
                'first_name'      => 'nullable|min:1|max:50',
                'first_name_kana' => 'nullable|min:1|max:50',
                'last_name'       => 'nullable|min:1|max:50',
                'last_name_kana'  => 'nullable|min:1|max:50',
                'contact_no'      => 'required|string|min:1|max:15'
            ];
    }

    /**
     * Service or logic  to save either company with its geolocation
     * or jobseeker with its geolocation, skill, work_exp and education
     * @param  Object $request User client input
     * @param  Object $user    User collection
     */
    public function saveClientType($request, $user)
    {
        $data = [];
        $client_input_data =  ($request->job_seeker) ? $request['job_seeker'] : $request['company'];

        $isAllEmpty = true;
        foreach ($client_input_data as $key => $value) {
            if (isset($key)) {
                $isAllEmpty = false;
                break;
                if (is_array($key)) {
                    foreach ($key as $key1 => $value1) {
                        if (isset($key1)) {
                            $isAllEmpty = false;
                            break;
                        }
                    }
                }
            }
        }

        if($isAllEmpty){
            return false;
        }

        $data = (isset($request->company)) ? $data = $request['company'] : $data = $request['job_seeker'];
        $data['user_id'] = $user->id;

        $this->isCompanyOrJobSeekerValidator($request);

        if (!is_null($request['company'])) {
            $data['type'] = 'company';
            $client = $this->jobChoiceRepository->company()->create($data);
            $this->saveGeolocation($request->company, $client);
        }

        if (!is_null($request['job_seeker'])) {
            $data['type'] = 'job_seeker';
            if (!is_null($request['job_seeker']['profile_picture'])) {
                $file = $this->uploadService->upload($request['job_seeker']['profile_picture'], $data['user_id']);
                $data['profile_picture'] = $file;
            }

            $client = $this->jobChoiceRepository->job_seeker()->create($data);
            $this->saveGeolocation($request->job_seeker, $client);

            if (!empty($request->skills)) {
                $this->saveJobSeekerSkill($request->skills, $client);
            }

            if (!empty($request->work_exp)) {
                $this->saveWorkExperience($request->work_exp, $client);
            }

            if (!empty($request->educational_bg)) {
                $this->saveEducationalBackground($request->educational_bg, $client);
            }

            if (!is_null($request->hataraki_kata)) {
                if (count($request->hataraki_kata) > 4) {
                    throw new \Exception('Only up to four hataraki kata are allowed.');
                }

                $this->jobChoiceRepository->hataraki_kata_resource()->createMany($request->hataraki_kata, $client);
            }

            if (!isset($request->bank_account)) {
                throw new \Exception('Bank account field missing.');
            } else {
                $this->saveBankAccount($request->bank_account, $client);
            }
        }
    }

    /**
     * Gets the user with given parameters
     * @param  Object $request Parameters of where clause
     * @return Object $user 
     */
    public function whereFirst($request)
    {
        $user = $this->jobChoiceRepository->user()->whereFirst($request->all());

        if (!$user) {
            throw new \Exception('Email does not exist.');
        }

        return $user;
    }

    /**
     * Getting all users from resource except admin accounts
     * @return Object Users Collection
     */
    public function index()
    {
        if (Auth::user()->type != 'admin') {
            throw new \Exception('You don\'t have the rights to view these users.');
        }

        $params = [
            ['type', '!=', 'admin'],
            ['sms_verified_at', '!=', NULL]
        ];

        return $this->jobChoiceRepository->user()->where($params, 20);
    }

    /**
     * Service and logic that will get all user's dashboard info of shared and applied jobs
     * @param  int $id
     * @return array List of counts and sum of incentives
     */
    public function getUserInfoDashboard($id = null)
    {
        // dynamic that uses id passed or gets the id of logged in user if no id was passed for retrieving user
        $id = ($id) ? $id : Auth::id();
        $user = $this->jobChoiceRepository->user()->show($id);

        if ($user->type == 'job_seeker') {

            $applied_jobs = $this->getAllappliedJobs($user);
            $shared_jobs = $this->getAllSharedJobs($user);
            $this_month_shared_jobs = $this->getAllThisMonthSharedjobs($user);
            $disclosed_shared_jobs = $this->getAllDisclosedSharedJob($shared_jobs);
            $this_month_disclosed_shared_jobs = $this->getAllThisMonthDisclosedSharedJobs($user);
            $work_experiences = $this->getAllWorkExperiences($user);
            $sum_disclosed_incentives = $this->getAllDisclosedIncentivesOnSharedJobs($user);
            $this_month_sum_disclosed_incentives = $this->getAllThisMonthDisclosedIncentivesOnSharedJobs($user);

            return [
                count($applied_jobs),
                count($shared_jobs),
                count($this_month_shared_jobs),
                count($disclosed_shared_jobs),
                count($this_month_disclosed_shared_jobs),
                count($work_experiences),
                $sum_disclosed_incentives,
                $this_month_sum_disclosed_incentives,
            ];
        }
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting disclosed shared jobs for current month
     * @param Object $user User object
     * @return Object Applied Job Collection
     */
    public function getAllThisMonthDisclosedSharedJobs($user)
    {
        $this_month_shared_jobs = $this->getAllThisMonthSharedjobs($user);
        $this_month_shared_job_ids = $this_month_shared_jobs->pluck('id');

        $applied_jobs = $this->jobChoiceRepository->applied_job()
                                                  ->whereIn(
                                                             'shared_job_id', 
                                                             $this_month_shared_job_ids->toArray()
                                                           );

        return $applied_jobs->whereIn('disclosed', 1);

    }

     /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting shared jobs that has been disclosed
     * @param Object $shared_jobs Collection of Shared Jobs
     * @return Object Appplied Job Collection
     */
    public function getAllDisclosedSharedJob($shared_jobs)
    {
        $shared_job_ids = $shared_jobs->pluck('id');
        $applied_jobs = $this->jobChoiceRepository->applied_job()
                                                  ->whereIn(
                                                             'shared_job_id', 
                                                             $shared_job_ids->toArray()
                                                           );

        return $applied_jobs->whereIn('disclosed', 1);
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting incentives on disclosed shared jobs for current month
     * @param  Object $disclosed_shared_jobs Collection of disclosed
     * @return int total_compensation of incentive_per_share of all shared jobs disclosed in current month
     */
    public function getAllThisMonthDisclosedIncentivesOnSharedJobs($user)
    {
        $params = [
            'slug_id' => $user->slug->id
        ];

        $dates = [
            Carbon::now()->startOfMonth()->toDateTimeString(),
            Carbon::now()->endOfMonth()->toDateTimeString()
        ];
        // hybrid sql function that gets the total incentive share of user in current month 
        $compensation = $this->jobChoiceRepository->shared_job()
                                                  ->hybridSumCompensation(
                                                                          $params, 
                                                                          'shared_jobs.created_at', 
                                                                          $dates
                                                                        );                                                             
        // returns total compensation else 0                                                                        
        $disclosed_incentive = ($compensation->total_compensation) ? $compensation->total_compensation : 0;

        return $disclosed_incentive;
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting all incentives on disclosed shared jobs
     * @param  Object $user shared jobs by current logged in user
     * @return int total_compensation of incentive_per_share of all shared jobs disclosed
     */
    public function getAllDisclosedIncentivesOnSharedJobs($user)
    {
        $params = [
            'slug_id' => $user->slug->id
        ];
        // hybrid sql function that gets the total incentive share of user
        $compensation = $this->jobChoiceRepository->shared_job()->hybridSumCompensation($params);
        // returns total compensation else 0    
        $disclosed_incentive = ($compensation->total_compensation) ? $compensation->total_compensation : 0;

        return $disclosed_incentive;
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting all applied jobs based on current logged in users
     * @param  Object $user Getting job seeker id based on logged in user
     * @return Object applied job collection
     */
    public function getAllappliedJobs($user)
    {
        $job_seeker_params = [
           'job_seeker_id' => $user->job_seeker->id
        ];

       return $this->jobChoiceRepository->applied_job()->where($job_seeker_params);
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting all shared jobs based on current logged in users
     * @param  Object $user Getting slugs id
     * @return Object shared job collection
     */
    public function getAllSharedJobs($user)
    {
        $slug_params = [
               'slug_id' => $user->slug->id
            ];

        return $this->jobChoiceRepository->shared_job()->where($slug_params);
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting shared jobs for current month
     * @param Object $user Getting slugs id
     * @return Object shared_jobs Collection
     */
    public function getAllThisMonthSharedjobs($user)
    {
        $params = [
            'slug_id' => $user->slug->id
        ];

        $month = Carbon::now()->month;
        $year = Carbon::now()->year;

        $shared_jobs = $this->jobChoiceRepository->shared_job()
                                                 ->whereWhereMonthAndYear(
                                                                            $params, 
                                                                            'created_at', 
                                                                            $month,
                                                                            $year                                                                                        
                                                                         );

        return $shared_jobs;
    }

    /**
     * Created this method to refactor getUserInfoDashboard method
     * Logics on getting all work experiences based on current logged in users
     * @param  Object $user Getting job seeker id based on logged in user
     * @return Object shared job collection
     */
    public function getAllWorkExperiences($user)
    {
        $job_seeker_params = [
            'job_seeker_id' => $user->job_seeker->id
        ];

        return $this->jobChoiceRepository->work_experience()->where($job_seeker_params);
    }

    /**
     * Logics on getting all users with applied and shared information for incentive use
     * @param  array $searchDates dates to search in between
     * @return Mixed $users       user mixed results
     */
    public function userIncentiveManagement($searchDates = [])
    {
        $dates = [
            Carbon::now()->startOfMonth()->toDateTimeString(),
            Carbon::now()->endOfMonth()->toDateTimeString()
        ];

        if (count($searchDates) > 0) {
            $dates = $searchDates;
        }

        $users =  $this->jobChoiceRepository->user()->userIncentiveManagement(
                                                                                $dates, 
                                                                                'DESC',
                                                                                20
                                                                             );

        return $this->appendIncentiveManagementInformation($users, $dates);
    }

    /**
     * Logics on getting all users with applied and shared information for incentive with searchable date params
     * @param  Object $request input by User
     * @return Mixed  $users   user mixed results
     */
    public function userIncentiveManagementSearch($request)
    {
        $dates = [];
        if ($request->start_date && $request->end_date) {
            $dates = [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ];
        }

        return $this->userIncentiveManagement($dates);
    }

    /**
     * Logics on getting all users with applied and shared information for incentive use
     * @param  Object $users   users retrieved from user incentive management
     * @param  array  $dates   dates for results to be queried, default to this month
     * @return Object $users   user mixed results
     */
    public function appendIncentiveManagementInformation($users, $dates)
    {
        foreach ($users as $user) {
            $shared_job_params = [
                'slug_id' => $user['slug_id']
            ];
            // gets per user's shared jobs
            $shared_jobs = $this->jobChoiceRepository->shared_job()->where($shared_job_params);
            $shared_job_ids = $shared_jobs->pluck('id')->toArray();
            $applied_jobs = $this->getAppliedSharedJobsPerUser($shared_job_ids, $dates);
            // sorts the applied jobs to descending based on updated_at field and
            // resets the key starting to 0 based on the newly sorted list    
            $user['applied_jobs'] = $applied_jobs->sortByDesc('updated_at')->values()->all();
            $user['no_disclosed'] = count($applied_jobs);

            $total_share_money = 0;
            foreach ($applied_jobs as $applied_job) {
                $total_share_money += $applied_job->job['incentive_per_share'];                
            }
            
            $bank_account_params = [
                'job_seeker_id' => $user['job_seeker_id']
            ];

            $user['bank_account'] = $this->jobChoiceRepository->bank_account()->whereFirst($bank_account_params);
            $user['total_share_money'] = $total_share_money;
        }

        return $users;
    }

    /**
     * Logic on getting applied jobs for all shared jobs of user where between dates
     * @param  array  $shared_job_ids  user's shared job ids
     * @param  array  $dates           dates for results to be queried, default to this month 
     * @return Object $applied_jobs    Applied jobs collection
     */
    public function getAppliedSharedJobsPerUser($shared_job_ids, $dates)  
    {
        $params = [
            'disclosed' => 1
        ];

        $select = ['id', 'job_seeker_id', 'job_id', 'status', 'disclosed', 'shared_job_id', 'updated_at'];
        $with = [
            'job_seeker' => function ($sub_query) {
                $sub_query->select('id', 'user_id');
            },
            'job_seeker.user' => function ($sub_query) {
                $sub_query->select('id', 'first_name', 'last_name');
            },
            'job' => function ($sub_query) {
                $sub_query->select('id', 'title', 'incentive_per_share');
            }
        ];

        $applied_jobs = $this->jobChoiceRepository
                             ->applied_job()
                             ->whereWhereInAndWhereBetweenWith(
                                                                $params, 
                                                                'shared_job_id', 
                                                                $shared_job_ids, 
                                                                'updated_at', 
                                                                $dates, 
                                                                $with, 
                                                                $select
                                                              );

        return $applied_jobs;
    }

}
