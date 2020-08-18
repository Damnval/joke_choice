<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobQuestionAnswerRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_question_answer
    ;

    // Constructor to bind model to repo
    public function __construct(Model $job_question_answer)
    {
        $this->job_question_answer = $job_question_answer;
    }

    /**
     * Retrive all job_question_answer
     * @return Object job_question_answer collections
     */
    public function all()
    {
        return $this->job_question_answer->all();
    }

    /**
     * Saving answer of job questions data to job_question_answers resource
     * @param  Array $data Input from user
     * @return Collection Saved job_question_answer data from db
     */
    public function create(array $data)
    {
        $this->job_question_answer->fill($data);
        $this->job_question_answer->save();
        return $this->job_question_answer ;
    }

    /**
     * Updating job_question_answer data to Days resource
     * @param  Array $data Input from user client
     * @return Collection job_question_answer Updated job_question_answer from database
     */
    public function update(array $data, $id)
    {
        $job_question_answer = $this->job_question_answer->find($id);
        return $job_question_answer->update($data);
    }

    /**
     * Updating job_question_answer data to days resource
     * @param  Array $data Input from user client
     * @return Collection job_question_answer Updated job_question_answer from db
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->job_question_answer
                    ->where($where)
                    ->each(function ($job_question_answer) use ($data) {
                        $job_question_answer->update($data);
                    });
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_question_answer->destroy($id);
    }

    /**
     * Retrive specific job_question_answer
     * @param  Int $id
     * @return Object job_question_answer collections
     */
    public function show($id)
    {
        return $this->job_question_answer
                    ->where('id', '=', $id)
                    ->first();
    }

     /**
     * Store array of job_question_answer in job_question_answer
     * @param  array  $data job_question_answer to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_question_answers()->saveMany($data);
    }

    /**
     * Delete all job_question_answer using job_seeker_id from job_question_answer
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_question_answers()->delete();
    }

}
