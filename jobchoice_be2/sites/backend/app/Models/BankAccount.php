<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'job_seeker_id',
        'bank_name',
        'bank_code',
        'branch_name',
        'branch_code',
        'account_number',
        'account_holder',
        'deposit_type',
    ];

    public static function createRules()
    {
        return [
           'bank_name'      => 'required|string|min:2|max:255',
           'bank_code'      => 'required|string|min:2|max:10',
           'branch_name'    => 'required|string|min:2|max:255',
           'branch_code'    => 'required|string|min:2|max:10',
           'account_number' => 'required|string|min:7|max:16',
           'account_holder' => 'required|string|min:2|max:255',
           'deposit_type'   => 'required|string|in:current_account,savings_account',
        ];
    }
}
