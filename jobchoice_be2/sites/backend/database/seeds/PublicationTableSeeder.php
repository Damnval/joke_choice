f<?php

use Illuminate\Database\Seeder;
use App\Models\Publication;

class PublicationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 11; $x++) {        
            factory(Publication::class, 1)->create([
                'publishable_id' => $x,
                'publishable_type' => 'Job',
            ]);
        }

        for ($x = 1; $x < 11; $x++) {
            factory(Publication::class, 1)->create([
                'publishable_id' => $x,
                'publishable_type' => 'Notification',
                'status' => NULL
            ]);
        }
    }
}
