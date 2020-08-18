<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = [
        'job_id',
        'draft',
        'published_start_date',
        'published_end_date',
        'status',
    ];
    
    protected $hidden = [
        'publishable_type',
        'publishable_id',
    ];

    public static function createRules()
    {
        return [
            'draft' => 'required',
        ];
    }

    public function publishable()
    {
        return $this->morphTo();
    }
}
