<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobWelfareRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_welfare;

    // Constructor to bind model to repo
    public function __construct(Model $job_welfare)
    {
        $this->job_welfare = $job_welfare;
    }

    /**
     * Retrive all job_welfare
     * @return Object job_welfares collections
     */
    public function all()
    {
        return $this->job_welfare->all();
    }

    /**
     * Saving Job Welfares data to job_welfares resource
     * @param  Array $data Input from user
     * @return Collection Saved Welfares data from db
     */
    public function create(array $data)
    {
        $this->job_welfare->fill($data);
        $this->job_welfare->save();
        return $this->job_welfare;
    }

    /**
     * Updating ob Welfares data to job_welfares resource
     * @param  Array $data Input from user client
     * @return Collection job_welfare Updated job_welfare from database
     */
    public function update(array $data, $id)
    {
        $job_welfare = $this->job_welfare->find($id);
        return $job_welfare->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_welfare->destroy($id);
    }

    /**
     * Retrive specific job_welfare
     * @param  Int $id
     * @return Object job_welfare collections
     */
    public function show($id)
    {
        return $this->job_welfare->findOrFail($id);
    }

     /**
     * Store array of Job Welfares in job_welfares
     * @param  array  $data Job Welfares to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_welfares()->saveMany($data);
    }

    /**
     * Delete all Job Welfares in job_welfares resource
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_welfares()->delete();
    }

}
