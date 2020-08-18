<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model
{
	  /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */

	protected $table = 'notes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'notes',
        'taggable_id',
        'taggable_type'
    ];

    protected $hidden = [
        'taggable_id',
        'taggable_type',
    ];

    public static function createRules()
    {
        return [
            'notes'         => 'required|string|max:255',
            'taggable_id'   => 'required|integer',
            'taggable_type' => 'required|in:Job,SharedJob,AppliedJob',
        ];
    }

	public function taggable()
    {
        return $this->morphTo();
    }
}
