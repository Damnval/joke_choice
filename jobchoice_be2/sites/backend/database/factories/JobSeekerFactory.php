<?php

use Carbon\Carbon;
use Faker\Generator as Faker;
use App\Models\JobSeeker;

$factory->define(JobSeeker::class, function (Faker $faker) {

    $age = mt_rand(18, 55);
    $date = Carbon::now();
    date_sub($date,date_interval_create_from_date_string($age.'years'));

    return [
        'nickname' => $faker->firstName,
        'age' => $age,
        'birth_date' => $date,
        'gender' =>	$faker->randomElement(['male', 'female']),
        'mail_setting' => $faker->randomElement([1, 0]),
        'employment_status' => $faker->randomElement(['regular', 'temporary', 'dispatch', 'contract_less_35_hrs_week', 'contract_more_35_hrs_week', 'short_time', 'outsourcing', 'franchise']),
        'marital_status' => $faker->randomElement(['yes', 'no']),
        'profile_picture' => config('app.staging_url') . '/images/seeder/job-avatar.jpg',
        'description' => $faker->text,
    ];
});
