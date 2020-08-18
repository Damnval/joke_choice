<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class SpecialFeatureRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $special_feature;

    // Constructor to bind model to repo
    public function __construct(Model $special_feature)
    {
        $this->special_feature = $special_feature;
    }

    /**
     * Retrive all Special Features
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate special feature per page
     * @return Object Special Feature collections
     */
    public function all(array $with = [], int $paginate = null)
    {
        $query = $this->special_feature;

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Saving Special Features data to special_features resource
     * @param array $data Input from user
     * @return collection Saved Special Features from db
     */
    public function create(array $data)
    {
        $this->special_feature->fill($data);
        $this->special_feature->save();
        return $this->special_feature;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $special_feature = $this->special_feature->find($id);
        return $special_feature->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->special_feature->destroy($id);
    }

    /**
     * Retrive specific Special Features
     * @param  Int $id
     * @return Object Special Feature
     */
    public function show($id)
    {
        return $this->special_feature->findOrfail($id);
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
