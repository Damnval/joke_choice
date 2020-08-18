<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobJobSubCategory extends Model
{
    use SoftDeletes;

    protected $table = 'job_job_sub_categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'job_id',
        'job_sub_category_id'
    ];

    public static function createRules()
    {
    	return [
	        'job_sub_category_id' => 'required'
    	];
    }

	public function job_sub_category()
	{
		return $this->belongsTo(JobSubCategory::class);
	}
}
