<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HatarakiKataResource extends Model
{
    use SoftDeletes;
	  /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */

	protected $table = 'hataraki_kata_resource';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    	'hataraki_kata_id'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $hidden = [
        'taggable_type',
        'taggable_id',
    ];

	public function taggable()
    {
        return $this->morphTo();
    }

    public function hataraki_kata()
    {
        return $this->belongsTo(HatarakiKata::class);
    }

}
