<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppliedJob extends Model
{
    use SoftDeletes;

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'job_seeker_id',
        'job_id',
        'status',
        'work_exp_comment',
        'shared_job_id'
    ];

    public static function createRules()
    {
        return [
            'job_id'  => 'required',
            'work_exp_comment' => 'required|min:20',
        ];
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function job_seeker()
    {
        return $this->belongsTo(JobSeeker::class);
    }

    public function note()
    {
        return $this->morphOne(Note::class, 'taggable');
    }

    public function shared_job()
    {
        return $this->belongsTo(SharedJob::class, 'shared_job_id');
    }

}
