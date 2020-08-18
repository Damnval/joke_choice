<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class CompanyJobSearchRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $company_job_search;

    // Constructor to bind model to repo
    public function __construct(Model $company_job_search)
    {
        $this->company_job_search = $company_job_search;
    }

    /**
     * Retrive all data from company job search
     * @return Object company_job_search collections
     */
    public function all()
    {
        return $this->company_job_search
                    ->paginate(20);
    }

    //Not being used since this is a view table
    public function create(array $data)
    {
        $this->company_job_search->fill($data);
        $this->company_job_search->save();
        return $this->company_job_search;
    }

    //Not being used since this is a view table
    public function update(array $data, $id)
    {
        $company_job_search = $this->company_job_search->find($id);
        return $company_job_search->update($data);
    }

    //Not being used since this is a view table
    public function destroy($id)
    {
        return $this->company_job_search->destroy($id);
    }

    //Not being used since this is a view table
    public function show($id)
    {
        return $this->company_job_search
                    ->findOrFail($id);
    }

    /**
     * Multiple keyword Search
     * Search from mysql view company_job_search table
     * @param array $data
     * @return array $company_job_search Job Collections based on keyword search
     */
    public function keywordSearch($data)
    {
        $searchWords = explode(" ", $data);
        $companyJobQuery = $this->company_job_search::with('jobs');
        $words = [];

        foreach ($searchWords as $word) {
            if (count($words) > 0) {
                $companyJobQuery->orWhere('items', 'like', '%' . $word . '%');
            } else {
                $companyJobQuery->Where('items', 'like', '%' . $word . '%');
                $words[] = $word;
            }
        }
        $company_job_search = $companyJobQuery->get();

        return $company_job_search;
    }

    /**
     * Retrieves all company job search based on where parameter
     * @param array $data values to search
     * @return Object company_job_search collection
     */
    public function where(array $data)
    {
        return $this->company_job_search
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
