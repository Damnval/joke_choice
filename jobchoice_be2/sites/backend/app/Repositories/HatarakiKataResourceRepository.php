<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use DB;
use Carbon\Carbon;

class HatarakiKataResourceRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $hatarakiKataResource;

    // Constructor to bind model to repo
    public function __construct(Model $hatarakiKataResource)
    {
        $this->hatarakiKataResource = $hatarakiKataResource;
    }

     /**
     * Retrive all Hataraki Kata resource collection
     * @param  Int $id
     * @return Object Hataraki Kata collections
     */
    public function all()
    {
        return $this->hatarakiKataResource->get();
    }

    // Saving hataraki kata resource must use createMany method to store data
    public function create(array $data)
    {
    }

    // not being used
    public function update(array $data, $id)
    {
        $hatarakiKataResource = $this->hatarakiKataResource->find($id);
        return $hatarakiKataResource->update($data);
    }

    // not being used
    public function destroy($id)
    {
        return $this->hatarakiKataResource->destroy($id);
    }

    // not being used
    public function show($id)
    {
        return $this->hatarakiKataResource
                    ->where('id', '=', $id)
                    ->first();
    }

    /**
     * Store array of Hataraki kata in hataraki_kata_resource
     * @param  Array  $data  Hataraki kata to save
     * @param  Object $model Model of its relationship to save
     */
    public function createMany(array $data, Object $model)
    {
        $model->hataraki_kata_resource()->createMany($data);
    }

    /**
     * Delete all hataraki_kata using client id (jobseeker or company) from hataraki_kata_resource
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        $model->hataraki_kata_resource()->delete();
    }

    /**
     * Gets all hataraki_kata_resource from either JobSeeker or Job type
     * @param  Array $data input params
     * @return Object Hataraki Kata collections
     */
    public function where(array $data)
    {
        return $this->hatarakiKataResource->where($data)->get();
    }

     /**
     * Dynamic retrieving of a hataraki kata based on given params using where in MySQL
     * @param  String $field Column to pass where in
     * @param  Array $data values to search
     * @return Object hataraki kata resource collection
     */
    public function whereIn($field, array $data)
    {
        return $this->hatarakiKataResource
                        ->whereIn($field, $data)
                        ->get();
    }

    /**
     * Dynamic retrieving of a hataraki kata based on given params using where in MySQL
     * @param  Array $where values to search using where
     * @param  String $field Column to pass where in
     * @param  Array $data values to search using whereIn
     * @return Object hataraki kata resource collection
     */
    public function whereWhereIn(array $where, $field, array $data)
    {
        return $this->hatarakiKataResource
                        ->whereIn($field, $data)
                        ->get();
    }

    //not being used. reserved in case change of logic
    public function search(array $hataraki_kata_ids, $type = 'Job')
    {
        $count = count($hataraki_kata_ids);

        $job_ids = DB::table('hataraki_kata_resource')
                    ->select(DB::raw('count(taggable_id) as ct, taggable_id'))
                    ->where('taggable_type', '=', $type)
                    ->whereIn('hataraki_kata_id', $hataraki_kata_ids)
                    ->groupBy('taggable_id')
                    ->having('ct', '<=', $count)
                    ->get();

        return $job_ids;
    }

    /**
     * Dynamic that automatically computes job matching ratio with respect to job seeker
     * @param  int    $job_seeker_id
     * @param  int    $job_id
     * @return Object Returns matching ratio of job with respect to job seeker
     */
    public function computeMatchingRatio(int $job_seeker_id, int $job_id)
    {
        return \DB::table('hataraki_kata_resource as h1')
                ->select('h2.taggable_id as job_id', 'h1.taggable_id as job_seeker_id', \DB::raw('count(h2.taggable_id) * 25 as job_seeker_job_matching_ratio'))
                ->leftJoin('hataraki_kata_resource as h2', 'h1.hataraki_kata_id', '=', 'h2.hataraki_kata_id')
                ->where(['h1.taggable_type' => 'JobSeeker', 'h2.taggable_type' => 'Job'])
                ->where(['h1.taggable_id' => $job_seeker_id, 'h2.taggable_id' => $job_id])
                ->groupBy('h2.taggable_id', 'h1.taggable_id')
                ->first();
    }

 }
