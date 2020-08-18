<?php


namespace App\Http\Controllers\API;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

class TwitterController extends Controller
{

    /**
     * Twitter Connection API
     * @return \Illuminate\Http\Response
     */
    public function twitter()
    {
        $stack = HandlerStack::create();
        $middleware = new Oauth1([
            'consumer_key'    => config('app.twitter_consumer_key'),
            'consumer_secret' => config('app.twitter_consumer_secret'),
            'token'           => config('app.twitter_token'),
            'token_secret'    => config('app.twitter_secret'),
            'callback' => config('app.url')."/twitter"
        ]);
        
        $stack->push($middleware);

        $client = new Client([
            'base_uri' => 'https://api.twitter.com/oauth/request_token',
            'handler' => $stack,
            'auth' => 'oauth'
        ]);

        $response = $client->request('POST', '');
        $this->data['status'] = 200;
       
        $result = str_replace('&','", "', $response->getBody());
        $result = str_replace('=','": "', $result);
        $final = json_decode('{ "' . $result . '"}');

        return response()->json($final, $this->data['status']);
    }

    /**
     * Twitter User Authentication Token API to be used by project
     * @param  object $request oauth token and secret
     * @return \Illuminate\Http\Response
     */
    public function twitterAuth(Request $request)
    {

        $stack = HandlerStack::create();

        $middleware = new Oauth1([
            'consumer_key'    => config('app.twitter_consumer_key'),
            'consumer_secret' => config('app.twitter_consumer_secret'),
            'token'           => $request->get('oauth_token'),
            'token_secret'    => $request->get('oauth_token_secret')
        ]);
        $stack->push($middleware);

        $client = new Client([
            'base_uri' => 'https://api.twitter.com/oauth/access_token?oauth_verifier',
            'handler' => $stack,
            'auth' => 'oauth'
        ]);

        $response = $client->request('POST', '', [
            'form_params' => ['oauth_verifier' => $request->get('oauth_verifier')]
        ]);

        $this->data['status'] = 200;
       
        $result = str_replace('&','", "', $response->getBody());
        $result = str_replace('=','": "', $result);
        $final = json_decode('{ "' . $result . '"}');

        return response()->json($final, $this->data['status']);
    }

    /**
     * Twitter User Profile API
     * @param  object $request oauth token and secret
     * @return \Illuminate\Http\Response
     */
    public function twitterCredentials(Request $request)
    {

        $stack = HandlerStack::create();
        $middleware = new Oauth1([
            'consumer_key'    => config('app.twitter_consumer_key'),
            'consumer_secret' => config('app.twitter_consumer_secret'),
            'token'           => $request->get('oauth_token'),
            'token_secret'    => $request->get('oauth_token_secret')
        ]);
        $stack->push($middleware);

        $client = new Client([
            'base_uri' => 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
            'handler' => $stack,
            'auth' => 'oauth'
        ]);

        $response = $client->request('GET', '');

        return $response;
    }
    
    /**
     * Twitter User Profile Share API
     * @param  object $request oauth token, secret and status
     * @return \Illuminate\Http\Response
     */
    public function twitterPost(Request $request)
    {

        $stack = HandlerStack::create();
        $middleware = new Oauth1([
            'consumer_key'    => config('app.twitter_consumer_key'),
            'consumer_secret' => config('app.twitter_consumer_secret'),
            'token'           => $request->get('oauth_token'),
            'token_secret'    => $request->get('oauth_token_secret'),
        ]);
        $stack->push($middleware);

        $client = new Client([
            'base_uri' => 'https://api.twitter.com/1.1/statuses/update.json',
            'handler' => $stack,
            'auth' => 'oauth',
        ]);

        $response = $client->request('POST', '', [
            'form_params' => ['status' => $request->get('status')]
        ]);

        return $response;
    }
}
