<?php

use Faker\Generator as Faker;
use App\Models\Geolocation;

$factory->define(Geolocation::class, function (Faker $faker) {
    return [
        'complete_address' => $faker->city,
        'lat' => $faker->numberBetween(1, 999),
        'lng' => $faker->numberBetween(1, 999),
        'zip_code' => $faker->numberBetween(1000000, 9999999),
        'prefectures' => $faker->randomElement(['Tokyo', 'Hokkaido', 'Osaka', 'Kyoto', 'Shizuoka', 'Kanagawa', 'Nagano', 'Okinawa']),
        'station' => $faker->randomElement(['Yokohama', 'Umeda', 'Ikebukuro', 'Shibuya', 'Shinjuku']),
    ];
});
