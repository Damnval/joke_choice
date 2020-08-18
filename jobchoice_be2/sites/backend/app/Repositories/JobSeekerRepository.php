<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class JobSeekerRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_seeker;

    // Constructor to bind model to repo
    public function __construct(Model $job_seeker)
    {
        $this->job_seeker = $job_seeker;
    }

     /**
     * Retrive all Job Seeker
     * @param  Int $id
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate jobs per page
     * @return Object Job Seeker collections
     */
    public function all(array $with = [], $paginate = null)
    {
        $query = $this->job_seeker;
        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            return $this->addPaginate($query, $paginate);
        }

        return $query->get();
    }

    /**
     * Saving JobSeeker data to job_seeker resource
     * @param array $data Input from user
     * @return collection Saved JobSeeker from db
     */
    public function create(array $data)
    {
        $this->job_seeker->fill($data);
        $this->job_seeker->save();
        return $this->job_seeker;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $job_seeker = $this->job_seeker->find($id);
        return $job_seeker->update($data);
    }

     /**
     * Updating Job Seeker data to job_seekers resource
     * @param array $data Input from user client
     * @param array $where Params what to search
     * @return collection Job Sekker Updated job seejer from resource
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->job_seeker->where($where)->each( function($job_seeker) use ($data) {
            $job_seeker->update($data);
        });
    }


    // remove record from the database
    public function destroy($id)
    {
        return $this->job_seeker->destroy($id);
    }

    /**
     * Retrive specific Job Seeker
     * @param  Int $id
     * @return Object Job Seeker collections
     */
    public function show($id, $with = null)
    {
        $query = $this->job_seeker;

        if ($with) {
            $query = $query->with($with);
        }

        return $query->findOrFail($id);
    }

    /**
     * Dynamic getting jobseeker from resource with where params only single row
     * @param  Array $data Where params
     * @return Object Job Seeker collection
     */
    public function whereFirst($data)
    {
        return $this->job_seeker
                    ->where($data)
                    ->first();
    }

    /**
     * Dynamic getting job seekers from resource with where params
     * @param  Array $data Where param
     * @param  Int $paginate no of pagination count
     * @param  String/Array $with Relationship to be included in getting user collection
     * @return Object JobSeeker Collection
     */
    public function where($data, $paginate = null, $with = null)
    {
        $query = $this->job_seeker->where($data);

        if ($with) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
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

    /**
     * Dynamic getting job seekers from resource with where params
     * @param  Array $where Where param
     * @param  Array $whereIn WhereIn param
     * @param  Array $whereBetween WhereBetween param
     * @return Object job_seekers Collection
     */
    public function hybridWhere($where = [], $whereIn = [], $whereBetween = [], $touched = false) {
        $query = $this->job_seeker;

        if (count($whereIn) > 0) {
            $query = $query->whereIn('id', $whereIn);
        } else if ($touched) {
            return [];
        }

        if (count($where) > 0) {
            $query = $query->where($where);
        }

        if (count($whereBetween) > 0) {
            $query = $this->addWhereBetween($query, $whereBetween);
        }

        return $query->get();
    }

    /**
     * query string using Where between collection
     * @param QueryString $query
     * @param array parameters of where Between
     * @return QueryString $query collection resulted from whereBetween
     */
    public function addWhereBetween($query, $whereBetween)
    {
        foreach ($whereBetween as $arrays) {
            foreach ($arrays as $field => $value) {
                $query = $query->whereBetween($field, $value);
            }
        }

        return $query;
    }

    /**
     * Dynamic retrieving of a job seekers based on given params using where in MySQL
     * @param string $field Column to pass where in
     * @param array $data values to search
     * @param int $paginate jobs per page
     * @return Object job_seeker collection
     */
    public function whereIn($field, array $data, $with = [], $paginate = null)
    {
        $query = $this->job_seeker
                       ->whereIn($field, $data);

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

 }
