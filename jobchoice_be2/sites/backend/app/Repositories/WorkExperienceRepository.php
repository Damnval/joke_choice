<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class WorkExperienceRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $work_experience;

    /**
     * Constructor to bind model to repo
     * @param Model $work_experience
     */
    public function __construct(Model $work_experience)
    {
        $this->work_experience = $work_experience;
    }

     /**
     * Get all work_experience from resource
     * @return Object
     */
    public function all()
    {
        return $this->work_experience->all();
    }

    /**
     * Saving work experience data to work_experience resource
     * @param array $data Input from user
     * @return object work_experience resource
     */
    public function create(Array $data)
    {
        $this->work_experience->fill($data);
        $this->work_experience->save();
        return $this->work_experience;
    }

    /**
     * Updates work experience from resource
     * @param array $data work_experience array params
     * @param integer $id id of work_experience params
     * @return boolean
     */
    public function update(Array $data, $id)
    {
        $work_experience = $this->work_experience->find($id);
        return $work_experience->update($data);
    }

    /**
     * Delete work experience from resource
     * @param integer $id id of work_experience params
     * @return boolean
     */
    public function destroy($id)
    {
        return $this->work_experience->destroy($id);
    }

    /**
     * Shows work experience from resource
     * @param integer $id id of work_experience array params
     * @return Object
     */
    public function show($id)
    {
        return $this->work_experience->findOrFail($id);
    }

    /**
     * Store array of work experience in work_experience
     * @param  array  $data  skill array
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        $model->work_experience()->saveMany($data);
    }

    /**
     * Delete all work_experience using job_seeker_id from work_experiences
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->work_experience()->delete();   
    }

    /**
     * Get work experience using where method based on params
     * @param array $data
     * @return object work_experience resource
     */
    public function where(array $data)
    {
        return $this->work_experience
                        ->where($data)
                        ->get();
    }

}

