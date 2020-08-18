<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSearch extends Model
{
	protected $table = 'job_search';

    public function jobs()
    {
        return $this->belongsTo(Job::class, 'id', 'id');
    }
}
