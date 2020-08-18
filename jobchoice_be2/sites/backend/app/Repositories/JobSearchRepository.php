<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobSearchRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_search;

    // Constructor to bind model to repo
    public function __construct(Model $job_search)
    {
        $this->job_search = $job_search;
    }

    /**
     * Retrive all data from job search
     * @return Object job_search collections
     */
    public function all()
    {
        return $this->job_search
                    ->paginate(20);
    }

    //Not being used since this is a view table
    public function create(array $data)
    {
        $this->job_search->fill($data);
        $this->job_search->save();
        return $this->job_search;
    }

    //Not being used since this is a view table
    public function update(array $data, $id)
    {
        $job_search = $this->job_search->find($id);
        return $job_search->update($data);
    }

    //Not being used since this is a view table
    public function destroy($id)
    {
        return $this->job_search->destroy($id);
    }

    //Not being used since this is a view table
    public function show($id)
    {
        return $this->job_search
                    ->findOrFail($id);
    }

    /**
     * Multiple keyword Search
     * Search from mysql view job_search table
     * @param array $data
     * @return array $job_ids IDs of job that has been searched
     */
    public function keywordSearch($data)
    {
        $searchWords = explode(" ", $data);
        $jobQuery = $this->job_search;
        $words = [];

        foreach ($searchWords as $word) {
            if (count($words) > 0) {
                $jobQuery = $jobQuery->orWhere('items', 'like', '%' . $word . '%');
            } else {
                $jobQuery = $jobQuery->where('items', 'like', '%' . $word . '%');
                $words[] = $word;
            }
        }

        return $jobQuery->get();
    }

    /**
     * Retrieves all job search based on given parameter
     * @param array $data values to search
     * @return Object job_search collection
     */
    public function where(array $data)
    {
        return $this->job_search
                    ->where($data)
                    ->get();
    }

     /**
     * Dynamic retrieving of a applied job based on given params using where in MySQL
     * @param  string $field Column to pass where in
     * @param  array $data values to search
     * @return Object job collection
     */
    public function whereIn($field, array $data)
    {
        return $this->applied_job
                        ->whereIn($field, $data)
                        ->get();
    }
}
