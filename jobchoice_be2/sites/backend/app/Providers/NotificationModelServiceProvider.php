<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Notification;
use App\Observers\NotificationObserver;

class NotificationModelServiceProvider extends ServiceProvider
{
     /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Notification::observe(NotificationObserver::class);
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
