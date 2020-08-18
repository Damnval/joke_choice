<?php

use Faker\Generator as Faker;
use App\Models\Gallery;
/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Gallery::class, function (Faker $faker) {
    return [
        'job_id' => $faker->numberBetween(2, 10),
        'file_path' => config('app.staging_url') . '/images/seeder/job-avatar.jpg',
        'caption' => $faker->text($maxNbChars = 20)
    ];
});
