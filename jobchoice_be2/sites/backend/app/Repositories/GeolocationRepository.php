<?php 

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class GeolocationRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $geolocation;

    // Constructor to bind model to repo
    public function __construct(Model $geolocation)
    {
        $this->geolocation = $geolocation;
    }

     /**
     * Retrive all jobs
     * @param  Int $id 
     * @return Object geolocation collections
     */
    public function all()
    {
        return $this->geolocation->all();
    }

    /**
     * Saving Geolocation data to geolocation resource
     * @param  Array $data Input from user 
     * @return Collection Saved geolocation from db
     */
    public function create(array $data)
    {
        $this->geolocation->fill($data);
        $this->geolocation->save();
        return $this->geolocation;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $geolocation = $this->geolocation->find($id);
        return $geolocation->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->geolocation->destroy($id);
    }

    /**
     * Retrive specific geolocation 
     * @param  Int $id 
     * @return Object geolocation collections
     */
    public function show($id)
    {
       return $this->geolocation->findOrFail($id);
    }

    /**
     * Saving Geolocation using Polymorph
     * @param Array $data data input by user  
     * @param Object $model model type
     */    
    public function createMorph(array $data, Object $model)
    {
        $model->geolocation()->create($data);
    }

    /**
     * Updating geolocation based on given model
     * @param Array $data data input by user  
     * @param Object $model model type
     */
    public function updateMorph(array $data, Object $model)
    {
        return $model->geolocation()->update($data);
    }

    /**
     * Retrieves all geolocation based on given parameter
     * @param  Array $data
     * @return Object geolocation collection
     */
    public function where(array $data)
    {
        return $this->geolocation
                    ->where($data)
                    ->get();
    }
    
}
