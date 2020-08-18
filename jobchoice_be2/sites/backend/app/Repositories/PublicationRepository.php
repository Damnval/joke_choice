<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class PublicationRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $publication;

    // Constructor to bind model to repo
    public function __construct(Model $publication)
    {
        $this->publication = $publication;
    }

     /**
     * Retrive all publications
     * @return Object publication collections
     */
    public function all()
    {
        return $this->publication->all();
    }

    /**
     * Saving publication data to publication resource
     * @param array $data Input from user
     * @return collection Saved publication from db
     */
    public function create(array $data)
    {
        $this->publication->fill($data);
        $this->publication->save();
        return $this->publication;
    }

    /**
     * Update publication data to publication resource
     * @param array $data Input from user
     * @param int $id Id of publication from user
     * @return bool
     */
    public function update(array $data, $id)
    {
        $publication = $this->publication->find($id);
        return $publication->update($data);
    }

    /**
     * Saving publication data to publication resource
     * @param array $data Input from user
     * @return bool
     */
    public function destroy($id)
    {
        return $this->publication->destroy($id);
    }

    /**
     * Retrieve specific publication from publication resource
     * @param  int $id
     * @return Object publication collections
     */
    public function show($id)
    {
        return $this->publication->findOrFail($id);
    }

    /**
     * Get publications using where method based on params
     * @param array $data
     * @return object publications resource
     */
    public function where(array $data)
    {
        return $this->publication
                    ->where($data)
                    ->get();
    }

    /**
     * Saving Publication using Polymorph
     * @param Array $data data input by user
     * @param Object $model model type
     */
    public function createMorph(array $data, Object $model)
    {
        $model->publication()->create($data);
    }

    /**
     * Hybrid query of getting publication collection based on params
     * @param  array   $where            Where params
     * @param  array   $whereBetweenData Where Between params
     * @param  String  $whereInField     Field to use tthe whereBetweenData
     * @param  array   $whereInParams    Where In params
     * @param  integer $limit            [description]
     * @return Collection                Collection of publications
     */
    public function hybridWhereAndWhereInAndWhereBetween(
        array $where,
        array $whereBetweenData,
        $whereInField,
        array $whereInParams,
        $limit = 20
    )
    {
        $query = $this->publication
                ->where($where)
                ->whereIn($whereInField, $whereInParams);

        if ($whereBetweenData) {
            foreach ($whereBetweenData as $field => $dataParams) {
                $query->whereBetween($field, $dataParams);
            }
        }

        return $query->paginate($limit);
    }

    /**
     * Updating Publication based on given model
     * @param Array $data data input by user
     * @param Object $model model type
     */
    public function updateMorph(array $data, Object $model)
    {
        return $model->publication()->update($data);
    }

    /**
     * Get publication collection by order limit and order by
     * @param  String $field whereIn field
     * @param  Array $data whereIn data
     * @param  Array $where where data
     * @param  Int $limit number limit of record to return
     * @param  string $order_by_field Field to be ordered by
     * @param  string $order_by order type
     * @return Collection publication
     */
    public function whereInlimit(
        $field,
        array $data = [],
        array $where = [],
        $limit = 10,
        $order_by_field = null,
        $order_by = 'asc'
    )
    {
        $query = $this->publication;

        if ($where) {
            $query = $query->where($where);
        }

        if ($order_by) {
            $query = $query->Orderby($order_by_field, $order_by);
        }

        return $query->whereIn($field, $data)
                    ->limit($limit)
                    ->get();
    }
}
