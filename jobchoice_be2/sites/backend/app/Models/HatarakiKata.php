<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HatarakiKata extends Model
{
	protected $table = 'hataraki_kata';

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
