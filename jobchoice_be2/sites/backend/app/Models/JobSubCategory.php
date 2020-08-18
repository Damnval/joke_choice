<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSubCategory extends Model
{
    use SoftDeletes;

    protected $table = 'job_sub_categories';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = [
        'sub_category',
        'description',
        'job_category_id'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function job_job_sub_categories()
    {
        return $this->hasMany(JobJobSubCategory::class);
    }

    public function job_category() {
        return $this->belongsTo(JobCategory::class);
    }
}
