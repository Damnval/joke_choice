<?php

use Illuminate\Database\Seeder;
use App\Models\JobSeekerSkill;

class JobSeekerSkillTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(JobSeekerSkill::class, 30)->create();   
    }
}
