f<?php

use Illuminate\Database\Seeder;
use App\Models\Image;

class ImageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 6; $x++) {
            factory(Image::class, 1)->create([
                'imageable_id' => $x,
                'imageable_type' => 'Notification',
            ]);
        }

        for ($x = 1; $x < 6; $x++) {
            factory(Image::class, 1)->create([
                'imageable_id' => $x,
                'imageable_type' => 'SpecialFeature',
                'image_name' => 'main_image' . $x,
                'image_path' => config('app.staging_url') . '/images/assets/special_features/main_image' . $x . '.jpg',
            ]);
        }

        for ($x = 1; $x < 6; $x++) {
            factory(Image::class, 1)->create([
                'imageable_id' => $x,
                'imageable_type' => 'SpecialFeature',
                'image_name' => 'sub_image' . $x,
                'image_path' => config('app.staging_url') . '/images/assets/special_features/sub_image' . $x . '.jpg',
            ]);
        }
    }
}
