<?php

namespace App\Providers;

use App\Models\Token;
use App\Observers\TokenObserver;
use Illuminate\Support\ServiceProvider;

class TokenModelServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Token::observe(TokenObserver::class);
    }
}
