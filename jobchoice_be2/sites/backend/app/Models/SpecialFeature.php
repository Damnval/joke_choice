<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialFeature extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = [
        'title_jp',
        'des_header_jp',
        'des_body_jp',
        'title_en,',
        'des_header_en',
        'des_body_en',
        'html_tags',
    ];

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

}
