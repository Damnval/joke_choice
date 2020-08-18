<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\JobCategory;
use App\Observers\JobCategoryObserver;

class JobCategoryModelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        JobCategory::observe(JobCategoryObserver::class);
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
