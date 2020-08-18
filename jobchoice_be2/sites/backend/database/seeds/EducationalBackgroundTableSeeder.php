<?php

use Illuminate\Database\Seeder;
use App\Models\EducationalBackground;

class EducationalBackgroundTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 6; $x++) {
            // random number of sub images of job            
            $no_of_educational_bg = mt_rand(0, 3);
            factory(EducationalBackground::class, $no_of_educational_bg)->create([
                'job_seeker_id' => $x
            ]);
        }
    }
}
