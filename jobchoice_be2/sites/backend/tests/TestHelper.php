<?php

namespace Tests;

use DB;
use App\Models\User;

trait TestHelper
{
	public static $access_token;
	public static $user;

	/**
	 * Service for login user in using test
	 * @param  string $type Type of user to get
	 * @param  string $client_id Client ID bassed on passport install
	 * @return array User Object, AccessToken
	 */
	public function login(int $user_id = null, $client_id = 2)
	{
		$user = User::where(['id' => $user_id])->first();
		$client = DB::table('oauth_clients')->where(['id' => $client_id])->first();

		$clientSecret = $client->secret;
		$params = [
			'username' => $user->email,
			'password' => 'password',
			'client_id' => $client_id,
			'client_secret' => $clientSecret,
			'grant_type' => 'password'
		];

		$response = $this->json('POST', '/oauth/token', $params);
		$result = json_decode((string) $response->getContent(), true);
		$access_token = $result['access_token'];

		return [$user, $access_token, $response];
	}

	/**
	 * Service for Logging out user in unit test
	 * @param  string $access_token Access Token of current user
	 * @return Object $response
	 */
	public function logout($access_token)
	{
     	$response = $this->withHeaders(['Authorization' => 'Bearer ' . $access_token])
                         ->json('POST', '/api/logout/');

        return $response;
	}

}

?>
