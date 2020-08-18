<?php

use Illuminate\Database\Seeder;
use App\Models\Geolocation;

use Carbon\Carbon;

class GeolocationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 6; $x++) {
            factory(Geolocation::class, 1)->create([
                'taggable_id' => $x,
                'taggable_type' => 'JobSeeker',
            ]);
        }

        for ($x = 1; $x < 11; $x++) {
            factory(Geolocation::class, 1)->create([
                'taggable_id' => $x,
                'taggable_type' => 'Job',
            ]);
        }

        for ($x = 1; $x < 6; $x++) {
            factory(Geolocation::class, 1)->create([
                'taggable_id' => $x,
                'taggable_type' => 'Company',
            ]);
        }
    }
  }
