<?php

use Illuminate\Database\Seeder;
use App\Models\Billing;

use Carbon\Carbon;

class BillingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {        
        for ($x = 0; $x < 20; $x++) {
            factory(Billing::class)->create([
                'detail_type' => 'disclosure',
                'billable_type' => 'Job'
            ]);
        }
        // Billings from a month before todays date for varying billing data
        for ($x = 0; $x < 20; $x++) {
            factory(Billing::class)->create([
                'detail_type' => 'disclosure',
                'billable_type' => 'Job',
                'created_at' => Carbon::now()->subMonth()
            ]);
        }

    }
}
