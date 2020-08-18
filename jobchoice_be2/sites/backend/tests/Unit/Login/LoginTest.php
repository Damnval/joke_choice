<?php   

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use DB;

class LoginTest extends TestCase
{

    /**
     * Test case that tests login for all existing users in database
     * @test
     */
    public function loginAll()
    {
        $users  = User::all();
        $client = DB::table('oauth_clients')->where(['id' => '2'])->first();
        $clientSecret = $client->secret;

        foreach ($users as $value) {
            $params = [
                'username' => $value['email'],
                'password' => 'password', 
                'client_id' => 2, 
                'client_secret' => $clientSecret,
                'grant_type' => 'password'
            ];

            $response = $this->json('POST', '/oauth/token', $params);
            $response->assertStatus(200);
        }
    }

    /**
     * Test case that tests login fail if user inputs wrong credentials
     * @test
     */
    public function loginFail()
    {
        $user = User::find(1);

        $params = [
            'username' => $user['email'],
            'password' => 'wrongpassword', 
            'client_id' => 2, 
            'client_secret' => 'wrongclient',
            'grant_type' => 'password'
        ];

        $response = $this->json('POST', '/oauth/token', $params);
        $response->assertStatus(401);
    }

}
