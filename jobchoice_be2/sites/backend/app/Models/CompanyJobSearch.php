<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyJobSearch extends Model
{
	protected $table = 'company_job_search';

    public function jobs()
    {
        return $this->belongsTo(Job::class, 'id', 'id');
    }
}
