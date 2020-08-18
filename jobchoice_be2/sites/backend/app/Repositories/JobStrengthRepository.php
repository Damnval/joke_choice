<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobStrengthRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_strength;

    // Constructor to bind model to repo
    public function __construct(Model $job_strength)
    {
        $this->job_strength = $job_strength;
    }

    /**
     * Retrive all job_strength
     * @return Object job_strength collections
     */
    public function all()
    {
        return $this->job_strength->all();
    }

    /**
     * Saving job Strengths data to job_strengths resource
     * @param  Array $data Input from user
     * @return Collection Saved job Strengths data from db
     */
    public function create(array $data)
    {
        $this->job_strength ->fill($data);
        $this->job_strength ->save();
        return $this->job_strength;
    }

    /**
     * Updating job Strengths data to job_strengths resource
     * @param  Array $data Input from user client
     * @return Collection job Strengths Updated job_strengths from database
     */
    public function update(array $data, $id)
    {
        $job_strength = $this->job_strength->find($id);
        return $job_strength->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_strength ->destroy($id);
    }

    /**
     * Retrive specific job_strength
     * @param  Int $id
     * @return Object job_strength collections
     */
    public function show($id)
    {
        return $this->job_strength->findOrFail($id);
    }

    /**
     * Dynamic retrieving of a job_strength based on given params using where in MySQL
     * @param  String $field Column to pass where in
     * @param  Array $data values to search
     * @return Object job_strength collection
     */
    public function whereIn($field, array $data)
    {
        return $this->job_strength
        ->whereIn($field, $data)->get();
    }

     /**
     * Store array of Job Strengths in job_strengths
     * @param  array  $data Job Strengths to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_strengths()->saveMany($data);
    }

    /**
     * Delete all Job Strengths in job_strengths
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_strengths()->delete();
    }

}
