<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference_id',
        'employment_type',
        'employment_period',
        'company_id',
        'service_company',
        'price',
        'incentive_per_share',
        'title',
        'job_image',
        'description',
        'url_job_video',
        'qualifications',
        'planned_hire',
        'payment_type',
        'salary'    ,
        'salary_max_range',
        'benefits',
        'no_days_week',
        'no_days_week_max_range',
        'required_gender',
        'ratio_gender_scope',
        'required_min_age',
        'required_max_age',
        'ratio_age_scope',
        'start_time',
        'end_time',
        'welfare_description',
        'welfare_working_period',
        'working_condition',
        'mail_reply_template',
        'mail_reply_email_address',
        'published_comment',
        'approval_status',
        'features', // field currently unused
        'location_details'
    ];

    public static function createRules()
    {
        return [
            'employment_type' => 'required',
            'employment_period' => 'required',
            'company_id' => 'required',
            'service_company' => 'required|max:70',
            'price' => 'required|integer|between:1,99999',
            'incentive_per_share' => 'required|integer|between:1,99999',
            'title' => 'required|max:70',
            // 'job_image' => 'nullable',
            // 'nearest_stations' => 'required / mixed',
            'description' => 'required',
            // 'galleries' => 'nullable',
            'url_job_video' => 'max:100',
            // 'hataraki_kata' => 'required',
            // 'other_hataraki_kata' => 'nullable',
            // 'job_strength' => 'nullable',
            'qualifications' => 'required',
            // 'job_categories' => 'required',
            // 'job_sub_category' => 'required',
            'planned_hire' => 'required|integer|between:1,999',
            'payment_type' => 'required',
            'salary' => 'required|integer|between:1,999999',
            // 'salary_max_range' => 'nullable',
            // 'benefits' => 'nullable',
            'no_days_week' => 'required',
            // 'no_days_week_max_range' => 'nullable',
            // 'days' => 'nullable',
            // 'required_gender' => 'required',
            'ratio_gender_scope' => 'required',
            // 'required_min_age' => 'integer|between:10,99',
            // 'required_max_age' => 'integer|between:10,99',
            'ratio_age_scope' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'welfare_description' => 'max:1000',
            'welfare_working_period' => 'max:1000',
            'working_condition' => 'max:1000',
            // 'reasons' => 'nullable',
            // 'job_questions' => 'nullable',
            // 'job_question_answers' => 'nullable',
            'mail_reply_template' => 'required|max:2000',
            'mail_reply_email_address' => 'required|email|max:100',
            // 'publication' => 'default private',
            // 'published_comment' => 'nullable',
            'location_details' => 'max:100'
        ];
    }

    public function days()
    {
        return $this->hasMany(Day::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function hataraki_kata_resource()
    {
        return $this->morphMany(HatarakiKataResource::class, 'taggable');
    }

    public function slug()
    {
        return $this->morphOne(Slug::class, 'sluggable');
    }

    public function applied_job()
    {
        return $this->hasMany(AppliedJob::class);
    }

    public function shared_job()
    {
        return $this->hasMany(SharedJob::class);
    }

    public function geolocation()
    {
        return $this->morphOne(Geolocation::class, 'taggable');
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }

    public function other_hataraki_kata()
    {
        return $this->hasMany(OtherHatarakiKata::class);
    }

    public function notes()
    {
        return $this->morphOne(Note::class, 'taggable');
    }

    public function publication()
    {
        return $this->morphOne(Publication::class, 'publishable');
    }

    public function nearest_station()
    {
        return $this->morphMany(NearestStation::class, 'stationable');
    }

    public function job_strengths()
    {
        return $this->hasMany(JobStrength::class);
    }

    public function job_job_sub_categories()
    {
        return $this->hasMany(JobJobSubCategory::class);
    }

    public function job_welfares()
    {
        return $this->hasMany(JobWelfare::class);
    }

    public function job_reasons_to_hire()
    {
        return $this->hasMany(JobReasonsToHire::class);
    }

    public function job_questions()
    {
        return $this->hasMany(JobQuestion::class);
    }

    public function billing()
    {
        return $this->morphMany(Billing::class, 'billable');
    }

    public function analytic()
    {
        return $this->morphOne(Analytic::class, 'trackable');
    }
}
