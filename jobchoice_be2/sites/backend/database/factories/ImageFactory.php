<?php

use Faker\Generator as Faker;
use App\Models\Image;

$factory->define(Image::class, function (Faker $faker) {

    return [
        'image_name' => $faker->text,
        'image_path' => config('app.staging_url') . '/images/seeder/job-avatar.jpg',
        'caption' => $faker->randomElement([$faker->text, NULL]),
    ];
});
