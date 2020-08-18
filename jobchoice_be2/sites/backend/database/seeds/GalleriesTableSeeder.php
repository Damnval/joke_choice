<?php

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GalleriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x <= 3; $x++) {
            factory(Gallery::class)->create([
                'job_id' => 1,
                'file_path' => config('app.staging_url') . '/images/job/1/galleries/sub_image' .$x. '.jpg'
            ]);
        }      

        for ($x = 2; $x < 11; $x++) {
            // random number of sub images of job
            $no_of_sub_images = mt_rand(0, 3);
                factory(Gallery::class, $no_of_sub_images)->create([
                    'job_id' => $x
                ]);
        }
    }
}
