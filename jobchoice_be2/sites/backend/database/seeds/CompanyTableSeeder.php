<?php

use App\Models\Job;
use App\Models\Slug;
use App\Models\User;
use App\Models\Company;
use App\Models\JobStrength;
use App\Models\Publication;
use App\Models\JobSubCategory;
use App\Models\NearestStation;
use Illuminate\Database\Seeder;
use App\Models\HatarakiKataResource;
use App\Models\RecruitmentTag;

class CompanyTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 6; $x++) {
            factory(User::class, 1)->create([
                        'email' => 'company' . $x . '@sprobe.com',
                        'type' => 'company'
            ])->each(function ($user) {

                $company = factory(Company::class)->create(['user_id' => $user->id]);

                if ($company->id == 1) {
                    $job = factory(Job::class)->create([
                        'company_id' => $company->id,
                        'job_image' => config('app.staging_url') . '/images/job/' . $company->id . '/job_image.jpg'
                    ]);
                } else {
                    $job = factory(Job::class)->create([
                        'company_id' => $company->id
                    ]);                        
                }
                
                $hk_arr = []; // array of job's hataraki kata including other hatarakikata
                for ($y = 0; $y < 4; $y++) {
                    do {
                        $hk_value = mt_rand(1, 64);
                    } while (in_array($hk_value, $hk_arr));
                    
                    array_push($hk_arr, $hk_value);
                    factory(HatarakiKataResource::class)->create([
                        'taggable_id' => $job->id,
                        'taggable_type' => 'Job',
                        'hataraki_kata_id' => $hk_value
                    ]);

                }

                // sets a randomized number of other hatarakikata                
                $max_size = mt_rand(1, 4);
                for ($z = 0; $z < $max_size; $z++) {
                    do {
                        $hk_value = mt_rand(1, 64);
                    } while (in_array($hk_value, $hk_arr));
                    
                    array_push($hk_arr, $hk_value);
                    factory(RecruitmentTag::class)->create([
                        'job_id' => $job->id,
                        'hataraki_kata_id' => $hk_value
                    ]);
                }                                             

                factory(NearestStation::class)->create([
                    'stationable_id' => $job->id,
                    'stationable_type'=> 'Job',
                ]);

                factory(Slug::class)->create([
                    'sluggable_id' => $job->id,
                    'sluggable_type'=> 'Job',
                    'value' => strtolower(str_random(16)),
                ]);

            });
        }
    }
}
