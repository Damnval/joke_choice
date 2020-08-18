<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkExperience extends Model
{
    use SoftDeletes;
   /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company',
        'position',
        'job_seeker_id',
        'start_date',
        'end_date',
    ];

    public static function createRules()
    {
        return [
            'company'    => 'required|min:1|max:255',
            'position'   => 'required|min:1|max:50',
            'start_date' => 'required|date',
            'end_date'   => 'required|date',
        ];
    }

    public function job_seeker()
    {
        return $this->belongsTo(JobSeeker::class);
    }

}
