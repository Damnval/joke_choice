<?php

use Faker\Generator as Faker;
use App\Models\NearestStation;

$factory->define(NearestStation::class, function (Faker $faker) {

	return [
        'station' => $faker->text($maxNbChars = 20),
        'transportation' => $faker->randomElement([
            'car',
            'bus',
            'walk',
            'train'
        ]),
        'time_duration' => $faker->numberBetween(1, 99999)
    ];
});
