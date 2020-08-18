<?php

use Faker\Generator as Faker;
use App\Models\EducationalBackground;

$factory->define(EducationalBackground::class, function (Faker $faker) {
    return [
        'school'        => $faker->text,
        'year'          => $faker->numberBetween(1980, 2019),
        'month'         => $faker->randomElement([
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'July',
                                'August',
                                'September',
                                'October',
                                'November',
                                'December'
                            ]),
        'job_seeker_id' => $faker->numberBetween(1, 5) 
    ];
});
