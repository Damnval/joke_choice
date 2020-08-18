<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'area',
        'prefecture',
        'age_from',
        'age_to',
        'recipient_type'
    ];    
    
    public static function createRules()
    {
        return [
            'title'  => 'required',
            'description' => 'required',
        ];
    }

    public function publication()
    {
        return $this->morphOne(Publication::class, 'publishable');
    }

    public function image()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function document()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function notification_log()
    {
        return $this->hasOne(NotificationLog::class);
    }
}
