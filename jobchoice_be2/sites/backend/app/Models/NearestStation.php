<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NearestStation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'station',
        'transportation',
        'time_duration',
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

    public static function createRules()
    {
    	return [
			'station' => 'required|max:20',
	        'transportation' => 'required',
	        'time_duration' => 'required|integer|between:1,99999'
    	];
    }
}
