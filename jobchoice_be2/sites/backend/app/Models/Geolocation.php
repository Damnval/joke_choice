<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Geolocation extends Model
{
	protected $table = 'geolocation';

    use SoftDeletes;
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'complete_address',
        'zip_code',
        'lat',
        'lng',
        'prefectures',
        'station'
    ];

    protected $hidden = [
        'taggable_type',
        'taggable_id',
    ];

    public static function createRules()
    {
        return [
            'zip_code' => 'required|max:7',
            'complete_address' => 'max:100'
        ];
    }

	public function taggable()
    {
        return $this->morphTo();
    }
}
