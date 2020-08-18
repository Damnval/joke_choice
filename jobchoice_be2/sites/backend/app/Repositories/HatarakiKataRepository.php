<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class HatarakiKataRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $hatarakiKata;

    // Constructor to bind model to repo
    public function __construct(Model $hatarakiKata)
    {
        $this->hatarakiKata = $hatarakiKata;
    }

     /**
     * Retrive all Hataraki Kata
     * @param  Int $id
     * @return Object Hataraki Kata collections
     */
    public function all()
    {
        return $this->hatarakiKata
                        ->get();
    }

    /**
     * Saving Hataraki Kata data to hataraki_kata resource
     * @param array $data Input from user
     * @return collection Saved Hataraki Kata from db
     */
    public function create(array $data)
    {
        $this->hatarakiKata->fill($data);
        $this->hatarakiKata->save();
        return $this->hatarakiKata;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $hatarakiKata = $this->hatarakiKata->find($id);
        return $hatarakiKata->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->hatarakiKata->destroy($id);
    }

    /**
     * Retrive specific Hataraki Kata
     * @param  Int $id
     * @return Object Hataraki Kata collections
     */
    public function show($id)
    {
        return $this->hatarakiKata->where('id', '=', $id)
                         ->first();
    }

 }
