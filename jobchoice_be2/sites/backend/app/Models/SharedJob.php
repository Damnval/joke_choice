<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SharedJob extends Model
{
	use SoftDeletes;

	protected $table = 'shared_jobs';

	protected $fillable = [
		'job_id',
		'slug_id',
		'provider_id',
		'href',
	];

	public static function createRules()
    {
        return [
			'isPosted' => 'required|in:true,false',
			'href'     => 'required|string|min:1|max:255',
        ];
    }

	public function job()
	{
		return $this->belongsTo(Job::Class);
	}

	public function slug()
	{
		return $this->belongsTo(Slug::Class);
	}

	public function provider()
	{
		return $this->belongsTo(Provider::Class);
	}

	public function applied_job()
	{
		return $this->hasMany(AppliedJob::Class);
	}

	public function notes()
	{
		return $this->morphOne(Note::Class, 'taggable');
	}
}
