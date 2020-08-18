<?php

use App\Models\Slug;
use App\Models\User;
use App\Models\JobSeeker;
use App\Models\BankAccount;
use Illuminate\Database\Seeder;
use App\Models\HatarakiKataResource;

class JobSeekerTableSeeder extends Seeder
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
                    'email' => 'jobseeker' . $x . '@sprobe.com',
                    'type' => 'job_seeker',
                    ])->each(function($user) {
                        $job_seeker = factory(JobSeeker::class)->create(['user_id' => $user->id]);
                        factory(Slug::class)->create([
                            'sluggable_id' => $user->id,
                            'sluggable_type' => 'User'
                        ]);

                        factory(BankAccount::class)->create([
                            'job_seeker_id' => $job_seeker->id,
                        ]);
            });
        }
    }
}
