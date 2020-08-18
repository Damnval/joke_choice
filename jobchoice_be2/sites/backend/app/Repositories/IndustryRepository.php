<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class IndustryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $industry;

    // Constructor to bind model to repo
    public function __construct(Model $industry)
    {
        $this->industry = $industry;
    }

     /**
     * Retrive all Industries
     * @return Object Industries collections
     */
    public function all()
    {
        return $this->industry->all();
    }

    /**
     * Saving industry data to Industries resource
     * @param array $data Input from user
     * @return collection Saved industry from db
     */
    public function create(array $data)
    {
        $this->industry->fill($data);
        $this->industry->save();
        return $this->industry;
    }

      /**
     * Updating industry data to Industries resource
     * @param array $data Input from user client
     * @param int $id ID of industry to update
     * @return collection industry Updated industry from database
     */
    public function update(array $data, $id)
    {
        $industry = $this->industry->find($id);
        return $industry->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->industry->destroy($id);
    }

    /**
     * Retrive specific industry
     * @param  Int $id
     * @return Object industry collections
     */
    public function show($id)
    {
        return $this->industry
                    ->where('id', '=', $id)
                    ->first();
    }

 }
