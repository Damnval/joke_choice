<?php

namespace App\Services;

use Auth;
use Mail;
use App\Models\Billing;
use App\Repositories\JobChoiceRepository;
use App\Mail\AppliedJob\Store\InformCompanyAppiedJob;
use App\Mail\AppliedJob\Store\InformApplicantAppiedJob;

class AppliedJobService
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
    * Logics and functions in getting applied jobs of that specific user
    * @param  Object $request Input from user
    * @return  Object applied_jobs With paginations
    */
    public function index($request)
    {
        $user = $this->jobChoiceRepository->user()->show(Auth::id());
        $job_seeker_id = $user->job_seeker->id;

        $whereParams = [
            'job_seeker_id' => $job_seeker_id
        ];

        $whereInParams = $request->status;
        if (isFieldArrayNull($request->status)) {
            $whereInParams = [];
        }

        $applied_jobs = $this->jobChoiceRepository
                             ->applied_job()
                             ->whereAndWhereIn($whereParams, 'status', $whereInParams, 20);

        foreach ($applied_jobs as $applied_job) {
            $applied_job['job_share_count'] = count($applied_job['job']['shared_job']);
        }

        return $applied_jobs;
    }

    /**
     * Logics and service on saving applied job
     * @param  Object $request
     * @return Object Saved applied job
     */
    public function store($request)
    {
        $data =  $request->all();
        $data['job_seeker_id'] = Auth::user()->job_seeker->id;
        $params = [
            'job_seeker_id' => $data['job_seeker_id'],
            'job_id' => $data['job_id'],
        ];

        $job = $this->jobChoiceRepository->applied_job()->where($params);

        if (count($job) > 0) {
            throw new \Exception('You have already applied to this job.');
        }

        $applied_job = $this->jobChoiceRepository->applied_job()->create($data);

        //Sends an email to company that someone applied thier posted job
        Mail::send(new InformCompanyAppiedJob($applied_job));
        //Sends an email to job seeker that of what he/she applied
        Mail::send(new InformApplicantAppiedJob($applied_job));

        return $applied_job;
    }

    /**
     * Get applicants who applied for the specific job
     * @param  Object $request Request $request user client input
     * @return object Applied Jobs Collection
     */
    public function getJobApplicants($request)
    {
        $auth_company_id = Auth::user()->company->id;
        $company =  $this->jobChoiceRepository->job()->show($request->job_id)->company_id;

        if ($company != $auth_company_id) {
            throw new \Exception('You have no rights to view this job');
        }

        $applied_jobs = $this->jobChoiceRepository->applied_job()
                                                  ->hybridJobApplicationList(
                                                      $request->job_id, 
                                                      $request->age, 
                                                      $request->gender, 
                                                      $request->employment_status, 
                                                      $request->keyword
                                                  );
        // appends job matching ratio per applicant                                                                                
        $applied_jobs = $this->appendMatchingRatio($applied_jobs);                                                                                      
        // converts raw query array to collection for sorting
        $collection = collect($applied_jobs);
        $sorted = $collection->sortByDesc('applicant_job_match_ratio');
        $result['applied_jobs'] = $sorted->values()->all();
        $result['job_questions'] = $this->jobQuestionsAndAnswers($request)->toArray();

        return $result;
    }

    /**
     * Appends a job matching ratio depending on job seekers hataraki_kata
     * @param  array $applied_jobs array of applicants
     * @return array $applied_jobs array of applicants with appended ratio
     */
    public function appendMatchingRatio($applied_jobs)
    {
        foreach ($applied_jobs as $applied_job) {
            $job_match_ratio = $this->jobChoiceRepository->job()
                                                         ->matchingJobsWithRatio(
                                                             $applied_job->applicant_job_seeker_id,
                                                             null, 
                                                             $applied_job->job_id
                                                         )
                                                         ->first();
                                                                
            $applied_job->applicant_job_match_ratio = ($job_match_ratio) ? $job_match_ratio->matching_ratio : 0;                                                                      
        }

        return $applied_jobs;
    }

    /**
     * Service and logics on getting applicant info if it is disclosed or not
     * This method is for company which somebody applied in their jobs
     * @param  Object $request
     * @return array $result mixed results with object and int
     */
    public function getApplicantInformation($request)
    {
        $search_applied_job_params = [
            'job_seeker_id' => $request->job_seeker_id,
            'job_id' => $request->job_id,
        ];

        $job_seeker_params = ['job_seeker_id' => $request->job_seeker_id];

        $isDisclosed = $this->jobChoiceRepository->applied_job()->whereFirst($search_applied_job_params);

        if (!$isDisclosed) {
            throw new \Exception('Record not found.');
        }

        $result = $this->jobChoiceRepository
                        ->applied_job()
                        ->getAccountInformation($search_applied_job_params, $isDisclosed->disclosed);

        $total_applied_job = $this->jobChoiceRepository->applied_job()->where($job_seeker_params);

        $result['num_applied'] = count($total_applied_job);
        $result['num_under_application'] = count($total_applied_job->where('status', 'pending'));
        $result['num_hired'] = count($total_applied_job->where('status', 'success'));
        $result['num_rejected'] = count($total_applied_job->where('status', 'rejected'));
        $result['job_questions'] = $this->jobQuestionsAndAnswers($request)->toArray();

        return $result;
    }

    /**
     * Function that gets the questions of the applied job
     * If job_seeker_id is given, it also returns job seekers' answers of those questions
     * @param  Object $request input by user
     * @return Object $job_questions_and_answers job questions resource with answers relation
     */
    public function jobQuestionsAndAnswers($request)
    {
        $params = [
            'job_id' => $request->job_id
        ];
        $with = ['job_question_job_seeker_answers.job_question_answer'];

        if ($request->job_seeker_id) {
            $with = [
                'job_question_job_seeker_answers' => function ($query) use ($request) {
                    $query->where('job_seeker_id', $request->job_seeker_id);
                },
                'job_question_job_seeker_answers.job_question_answer'
            ];
        }

        $job_questions_and_answers = $this->jobChoiceRepository->job_question()->where($params, $with);

        return $job_questions_and_answers;
    }

    /**
     * Service and Logic to update disclosed field in applied jobs table
     * Updates status as well in applied jobs base on the disclosed value
     * @param  Object $request User input
     * @return Boolean If updated was successful or not
     */
    public function updateDisClose($request)
    {
        $toUpdate = [
            'disclosed' => $request->disclosed
        ];

        $whereParams = [
            'job_seeker_id' => $request->job_seeker_id,
            'job_id' => $request->job_id
        ];

        list($job, $job_seeker) = $this->appliedJobList($request);

        // disclosed is 1
        if ($request->disclosed) {
            $toUpdate['status'] = 'pending';
            $result = $this->jobChoiceRepository->applied_job()->updateWhere($toUpdate, $whereParams);
            $sharer = $this->jobChoiceRepository->applied_job()->whereFirst($whereParams);
            if ($sharer->shared_job_id) {
                $this->emailSharer($request, $job, $job_seeker);
            }
            //saves billing
            $this->billDisclosedJob($job);
        // not disclosed is 0
        } else {
            $toUpdate['status'] = 'rejected';
            $result = $this->jobChoiceRepository->applied_job()->updateWhere($toUpdate, $whereParams);
        }

        if (!$result) {
            throw new \Exception("Record not found in applied jobs.");
        }

        // sends an email to applicant after updating applied job
        $this->emailApplicationResult($request->disclosed, $job, $job_seeker);
    }

    /**
     * Service that returns job and job_seeker info
     * @param  Object $request Request $request user client input
     * @return array $job and job_seeker objects
     */
    public function appliedJobList($request)
    {
        $job = $this->jobChoiceRepository->job()->show($request->job_id);
        $job_seeker =  $this->jobChoiceRepository->job_seeker()->show($request->job_seeker_id, 'user');
        return [$job, $job_seeker];
    }

    /**
     * Will send an email to Job seeker if his profile has been viewed (disclosed) or rejected
     * @param Boolean $disclosed
     * @param Object $job
     * @param Object $job_seeker
     */
    public function emailApplicationResult($disclosed, $job, $job_seeker)
    {
        $subject = ($disclosed == 1)?'【JOBチョイス：通知】シェア報酬が確定しました。':'【JOBチョイス：通知】' . $job->title;
        Mail::send('emails.applicationResults', [
                                                    'job' => $job,
                                                    'disclosed' => $disclosed,
                                                ],
            function ($message) use ($job_seeker, $subject) {
                $message->from(config('app.job_choice_support_email'));
                $message->to($job_seeker['user']['email'])->subject($subject);
        });
    }

     /**
     * Will send an email to sharer if applicant has been disclosed
     * @param Object $request Input By user client
     * @param Object $job
     * @param Object $job_seeker
     */
    public function emailSharer($request, $job, $job_seeker)
    {
        $params = [
            'job_seeker_id' => $request->job_seeker_id,
            'job_id' => $request->job_id,

        ];

        $sharer = $this->jobChoiceRepository->applied_job()->whereFirst($params, ['shared_job.slug.user']);

        Mail::send('emails.applicationDisclosed', [
                                                    'job_seeker' => $job_seeker,
                                                    'job' => $job,
                                                    'sharer' => $sharer->shared_job->slug->user
                                                ],
            function ($message) use ($sharer) {

                $message->from(config('app.job_choice_support_email'));
                $message->to($sharer->shared_job->slug->user->email)->subject('【JOBチョイス：通知】シェア報酬が確定しました。');
        });
    }

     /**
     * Service logic to remove Job from resource
     * @param int $id Input by user
     * @return boolean Job successfully deleted
     */
    public function delete($id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to delete.');
        }
        $applied_job = $this->jobChoiceRepository->applied_job()->show($id);

        if (!$applied_job) {
            throw new \Exception('The record that you want to delete doesn\'t exist or has been deleted already.');
        }

        $job_seeker_id = $applied_job->job_seeker_id;
        $job_seeker = $this->jobChoiceRepository->job_seeker()->show($job_seeker_id, 'user');

        if (Auth::id() != 1) {
            if (Auth::id() != $job_seeker->user->id) {
                throw new \Exception('You don\'t have permission to delete this application.');
            }
        }

        $applied_job = $this->jobChoiceRepository->applied_job()->destroy($id);

        return $applied_job;
    }

    /**
     * After disclosing a job, saves a record in billings
     * @param  Object $job Job that is being disclosed
     */
    public function billDisclosedJob($job)
    {
        // get random 7 integer for billing
        $billing_code = $this->getBillingID(7);
        //get company ID based on logged in
        $company_id = Auth::user()->company->id;

        $billingData = [
            'billing_code' => $billing_code,
            'detail_type' => 'disclosure',
            'company_id' => $company_id
        ];

        validateInput($billingData, Billing::createRules());
        $this->jobChoiceRepository->billing()->createMorph($billingData, $job);
    }

    /**
     * Generates a random number as a billing number and then check if it already exist
     * if exist, will loop itself and generate a new billing number
     * @param  Int $length Number length of billing number to generate
     * @return Int $billing_code Billing code
     */
    public function getBillingID($length)
    {
        // generate billing code
        $billing_code = generateRandomInt($length);
        $params = [
            'billing_code' => $billing_code
        ];
        //search if billing code exist
       $billing = $this->jobChoiceRepository->billing()->where($params);

       // check if billing does exist, if it does, repeat method.
       if (count($billing->toArray()) > 0) {
            $this->getBillingID($length);
       }

       return $billing_code;
    }

    /**
     * Dynamic getting the count of Undisclosed job of a company
     * @param  Collections $companies
     * @return Collections $companies  Companies appended by number of undisclosed jobs
     */
    public function appendUndisclosed($companies)
    {
        foreach ($companies as $company => $value) {

            $company_id = $value['id'];
            // get total count of undisclosed(not been disclosed or rejected) job under this current company in foreach
            $applied_jobs = $this->getNumberOfUndisclosedJob($company_id);

            $value['number_of_undisclosed'] = $applied_jobs->count();
        }

        return $companies;
    }

     /**
     * Logic that will count the total number of undisclosed job of a company
     * @param  int  $company_id
     * @return Collection applied_jobs
     */
    public function getNumberOfUndisclosedJob(int $company_id)
    {
        $params = [
            'company_id' => $company_id
        ];
        // gets all the jobs of the current company in foreach
        $job_ids = $this->jobChoiceRepository->job()->where($params)->pluck('id')->toArray();

        $apply_job_params = [
            'status' => 'waiting'
        ];

        return $this->jobChoiceRepository
                    ->applied_job()
                    ->whereAndWhereIn(
                                    $apply_job_params,
                                    'job_id',
                                    $job_ids
                                );
    }

    /**
     * Service and logic that appends the total applied jobs of a job seeker
     * @param  Collection $job_seekers job_seekers Collections
     * @return Hybrid job_seekers collection appended by total applied jobs
     */
    public function appendCountAppliedJobs($job_seekers)
    {
        $applied_count = 0;
        foreach ($job_seekers as $job_seeker) {

            // gets the total applications of job seeker
            $applied_jobs = $this->getAllApplication($job_seeker['id']);
            $applied_count = $applied_jobs->count();
            $job_seeker['count_application'] = $applied_count;
        }

        return $job_seekers;
    }

    /**
     * Get all applied jobs of job seeker
     * @param  Int $job_seeker_id
     * @return Collection $applied_jobs Applied Job collection
     */
    public function getAllApplication($job_seeker_id)
    {
        $params = [
            'job_seeker_id' => $job_seeker_id
        ];

        $applied_jobs = $this->jobChoiceRepository->applied_job()->where($params);

        return $applied_jobs;
    }

}

