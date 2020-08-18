<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class NearestStationRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $nearest_station
    ;

    // Constructor to bind model to repo
    public function __construct(Model $nearest_station)
    {
        $this->nearest_station = $nearest_station;
    }

    /**
     * Retrive all nearest_station
     * @return Object nearest_station collections
     */
    public function all()
    {
        return $this->nearest_station->all();
    }

    /**
     * Saving Nearest stations data to nearest_stations resource
     * @param  Array $data Input from user
     * @return Collection Saved nearest_station data from db
     */
    public function create(array $data)
    {
        $this->nearest_station->fill($data);
        $this->nearest_station->save();
        return $this->nearest_station;
    }

    /**
     * Updating Nearest stations data to nearest_stations resource
     * @param  Array $data Input from user client
     * @return Collection nearest_station Updated Nearest stations from database
     */
    public function update(array $data, $id)
    {
        $nearest_station = $this->nearest_station->find($id);
        return $nearest_station->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->nearest_station->destroy($id);
    }

    /**
     * Retrive specific nearest_station
     * @param  Int $id
     * @return Object nearest_station collections
     */
    public function show($id)
    {
        return $this->nearest_station->findOrFail($id);
    }

     /**
     * Store array of Nearest stations in nearest_stations resource
     * @param  array  $data Nearest stations to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->nearest_station()->saveMany($data);
    }

    /**
     * Delete all Nearest stations in nearest_stations resource
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->nearest_station()->delete();
    }

}
