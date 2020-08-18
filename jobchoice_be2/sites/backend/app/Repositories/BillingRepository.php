<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class BillingRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $billing;

    // Constructor to bind model to repo
    public function __construct(Model $billing)
    {
        $this->billing = $billing;
    }

     /**
     * Retrive all Billing
     * @return Object billings collections
     */
    public function all()
    {
        return $this->billing->all();
    }

    /**
     * Saving billing data to billings resource
     * @param array $data Input from user
     * @return collection Saved billing from db
     */
    public function create(array $data)
    {
        $this->billing->fill($data);
        $this->billing->save();
        return $this->billing;
    }

    /**
     * Update billing data to billings resource
     * @param array $data Input from user
     * @param int $id Id of billing from user
     * @return bool 
     */
    public function update(array $data, $id)
    {
        $billing = $this->billing->find($id);
        return $billing->update($data);
    }


    /**
     * Deletes billing from billings resource
     * @param  Int $id billing ID
     * @return Boolean if billing is successfully saved
     */
    public function destroy($id)
    {
        return $this->billing->destroy($id);
    }

    /**
     * Retrive specific billing
     * @param  Int $id
     * @return Object billings collections
     */
    public function show($id)
    {
        return $this->billing
                    ->findOrfail($id);
    }

    /**
     * Saving Billing using Polymorph
     * @param Array $data data input by user
     * @param Object $model model type
     */
    public function createMorph(array $data, Object $model)
    {
        $model->billing()->create($data);
    }

    /**
     * Retrieves all billings based on given parameter
     * @param array $data values to search
     * @return Object Billing collection
     */
    public function where(array $data, $paginate = null)
    {
        $query = $this->billing->where($data);

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Retrieves all company's billings based on where parameter and other optional parameters
     * @param array   $data                   values to search
     * @param string  $whereYearAndMonthField field in which to query where year and where month param
     * @param int     $whereMonth             value of month to limit query results
     * @param array   $whereYear              value of year to limit query results
     * @param array   $with                   with relationship params
     * @return Object $query                  billing collection
     */
    public function whereWhereMonthAndYear(array $data, $whereYearAndMonthField = null, $whereMonth = null, $whereYear = null, $with = null)
    {
        $query = $this->billing->where($data);
                            
        if ($whereMonth) {
            $query->whereMonth($whereYearAndMonthField, $whereMonth);
        }

        if ($whereYear) {
            $query->whereYear($whereYearAndMonthField, $whereYear);
        }
     
        if ($with) {
            $query->with($with);
        }

        return $query->get();
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
