<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class OccupationRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $occupation;

    // Constructor to bind model to repo
    public function __construct(Model $occupation)
    {
        $this->occupation = $occupation;
    }

     /**
     * Retrive all Occupations
     * @return Object occupation collections
     */
    public function all()
    {
        return $this->occupation->all();
    }

    /**
     * Saving occupation data to Occupations resource
     * @param array $data Input from user
     * @return collection Saved occupation from db
     */
    public function create(array $data)
    {
        $this->occupation->fill($data);
        $this->occupation->save();
        return $this->occupation;
    }

      /**
     * Updating occupation data to Occupations resource
     * @param array $data Input from user client
     * @param int $id ID of occupation to update
     * @return collection occupation Updated occupation from database
     */
    public function update(array $data, $id)
    {
        $occupation = $this->occupation->find($id);
        return $occupation->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->occupation->destroy($id);
    }

    /**
     * Retrive specific occupation
     * @param  Int $id
     * @return Object occupation collections
     */
    public function show($id)
    {
        return $this->occupation
                    ->where('id', '=', $id)
                    ->first();
    }

 }
