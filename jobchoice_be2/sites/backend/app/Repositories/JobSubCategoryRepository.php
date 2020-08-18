<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class JobSubCategoryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_sub_category;

    // Constructor to bind model to repo
    public function __construct(Model $job_sub_category)
    {
        $this->job_sub_category = $job_sub_category;
    }

     /**
     * Retrieve all Job Sub Categories
     * @return Object job_sub_category collections
     */
    public function all()
    {
        return $this->job_sub_category->all();
    }

    /**
     * Saving Job Sub Category data to job_sub_category resource
     * @param array $data Input from user
     * @return collection Saved job_sub_category from db
     */
    public function create(array $data)
    {
        $this->job_sub_category->fill($data);
        $this->job_sub_category->save();
        return $this->job_sub_category;
    }

    /**
     * Update Job Sub Category data to job_sub_category resource
     * @param array $data Input from user
     * @param int $id Id of job_sub_category from user
     * @return bool
     */
    public function update(array $data, $id)
    {
        $job_sub_category = $this->job_sub_category->find($id);
        return $job_sub_category->update($data);
    }

    /**
     * Deleting Job Sub Category data to job_sub_category resource
     * @param integer $id Input from user
     * @return boolean
     */
    public function destroy($id)
    {
        return $this->job_sub_category->destroy($id);
    }

    /**
     * Retrieve specific Job Sub Category From job_sub_category resource
     * @param  int $id
     * @return Object job_sub_category collections
     */
    public function show($id)
    {
        return $this->job_sub_category->findOrFail($id);
    }

    /**
     * Retrieves Job Sub Categories based on given parameter
     * @param array $data values to search
     * @return Object job_sub_categories collection
     */
    public function where(array $data, $paginate = null)
    {
        $query = $this->job_sub_category
                      ->where($data);

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

}
