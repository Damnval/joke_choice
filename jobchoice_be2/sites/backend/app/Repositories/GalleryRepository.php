<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class GalleryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $gallery;

    // Constructor to bind model to repo
    public function __construct(Model $gallery)
    {
        $this->gallery = $gallery;
    }

    /**
     * Retrive all galleries
     * @return Object gallery collections
     */
    public function all()
    {
        return $this->gallery->all();
    }

    /**
     * Saving gallery data to galleries resource
     * @param  Array $data Input from user
     * @return Collection Saved gallery data from db
     */
    public function create(array $data)
    {
        $this->gallery->fill($data);
        $this->gallery->save();
        return $this->gallery;
    }

    /**
     * Updating gallery data to galleries resource
     * @param  Array $data Input from user client
     * @param  Int $id
     * @return Collection gallery Updated gallery from database
     */
    public function update(array $data, $id)
    {
        $gallery = $this->gallery->find($id);
        return $gallery->update($data);
    }

    /**
     * Updating gallery data to galleries resource
     * @param  Array $data Input from user client
     * @param  Array $where
     * @return Collection gallery Updated gallery from db
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->gallery->where($where)->each(function ($gallery) use ($data) {
            $gallery->update($data);
        });
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->gallery->destroy($id);
    }

    /**
     * Retrive specific gallery
     * @param  Int $id
     * @return Object gallery collection
     */
    public function show($id)
    {
        return $this->gallery
                    ->where('id', '=', $id)
                    ->first();
    }

     /**
     * Store array of gallery in galleries
     * @param  array  $data galleries to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->galleries()->saveMany($data);
    }

    /**
     * Delete all galleries using job_seeker_id from galleries
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->galleries()->delete();
    }

}
