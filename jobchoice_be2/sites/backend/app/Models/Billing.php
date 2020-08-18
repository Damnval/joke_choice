<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    const VARIABLES = [
        'tax_percentage' => .08,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'billing_code',
        'detail_type',
        'billable_type',
        'billable_id',
        'company_id'
    ];

    public function billable()
    {
        return $this->morphTo();
    }

    public static function createRules()
    {
        return [
            'detail_type' => 'required'
        ];
    }

}
