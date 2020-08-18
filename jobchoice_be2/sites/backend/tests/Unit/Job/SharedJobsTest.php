<?php

namespace Tests\Unit\Jobs;

use Tests\TestCase;
use App\Models\User;
use DB;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SharedJobsTest extends TestCase
{
    public static $user;
    public static $access_token;

    /**
     * Login
     * @test 
     */
    public function login()
    {
        self::$user = User::where(['type' => 'job_seeker'])->first();
        $client = DB::table('oauth_clients')->where(['id' => '2'])->first();
        $clientSecret = $client->secret;

        $params = [
        'username' => self::$user->email,
        'password' => 'password', 
        'client_id' => 2, 
        'client_secret' => $clientSecret, 
        'grant_type' => 'password'
        ];

        $response = $this->json('POST', '/oauth/token', $params);
        $result = json_decode((string) $response->getContent(), true);
        self::$access_token = $result['access_token'];
        $response->assertStatus(200);

    }

    /** 
     * Shared Jobs List
     * @depends login
     * @test
     */
    public function sharedJobsList(){

        $response = $this->withHeaders(['Authorization' => 'Bearer '.self::$access_token])->json('GET', '/api/user-shared-jobs');
        $response->assertStatus(200);

    }

}
