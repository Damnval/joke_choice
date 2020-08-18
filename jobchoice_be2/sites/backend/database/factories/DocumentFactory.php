<?php

use Faker\Generator as Faker;
use App\Models\Document;

$factory->define(Document::class, function (Faker $faker) {

    return [
        'file_name' => $faker->text,
        'file_path' => config('app.staging_url') . '/document/seeder/dummy-file.txt'
    ];
});
