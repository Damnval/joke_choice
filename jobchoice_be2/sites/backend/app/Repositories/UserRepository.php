<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use DB;
use Carbon\Carbon;

class UserRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $user;

    /**
     * Constructor to bind model to repo
     * @param Model $user
     */
    public function __construct(Model $user)
    {
        $this->user = $user;
    }

     /**
     * Get all user from resource
     * @return Object
     */
    public function all()
    {
        return $this->user->all();
    }

    /**
     * Saving user data to user resource
     * @param array $data Input from user
     * @return collection User Saved user from db
     */
    public function create(array $data)
    {
        $this->user->fill($data);
        $this->user->save();
        return $this->user;
    }

      /**
     * Updating user data to user resource
     * @param array $data Input from user client
     * @return collection User Updated user from db
     */
    public function update(array $data, $id)
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user = $this->user->find($id);
        if ($user->update($data)) {
            return $user;
        }
        return false;
    }

    public function destroy($id)
    {
        return $this->user->destroy($id);
    }

    public function show($id)
    {
        return $this->user
                    ->with(
                        'slug',
                        'job_seeker.bank_account',
                        'job_seeker.geolocation',
                        'job_seeker.hataraki_kata_resource.hataraki_kata',
                        'job_seeker.job_seeker_skills.skill',
                        'job_seeker.work_experience',
                        'job_seeker.educational_background',
                        'company.geolocation',
                        'company.industry',
                        'company.occupation'
                    )
                    ->findOrFail($id);
    }

    /**
     * Dynamic getting users from resource with where params
     * @param  Array $data Where param
     * @param  Int $paginate no of pagination count
     * @param  Array $with Relationship to be included in getting user collection
     * @return Object User Collection
     */
    public function where($data, $paginate = null, array $with = [])
    {
        $query = $this->user->where($data);

        if (count($with) > 0) {
            $query = $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     * Dynamic getting user from resource with where params only single row
     * @param  Array $data Where params
     * @return Object User Collection
     */
    public function whereFirst($data)
    {
        return $this->user
                    ->where($data)
                    ->first();
    }

    /**
     * Paginate returned collections
     * @param QueryString $query
     * @param int $per_page No. of pagination per page.
     * @return QueryString $query paginated
     */
    public function addPaginate($query, $per_page)
    {
        return $query->paginate($per_page);
    }

    /**
     * Function that force deletes a soft deleted user
     * @param Object $model model type
     */
    public function forceDelete($model)
    {
        $model->forceDelete();
    }

    /**
     * Specific that gets users with job seekers applied through their shared jobs
     * Reference SQL Query in public/reference/sql/UserRepository/UserIncentiveManagement.sql
     * @param array  $dates             date values to search in between
     * @param string $orderBy           the order to sort the field
     * @param int    $paginate          number of results per page
     */
    public function userIncentiveManagement($dates, $orderBy = null, $paginate = null)
    {
        // sub query to get shared job counts of user
        $sub_query_shared = DB::table('shared_jobs')->select('slug_id', DB::raw('count(*) as shared_job_count'))
                                                    ->groupBy('slug_id');
        // sub query to get those who applied to the users shared jobs
        $sub_query_applied_shared = DB::table('shared_jobs')
                                      ->select(
                                                 DB::raw('max(applied_jobs.updated_at) as updated_at'),
                                                 'slugs.id as slug_id'
                                              )
                                      ->join('applied_jobs', 'applied_jobs.shared_job_id', '=', 'shared_jobs.id')
                                      ->join('slugs', 'slugs.id', '=', 'shared_jobs.slug_id')
                                      ->where('applied_jobs.disclosed', 1)
                                      ->groupBy('slugs.id');

        // main query to get all users with jobseekers applying to their shared jobs
        $query = $this->user->select(
                                        'users.id',
                                        'job_seekers.id as job_seeker_id',
                                        'users.first_name',
                                        'users.last_name',
                                        'users.first_name_kana',
                                        'users.last_name_kana',
                                        'job_seekers.gender',
                                        'job_seekers.birth_date',
                                        'geolocation.prefectures',
                                        'slugs.id as slug_id',
                                        'shared_job_count',
                                        'applied_shared.updated_at'
                                    )
                            ->join('job_seekers', 'job_seekers.user_id', '=', 'users.id')
                            ->join('geolocation', 'geolocation.taggable_id', '=', 'job_seekers.id')
                            ->join('slugs', 'slugs.sluggable_id', '=', 'users.id')
                            ->leftJoinSub($sub_query_shared, 'shared_count', function ($join) {
                                $join->on('shared_count.slug_id', '=', 'slugs.id');
                            })
                            ->joinSub($sub_query_applied_shared, 'applied_shared', function ($join) {
                                $join->on('applied_shared.slug_id', '=', 'slugs.id');
                            })
                            ->where('users.type', 'job_seeker')
                            ->where('geolocation.taggable_type', 'JobSeeker')
                            ->where('slugs.sluggable_type', 'User')
                            ->whereBetween('applied_shared.updated_at', $dates);

        if ($orderBy) {
            $query->orderBy('applied_shared.updated_at', $orderBy);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

}
