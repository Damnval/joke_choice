<?php

use Faker\Generator as Faker;
use App\Models\User;
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

$factory->define(User::class, function (Faker $faker) {
    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'first_name_kana' => 'カタカナ',
        'last_name_kana' => 'カタカナ',
        'email' => $faker->unique()->safeEmail,
        'contact_no' => '+81' . mt_rand(1000000000, 9999999999),
        'email_verified_at' => now(),
        'sms_verified_at' => now(),
        'password' => bcrypt('password'),
        'remember_token' => str_random(10),
    ];
});
