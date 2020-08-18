<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class JobSeekerSkillRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_seeker_skill;

    /**
     * Constructor to bind model to repo
     * @param Model $job_seeker_skill
     */
    public function __construct(Model $job_seeker_skill)
    {
        $this->job_seeker_skill = $job_seeker_skill;
    }

    /**
     * Get all job seeker skills from resource
     * @return Object
     */
    public function all()
    {
        return $this->job_seeker_skill->all();
    }

    /**
     * Creates job seeker skills from resource
     * @param array $data skill array params
     * @return Object
     */
    public function create(array $data)
    {
        $this->job_seeker_skill->fill($data);
        $this->job_seeker_skill->save();
        return $this->job_seeker_skill;
    }

    /**
     * Updates job seeker skills from resource
     * @param array $data skill array params
     * @param integer $id id of skill array params
     * @return boolean
     */
    public function update(array $data, $id)
    {
        $job_seeker_skill = $this->job_seeker_skill->find($id);
        return $job_seeker_skill->update($job_seeker_skill);
    }

    /**
     * Delete job seeker skills from resource
     * @param integer $id id of skill params
     * @return boolean
     */
    public function destroy($id)
    {
        return $this->job_seeker_skill->destroy($id);
    }

    /**
     * Shows job seeker skills from resource
     * @param integer $id id of skill array params
     * @return Object
     */
    public function show($id)
    {
        return $this->job_seeker_skill->findOrFail($id);
    }

    /**
     * Store array of job seeker skills in job_seeker_skills
     * @param  array  $data  skills to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_seeker_skills()->saveMany($data);
    }

    /**
     * Delete all job_seeker_skill using job_seeker_id from job_seeker_skills
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_seeker_skills()->delete();   
    }

}
