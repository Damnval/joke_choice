<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $table = 'inquiries';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'inquirer',
        'type',
        'details',
        'name',
        'email',
        'contact_no'
    ];

    public static function createRules()
    {
    	return [
    		'inquirer'      => 'required|in:job_seeker/sharer,company,others',
            'type'          => 'required',
            'details'       => 'required|min:1|string',
            'name'          => 'required|min:1|string',
            'email'         => 'required|email|string',
            'contact_no'    => 'nullable|min:10|max:11|string'
    	];
    }

}
