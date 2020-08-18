<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class AdminCompanySearchRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $admin_company_search;

    // Constructor to bind model to repo
    public function __construct(Model $admin_company_search)
    {
        $this->admin_company_search = $admin_company_search;
    }

    /**
     * Retrive all admin_company_search from resource
     * @return Object admin_company_search collections
     */
    public function all()
    {
        return $this->admin_company_search
                    ->paginate(20);
    }

    //Not being used since this is a view table
    public function create(array $data)
    {
        $this->admin_company_search->fill($data);
        $this->admin_company_search->save();
        return $this->admin_company_search;
    }

    //Not being used since this is a view table
    public function update(array $data, $id)
    {
        $admin_company_search = $this->admin_company_search->find($id);
        return $admin_company_search->update($data);
    }

    //Not being used since this is a view table
    public function destroy($id)
    {
        return $this->admin_company_search->destroy($id);
    }

    //Not being used since this is a view table
    public function show($id)
    {
        return $this->admin_company_search
                    ->findOrFail($id);
    }

    /**
     * Retrieves all admin_company_search based on given parameter
     * @param array $data values to search
     * @return Object admin_company_search collection
     */
    public function where(array $data)
    {
        return $this->admin_company_search
                    ->where($data)
                    ->get();
    }

     /**
     * Dynamic retrieving of admin_company_search based on given params using where in MySQL
     * @param  string $field Column to pass where in
     * @param  array $data values to search
     * @return Object admin_company_search collection
     */
    public function whereIn($field, array $data)
    {
        return $this->admin_company_search
                    ->whereIn($field, $data)
                    ->get();
    }

    /**
     * Multiple keyword Search
     * Search from mysql view admin_job_search table
     * @param  array $keyword_params
     * @param  array $where values to search
     * @return Object $admin_job_search Job Collections based on keyword search
     */
    public function keywordSearch($keyword_params = null, $where = [])
    {
        $query = $this->admin_company_search;
        $touched = false;

        if (count($where) > 0) {
            $query = $query->where($where);
        }

        if ($keyword_params) {

            $searchWords = explode(" ", $keyword_params);
            $words = [];

            foreach ($searchWords as $word) {
                if (count($words) > 0) {
                    $query = $query->orWhere('items', 'like', '%' . $word . '%');
                } else {
                    $query = $query->where('items', 'like', '%' . $word . '%');
                    $words[] = $word;
                }
            }
        }

        return $query->get();
    }

}
