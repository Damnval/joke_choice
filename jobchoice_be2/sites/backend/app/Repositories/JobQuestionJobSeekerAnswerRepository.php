<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobQuestionJobSeekerAnswerRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_question_job_seeker_answer
    ;

    // Constructor to bind model to repo
    public function __construct(Model $job_question_job_seeker_answer)
    {
        $this->job_question_job_seeker_answer = $job_question_job_seeker_answer;
    }

    /**
     * Retrive all job_question_job_seeker_answer
     * @return Object job_question_job_seeker_answer collections
     */
    public function all()
    {
        return $this->job_question_job_seeker_answer->all();
    }

    /**
     * Saving answers of jobseeker from job questions to job_question_job_seeker_answers resource
     * @param  Array $data Input from user
     * @return Collection Saved job_question_job_seeker_answer data from db
     */
    public function create(array $data)
    {
        $this->job_question_job_seeker_answer->fill($data);
        $this->job_question_job_seeker_answer->save();
        return $this->job_question_job_seeker_answer ;
    }

    /**
     * Updating answers of jobseeker from job questions to job_question_job_seeker_answers resource
     * @param  Array $data Input from user client
     * @return Collection job_question_job_seeker_answer Updated job_question_job_seeker_answer from database
     */
    public function update(array $data, $id)
    {
        $job_question_job_seeker_answer = $this->job_question_job_seeker_answer->find($id);
        return $job_question_job_seeker_answer->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_question_job_seeker_answer->destroy($id);
    }

    /**
     * Retrive specific job_question_job_seeker_answer
     * @param  Int $id
     * @return Object job_question_job_seeker_answer collections
     */
    public function show($id)
    {
        return $this->job_question_job_seeker_answer
                    ->findPrFail($id);
    }

    /**
     * Saves multiple data on saving Job seekers answer from job question
     * @param  Int $data Job seeker answers to be saved.
     * @return Boolean If it succesfully saved.
     */
    public function insert($data)
    {
        return $this->job_question_job_seeker_answer
                    ->insert($data);
    }

     /**
     * Delete all job_question_job_seeker_answer using job_seeker_id from job_question_job_seeker_answers
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_question_job_seeker_answers()->delete();
    }

}
