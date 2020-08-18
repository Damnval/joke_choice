<?php

namespace App\Repositories;

use App\Repositories\Contract\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class JobQuestionRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $job_question;

    // Constructor to bind model to repo
    public function __construct(Model $job_question)
    {
        $this->job_question = $job_question;
    }

     /**
     * Retrieve all job questions
     * @return Object job_question collections
     */
    public function all()
    {
        return $this->job_question->all();
    }

    /**
     * Saving job questions data to job_questions resource
     * @param  Array $data Input from user
     * @return Collection Saved job_question data from db
     */
    public function create(array $data)
    {
        $this->job_question->fill($data);
        $this->job_question->save();
        return $this->job_question;
    }

    /**
     * Update job_question data to job_question resource
     * @param array $data Input from user
     * @param int $id Id of job_question from user
     * @return bool 
     */
    public function update(array $data, $id)
    {
        $job_question = $this->job_question->find($id);
        return $job_question->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->job_question->destroy($id);
    }

    /**
     * Retrieve specific job_question from job_question resource
     * @param  int $id
     * @return Object job_question collections
     */
    public function show($id)
    {
        return $this->job_question
                    ->where('id', '=', $id)
                    ->first();
    }

    /**
     * Get job questions using where method based on params
     * @param array $data where params
     * @param array $with relationship
     * @return object job question answers resource
     */
    public function where(array $data, $with)
    {
        $query = $this->job_question
                      ->where($data);
        
        if ($with) {
            $query->with($with);
        } 
                   
        return $query->get();
    }

    /**
     * Store array of job questions in job_questions resource
     * @param  array $data job questions to save
     * @param  Object $model Model of its relationship to save
     */
    public function saveMany(array $data, Object $model)
    {
        return $model->job_questions()->saveMany($data);
    }

    /**
     * Delete all job questions from job_questions resource
     * @param  Object $model Model of its relationship to delete
     */
    public function deleteMany(Object $model)
    {
        return $model->job_questions()->delete();
    }

}
