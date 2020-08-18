<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
	// hide columns whenever a model is called/returns
	protected $hidden = [
		'id',
		'trackable_type',
		'trackable_id',
		'created_at',
		'updated_at',
		'deleted_at'
	];

	// declared columns for mass assignment saving
	protected $fillable = [
		'trackable_type',
		'trackable_id',
		'views'
	];

	public static function createRules()
	{
		return [
			'model' => 'required',
			'id' => 'required'
		];
	}

	public function trackable()
	{
		return $this->morphTo();
	}

}

