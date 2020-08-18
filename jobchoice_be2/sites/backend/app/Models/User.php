<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'first_name_kana',
        'last_name_kana',
        'email',
        'contact_no',
        'password',
        'email_verified_at',
        'sms_verified_at',
        'type',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

     /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    public static function createRules()
    {
        return [
            'email' => 'required|email',
            'type'  => 'required|string|in:job_seeker,company'
        ];
    }

    public static function updateRulesOnRegister()
    {
        return [
            'token'           => 'required',
            'first_name'      => 'nullable|min:1|max:50',
            'last_name'       => 'nullable|min:1|max:50',
            'first_name_kana' => 'nullable|min:1|max:50',
            'last_name_kana'  => 'nullable|min:1|max:50',
            'contact_no'      => 'required', // Remove maximum and minumum validation because it will cause an error if we will input + or -. Need to validate in the back end side.
            'password'        => 'required|min:8',
            'c_password'      => 'required|min:8|same:password',
        ];
    }

    public static function updateRules($id)
    {
        return [
            'email'           => 'unique:users,email,'.$id.',id,deleted_at,NULL',
            'first_name'      => 'nullable|min:1|max:50',
            'last_name'       => 'nullable|min:1|max:50',
            'first_name_kana' => 'nullable|min:1|max:50',
            'last_name_kana'  => 'nullable|min:1|max:50',
            'contact_no'      => 'required', // Remove maximum and minumum validation because it will cause an error if we will input + or -. Need to validate in the back end side.
            'password'        => 'nullable|min:8',
            'c_password'      => 'nullable|min:8|same:password',
        ];
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function job_seeker()
    {
        return $this->hasOne(JobSeeker::class);
    }

    public function slug()
    {
        return $this->morphOne(Slug::class, 'sluggable');
    }

    //I will remove these methods once everthing is verified
    // public function AauthAcessToken()
    // {
    //     return $this->hasMany(OauthAccessToken::class);
    // }

    public function custom_token()
    {
        return $this->hasOne('App\Models\Token');
    }

    public function sns_user()
    {
        return $this->hasMany(SnSUser::class);
    }

}

