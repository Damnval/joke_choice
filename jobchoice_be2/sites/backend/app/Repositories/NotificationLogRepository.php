<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class NotificationLogRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $notification_log;

    // Constructor to bind model to repo
    public function __construct(Model $notification_log)
    {
        $this->notification_log = $notification_log;
    }

     /**
     * Retrieve all  Notifications Log
     * @return Object  Notifications Log collections
     */
    public function all()
    {
        return $this->notification_log->all();
    }                           

    /**
     * Saving tead notification data to  Notifications Log resource
     * @param array $data Input from user
     * @return collection Saved notification log from db
     */
    public function create(array $data)
    {
        $this->notification_log->fill($data);
        $this->notification_log->save();
        return $this->notification_log;
    }

    
    /**
     * Updating notification data to Notifications Log resource
     * @param array $data Input from user client
     * @param int $id ID of notification log to update
     * @return collection notification log Updated  from db
     */
    public function update(array $data, $id)
    {
        $notification_log = $this->notification_log->find($id);
        return $notification_log->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->notification_log->destroy($id);
    }

    /**
     * Retrieve specific notification log
     * @param int $id
     * @return Object notification Log collections
     */
    public function show($id)
    {
        return $this->notification_log
                    ->where('id', '=', $id)
                    ->first();
    }

    /**
     * Retrieves first notification log based on given parameter
     * @param array $data 
     * @return Object notification log collection
     */
    public function whereFirst(array $data)
    {
        return $this->notification_log->where($data)
                                      ->first();
    }

 }
