<?php

namespace App\Services;

use Auth;
use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;

class CompanyService
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
     * Service and Logic to get all jobs under this company that is currently logged in
     * @return object Job collections
     */
    public function getJobs($request)
    {
        $company_id = Auth::user()->load('company')->company->id;
        $touched = false;

      $whereInParams = [];
        if (isset($request->keyword)) {
            $touched = true;
            $whereInParams = $this->keyWordSearch($request->keyword);
        }

        //check if a param is passed in keyword search
        if ($touched) {
            $whereInField = 'id';
        } else {
            $whereInField = (isFieldArrayNull($whereInParams)) ? NULL : 'id';
        }

        $params = [
            'company_id' => $company_id
        ];

        $whereHasField = 'publication';
        $whereHasParams = [];

        if (isset($request->published_start_date)) {
            $whereHasParams[] = ['published_start_date', '<=', $request->published_start_date];
            $whereHasParams[] = ['published_end_date', '>=', $request->published_end_date];
        }

        if (isset($request->status)) {
            $whereHasParams[] = ['status', $request->status];
        }

        $paginate = isset($request->paginate) ? $request->paginate : 4;

        $company_jobs = $this->jobChoiceRepository->job()->companyJobDetails(
                                                                                $params,
                                                                                $whereInField,
                                                                                $whereInParams,
                                                                                $whereHasField,
                                                                                $whereHasParams,
                                                                                $paginate
                                                                            );

        return $this->appendJobSharedAppliedCount($company_jobs);
    }

    /**
     * Append job details on how many it was applied and shared
     * @param  $company_jobs Job Collections
     * @return Hybrid Collection/Array of Job with its count on applied and shared details
     */
    public function appendJobSharedAppliedCount($company_jobs)
    {
        foreach ($company_jobs as $key => $value) {
            $relatedParams = ['job_id' => $value['id']];
            $shared_job = $this->jobChoiceRepository->shared_job()->where($relatedParams);
            $applied_job = $this->jobChoiceRepository->applied_job()->where($relatedParams);

            $value['num_shares'] = count($shared_job);
            $value['num_applied'] = count($applied_job);
            $value['num_waiting'] = count($applied_job->where('status', 'waiting'));
            $value['num_disclosed'] = count($applied_job->where('disclosed', 1));
            $value['num_hired'] = count($applied_job->where('status', 'success'));
        }

        return $company_jobs;
    }

    /**
     * Service and Logics that checks if the job passed is owned by current logged in company
     * @param  Int $job_id
     * @return Mixed Throws Exception if company doesn't own the job else true
     */
    public function doesCompanyOwnThisJob($job_id)
    {
        $company_id = Auth::user()->load('company')->company->id;

        $params = [
            'id' => $job_id,
            'company_id' => $company_id
        ];

        $result = $this->jobChoiceRepository->job()->where($params);

        if (count($result) > 0) {
            return true;
        }

        throw new \Exception('You have no rights to this job');
    }

    /**
     * Service and Logics that gets jobs under logged in company
     * jobs with search params
     * @param  Int $id User client input
     * @return Object Array Job ids base on search
     */
    public function jobSearch($request)
    {
        $company_id = Auth::user()->company->id;

        $whereInField = 'publishable_id';
        //job ids
        $whereInParams = $this->jobChoiceRepository
                                ->job()
                                ->where(['company_id' => $company_id])
                                ->pluck('id')
                                ->toArray();

        $whereBetweenData = [];
        if (isset($request->published_start_date) && isset($request->published_end_date)) {
            $whereBetweenData = [
                'published_start_date' => [$request->published_start_date, $request->published_end_date],
                'published_end_date' => [$request->published_start_date, $request->published_end_date]
            ];
        }

        $whereParams = [
            'publishable_type' => 'Job',
        ];

        if (isset($request->status)) {
            $whereParams['status'] = $request->status;
        }

        $paginate = isset($request->paginate) ? $request->paginate : null;

        $job_ids = $this->jobChoiceRepository
                    ->publication()
                    ->hybridWhereAndWhereInAndWhereBetween($whereParams, $whereBetweenData, $whereInField, $whereInParams, $paginate)
                    ->pluck('publishable_id')
                    ->toArray();

        return $job_ids;
    }

    /**
     * Find company jobs by searching key words input
     * @param  String $value String of key words
     * @return Object Array Job ids base on Keyword search
     */
    public function keyWordSearch($value)
    {
        $job_ids = $this->jobChoiceRepository
                        ->company_job_search()
                        ->keywordSearch($value)
                        ->pluck('id')
                        ->toArray();

        return $job_ids;
    }

    /**
     * Getting all companies from Companies table
     * @return Object Companies Collection
     */
    public function index()
    {
        $with = ['user', 'geolocation'];
        $users = $this->jobChoiceRepository->company()->all($with, 20);

        return $users;
    }

    /**
     * Service that gets specific job
     * @param int $id
     * @return Object Job Collection
     */
    public function show($id)
    {
        $with = [
            'geolocation',
            'industry',
            'user'
        ];

        return $this->jobChoiceRepository->company()->show($id, $with);
    }

    /**
     * Find Companies by using search
     * @param  Object $request User Data input
     * @return Object Collection of Companies from search
     */
    public function adminCompanySearch($request)
    {
        $finalWhereInParams = $whereParams = $whereInParams = $whereBetweenParams = $toIntersect = [];
        // check if it performed a search based on the fields passed
        $touched = false;

        if (isset($request->complete_address)){
            $touched = true;
            $whereInParams[] = $this->searchUnderGeolocationFields('complete_address', $request->complete_address);
        }

        if (isset($request->prefectures)){
            $touched = true;
            $whereInParams[] = $this->searchUnderGeolocationFields('prefectures', $request->prefectures);
        }

        if (isset($request->email)){
            $touched = true;
            $whereInParams[] = $this->searchUnderUserFields('email', $request->email);
        }

        if (isset($request->contact_no)){
            $touched = true;
            $whereInParams[] = $this->searchUnderUserFields('contact_no', $request->contact_no);
        }

        // keyword, Posting Job, Not Disclosed searches
        list ($company_ids_from_keyword_search, $keyword_touched)
        = $this->companyKeyWordSearchAndRadioButtonSearch($request);
        if ($keyword_touched) {
            $touched = true;
            $whereInParams[] = $company_ids_from_keyword_search;
        }

        if ($touched) {
            $finalWhereInParams = arrayIntersectResults($whereInParams);
            // $toIntersect[] = $this->jobChoiceRepository->company()->whereIn('id', $finalWhereInParams);
        } else {
            return $this->index();
        }

        $searchedCompanies = $this->jobChoiceRepository->company()->whereIn('id', $finalWhereInParams);
        // $searchedCompanies = collectionIntersectResults($toIntersect);

        return $this->makeSearchedCompanyAsList($searchedCompanies->pluck('id'));
    }

    /**
     * Getting all companies from Users table
     * @param  Array $company_ids
     * @return Object Companies Collection
     */
    public function makeSearchedCompanyAsList($company_ids)
    {
        $with = ['user', 'geolocation'];
        $companies = $this->jobChoiceRepository->company()->whereIn('id', $company_ids->toArray(), $with, 20);

        return $companies;
    }

    /**
     * Find companies by using key words and others search params (has posting job, has no disclosed)
     * @param  Object $request Data User input
     * @return Object Collection of companies
     */
    public function companyKeyWordSearchAndRadioButtonSearch($request)
    {
        $params = [];
        $keyword_params = null;
        $touched = false;

        if ($request->has_job_posted != 'all'){
            $touched = true;
            // check if company has atleast 1 posting job
            $has_job_posted = $request->has_job_posted == 'yes' ? 1 : 0;
            $params[] = ['has_job_posted', '=', $has_job_posted];
        }

        if ($request->has_not_disclosed != 'all'){
            $touched = true;
            // check if company has no disclosed job in all job posted
            $has_not_disclosed = $request->has_not_disclosed == 'yes' ? 1 : 0;
            $params[] = ['has_not_disclosed', '=', $has_not_disclosed];
        }

        if (isset($request->keyword)){
            $touched = true;
            $keyword_params = $request->keyword;
        }
        // perform search if atleast one param is passed in searching
        if ($touched) {
            $company_ids = $this->jobChoiceRepository
                                ->admin_company_search()
                                ->keywordSearch($keyword_params, $params)
                                ->pluck('id')
                                ->toArray();

            return [$company_ids, $touched];
        }

        return [[], $touched];
    }

    /**
     * Dynamic function that returns company ids based on the searched fields in geolocation table
     * @param  String $keyi
     * @param  String $value
     * @return array Array of job ids
     */
    public function searchUnderGeolocationFields($key, $value)
    {
        $params = [
            [$key, 'like', '%' .$value. '%'],
            ['taggable_type', '=', 'Company']
        ];

        return $this->jobChoiceRepository->geolocation()
                                        ->where($params)
                                        ->pluck('taggable_id')
                                        ->toArray();
    }

    /**
     * Dynamic function that returns company ids based on the searched fields in users table
     * @param  String $key
     * @param  String $value
     * @return array Array of job ids
     */
    public function searchUnderUserFields($key, $value)
    {
        $params = [
            [$key, 'like', '%' .$value. '%'],
            ['type', '=', 'company']
        ];
        // get user ids
        $user_ids = $this->jobChoiceRepository->user()
                                                ->where($params)
                                                ->pluck('id')
                                                ->toArray();

        // get company ids based on where In search
        $company_ids = $this->jobChoiceRepository->company()
                                                    ->whereIn('user_id', $user_ids)
                                                    ->pluck('id')
                                                    ->toArray();

        return $company_ids;
    }
}
