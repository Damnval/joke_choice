<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class AnalyticRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $analytic;

    // Constructor to bind model to repo
    public function __construct(Model $analytic)
    {
        $this->analytic = $analytic;
    }

     /**
     * Retrive all Analytics
     * @param  Int $paginate
     * @return Object Analytic collections
     */
    public function all($paginate = null)
    {
        $query = $this->analytic;

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Saving Analytic data to analytics resource
     * @param array $data Input from user
     * @return collection Saved Analytic from db
     */
    public function create(array $data)
    {
        $this->analytic->fill($data);
        $this->analytic->save();
        return $this->analytic;
    }

    /**
     * Updating Analytiuc data to analytics resource
     * @param array $data Input from user
     * @return Collection Saved analytic from db
     */
    public function update(array $data, $id)
    {
        $analytic = $this->analytic->find($id);
        return $analytic->update($data);
    }

    /**
     * Remove analytic from resource
     * @param int $id ID of Job
     * @return Boolean Result if deleted
     */
    public function destroy($id)
    {
        return $this->analytic->destroy($id);
    }

    /**
     * Retrive specific analytic
     * @param  Int $id
     * @return Object Analytic collections
     */
    public function show($id)
    {
        return $this->analytic->findOrFail($id);
    }

    /**
     * Retrieves a specific analytic given where params limit by 1
     * @param  array $data
     * @return Object Analytics collection
     */
    public function whereFirst(array $data)
    {
        return $this->analytic
                    ->where($data)
                    ->first();
    }

    /**
     * Retrieve specific analytic given where params
     * @param  array $data
     * @return Object Analytic collections
     */
    public function where(array $data)
    {
        return $this->analytic
                    ->where($data)
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

