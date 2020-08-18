<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Twilio extends Model
{
    protected $table = 'twilio';
    protected $fillable = [
        'user_id','code','usage',
    ];
}
