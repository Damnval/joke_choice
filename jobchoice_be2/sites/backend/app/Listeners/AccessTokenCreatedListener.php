<?php

namespace App\Listeners;

use Carbon\Carbon;
use App\Models\User;
use Laravel\Passport\Client;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Passport\Events\AccessTokenCreated;

class AccessTokenCreatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  AccessTokenCreated  $event
     * @return void
     */
    public function handle(AccessTokenCreated $event)
    {
        $client = Client::find($event->clientId);
        $params = [
            'last_login_at' => Carbon::now()
        ];
        $user = User::find($event->userId);
        $user->update($params);
    }
}
