<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Slug extends Model
{
    use SoftDeletes;

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'value',
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

	public function sluggable()
    {
        return $this->morphTo();
    }

	public function shared_jobs()
    {
        return $this->hasMany(SharedJob::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'sluggable_id');
    }
}
