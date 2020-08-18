<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;
use DB;

class SharedJobRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $shared_job;

    /**
     * Constructor to bind model to repo
     * @param Model $shared_job
     */
    public function __construct(Model $shared_job)
    {
        $this->shared_job = $shared_job;
    }

     /**
     * Get all shared jobs from resource
     * @return Object
     */
    public function all()
    {
        return $this->shared_job->all();
    }

    /**
     * Saving shared_job data to shared_jobs resource
     * @param array $data Input from user
     * @return Object shared_job resource
     */
    public function create(Array $data)
    {
        $this->shared_job->fill($data);
        $this->shared_job->save();
        return $this->shared_job;
    }

    public function update(Array $data, $id)
    {
        $shared_job = $this->shared_job->find($id);
        return $shared_job->update($data);
    }

    public function destroy($id)
    {
        return $this->shared_job->destroy($id);
    }

    public function show($id)
    {
        return $this->shared_job->findOrFail($id);
    }

    /**
     * Get Shared jobs using where method based on params
     * @param array $data
     * @return Object shared_job resource
     */
    public function where(array $data)
    {
        return $this->shared_job
                        ->where($data)
                        ->get();
    }

    /**
     * Get Shared jobs using where method based on params but only returning first record with optional with
     * @param array $data
     * @param array $with
     * @return Object shared_job resource
     */
    public function whereFirst(array $data, $with = null)
    {
        $query = $this->shared_job
                      ->where($data);

        if ($with) {
            $query->with($with);
        }

        return $query->first();
    }

    /**
     * Dynamic Get and group Shared jobs with optional limit and order
     * @param string $field
     * @param string $groupBy
     * @param string $orderBy
     * @param int $limit
     * @return Object shared_job resource
     */
    public function selectGroupBy($field, $groupBy, $whereHasField = null, $whereHasData = null, $orderBy = null, $limit = null)
    {
        $query = $this->shared_job->select($field, DB::raw('count(*) as num'))
                                  ->with('job')
                                  ->groupBy($groupBy);

        if ($orderBy) {
            $query->orderBy('num', $orderBy);
        }

        if ($whereHasField) {
            $query->whereHas($whereHasField, function($subquery) use ($whereHasData) {
                $subquery->where($whereHasData);
            });
        }

        if ($limit) {
            $query->limit($limit);
        }

        $result = $query->get();

        return $result;
    }

    /**
     * Hybrid where with optional field and whereBetweens
     * @param array  $data          where input
     * @param string $field         field in between which to search results
     * @param array  $whereBetweens input by user
     * @param array  $with          relationships required
     * @param string $orderBy       field in which to order
     * @param string $order         the ordering of results
     * @param int    $limit         default of 20
     * @return Object shared_job resource
     */
    public function hybridWhere($data, $field = null, $whereBetweens = null, $with = null, $orderBy = null, $order = null, $whereHasField = null, $whereHasData = null, $limit = 20)
    {
        $query = $this->shared_job->select('id', 'href', 'slug_id', 'job_id', 'provider_id', 'created_at')
                                  ->where($data);

        if ($field && $whereBetweens) {
            $query->whereBetween($field, $whereBetweens);
        }

        if ($whereHasField) {
            $query->whereHas($whereHasField, function($subquery) use ($whereHasData) {
                $subquery->where($whereHasData);
            });
        }

        if ($with) {
            $query->with($with);
        }

        if ($orderBy && $order) {
            $query->orderBy($orderBy, $order);
        }

        return $query->paginate($limit);
    }

    /**
     * Hybrid sum of compensation with depending optional field and whereBetweens
     * Reference SQL Query in public/reference/sql/SharedJobRepository/HybridSumCompensation.sql
     * @param array  $data where input
     * @param string $field
     * @param array  $whereBetweens input by uesr
     * @return Object Shared job total compensation
     */
    public function hybridSumCompensation($data, $field = null, $whereBetweens = [])
    {
        $sub_query = $this->shared_job->select('shared_jobs.id as shared_job_id', DB::raw('(count(*) * incentive_per_share) as compensation'))
                                      ->leftJoin('jobs', 'jobs.id', '=', 'shared_jobs.job_id')
                                      ->leftJoin('applied_jobs', 'applied_jobs.shared_job_id', '=', 'shared_jobs.id')
                                      ->where($data)
                                      ->where('applied_jobs.disclosed', 1)
                                      ->groupBy('shared_jobs.id');

        if ($field && count($whereBetweens) > 0) {
            $sub_query->whereBetween($field, $whereBetweens);
        }                                                                      

        $query = $this->shared_job->select(DB::raw('SUM(table1.compensation) as total_compensation'))
                                    ->joinSub($sub_query, 'table1', function($join) {
                                        $join->on('shared_jobs.id', '=', 'table1.shared_job_id');
                                    });

        return $query->first();
    }

    /**
     * Retrieves all shared jobs based on where parameter and other optional parameters
     * @param array   $data                   values to search
     * @param string  $whereYearAndMonthField field in which to query where year and where month param
     * @param int     $whereMonth             value of month to limit query results
     * @param array   $whereYear              value of year to limit query results
     * @param array   $with                   with relationship params
     * @return Object $query                  shared_job resource
     */
    public function whereWhereMonthAndYear(array $data, $whereYearAndMonthField = null, $whereMonth = null, $whereYear = null, $with = null)
    {
        $query = $this->shared_job->where($data);
                            
        if ($whereMonth) {
            $query->whereMonth($whereYearAndMonthField, $whereMonth);
        }

        if ($whereYear) {
            $query->whereYear($whereYearAndMonthField, $whereYear);
        }
     
        if ($with) {
            $query->with($with);
        }

        return $query->get();
    }

}
