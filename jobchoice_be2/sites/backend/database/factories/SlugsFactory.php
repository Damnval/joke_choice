<?php

use App\Models\Slug;
use Faker\Generator as Faker;

$factory->define(Slug::class, function (Faker $faker) {
    return [
       'value' => strtoupper(str_random(6)),
    ];
});
