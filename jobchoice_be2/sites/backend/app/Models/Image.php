<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'image_name',
        'image_path',
        'caption',
    ];    

    protected $hidden = [
        'imageable_type',
        'imageable_id',
    ];

    public function imageable()
    {
        return $this->morphTo();
    }

}

