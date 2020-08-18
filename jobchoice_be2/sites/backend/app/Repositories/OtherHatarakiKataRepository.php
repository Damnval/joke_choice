<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class OtherHatarakiKataRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $other_hataraki_kata;

    // Constructor to bind model to repo
    public function __construct(Model $other_hataraki_kata)
    {
        $this->other_hataraki_kata = $other_hataraki_kata;
    }

    /**
     * Retrive all other_hataraki_kata
     * @param  Int $id
     * @return Object other_hataraki_kata collections
     */
    public function all()
    {
        return $this->other_hataraki_kata->all();
    }

    /**
     * Saving other_hataraki_kata data to other_hataraki_kata resource
     * @param  Array $data Input from user
     * @return Collection Saved other_hataraki_kata data from db
     */
    public function create(array $data)
    {
        $this->other_hataraki_kata->fill($data);
        $this->other_hataraki_kata->save();
        return $this->other_hataraki_kata;
    }

    /**
     * Updating other_hataraki_kata data to other_hataraki_kata resource
     * @param  Array $data Input from user client
     * @return Collection other_hataraki_kata Updated other_hataraki_kata from database
     */
    public function update(array $data, $id)
    {
        $other_hataraki_kata = $this->other_hataraki_kata->find($id);
        return $other_hataraki_kata->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->other_hataraki_kata->destroy($id);
    }

    /**
     * Retrive specific other_hataraki_kata
     * @param  Int $id
     * @return Object other_hataraki_kata collections
     */
    public function show($id)
    {
        return $this->other_hataraki_kata
                    ->where('id', '=', $id)
                    ->first();
    }

     /**
     * Store array of other_hataraki_kata in other_hataraki_kata
     * @param  array  $data other_hataraki_kata to save
     * @param  Object $model Model of its relationship to save
     */
    public function createMany(array $data, Object $model)
    {
        return $model->other_hataraki_kata()->createMany($data);
    }

    /**
     * Delete all other_hataraki_kata using job from other_hataraki_kata
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->other_hataraki_kata()->delete();   
    }

}
