<?php

namespace App\Services;

use Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;
use App\Models\SharedJob;

class JobSeekerService
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
     * Service that gets specific User and its relationship
     * @param  int $id
     * @return Object Job Seeker Collection
     */
    public function show($id)
    {
        if (is_null($id)) {
            throw new \Exception('Please provide an ID parameter to find a user.');
        }

        if (!(int)$id) {
            throw new \Exception('Input is not an integer');
        }

        $with = [
            'user.slug',
            'bank_account',
            'geolocation',
            'hataraki_kata_resource.hataraki_kata',
            'job_seeker_skills.skill',
            'work_experience',
            'educational_background',
        ];

        $job_seeker = $this->jobChoiceRepository->job_seeker()->show($id, $with);

        return $job_seeker;
    }

    /**
     * Getting all job seekers from job_seekers table
     * @return Object JobSeekers Collection
     */
    public function index()
    {
        $with = ['user', 'geolocation'];
        $job_seekers = $this->jobChoiceRepository->job_seeker()->all($with, 20);

        return $job_seekers;
    }

    /**
     * Find JobSeekers by using search
     * @param  Object $request User Data Input
     * @return Object Collection of JobSeekers
     */
    public function jobSeekerSearch($request)
    {
        $finalWhereInParams = $whereParams = $whereInParams = $whereBetweenParams = $to_intersect = [];
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

        if ($request->gender != 'all'){
            // where params is if searching directly sa in job seekers table
            $whereParams[] = ['gender', '=', $request->gender];
        }

        if (isset($request->age['min']) && isset($request->age['max'])){
            // max variable is set from the min age passed by user because it is using subYears
            $max_year = Carbon::now()->subYears($request->age['min'])->endOfDay()->toDateTimeString();
            $min_year = Carbon::now()->subYears($request->age['max'])->startOfDay()->toDateTimeString();

            $whereBetweenParams[] = formatWhereBetweenParams('birth_date', $min_year, $max_year);
        }

        // keyword, has applied history, has shared history searches
        if (isset($request->keyword) ||
            isset($request->has_shared_job) ||
            isset($request->has_applied_job)) {
            $to_intersect[] = $this->jobSeekerKeyWordSearchAndHasSharedAndApplied($request);
        }

        $finalWhereInParams = arrayIntersectResults($whereInParams);
        $to_intersect[] = $this->jobChoiceRepository
                                ->job_seeker()
                                ->hybridWhere($whereParams, $finalWhereInParams, $whereBetweenParams, $touched);

        // remove duplicates and get the job seeker ids
        $searched_job_seekers_ids = collectionIntersectResults($to_intersect)->pluck('id')->toArray();

        $with = ['user', 'geolocation'];
        $searched_job_seekers_with_pagination = $this->jobChoiceRepository->job_seeker()->whereIn(
                                                    'id',
                                                    $searched_job_seekers_ids,
                                                    $with,
                                                    20
                                                );

        return $searched_job_seekers_with_pagination;
    }

    /**
     * Find Job seekers by using key words and others search params (has shared job, has applied job)
     * @param  Object $request Data User input
     * @return Object Collection of JobSeekers
     */
    public function jobSeekerKeyWordSearchAndHasSharedAndApplied($request)
    {
        $params = [];
        if (isset($request->has_shared_job)) {
            $params[] = ['has_shared_job', '=', $request->has_shared_job];
        }

        if (isset($request->has_applied_job)) {
            $params[] = ['has_applied_job', '=', $request->has_applied_job];
        }

        if (isset($request->keyword)){
            $params[] = ['item', 'like', '%' .$request->keyword. '%'];
        }

        $job_seeker_ids = $this->jobChoiceRepository
                            ->job_seeker_search()
                            ->where($params)
                            ->pluck('id')
                            ->toArray();

        return $this->jobChoiceRepository->job_seeker()->whereIn('id', $job_seeker_ids);
    }

    /**
     * Dynamic function that returns job seeker ids based on the searched fields in geolocation table
     * @param  String $key
     * @param  String $value
     * @return array Array of job ids
     */
    public function searchUnderGeolocationFields($key, $value)
    {
        $params = [
            [$key, 'like', '%' .$value. '%'],
            ['taggable_type', '=', 'JobSeeker']
        ];
        return $this->jobChoiceRepository->geolocation()->where($params)->pluck('taggable_id')->toArray();
    }

    /**
     * Dynamic function that returns job seeker ids based on the searched fields in users table
     * @param  String $key
     * @param  String $value
     * @return array Array of job ids
     */
    public function searchUnderUserFields($key, $value)
    {
        $params = [
            [$key, 'like', '%' .$value. '%'],
            ['type', '=', 'job_seeker']
        ];
        // get user ids
        $user_ids = $this->jobChoiceRepository->user()
                                                ->where($params)
                                                ->pluck('id')
                                                ->toArray();

        // get company ids based on where In search
        $company_ids = $this->jobChoiceRepository->job_seeker()
                                                    ->whereIn('user_id', $user_ids)
                                                    ->pluck('id')
                                                    ->toArray();

        return $company_ids;
    }

}

