<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobReasonToHireRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_reason_to_hire;

    // Constructor to bind model to repo
    public function __construct(Model $job_reason_to_hire)
    {
        $this->job_reason_to_hire = $job_reason_to_hire;
    }

    /**
     * Retrive all job_reason_to_hire
     * @return Object job_reason_to_hire collections
     */
    public function all()
    {
        return $this->job_reason_to_hire->all();
    }

    /**
     * Saving Reasons to hire data to job_reason_to_hires resource
     * @param  Array $data Input from user
     * @return Collection Saved job_reason_to_hire data from db
     */
    public function create(array $data)
    {
        $this->job_reason_to_hire->fill($data);
        $this->job_reason_to_hire->save();
        return $this->job_reason_to_hire;
    }

    /**
     * Updating  Reasons to hire data to job_reason_to_hires resource
     * @param  Array $data Input from user client
     * @return Collection job_reason_to_hire Updated job_reason_to_hire from database
     */
    public function update(array $data, $id)
    {
        $job_reason_to_hire = $this->job_reason_to_hire->find($id);
        return $job_reason_to_hire->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_reason_to_hire->destroy($id);
    }

    /**
     * Retrive specific job_reason_to_hire
     * @param  Int $id
     * @return Object job_reason_to_hire collections
     */
    public function show($id)
    {
        return $this->job_reason_to_hire
                    ->where('id', '=', $id)
                    ->first();
    }

     /**
     * Store array of  Reasons to hire in job_reason_to_hires
     * @param  array  $data  Reasons to hire to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_reasons_to_hire()->saveMany($data);
    }

    /**
     * Delete all  Reasons to hire in job_reason_to_hires
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_reasons_to_hire()->delete();
    }

}
