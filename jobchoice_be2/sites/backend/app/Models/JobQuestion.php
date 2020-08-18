<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobQuestion extends Model
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question',
        'answer_type',
        'job_id',
        'required_answer'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public static function createRules()
    {
        return [
            'question' => 'required',
            'answer_type'  => 'required',
            'required_answer' => 'required',
        ];
    }

    public function job_question_answers()
    {
        return $this->hasMany(JobQuestionAnswer::class);
    }

    public function job_question_job_seeker_answers()
    {
        return $this->hasMany(JobQuestionJobSeekerAnswer::class);
    }
}
