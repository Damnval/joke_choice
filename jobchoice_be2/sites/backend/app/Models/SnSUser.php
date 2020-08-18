<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SnSUser extends Model
{
    Use SoftDeletes;

    protected $table = 'sns_users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 
        'social_id', 
        'provider',
    ];

	public function user()
    {
        return $this->belongsTo(User::Class);
    }

    public static function createRules()
    {
        return [
            'type'                 => 'required|min:1|max:50',
            'first_name'           => 'required|min:1|max:50',
            'email'                => 'nullable|email',
            'job_seeker.social_id' => 'required|min:1|max:50',
        ];
    }
}
