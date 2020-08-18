<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $fillable = [
        'user_id', 
        'token', 
        'active'
    ];

    public static function createSendTokenRules()
    {
        return [
            'email' => 'required|email|exists:users,email'
        ];
    }

    public static function createResetPasswordRules()
    {
        return [
            'password'   => 'required|string|min:6',
            'c_password' => 'required|string|same:password',                 
            'token'      => 'required|string|exists:password_resets,token',
        ];
    }
}
