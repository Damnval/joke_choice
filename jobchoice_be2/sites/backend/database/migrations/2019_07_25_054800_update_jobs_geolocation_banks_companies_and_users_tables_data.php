<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateJobsGeolocationBanksCompaniesAndUsersTablesData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Jobs Table
        // Updates correct price and incentive per share depending on employment period
        \DB::statement(
            "UPDATE jobs
             SET price = CASE employment_period
                WHEN 'long_term' THEN 15000
                WHEN 'middle_term' THEN 8000
                WHEN 'short_term' THEN 5000
                WHEN 'single_term' THEN 2000
             END"
        );
        \DB::statement(
            "UPDATE jobs
             SET incentive_per_share = (jobs.price * .3)"
        );
        // Bank Accounts Table
        // Updates bank account to a fixed existing bank in Japan and updates kana
        DB::table('bank_accounts')->where('id', '<=', 5)->whereNotNull('account_holder')
                                  ->update([
                                    'bank_name' => 'みずほ',
                                    'bank_code' => '0001', 
                                    'branch_name' => '東京営業部"',
                                    'branch_code' => '001',
                                    'account_number' => mt_rand(1000000, 9999999),
                                    'account_holder' => 'カタカナ'
                                  ]);
        // Companies Table
        // Updates company kana
        DB::table('companies')->where('id', '<=', 5)
                              ->update(['company_kana' => 'カタカナ']);
        // Users Table
        // Updates users first and last name kana
        DB::table('users')->where('id', '<=', 12)
                          ->update([
                              'first_name_kana' => 'カタカナ',
                              'last_name_kana' => 'カタカナ'
                          ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
