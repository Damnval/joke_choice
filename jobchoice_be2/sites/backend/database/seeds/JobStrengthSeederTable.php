<?php

use App\Models\JobStrength;
use Illuminate\Database\Seeder;

class JobStrengthTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(JobStrength::class, 20)->create();
    }
}

