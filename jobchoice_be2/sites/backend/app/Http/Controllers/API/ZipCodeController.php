<?php


namespace App\Http\Controllers\API;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

class ZipCodeController extends Controller
{

    /**
     * Twitter Connection API
     * @return \Illuminate\Http\Response
     */
    public function zipcode(Request $request)
    {
        $client = new Client([
            'base_uri' => config('app.zipcode_url').'/zip/search?zipcode='.$request->zipcode,
        ]);

        $response = $client->request('POST', '');
        $this->data['status'] = 200;

        return $response;
    }
}
