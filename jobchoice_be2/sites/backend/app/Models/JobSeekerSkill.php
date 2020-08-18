<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSeekerSkill extends Model
{
    use SoftDeletes;

	protected $table = 'job_seeker_skills';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'skill_id',
        'job_seeker_id'
    ];

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
