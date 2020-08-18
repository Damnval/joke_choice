<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EducationalBackground extends Model
{
    use SoftDeletes;

    protected $table = 'educational_backgrounds';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'school',
        'year',
        'month',
        'job_seeker_id',
    ];

    public static function createRules()
    {
        return [
            'school'  => 'required|string|min:1|max:255',
            'year'    => 'required|integer|min:1|max:50',
            'month'   => 'required|string|min:1|max:15',
        ];
    }

    public function job_seeker()
    {
        return $this->belongsTo(JobSeeker::class);
    }

}
