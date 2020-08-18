<?php

use Illuminate\Database\Seeder;
use App\Models\HatarakiKataResource;

class HatarakiKataResourceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {       
        for ($x = 1; $x < 6; $x++) {
            
            $hk_arr = []; // array of job_seeker's hataraki kata
            for ($y = 0; $y < 4; $y++) {
                do {
                    $hk_value = mt_rand(1, 64);
                } while (in_array($hk_value, $hk_arr));

                array_push($hk_arr, $hk_value);
                factory(HatarakiKataResource::class)->create([
                    'hataraki_kata_id' => $hk_value,
                    'taggable_type' => 'JobSeeker',
                    'taggable_id' => $x
                ]);
            }
        }
    }
}
