<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class HatarakiKataCategoryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $hatarakiKataCategory;

    // Constructor to bind model to repo
    public function __construct(Model $hatarakiKataCategory)
    {
        $this->hatarakiKataCategory = $hatarakiKataCategory;
    }

     /**
     * Retrive all Hataraki Kata Category
     * @param  Int $id
     * @return Object Hataraki Kata Category collections
     */
    public function all()
    {
        return $this->hatarakiKataCategory
                    ->with('hataraki_kata')
                    ->get();
    }

    /**
     * Saving Hataraki Kata Category data to hataraki_kata resource
     * @param array $data Input from user
     * @return collection Saved Hataraki Kata Category from db
     */
    public function create(array $data)
    {
        $this->hatarakiKataCategory->fill($data);
        $this->hatarakiKataCategory->save();
        return $this->hatarakiKataCategory;
    }

    /**
     * Update Hataraki Kata Category data to hataraki_kata_category resource
     * @param array $data Input from user
     * @param int $id Id of Hataraki Kata Category from user
     * @return boolean 
     */
    public function update(array $data, $id)
    {
        $hatarakiKataCategory = $this->hatarakiKataCategory->find($id);
        return $hatarakiKataCategory->update($data);
    }

    /**
     * Deleting Hataraki Kata Category data to hataraki_kata_category resource
     * @param integer $id Input from user
     * @return boolean 
     */
    public function destroy($id)
    {
        return $this->hatarakiKataCategory->destroy($id);
    }

    /**
     * Retrieve specific Hataraki Kata Category data from hataraki_kata_category resource
     * @param  int $id
     * @return Object Hataraki Kata Category collections
     */
    public function show($id)
    {
        return $this->inquiry->findOrFail($id);
    }

 }
