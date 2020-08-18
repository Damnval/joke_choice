<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\JobJobSubCategory;

class JobJobSubCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$faker = Faker\Factory::create();
    	$now = Carbon::now();
        DB::table('job_job_sub_categories')->insert([
            [
                'job_id' => 1,
                'job_sub_category_id' => 1,
                'created_at' => $now,
                'updated_at' => $now
            ],
         	[
                'job_id' => 1,
                'job_sub_category_id' => 5,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 1,
                'job_sub_category_id' => 7,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 2,
                'job_sub_category_id' => 23,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 2,
                'job_sub_category_id' => 24,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 3,
                'job_sub_category_id' => 36,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 4,
                'job_sub_category_id' => 56,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 4,
                'job_sub_category_id' => 57,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 5,
                'job_sub_category_id' => 42,
                'created_at' => $now,
                'updated_at' => $now
            ],
         	[
                'job_id' => 5,
                'job_sub_category_id' => 45,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 5,
                'job_sub_category_id' => 49,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 6,
                'job_sub_category_id' => 38,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 6,
                'job_sub_category_id' => 39,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 6,
                'job_sub_category_id' => 41,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 7,
                'job_sub_category_id' => 1,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 7,
                'job_sub_category_id' => 4,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 7,
                'job_sub_category_id' => 5,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 7,
                'job_sub_category_id' => 6,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 8,
                'job_sub_category_id' => 61,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 9,
                'job_sub_category_id' => 51,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 9,
                'job_sub_category_id' => 52,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 9,
                'job_sub_category_id' => 53,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 10,
                'job_sub_category_id' => 29,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 10,
                'job_sub_category_id' => 33,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'job_id' => 10,
                'job_sub_category_id' => 34,
                'created_at' => $now,
                'updated_at' => $now
            ],
        ]);
    }
}
