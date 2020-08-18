<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OtherHatarakiKata extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */

	protected $table = 'other_hataraki_kata';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hataraki_kata_id',
        'job_id'
    ];

    public function hataraki_kata()
    {
        return $this->belongsTo(HatarakiKata::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

}
