<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;
use DB;

class AppliedJobRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $applied_job;

    /**
     * Constructor to bind model to repo
     * @param Model $applied_job
     */
    public function __construct(Model $applied_job)
    {
        $this->applied_job = $applied_job;
    }

     /**
     * Get all applied jobs from resource
     * @return Object
     */
    public function all()
    {
        return $this->applied_job->all();
    }

    /**
     * Saving applied_job data to applied_jobs resource
     * @param array $data Input from user
     * @return object applied_job resource
     */
    public function create(Array $data)
    {
        $this->applied_job->fill($data);
        $this->applied_job->save();
        return $this->applied_job;
    }

    public function update(Array $data, $id)
{
        $applied_job = $this->applied_job->find($id);
        return $applied_job->update($data);
    }

    /**
     * Remove applied job from resource
     * @param int $id ID of applied_job
     * @return Boolean Result if deleted
     */
    public function destroy($id)
    {
        return $this->applied_job->destroy($id);
    }

    public function show($id)
    {
        return $this->applied_job->findOrFail($id);
    }

    /**
     * Get Applied jobs using where method based on params
     * @param array $data
     * @param int $paginate
     * @param string $with
     * @return object applied_jobs resource
     */
    public function where(array $data, $paginate = null, $with = null)
    {
        $query = $this->applied_job
                      ->where($data);

        if ($with) {
            $query->with($with);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }

    /**
     *  Get Applied jobs using with Where and Where In based on params
     * @param   array  $where
     * @param   string $field
     * @param   array $whereIn
     * @param   int $paginate   per page pagination
     * @return  Object Collection of Objects
     */
    public function whereAndWhereIn(array $where, $field, array $whereIn, $paginate = null)
    {

        $query = $this->applied_job
                      ->with(
                                'job.analytic',
                                'job.company.user',
                                'job.shared_job',
                                'job.job_job_sub_categories.job_sub_category',
                                'shared_job.slug.user.job_seeker'
                            )
                      ->where($where);


        if (!empty($whereIn)) {
           $query->whereIn($field, $whereIn);
        }

        if ($paginate) {
            $query = $this->addPaginate($query, $paginate);
            return $query;
        }

        return $query->get();
    }


    /**
     * Paginate returned collections
     * @param Collection $query
     * @param Int $per_page No. of pagination per page.
     */
    public function addPaginate($query, $per_page)
    {
        return $query->paginate($per_page);
    }

     /**
     * Dynamic retrieving of a applied job based on given params using where in MySQL
     * @param  string $field Column to pass where in
     * @param  array $data values to search
     * @return Object applied job collection
     */
    public function whereIn($field, array $data)
    {
        return $this->applied_job
                        ->whereIn($field, $data)
                        ->get();
    }

    /**
     * Dynamic retrieving of a applied job based on given params using where in MySQL
     * and where, where between and with relationships
     * @param  array  $data              where params values to search
     * @param  string $field             column to pass where in
     * @param  array  $whereIn           params to search where in
     * @param  array  $whereBetweenField column to pass where between
     * @param  array  $whereBetweenData  params to search where between
     * @param  array  $with              retrieving relationships based on user required data
     * @param  string $select            fields to display
     * @return Object applied job collection
     */
    public function whereWhereInAndWhereBetweenWith($data, $field, array $whereIn, $whereBetweenField = null, $whereBetweenData = null, $with = null, $select = '*')
    {
       $query = $this->applied_job->select($select)
                                  ->where($data)
                                  ->whereIn($field, $whereIn);

       if ($whereBetweenField && $whereBetweenData) {
           $query->whereBetween($whereBetweenField, $whereBetweenData);
       }

       if ($with) {
           $query->with($with);
       }

       return $query->get();
    }

    /**
     * Get all applicants on the passed job id params
     * @param int $job_id
     */
    public function hybridJobApplicationList($job_id, $age = null, $gender = null, $employment_status = null, $keyword = null)
    {
        $query = ("SELECT
                        aj.id as applied_job_id,
                        aj.job_id as job_id,
                        aj.job_seeker_id as applicant_job_seeker_id,
                        aj.disclosed as applicant_applied_job_disclosed,
                        aj.status as applicant_status,
                        us.first_name as applicant_first_name,
                        js.nickname as applicant_nickname,
                        YEAR(CURDATE()) - YEAR(js.birth_date) as applicant_age,
                        js.gender as applicant_gender,
                        js.employment_status as applicant_employment_status,
                        geo.complete_address as applicant_complete_address,
                        job_seeker_note.notes as applicant_notes,
                        job_seeker_note.id as applicant_note_id,
                        aj.work_exp_comment as applicant_work_exp_comment,
                        aj.shared_job_id as shared_job_id,
                        sharer_info.first_name as sharer_first_name,
                        sharer_info.user_id as sharer_user_id,
                        sharer_info.disclosed as sharer_disclosed_job,
                        sharer_info.not_disclosed as sharer_not_disclosed_job,
                        sharer_info.total_shared_job as sharer_total_shared_job,
                        sharer_note.notes as sharer_note,
                        sharer_note.id as sharer_note_id,
                        shared_job.slug_id as sharer_slug_id

                    FROM
                        applied_jobs aj
                    LEFT JOIN
                        job_seekers js
                    ON
                        aj.job_seeker_id = js.id
                    LEFT JOIN
                        users us
                    ON
                        us.id = js.user_id
                    INNER JOIN
                        geolocation geo
                    ON
                        geo.taggable_id = aj.job_seeker_id

                    LEFT JOIN
                        (
                        SELECT
                            id,
                            taggable_id,
                            notes
                        FROM
                            notes
                        WHERE
                            taggable_type = 'AppliedJob'
                        ) job_seeker_note
                    ON
                        job_seeker_note.taggable_id = aj.id
                    LEFT JOIN
                        (
                        SELECT
                            id,
                            notes,
                            taggable_id as shared_job_id
                        FROM
                            notes
                        WHERE
                            taggable_type = 'SharedJob'
                        ) sharer_note
                    ON
                        sharer_note.shared_job_id = aj.shared_job_id
                    LEFT JOIN
                        shared_jobs shared_job
                    ON
                        shared_job.id = aj.shared_job_id
                    LEFT JOIN
                        (
                        SELECT
                            shared_jobs.slug_id,
                            user.first_name,
                            user.id as user_id,
                            count(CASE WHEN disclosed = 1 THEN disclosed END) as disclosed,
                            count(CASE WHEN disclosed = 0 THEN disclosed END) as not_disclosed,
                            count(disclosed) as total_shared_job

                        FROM
                            shared_jobs
                        INNER JOIN
                            (
                            SELECT
                                disclosed,
                                shared_job_id
                            FROM
                                applied_jobs
                            ) as approved
                        ON
                            approved.shared_job_id = shared_jobs.id

                        INNER JOIN
                            slugs slug
                        ON
                            shared_jobs.slug_id = slug.id

                        INNER JOIN
                            users user
                        ON
                            slug.sluggable_id = user.id
                        WHERE
                            slug.sluggable_type = 'User'


                        group by shared_jobs.slug_id
                        ) sharer_info
                    ON
                        sharer_info.slug_id = shared_job.slug_id
                    WHERE
                        geo.taggable_type = 'JobSeeker'
                    AND
                        aj.job_id =  '" . $job_id . "'
                    ");

        if ($age) {
            $query .= " AND (YEAR(CURDATE()) - YEAR(js.birth_date)) = " .$age. "";
        }

        if ($gender) {
            $query .= " AND js.gender = '" .$gender. "'";
        }

        if ($employment_status) {
            $query .= " AND js.employment_status = '" .$employment_status. "'";
        }

        if ($keyword) {
            $query .= " AND (
                            aj.disclosed LIKE '%".$keyword."%' OR
                            aj.status LIKE '%".$keyword."%' OR
                            us.first_name LIKE '%".$keyword."%' OR
                            YEAR(CURDATE()) - YEAR(js.birth_date) LIKE '%".$keyword."%' OR
                            js.gender LIKE '%".$keyword."%' OR
                            geo.complete_address LIKE '%".$keyword."%' OR
                            job_seeker_note.notes LIKE '%".$keyword."%' OR
                            aj.work_exp_comment LIKE '%".$keyword."%' OR
                            sharer_info.first_name LIKE '%".$keyword."%' OR
                            sharer_info.disclosed LIKE '%".$keyword."%' OR
                            sharer_info.total_shared_job LIKE '%".$keyword."%' OR
                            sharer_note.notes LIKE '%".$keyword."%'
                            )";
        }

        $result = \DB::select($query);

        return $result;
    }

    /**
     * Updating applied job table based on where params
     * @param array $data Input from user client
     * @param array $where Parameters what only rows to be updated
     * @return Boolean If update success
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->applied_job
                    ->where($where)
                    ->update($data);
    }

     /**
     * Dynamic retrieving of a applied job based on given params using where and with
     * @param  $with default to null
     * @param  array $data values to retrieved
     * @return Object data
     */
    public function whereFirst(array $data, $with = null)
    {
        $query = $this->applied_job
                    ->where($data);
        if($with){
            $query =  $query->with($with);
        }

        return  $query->first();
    }

    /**
     * Info on what to return if job is disclosed or not
     * @param  array $data  Where params
     * @param  Boolean $check If disclosed or not
     * @return Collection Applied job with relation ships
     */
    public function getAccountInformation($data, $check)
    {
        $with = [
            'job_seeker.job_seeker_skills.skill',
            'job_seeker.educational_background',
            'job_seeker.hataraki_kata_resource.hataraki_kata',
            'job_seeker.work_experience',
            'job_seeker.geolocation',
            'job' => function ($query) {
                $query->select('id', 'incentive_per_share');
            },
        ];

        if ($check) {
            $with[] = 'job_seeker.user';
        } else {
            $with['job_seeker'] = function($query){
                            return $query->exclude(['profile_picture']);
                        };
        }
        return $this->applied_job
                    ->with($with)
                    ->where($data)
                    ->first();
    }

}
