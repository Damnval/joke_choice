<?php

namespace App\Providers;

use App\Models\JobQuestion;
use App\Observers\JobQuestionObserver;
use Illuminate\Support\ServiceProvider;

class JobQuestionModelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        JobQuestion::observe(JobQuestionObserver::class);
    }
}
