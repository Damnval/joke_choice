<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class SlugRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $slug;

    // Constructor to bind model to repo
    public function __construct(Model $slug)
    {
        $this->slug = $slug;
    }

    /**
     * Retrive all Slugs
     * @return Object Slug collections
     */
    public function all()
    {
        return $this->slug->all();
    }

    /**
     * Saving Slug data to slug resource
     * @param array $data Input from user
     * @return collection Saved slug from db
     */
    public function create(array $data)
    {
        $this->slug->fill($data);
        $this->slug->save();
        return $this->slug;
    }

    // update record in the database
    public function update(array $data, $id)
    {
        $slug = $this->slug->find($id);
        return $slug->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->slug->destroy($id);
    }

    /**
     * Retrive specific Slug
     * @param  Int $id
     * @return Object Slug collections
     */
    public function show($id)
    {
        return $this->slug
                    ->where('id', '=', $id)
                    ->with('shared_jobs.job.company.user')
                    ->first();
    }

    /**
     * Saving Slug using Polymorph
     * @param array $data data input by user
     * @param Object $model model type
     */
    public function createMorph(array $data, Object $model)
    {
        $model->slug()->create($data);
    }

    /**
     * Dynamic getting Slug collections with where params
     * @param array $data
     * @return Object Slug resource
     */
    public function where(array $data)
    {
        return $this->slug
                    ->where($data)
                    ->get();
    }

    /**
     * Dynamic getting Slug from resource with where params but retrieving single row only.
     * @param array $data
     * @return Object Slug resource
     */
    public function whereFirst(array $data)
    {
        return $this->slug
                    ->where($data)
                    ->first();
    }

    /**
     * Get Slug using Polymorph
     * @param Object $model model type
     * @return Object Slug resource
     */
    public function getMorph(Object $model)
    {
        return $model->slug()->first();
    }

 }
