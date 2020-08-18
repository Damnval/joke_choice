<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecruitmentTag extends Model
{
	protected $table = 'other_hataraki_kata';

	public function hataraki_kata()
    {
        return $this->belongsTo(HatarakiKata::class);
    }

}
