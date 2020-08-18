<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobQuestionJobSeekerAnswer extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'job_question_id',
        'job_seeker_id',
        'job_question_answer_id',
        'free_text_answer'
    ];

    public static function createRules()
    {
        return [
			'job_question_id' => 'required',
			'job_seeker_id' => 'required'
        ];
    }

    public function job_question_answer()
    {
        return $this->belongsTo(JobQuestionAnswer::class);
    }

}

