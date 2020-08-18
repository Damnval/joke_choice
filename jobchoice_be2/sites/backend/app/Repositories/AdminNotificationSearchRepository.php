<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class AdminNotificationSearchRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $admin_notification_search;

    // Constructor to bind model to repo
    public function __construct(Model $admin_notification_search)
    {
        $this->admin_notification_search = $admin_notification_search;
    }

    /**
     * Retrive all data from admin notification search
     * @param  int $paginate No. of admin notification search rows per page
     * @return Object admin_notification_search collections
     */
    public function all($paginate = null)
    {
        $query = $this->admin_notification_search;

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }
        
        return $query->get();
    }

    //Not being used since this is a view table
    public function create(array $data)
    {
        $this->admin_notification_search->fill($data);
        $this->admin_notification_search->save();
        return $this->admin_notification_search;
    }

    //Not being used since this is a view table
    public function update(array $data, $id)
    {
        $admin_notification_search = $this->admin_notification_search->find($id);
        return $admin_notification_search->update($data);
    }

    //Not being used since this is a view table
    public function destroy($id)
    {
        return $this->admin_notification_search->destroy($id);
    }

    //Not being used since this is a view table
    public function show($id)
    {
        return $this->admin_notification_search
                    ->findOrFail($id);
    }

    /**
     * Multiple keyword Search
     * Search from mysql view admin_notification_search table
     * @param  array $data
     * @return Object $admin_notification_search Notification Collections based on keyword search
     */
    public function keywordSearch($data)
    {
        $searchWords = explode(" ", $data);
        $query = $this->admin_notification_search;

        $words = [];

        foreach ($searchWords as $word) {
            if (count($words) > 0) {
                $query = $query->orWhere('items', 'like', '%' . $word . '%');
            } else {
                $query = $query->where('items', 'like', '%' . $word . '%');
                $words[] = $word;
            }
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
