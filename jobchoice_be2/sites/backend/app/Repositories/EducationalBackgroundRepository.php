<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class EducationalBackgroundRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $educational_background;

    /**
     * Constructor to bind model to repo
     * @param Model $educational_background
     */
    public function __construct(Model $educational_background)
    {
        $this->educational_background = $educational_background;
    }

     /**
     * Get all applied educational_background from resource
     * @return Object
     */
    public function all()
    {
        return $this->educational_background->all();
    }

    /**
     * Saving educational_background data to educational_background resource
     * @param array $data Input from user
     * @return object educational_background resource
     */
    public function create(Array $data)
    {
        $this->educational_background->fill($data);
        $this->educational_background->save();
        return $this->educational_background;
    }

    /**
     * Updates educational_background from resource
     * @param array $data educational_background array params
     * @param integer $id id of educational_background params
     * @return boolean
     */
    public function update(Array $data, $id)
    {
        $educational_background = $this->educational_background->find($id);
        return $educational_background->update($data);
    }

    /**
     * Delete educational_background from resource
     * @param integer $id id of educational_background params
     * @return boolean
     */
    public function destroy($id)
    {
        return $this->educational_background->destroy($id);
    }

    /**
     * Shows educational_background from resource
     * @param integer $id id of educational_background array params
     * @return Object
     */
    public function show($id)
    {
        return $this->educational_background->findOrFail($id);
    }

    /**
     * Store array of educational_background in educational_background
     * @param  array  $data  Hataraki kata to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->educational_background()->saveMany($data);
    }

    /**
     * Delete all educational_background using job_seeker_id from educational_backgrounds
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->educational_background()->delete();   
    }

}

