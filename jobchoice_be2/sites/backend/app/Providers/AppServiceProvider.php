<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'AppliedJob' => 'App\Models\AppliedJob',
            'Company' => 'App\Models\Company',
            'Job' => 'App\Models\Job',
            'JobSeeker' => 'App\Models\JobSeeker',
            'Notification' => 'App\Models\Notification',
            'SharedJob' => 'App\Models\SharedJob',
            'SpecialFeature' => 'App\Models\SpecialFeature',
            'User' => 'App\Models\User',
        ]);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

    }
}
