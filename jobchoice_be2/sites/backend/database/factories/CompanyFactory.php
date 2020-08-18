<?php

use Faker\Generator as Faker;
use App\Models\Company;

$factory->define(Company::class, function (Faker $faker) {
    return [
        'purpose' => $faker->randomElement(['company_use', 'personal_use']),
        'company_name' => $faker->company,
        'company_kana' => 'カタカナ',
        'no_employees' => $faker->randomElement([
			'owner',
			'less_than_10',
			'more_than_10_less_than_50',
			'more_than_50_less_than_100',
			'more_than_100'
		]),
        'department' => $faker->text,
        'occupation_id' => $faker->numberBetween(1, 12),
        'industry_id' => $faker->numberBetween(1, 29),
    ];
});
