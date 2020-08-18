<?php

use Illuminate\Database\Seeder;
use App\Models\WorkExperience;
use Faker\Generator as Faker;

class WorkExperienceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        factory(WorkExperience::class, 10)->create();
    }
}
