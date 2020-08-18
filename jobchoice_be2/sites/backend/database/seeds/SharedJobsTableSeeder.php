<?php

use Illuminate\Database\Seeder;
use App\Models\SharedJob;
use Faker\Generator as Faker;

class SharedJobsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        factory(SharedJob::class)->create([
            'job_id' => 1,
            'provider_id' => 1
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 2,
            'provider_id' => 2
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 3,
            'provider_id' => 3
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 4,
            'provider_id' => 4
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 5,
            'provider_id' => 5
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 1,
            'provider_id' => 6
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 2,
            'provider_id' => 7
        ]);
        
        factory(SharedJob::class)->create([
            'job_id' => 3,
            'provider_id' => 1
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 4,
            'provider_id' => 2
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 1,
            'provider_id' => 3
        ]);
        
        factory(SharedJob::class)->create([
            'job_id' => 6,
            'provider_id' => 1
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 6,
            'provider_id' => 3
        ]);
        
        factory(SharedJob::class)->create([
            'job_id' => 8,
            'provider_id' => 2
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 9,
            'provider_id' => 4
        ]);

        factory(SharedJob::class)->create([
            'job_id' => 10,
            'provider_id' => 6
        ]);
    }
}
