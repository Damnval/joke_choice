<?php

use Illuminate\Database\Seeder;
use App\Models\JobReasonsToHire;

class JobReasonsToHireTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	for ($i = 1; $i < 11; $i++) {

			$no_of_reason = rand(1, 3);
			factory(JobReasonsToHire::class, $no_of_reason)->create([
				'job_id' => $i
			]);
    	}

    }
}
