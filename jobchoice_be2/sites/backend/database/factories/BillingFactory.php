<?php

use Faker\Generator as Faker;
use App\Models\Billing;
use App\Models\Job;

$factory->define(Billing::class, function (Faker $faker) {
    // adds an additional 20% percentage that the job will result job id is one
    $job_id = $faker->optional($weight = 0.8, $default = 1)->numberBetween(1, 10);
    $company_id = Job::find($job_id)->company_id;

    return [
        'billing_code' => $faker->numberBetween(1000000, 9999999),
        'detail_type' => $faker->randomElement([
                                                    'system_use',
                                                    'bot',
                                                    'disclosure',
                                                    'share_master',
                                                    'PR'
                                               ]),
        'billable_id' => $job_id,
        'company_id' => $company_id
    ];
});
