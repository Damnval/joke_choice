<?php   

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Faker\Factory as Faker;
use Carbon\Carbon;
use App\Models\Token;
use App\Models\User;


class JobSeekerTest extends TestCase
{
    use WithFaker; 
     
    public static $tokenEmail = null;
    public static $user_id = null;

    /**
    * Fail register email
    * @test
    */
    public function registerEmailFail()
    {       
        $params = [
            'email' => '',
            'type' => ''
        ];

        $response = $this->json('POST', '/api/register/email', $params);
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
            'type' => 'job_seeker'
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
    public function registerDetailsValidatorFail()
    {       
        $faker = Faker::create();
        self::$user_id = User::where(['email' => self::$tokenEmail])->get()->pluck('id');

        $params = [
            'token' => 'Asasdsadasaskdajsdkjngf;lgjljflasd',
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
    * Verify token fail in register details
    * @depends registerEmail
    * @test 
    */
    public function registerDetailsTokenFail()
    {       
        $faker = Faker::create();
        self::$user_id = User::where(['email' => self::$tokenEmail])->get()->pluck('id');

        $params = [
            'token' => 'Asasdsadasaskdajsdkjngf;lgjljflasd',
            'first_name' => $faker->firstName,
            'last_name' => $faker->lastName,
            'first_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'last_name_kana' => $faker->randomElement(['カタカナ', 'ひらがな']),
            'password' => 'password',
            'c_password' => 'password',
            'contact_no' =>  '1234567890',
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
            'contact_no' =>  $faker->isbn10,
            'job_seeker' => [
                    'birth_date' => Carbon::now()->format('Y-m-d'),
                    'profile_picture' => "http://192.168.99.100:8080/images/profile/1/profile.jpg",
                    'gender' =>  $faker->randomElement(['male', 'female']),
                    'address' => [
                            'complete_address' => $faker->randomElement(['Cebu', 'Manila', 'Job Address', 'Tokyo']),
                            'lat' => $faker->numberBetween(1,999),
                            'lng' => $faker->numberBetween(1,999),
                            'zip_code' => $faker->isbn10,
                            'station' => $faker->text,
                            'prefectures' => $faker->text,
                        ],
                    'bank_account' => $faker->isbn13,
                    'mail_setting' => $faker->numberBetween(0, 1),
                    'marital_status' => $faker->randomElement(['single', 'married', 'divorced', 'widowed']),   
                    'description' => $faker->text
                ],
            'hataraki_kata' => [
                ['hataraki_kata_id' => $faker->numberBetween(1, 22)],
                ['hataraki_kata_id' => $faker->numberBetween(1, 22)],
                ['hataraki_kata_id' => $faker->numberBetween(1, 22)],
                ['hataraki_kata_id' => $faker->numberBetween(1, 22)],
            ],
            'skills' => [
                $faker->numberBetween(1, 4),
                $faker->numberBetween(1, 4)
            ],
            'educational_bg' => [
                [
                    'school' => $faker->text,
                    'year' =>  $faker->numberBetween(1950, 2018),
                    'month' => $faker->randomElement(['jan',
                                                      'feb',
                                                      'mar',
                                                      'apr',
                                                      'may',
                                                      'jun',
                                                      'jul',
                                                      'aug',
                                                      'sept',
                                                      'oct',
                                                      'nov',
                                                      'dec'
                                                    ]),
                ]
            ], 
            'work_exp' => [
                [
                    'company' => $faker->company, 
                    'position' => $faker->jobTitle,
                    'start_date' => $faker->dateTimeBetween('-25 years', '-1 month')->format('Y-m-d'),
                    'end_date' => $faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d')
                ] 
            ]
        ];
     
        $response = $this->json('POST', 'api/register/details', $params);
        $response->assertStatus(200);
        
    }

    /**
     * Delete the registered user
     * @test 
     */
    public function deleteRegisterDetails()
    {

        unlink("public/images/profile/".self::$user_id[0]."/profile.jpg");
        rmdir("public/images/profile/".self::$user_id[0]);
        $user = User::where(['id' => self::$user_id])->with(
            'AauthAcessToken',
            'slug',
            'token',
            'job_seeker.geolocation',
            'job_seeker.hataraki_kata_resource',
            'job_seeker.job_seeker_skills',
            'job_seeker.work_experience',
            'job_seeker.educational_background')
            ->first();

        $user->job_seeker->geolocation->forceDelete();  
        $user->job_seeker->hataraki_kata_resource()->delete();
        $user->job_seeker->job_seeker_skills()->delete();
        $user->job_seeker->work_experience()->delete();
        $user->job_seeker->educational_background()->delete();
        $user->job_seeker->delete();
        $user->slug->forceDelete();      
        $user->token->delete();
        $user->AauthAcessToken()->delete();
        $user->forceDelete();

        $deletedUser = User::where(['id' => self::$user_id])->exists();
        
        $this->assertFalse($deletedUser);

    }
}
