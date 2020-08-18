<?php

namespace App\Models;

use App\Models\Job;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'occupation_id',
        'industry_id',
        'purpose',
        'company_name',
        'company_kana',
        'prefectures',
        'no_employees',
        'department',
    ];

    public function job()
    {
        return $this->hasMany(Job::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function createRules()
    {
        return [
           'purpose'      => 'required|string|min:1|max:255',
           'company_name' => 'nullable|string|min:1|max:255',
           'company_kana' => 'nullable|string|min:1|max:255',
           'prefectures'  => 'nullable|string|min:1|max:255',
           'no_employees' => 'nullable',
           'department'   => 'nullable|string|min:1|max:255',
        ];
    }

    public function geolocation()
    {
        return $this->morphOne(Geolocation::class, 'taggable');
    }

    public function occupation()
    {
        return $this->belongsTo(Occupation::class);
    }

    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }

}
