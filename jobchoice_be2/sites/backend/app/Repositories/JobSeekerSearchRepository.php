<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobSeekerSearchRepository implements BaseRepositoryInterface {

    // model property on class instances
    protected $job_seeker_search;

    // Constructor to bind model to repo
    public function __construct(Model $job_seeker_search)
    {
        $this->job_seeker_search = $job_seeker_search;
    }

    /**
     * Retrive all job_seeker_search from resource
     * @return Object job_seeker_search collections
     */
    public function all()
    {
        return $this->job_seeker_search
                    ->paginate(20);
    }

    //Not being used since this is a view table
    public function create(array $data)
    {
        $this->job_seeker_search->fill($data);
        $this->job_seeker_search->save();
        return $this->job_seeker_search;
    }

    //Not being used since this is a view table
    public function update(array $data, $id)
    {
        $job_seeker_search = $this->job_seeker_search->find($id);
        return $job_seeker_search->update($data);
    }

    //Not being used since this is a view table
    public function destroy($id)
    {
        return $this->job_seeker_search->destroy($id);
    }

    //Not being used since this is a view table
    public function show($id)
    {
        return $this->job_seeker_search
                    ->findOrFail($id);
    }

    /**
     * Retrieves all job_seeker_search based on given parameter
     * @param array $data values to search
     * @return Object job_seeker_search collection
     */
    public function where(array $data)
    {
        return $this->job_seeker_search
                    ->where($data)
                    ->get();
    }

     /**
     * Dynamic retrieving of job_seeker_search based on given params using where in MySQL
     * @param  string $field Column to pass where in
     * @param  array $data values to search
     * @return Object job collection
     */
    public function whereIn($field, array $data)
    {
        return $this->job_seeker_search
                        ->whereIn($field, $data)
                        ->get();
    }

}
