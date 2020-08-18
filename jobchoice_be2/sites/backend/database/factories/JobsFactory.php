<?php

use Faker\Generator as Faker;
use App\Models\Job;

$factory->define(Job::class, function (Faker $faker) {

    $salary = $faker->numberBetween(100000, 999999);
    $no_days_week = $faker->numberBetween(1, 5);
    $age = $faker->numberBetween(18, 30);
    $employment_period = $faker->randomElement([
        'long_term',
        'middle_term',
        'short_term',
        'single_term',
    ]);
    // Price corresponds to an employment type
    switch ($employment_period) {
        case 'long_term': $price = 15000; break;
        case 'middle_term': $price = 8000; break;
        case 'short_term': $price = 5000; break;
        case 'single_term': $price = 2000; break;
    }
    $incentive_per_share = $price * .3;

    return [
        'title' => $faker->jobTitle,
        'benefits' => $faker->text,
        'description' => $faker->text,
        'payment_type' => $faker->randomElement([
            'weekly',
            'hourly',
            'daily',
            'monthly',
            'yearly'
        ]),
        'salary' => $salary,
        'salary_max_range' => $salary + 10000,
        'start_time' => $faker->time($format = 'H:i:s'),
        'end_time' => $faker->time($format = 'H:i:s'),
        'no_days_week' => $no_days_week,
        'no_days_week_max_range' => $no_days_week + 2,
        'price' => $price,
        'incentive_per_share' => $incentive_per_share,
        'planned_hire' => $faker->numberBetween(1, 999),
        'welfare_description' => $faker->text,
        'welfare_working_period' => $faker->text,
        'working_condition' => $faker->text,
        'qualifications' => $faker->text,
        'employment_type' => $faker->randomElement([
                                'regular',
                                'regular_with_rank',
                                'contract_worker',
                                'limited',
                                'part_time',
                                'temporary',
                                'contract_outsourcing'
                            ]),
        'employment_period' => $employment_period,
        'required_gender' => $faker->randomElement([
                                'male',
                                'female'
                            ]),
        'ratio_gender_scope' => $faker->randomElement([
                                'required',
                                'not_required',
                                'preferable',
                            ]),
        'required_min_age' => $age,
        'required_max_age' => $age + 8,
        'ratio_age_scope' => $faker->randomElement([
                                'required',
                                'not_required',
                                'preferable',
                            ]),
        'job_image' => config('app.staging_url') . '/images/seeder/job-avatar.jpg',
        'reference_id' =>  mt_rand(0, 1000000),
        'location_details' => $faker->text($maxNbChars = 100),
        'features' => $faker->text,
        // adds an additional 10% percentage that the resulting job will have an approved, approval_status
        'approval_status' => $faker->optional($weight = 0.9, $default = 'approved')
                                   ->randomElement([
                                        'waiting',
                                        'approved',
                                        'rejected'
                                    ]),
        'service_company' => $faker->company,
        'url_job_video' => $faker->url,
        'mail_reply_template' => $faker->text,
        'mail_reply_email_address' => $faker->email,
        'published_comment' => $faker->text($maxNbChars = 100)
    ];
});
