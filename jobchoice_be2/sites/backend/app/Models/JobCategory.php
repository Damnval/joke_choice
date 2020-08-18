<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobCategory extends Model
{
    use SoftDeletes;

	protected $table = 'job_categories';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = [
        'category',
        'description',
    ];

    public static function createRules()
    {
    	return [
    		'category'    => 'required|min:1|max:50',
    		'description' => 'required|min:10|max:255'
    	];
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function job_sub_category()
    {
        return $this->hasMany(JobSubCategory::class);
    }
}
