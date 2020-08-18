<?php

use Faker\Generator as Faker;
use App\Models\Notification;

$factory->define(Notification::class, function (Faker $faker) {
    
    $age_from = $faker->randomElement([NULL, $faker->numberBetween(18, 30)]);
    $age_to = ($age_from) ? $age_from + $faker->numberBetween(1, 15) : NULL ;

    return [
        'title' => $faker->text,
        'description' => $faker->text,
        'type' => $faker->randomElement(['campaign_information', 'system_maintenance', 'system_update_notification']),
        'area' => $faker->randomElement(['nationwide', 'international', 'local', NULL]),
        'prefecture' => $faker->randomElement([$faker->address, NULL]),
        'age_from' => $age_from,
        'age_to' => $age_to,
        'recipient_type' => $faker->randomElement(['job_seeker', 'company', 'all'])
    ];
});
