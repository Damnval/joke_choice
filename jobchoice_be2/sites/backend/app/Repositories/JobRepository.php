<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

use DB;

class JobRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job;

    // Constructor to bind model to repo
    public function __construct(Model $job)
    {
        $this->job = $job;
    }

    /**
     * Retrive all jobs
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate jobs per page
     * @return Object Job collections
     */
    public function all(array $with = [], int $paginate = null)
    {
        $query = $this->job;

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }
        // Below are the with relationships. Will delete this once all are verified that nothing has been affected
        // 'job_job_sub_categories.job_sub_category.job_category',
        // 'company',
        // 'hataraki_kata_resource.hataraki_kata',
        // 'geolocation',
        // 'nearest_station',
        // 'analytic'
        return $query->get();
    }

    /**
     * Saving job data to jobs resource
     * @param array $data Input from user
     * @return Collection Saved job from db
     */
    public function create(array $data)
    {
        $this->job->fill($data);
        $this->job->save();
        return $this->job;
    }

    /**
     * Updating job data to jobs resource
     * @param array $data Input from user
     * @return Collection Saved job from db
     */
    public function update(array $data, $id)
    {
        $job = $this->job->find($id);
        $job->update($data);
        if ($job->update($data)) {
            return $job;
        }
        return false;
    }

    /**
     * Remove Job from resource
     * @param int $id ID of Job
     * @return Boolean Result if deleted
     */
    public function destroy($id)
    {
        return $this->job->destroy($id);
    }

    /**
     * Retrive specific jobs
     * @param int $id
     * @return Object Job collections
     */
    public function show($id)
    {
        return $this->job
                    ->with(
                        'job_job_sub_categories.job_sub_category',
                        'company',
                        'geolocation',
                        'galleries',
                        'hataraki_kata_resource.hataraki_kata',
                        'other_hataraki_kata.hataraki_kata',
                        'days',
                        'notes',
                        'publication',
                        'nearest_station',
                        'job_strengths',
                        'job_welfares',
                        'job_reasons_to_hire',
                        'job_questions.job_question_answers',
                        'analytic'
                    )
                    ->findOrFail($id);
    }

    /**
     * Multiple keyword Search
     * @param array $data
     * @return Object job collection
     */
    public function keywordSearch($data)
    {
        if (!$data || is_null($data['keyword'])) {
            return [];
        }

        $searchWords = explode(" ", $data['keyword']);

        $jobQuery = $this->job
                         ->with(
                                'job_job_sub_categories.job_sub_category',
                                'company',
                                'hataraki_kata_resource.hataraki_kata'
                            );

        $words = [];

        foreach ($searchWords as $word) {
            if (count($words) > 0) {
                $jobQuery->orWhere('title', 'like', '%' . $word . '%');
            } else {
                $jobQuery->Where('title', 'like', '%' . $word . '%');
                $words[] = $word;
            }
        }

        $jobs = $jobQuery->orWhereHas('company', function ($query) use ($searchWords) {
            $words = [];
            foreach ($searchWords as $word) {
                if (count($words) > 0) {
                    $query->orWhere('name', 'like', '%' . $word . '%');
                } else {
                    $query->Where('name', 'like', '%' . $word . '%');
                    $words[] = $word;
                }
            }
        })->get();

        return $jobs;
    }

    /**
     * Retrieves all jobs based on given parameter
     * @param array $data values to search
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate jobs per page
     * @return Object job collection
     */
    public function where(array $data, array $with = [], $paginate = null)
    {
        $query = $this->job->where($data);
        // Below are the with relationships. Will delete this once all are verified that nothing has been affected
        // ->with(
        //       'job_job_sub_categories.job_sub_category.job_category',
        //       'company.user',
        //       'hataraki_kata_resource.hataraki_kata',
        //       'days',
        //       'geolocation',
        //       'nearest_station'
        //   );
        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Retrieves first job based on given parameter
     * @param array $data values to search
     * @return Object job collection
     */
    public function whereFirst(array $data)
    {
        return $this->job
                    ->where($data)
                    ->with(
                        'job_job_sub_categories.job_sub_category.job_category',
                        'company.user',
                        'hataraki_kata_resource.hataraki_kata',
                        'days'
                    )
                    ->first();
    }

    /**
     * Retrieves all jobs based on given parameter
     * @param string $field Column to pass where in
     * @param array $data values to search between
     * @return Object job collection
     */
    public function whereBetween($field, array $data)
    {
        return $this->job
                    ->whereBetween($field, $data)
                    ->with(
                        'job_job_sub_categories.job_sub_category.job_category',
                        'company.user',
                        'hataraki_kata_resource.hataraki_kata',
                        'days'
                    )
                    ->get();
    }
    /**
     * Dynamic Retrieves of a job based on given id and dynamic with
     * @param int $id Id of job
     * @param array $with retrieving relationships based on user required data
     * @return Object job collection
     */
    public function showWith($id, $with)
    {
        return $this->job->with($with)->findOrFail($id);
    }

    /**
     * Dynamic retrieving of a job based on given params using where in MySQL
     * @param string $field Column to pass where in
     * @param array $data values to search
     * @param int $paginate jobs per page
     * @return Object job collection
     */
    public function whereIn($field, array $data, $paginate = null)
    {
        $query =  $this->job
                       ->whereIn($field, $data)
                       ->with(
                            'job_job_sub_categories.job_sub_category',
                            'company.user',
                            'hataraki_kata_resource.hataraki_kata',
                            'days'
                        );

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Dynamic retrieving of a job based on given params using where in MySQL
     * @param  string $field        column to pass where in
     * @param  array  $whereInData  params values to search
     * @param  array  $with         retrieving relationships based on user required data
     * @param  int    $paginate     jobs per page
     * @return Object job collection
     */
    public function whereInAndWith($field = null, $whereInData = [], $with = null, $paginate = null, $select = '*')
    {
        $query = $this->job->select($select);

        if ($field) {
            $query->whereIn($field, $whereInData);
        }

        if ($with) {
            $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Hybrid retrieving of a job based on given params
     * @param String $whereInField field to check in whereIn
     * @param array $whereIn  parameter that uses whereIn in MySQL
     * @param String $whereBetweenField field to use in whereBetween in MySQL
     * @param array $whereBetween parameter that uses whereBetween in MySQL
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate jobs per page
     * @return Object job collection
     */
    public function hybridWhere(
        $whereInField,
        array $whereIn,
        $whereBetweenField,
        array $whereBetween,
        array $with = null,
        int $paginate = null,
        array $hataraki_kata_special_case_query = []
    )
    {
        $query = $this->job;

        if ($with) {
           $query = $query->with($with);
        }

        $query = $query->whereIn($whereInField, $whereIn);

        if (!empty($whereBetween) && count($whereBetween) != 0) {
            $query = $query->whereBetween($whereBetweenField, $whereBetween);
        }

        if (count($hataraki_kata_special_case_query) > 0) {

            $query = $query->whereIn('id', $hataraki_kata_special_case_query);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Custom query that retrieves all jobs with a matching ratio based on job seeker's hataraki_kata
     * Reference SQL Query in public/reference/sql/JobRepository/MatchingJobsWithRatio.sql
     * @param int    $job_seeker_id job seeker's id
     * @param int    $paginate      jobs per page
     * @param int    $job_id        job's id to get matching ratio of only a specific job
     * @param string $whereInField  field to search where in
     * @param array  $whereIn       where in params
     * @return $query job collection
     */
    public function matchingJobsWithRatio($job_seeker_id, $paginate = null, $job_id = null, $whereInField = null, $whereInParams = [])
    {
        // Query that gets the points for the main hataraki_kata of jobs based on job seeker's hataraki kata
        $first_union_query = $this->job->select('hk_r_job.taggable_id as job_id', DB::raw('count(*) * 11 as points'))
                                       ->leftJoin('hataraki_kata_resource as hk_r_job', 'hk_r_job.taggable_id', '=', 'jobs.id')
                                       ->leftJoin('hataraki_kata_resource as hk_r_job_seeker', 'hk_r_job_seeker.hataraki_kata_id', '=', 'hk_r_job.hataraki_kata_id')
                                       ->where('hk_r_job.taggable_type', 'Job')
                                       ->where('hk_r_job_seeker.taggable_type', 'JobSeeker')
                                       ->where('hk_r_job_seeker.taggable_id', $job_seeker_id)
                                       ->whereNull('hk_r_job.deleted_at')
                                       ->whereNull('hk_r_job_seeker.deleted_at')
                                       ->groupBy('hk_r_job.taggable_id');
        // Query that gets the points for the recruitment tag hataraki kata based on job seeker's hataraki kata
        $second_union_query = $this->job->select('o_hk_job.job_id as job_id', DB::raw('count(*) * 4 as points'))
                                        ->leftJoin('other_hataraki_kata as o_hk_job', 'o_hk_job.job_id', '=', 'jobs.id')
                                        ->leftJoin('hataraki_kata_resource as hk_job_seeker', 'hk_job_seeker.hataraki_kata_id', '=', 'o_hk_job.hataraki_kata_id')
                                        ->where('hk_job_seeker.taggable_type', 'JobSeeker')
                                        ->where('hk_job_seeker.taggable_id', $job_seeker_id)
                                        ->whereNull('hk_job_seeker.deleted_at')
                                        ->whereNull('o_hk_job.deleted_at')
                                        ->groupBy('o_hk_job.job_id');
        // Sub-query that gets the large category hatarki kata that belongs to job seeker
        $job_seeker_categories_query = DB::table('job_seekers')
                                         ->select('hk_c_job_seeker.id as hataraki_kata_category_id')
                                         ->leftJoin('hataraki_kata_resource as hk_r_job_seeker', 'hk_r_job_seeker.taggable_id', '=', 'job_seekers.id')
                                         ->leftJoin('hataraki_kata as hk_job_seeker', 'hk_job_seeker.id', '=', 'hk_r_job_seeker.hataraki_kata_id')
                                         ->leftJoin('hataraki_kata_categories as hk_c_job_seeker', 'hk_c_job_seeker.id', '=', 'hk_job_seeker.hataraki_kata_category_id')
                                         ->where('job_seekers.id', $job_seeker_id)
                                         ->where('hk_r_job_seeker.taggable_type', 'JobSeeker')
                                         ->whereNull('hk_r_job_seeker.deleted_at')
                                         ->groupBy('hk_c_job_seeker.id');
        // Query that gets points for the large categories of the main hataraki kata based on job seeker's hataraki kata
        $third_union_query = $this->job->select('jobs.id as job_id', DB::raw('count(*) * 7 as points'))
                                       ->leftJoin('hataraki_kata_resource as hk_r_job', 'hk_r_job.taggable_id', '=', 'jobs.id')
                                       ->leftJoin('hataraki_kata as hk_job', 'hk_job.id', '=', 'hk_r_job.hataraki_kata_id')
                                       ->leftJoin('hataraki_kata_categories as hk_c_job', 'hk_c_job.id', '=', 'hk_job.hataraki_kata_category_id')
                                       ->joinSub($job_seeker_categories_query, 'hk_c_job_seeker_table', function ($join) {
                                            $join->on('hk_c_job_seeker_table.hataraki_kata_category_id', '=', 'hk_c_job.id');
                                       })
                                       ->where('hk_r_job.taggable_type', 'Job')
                                       ->whereNull('hk_r_job.deleted_at')
                                       ->groupBy('jobs.id');
        // Query that gets the points for the large categories of the recruitment tag hataraki kata based on job seeker's hataraki kata
        $fourth_union_query = $this->job->select('jobs.id as job_id', DB::raw('count(*) * 3 as points'))
                                        ->leftJoin('other_hataraki_kata as o_hk_job', 'o_hk_job.job_id', '=', 'jobs.id')
                                        ->leftJoin('hataraki_kata as hk_job', 'hk_job.id', '=', 'o_hk_job.hataraki_kata_id')
                                        ->leftJoin('hataraki_kata_categories as hk_c_job', 'hk_c_job.id', '=', 'hk_job.hataraki_kata_category_id')
                                        ->joinSub($job_seeker_categories_query, 'hk_c_job_seeker_table', function ($join) {
                                            $join->on('hk_c_job_seeker_table.hataraki_kata_category_id', '=', 'hk_c_job.id');
                                        })
                                        ->whereNull('o_hk_job.deleted_at')
                                        ->groupBy('jobs.id');
        // Sub-query to join all other queries of points for the matching ratio
        $union_sub_query = $first_union_query->union($second_union_query)
                                             ->union($third_union_query)
                                             ->union($fourth_union_query);
        // Main query to get total points and calculate the matching ratio in descending order for job matching of job seeker
        $query = $this->job->select(
                                        'jobs.*',
                                        DB::raw('SUM(points) as total_points'),
                                        DB::raw('CASE
                                                WHEN SUM(points) >= 100 THEN 99.9
                                                WHEN SUM(points) >= 90  THEN (SUM(points) * 1)
                                                WHEN SUM(points) >= 80  THEN (SUM(points) * 1.1)
                                                WHEN SUM(points) >= 70  THEN (SUM(points) * 1.25)
                                                WHEN SUM(points) >= 60  THEN (SUM(points) * 1.4)
                                                ELSE SUM(points) * 1.1
                                            END AS matching_ratio'
                                        )
                                    )
                           ->leftJoinSub($union_sub_query, 'hataraki_kata_union_table', function ($join) {
                                $join->on('hataraki_kata_union_table.job_id', '=', 'jobs.id');
                           })
                           ->where('approval_status', 'approved')
                           ->whereNull('deleted_at')
                           ->with(
                                    'job_job_sub_categories.job_sub_category.job_category',
                                    'company.user',
                                    'hataraki_kata_resource.hataraki_kata',
                                    'geolocation',
                                    'nearest_station'
                                  )
                           ->groupBy('jobs.id')
                           ->orderBy('matching_ratio', 'DESC');                       

        if ($job_id) {
            $query = $query->where('id', $job_id);
        }

        if ($whereInField) {
            $query = $query->whereIn($whereInField, $whereInParams);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Temp. func. that retrieves a specific job or jobs for company use
     * @param array  $data           values to search
     * @param string $whereInField   field name used for where in
     * @param array  $whereInParams  values used where in
     * @param string $whereHasField  field name used for where has
     * @param array  $whereHasData   values used for where has data
     * @param int    $paginate       jobs per page
     * @return $query job collection
     */
    public function companyJobDetails(array $data, $whereInField = null, array $whereInParams = [], $whereHasField = null, $whereHasData = null, $paginate = null)
    {
        $query = $this->job->select('id', 'title', 'employment_type', 'price', 'approval_status')
                            ->with(['notes',
                                    'publication',
                                    'applied_job' => function($query) {
                                        $query->orderBy('created_at', 'DESC')
                                              ->limit(1);
                                    }
                                ])
                            ->where($data);

        if ($whereHasField) {
            $query->whereHas($whereHasField, function($subquery) use ($whereHasData) {
                $subquery->where($whereHasData);
            });
        }

        if ($whereInField) {
            $query->whereIn($whereInField, $whereInParams);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->first();
    }

    /**
     * Updating  job table based on where params
     * @param array $data Input from user client
     * @param array $where Parameters what only rows to be updated
     * @return Boolean If update success
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->job
                    ->where($where)
                    ->update($data);
    }

    /**
     * Paginate returned collections
     * @param QueryString $query
     * @param int $per_page No. of pagination per page.
     * @return QueryString $query paginated
     */
    public function addPaginate($query, $per_page)
    {
        return $query->paginate($per_page);
    }

}
