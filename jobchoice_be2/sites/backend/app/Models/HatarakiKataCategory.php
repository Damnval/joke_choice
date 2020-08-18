<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HatarakiKataCategory extends Model
{
    protected $table = 'hataraki_kata_categories';	
    
    public function hataraki_kata()
    {
        return $this->hasMany(HatarakiKata::class);
    }
}
