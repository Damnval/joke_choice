<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class NotificationRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $notification;

    // Constructor to bind model to repo
    public function __construct(Model $notification)
    {
        $this->notification = $notification;
    }

     /**
     * Retrieve all Notifications
     * @return Object Notifications collections
     */
    public function all($paginate = null)
    {
        $notification = $this->notification->with('publication', 'image', 'document');
        
        if ($paginate){
            return $notification->paginate($paginate);
        }

        return $notification->get();
    }

    /**
     * Saving notification data to Notifications resource
     * @param array $data Input from user
     * @return collection Saved notification from db
     */
    public function create(array $data)
    {
        $this->notification->fill($data);
        $this->notification->save();
        return $this->notification;
    }
    
    /**
     * Updating notification data to Notifications resource
     * @param array $data Input from user client
     * @param int $id ID of notification to update
     * @return collection notification Updated notification from database
     */
    public function update(array $data, $id)
    {
        $notification = $this->notification->find($id);

        if ($notification->update($data)) {
            return $notification;
        }
        return false;
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->notification->destroy($id);
    }

    /**
     * Retrieve specific notification
     * @param  Int $id
     * @return Object notification collections
     */
    public function show($id)
    {
        return $this->notification
                    ->where('id', '=', $id)
                    ->with('publication', 'image', 'document')
                    ->first();
    }

    /**
     * Hybrid function that gets published notifications based on where in params 
     * with notification log and optional where has params
     * @param  array  $data          whereIn params
     * @param  string $whereInField  whereIn field
     * @param  array  $with          with retrieving relationships based on user required data
     * @param  string $whereHasField whereHas field to query on what relationship
     * @param  array  $whereHasData  params to perform where query in whereHas
     * @param  string $orderBy       ordering of rows 
     * @param  int    $limit         paginated rows to return 
     * @return Object notification collections
     */
    public function hybridWhereInWithAndWhereHas(array $data, $whereInField, $with, $whereHasField, $whereHasData, $orderBy, $limit = 20)
    {
        $query = $this->notification->whereIn($whereInField, $data);

        if ($with) {
            $query->with($with);
        }

        if ($whereHasField) {
            $query->whereHas($whereHasField, function($subquery) use ($whereHasData) {
                $subquery->where($whereHasData);
            });
        }

        if ($orderBy) {
            $query->orderBy('created_at', $orderBy);
        }

        return $query->paginate($limit);
    }

    /**
     * Hybrid function that gets published notifications  based on where in and where between
     * @param string $field              where in field
     * @param array  $data               where in params
     * @param string $whereBetweenField  where between field
     * @param array  $whereBetween       where between params
     * @param string $with               with retrieving relationships based on user required data
     * @param int    $paginate           paginated number of notifications per page
     */
    public function whereInAndWhereBetween(
        $field, 
        array $data = [], 
        $whereBetweenField = null, 
        array $whereBetweenData = [], 
        $with = [], 
        $paginate = null
    )
    {
        $query = $this->notification;

        if ($field) {
            $query = $query->whereIn($field, $data);
        }

        if ($whereBetweenField && count($whereBetweenData) > 0) {
            $query = $query->whereBetween($whereBetweenField, $whereBetweenData);
        }

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
