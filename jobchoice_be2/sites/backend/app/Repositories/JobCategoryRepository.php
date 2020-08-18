<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class JobCategoryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $jobCategory;

    // Constructor to bind model to repo
    public function __construct(Model $jobCategory)
    {
        $this->jobCategory = $jobCategory;
    }

     /**
     * Retrive all Job Categories
     * @param  Int $id
     * @return Object Job Categories collections
     */
    public function all($paginate = null)
    {
        $query = $this->jobCategory
                    ->with('job_sub_category');

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Saving Job Category data to job_categories resource
     * @param array $data Input from user
     * @return collection Saved Job Category from db
     */
    public function create(array $data)
    {
        $this->jobCategory->fill($data);
        $this->jobCategory->save();
        return $this->jobCategory;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $jobCategory = $this->jobCategory->find($id);
        return $jobCategory->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->jobCategory->destroy($id);
    }

    /**
     * Retrive specific Job Category
     * @param  Int $id
     * @return Object Job Category collections
     */
    public function show($id)
    {
        return $this->jobCategory->where('id', '=', $id)
                                 ->first();
    }

    /**
     * Retrieves a specific job category given where params
     * @param  array $data
     * @return Object Job Category collection
     */
    public function whereFirst(array $data)
    {
        return $this->jobCategory->where($data)
                                 ->first();
    }

    /**
     * Retrieve specific job categories given where params
     * @param  array $data
     * @return Object Job Category collections
     */
    public function where(array $data)
    {
        return $this->jobCategory->where($data)
                                 ->get();
    }

    /**
     * Paginate returned collections
     * @param QueryString $query
     * @param int $per_page No. of pagination per page.
     * @return QueryString $query paginated
     */
    public function addPaginate($query, $per_page)
    {
        return $query->paginate($per_page);
    }

 }
