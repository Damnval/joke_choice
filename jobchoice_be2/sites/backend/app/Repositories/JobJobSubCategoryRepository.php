<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobJobSubCategoryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_job_sub_category;

    // Constructor to bind model to repo
    public function __construct(Model $job_job_sub_category)
    {
        $this->job_job_sub_category = $job_job_sub_category;
    }

    /**
     * Retrive all job_job_sub_category
     * @param  Int $id
     * @return Object job_job_sub_category collections
     */
    public function all()
    {
        return $this->job_job_sub_category->all();
    }

    /**
     * Saving job's job sub categories data to job_job_sub_categories resource
     * @param  Array $data Input from user
     * @return Collection Saved job's job sub categories data from db
     */
    public function create(array $data)
    {
        $this->job_job_sub_category->fill($data);
        $this->job_job_sub_category->save();
        return $this->job_job_sub_category;
    }

    /**
     * Updating job's job sub categories data to job_job_sub_categories resource
     * @param  Array $data Input from user client
     * @return Collection job's job sub categories Updated job_job_sub_categories from database
     */
    public function update(array $data, $id)
    {
        $job_job_sub_category = $this->job_job_sub_category->find($id);
        return $job_job_sub_category->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_job_sub_category->destroy($id);
    }

    /**
     * Retrive specific job's job sub category
     * @param  Int $id
     * @return Object job_job_sub_categories collections
     */
    public function show($id)
    {
        return $this->job_job_sub_category->findOrFail($id);
    }

     /**
     * Store array of job's job sub category in job_job_sub_categories
     * @param  array  $data job's job sub category to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_job_sub_categories()->saveMany($data);
    }

    /**
     * Delete all job's job sub category in job_job_sub_categories
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_job_sub_categories()->delete();
    }

    /**
     * Dynamic retrieving of job job sub category based on given params using where in MySQL
     * @param string $field Column to pass where in
     * @param array $data values to search
     * @param int $paginate jobs per page
     * @return Object job_job_sub_categories collection
     */
    public function whereIn($field, array $data, $paginate = null)
    {
        $query =  $this->job_job_sub_category
                       ->whereIn($field, $data);

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }
}
