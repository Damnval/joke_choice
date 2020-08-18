<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSeeker extends Model
{
    use SoftDeletes;

	protected $table='job_seekers';

    /**
     * columns of this table/model
     * columns that are present on database should be included in $colums property
     * @var array
     */
    protected $columns = [
        'id',
        'nickname',
        'birth_date',
        'age',
        'gender',
        'user_id',
        'mail_setting',
        'marital_status',
        'employment_status',
        'description',
        'profile_picture',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nickname',
        'gender',
        'birth_date',
        'user_id',
        'mail_setting',
        'marital_status',
        'description',
        'profile_picture',
    ];

    public static function createRules()
    {
        return [
           'nickname'        => 'nullable|string|min:1|max:50',
           'gender'          => 'nullable|in:male,female',
           'birth_date'      => 'nullable|date|before:today',
           'mail_setting'    => 'nullable|in:0,1',
           'marital_status'  => 'nullable|in:yes,no',
           'description'     => 'nullable|string|min:1|max:255',
           'profile_picture' => 'nullable',
        ];
    }

    public function geolocation()
    {
        return $this->morphOne(Geolocation::class, 'taggable');
    }

    public function hataraki_kata_resource()
    {
        return $this->morphMany(HatarakiKataResource::class, 'taggable');
    }

    public function job_seeker_skills()
    {
        return $this->hasMany(JobSeekerSkill::class, 'job_seeker_id', 'id');
    }

    public function work_experience()
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function educational_background()
    {
        return $this->hasMany(EducationalBackground::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bank_account()
    {
        return $this->hasOne(BankAccount::class);
    }

    public function notes()
    {
        return $this->morphOne(Note::class, 'taggable');
    }

    //Scope query that can exclude specific fields from select *
    public function scopeExclude($query,$value = array())
    {
        return $query->select(array_diff( $this->columns,(array) $value));
    }

    public function job_question_job_seeker_answers()
    {
        return $this->hasMany(JobQuestionJobSeekerAnswer::class);
    }

}
