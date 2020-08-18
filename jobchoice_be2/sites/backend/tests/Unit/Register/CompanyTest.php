<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Faker\Factory as Faker;
use App\Models\Token;
use App\Models\User;

class CompanyTest extends TestCase
{
    use WithFaker; 
    public static $tokenEmail = null;
    public static $user_id = null;

    /**
    * Fail register company
    * @test
    */
    public function registerEmailFail()
    { 
        $faker = Faker::create();
        $email = $faker->unique()->safeEmail;
       
        $params = [  
        'email' => '',
        'type' => 'company'
       
        ];
    
        $response = $this->json('POST', '/api/register/email', $params);    
        self::$tokenEmail = $email;
        $response->assertStatus(500);    
    
    }

    /**
    * Register email
    * @test 
    */
    public function registerEmail()
    { 
        $faker = Faker::create();
        $email = $faker->unique()->safeEmail;
       
        $params = [  
        'email' => $email,
        'type' => 'company'
       
        ];
    
        $response = $this->json('POST', '/api/register/email', $params);    
        self::$tokenEmail = $email;
        $response->assertStatus(200);    
    
    }
  
    /** 
    * Request validation fail in register details
    * @depends registerEmail
    * @test 
    */
    public function registerDetailsTokenFail()
    {       
        $faker = Faker::create();
        self::$user_id = User::where(['email' => self::$tokenEmail])->get()->pluck('id');

        $params = [
            'token' => '1234',
            'first_name' => $faker->firstName,
            'last_name' => $faker->lastName,
            'first_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'last_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'password' => 'password',
            'c_password' => 'password',
            'contact_no' =>  '',
        ];
     
        $response = $this->json('POST', 'api/register/details', $params);
        $response->assertStatus(500);
        
    }

     /**
     * Register details 
     * @depends registerEmail
     * @test
     */
    public function registerDetailsValidatorFail()
    {
        $faker = Faker::create();
        self::$user_id = User::where(['email' => self::$tokenEmail])->get()->pluck('id');
        $token = Token::where(['user_id' => self::$user_id])->get()->pluck('token');

        $params = [

            'token' => 1234,
            'first_name' => $faker->firstName,
            'last_name' => $faker->lastName,
            'first_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'last_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'password' => 'password',
            'c_password' => 'password',
            'contact_no' => $faker->isbn10,
            'company' => [
                'purpose' => '',
                'company_name'  => $faker->text,
                'company_kana' => 'Hiragana',
                'no_employees' => $faker->numberBetween(1000, 5000),
                'department' => $faker->text,
                'industry_id' => 1,
                'occupation_id' => 1,
                'address' => [
                    'complete_address' => $faker->randomElement(['Cebu','Manila', 'Job Address', 'Tokyo']),
                    'lat' =>  $faker->numberBetween(1, 999),
                    'lng' => $faker->numberBetween(1, 999),
                    'zip_code' => $faker->numberBetween(1, 999)
                ]
            ],         
        
        ];
        $response = $this->json('POST', 'api/register/details', $params);

        $response->assertStatus(500);
    }

     /**
     * Register details 
     * @depends registerEmail
     * @test
     */
    public function registerDetails()
    {
        $faker = Faker::create();
        self::$user_id = User::where(['email' => self::$tokenEmail])->get()->pluck('id');
        $token = Token::where(['user_id' => self::$user_id])->get()->pluck('token');

        $params = [

            'token' => $token[0],
            'first_name' => $faker->firstName,
            'last_name' => $faker->lastName,
            'first_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'last_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'password' => 'password',
            'c_password' => 'password',
            'contact_no' => $faker->isbn10,
            'company' => [
                'purpose' => $faker->randomElement(['company_use','personal_use']),
                'company_name'  => $faker->text,
                'company_kana' => 'Hiragana',
                'no_employees' => $faker->numberBetween(1000, 5000),
                'department' => $faker->text,
                'industry_id' => 1,
                'occupation_id' => 1,
                'address' => [
                    'complete_address' => $faker->randomElement(['Cebu','Manila', 'Job Address', 'Tokyo']),
                    'lat' =>  $faker->numberBetween(1, 999),
                    'lng' => $faker->numberBetween(1, 999),
                    'zip_code' => $faker->numberBetween(1, 999)
                ]
            ],         
        
        ];
        $response = $this->json('POST', 'api/register/details', $params);

        $response->assertStatus(200);
    }

    /**
     * Delete the registered company
     * @test 
     */
    public function deleteRegisterDetails()
    {
        $user = User::where(['id' => self::$user_id])->with(
            'AauthAcessToken',
            'slug',
            'token',
            'company.job',
            'company.user',
            'company.geolocation',
            'company.occupation',
            'company.industry')
            ->first();

        $user->company->job()->delete();
        $user->company->user()->delete();
        $user->company->geolocation->forceDelete();
        $user->company->delete();
        $user->slug->forceDelete();      
        $user->token->delete();
        $user->AauthAcessToken()->delete();
        $user->forceDelete();

        $deletedUser = User::where(['id' => self::$user_id])->exists();       
        
        $this->assertFalse($deletedUser);
    }

}
