<?php

use Faker\Generator as Faker;
use App\Models\BankAccount;

$factory->define(BankAccount::class, function (Faker $faker) {
    
    $randomizer = $faker->randomElement([true, false]);

    if ($randomizer) {
        return [
            'bank_name' => 'みずほ',
            'bank_code' => '0001', 
            'branch_name' => '東京営業部"',
            'branch_code' => '001',
            'account_number' => mt_rand(1000000, 9999999),
            'account_holder' => 'カタカナ',
            'deposit_type' => $faker->randomElement(['current_account','savings_account']),
        ];
    } else {
        return [
            'bank_name' => null,
            'bank_code' => null,
            'branch_name' => null,
            'branch_code' => null,
            'account_number' => null,
            'account_holder' => null,
            'deposit_type' => null,
        ];
    }
});
