<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class CompanyRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $company;

    // Constructor to bind model to repo
    public function __construct(Model $company)
    {
        $this->company = $company;
    }

     /**
     * Retrive all Companies
     * @param array $with retrieving relationships based on user required data
     * @param int $paginate results per page
     * @return Object Company collections
     */
    public function all(array $with = [], $paginate = null)
    {
        $query = $this->company;

        if (count($with) > 0) {
           $query = $query->with($with);
        }

        if ($paginate) {
           return $this->addPaginate($query, $paginate);
        }

        return $query->get();
    }

    /**
     * Saving Company data to Companies resource
     * @param array $data Input from user
     * @return collection Saved Company Kata from db
     */
    public function create(array $data)
    {
        $this->company->fill($data);
        $this->company->save();
        return $this->company;
    }

      /**
     * Updating Company data to Companies resource
     * @param array $data Input from user client
     * @return collection Company Updated company from database
     */
    public function update(array $data, $id)
    {
        $company = $this->company->find($id);
        return $company->update($data);
    }

     /**
     * Updating Company data to Companies resource
     * @param array $data Input from user client
     * @return collection Company Updated company from d
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->company->where($where)->each( function($company) use ($data) {
            $company->update($data);
        });
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->company->destroy($id);
    }

    /**
     * Retrive specific Company
     * @param Int $id
     * @param array $with retrieving relationships based on user required data
     * @return Object Company collections
     */
    public function show($id, array $with = [])
    {
        $query = $this->company;

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        return $query->findOrFail($id);
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

    /**
     * Dynamic retrieving of a companies based on given params using whereIn in MySQL
     * @param string $field Column to pass where in
     * @param array $data values to search
     * @param array $with model relationship to include in return
     * @param int $paginate jobs per page
     * @return collection companies
     */
    public function whereIn($field, array $data, $with = [], $paginate = null)
    {
        $query = $this->company
                      ->whereIn($field, $data);

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

 }
