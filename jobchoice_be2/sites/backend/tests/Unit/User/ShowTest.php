<?php

namespace Tests\Unit\User;

use Tests\TestCase;
use Tests\TestHelper;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class showTest extends TestCase
{
    use WithFaker;
    use TestHelper {
        login as loginHelper;
        logout as logoutHelper;
    }

    private $user_id = 7;

    public static $user;
    public static $access_token;

    /**
     * Login user
     *  @test
     */
    public function login()
    {
        list(self::$user, self::$access_token, $response) =
        $this->loginHelper($this->user_id);
        $response->assertStatus(200);
    }

    /**
     * Get user details but params is not ID
     * @depends login
     * @test
     */
    public function showNotIDFail()
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . self::$access_token])
                         ->json('GET', '/api/user/sadf');

        $response->assertStatus(500);
    }

    /**
     * Get user details injecting not owned ID
     * @depends login
     * @test
     */
    public function showDoesNotOwnIDFail()
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . self::$access_token])
                         ->json('GET', '/api/user/3');

        $response->assertStatus(500);
    }

    /**
     * Get user details based on ID
     * @depends login
     * @test
     */
    public function show()
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . self::$access_token])
                         ->json('GET', '/api/user/' . self::$user->id);

        $response->assertStatus(200);
    }

    /**
     * Logs out the current user
     * @depends login
     * @test
     */
    public function logout()
    {
        $response = $this->logoutHelper(self::$access_token);
        $response->assertStatus(200);
    }

}
