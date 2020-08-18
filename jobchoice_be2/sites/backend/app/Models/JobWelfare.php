<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobWelfare extends Model
{
	use SoftDeletes;
	 /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
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
}
