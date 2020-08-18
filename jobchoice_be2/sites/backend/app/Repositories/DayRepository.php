<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class DayRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $day;

    // Constructor to bind model to repo
    public function __construct(Model $day)
    {
        $this->day = $day;
    }

    /**
     * Retrive all day
     * @param  Int $id
     * @return Object day collections
     */
    public function all()
    {
        return $this->day->all();
    }

    /**
     * Saving Day data to Days resource
     * @param  Array $data Input from user
     * @return Collection Saved Day data from db
     */
    public function create(array $data)
    {
        $this->day->fill($data);
        $this->day->save();
        return $this->day;
    }

    /**
     * Updating Day data to Days resource
     * @param  Array $data Input from user client
     * @return Collection Day Updated Day from database
     */
    public function update(array $data, $id)
    {
        $day = $this->day->find($id);
        return $day->update($data);
    }

    /**
     * Updating day data to days resource
     * @param  Array $data Input from user client
     * @return Collection Day Updated day from db
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->day->where($where)->each(function ($day) use ($data) {
            $day->update($data);
        });
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->day->destroy($id);
    }

    /**
     * Retrive specific day
     * @param  Int $id
     * @return Object day collections
     */
    public function show($id)
    {
        return $this->day
                    ->where('id', '=', $id)
                    ->first();
    }

    /**
     * Dynamic retrieving of a day based on given params using where in MySQL
     * @param  String $field Column to pass where in
     * @param  Array $data values to search
     * @return Object day collection
     */
    public function whereIn($field, array $data)
    {
        return $this->day->whereIn($field, $data)->get();
    }

     /**
     * Store array of day in Days
     * @param  array  $data Days to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->days()->saveMany($data);
    }

    /**
     * Delete all days using job_seeker_id from days
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->days()->delete();   
    }

}
