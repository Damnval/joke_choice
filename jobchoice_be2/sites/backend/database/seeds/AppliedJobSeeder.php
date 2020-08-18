<?php

use Illuminate\Database\Seeder;
use App\Models\AppliedJob;

class AppliedJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 1,
            'job_id' => 1,
            'status' => 'pending',
            'shared_job_id'=> 1
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 2,
            'job_id' => 2,
            'status' => 'pending', 
            'shared_job_id'=> 2
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 3,
            'status' => 'pending',
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 4,
            'job_id' => 4,
            'status' => 'pending',
            'shared_job_id'=> 4
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 5,
            'job_id' => 5,
            'status' => 'pending',
            'shared_job_id'=> null
            ]);
        
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 5,
            'job_id' => 1,
            'status' => 'rejected', 
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 4,
            'job_id' => 1,
            'status' => 'rejected', 
            'shared_job_id'=> 6
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 2,
            'status' => 'rejected', 
            'shared_job_id'=> 7
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 2,
            'job_id' => 1,
            'status' => 'rejected', 
            'shared_job_id'=> 10
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 1,
            'job_id' => 4,
            'status' => 'rejected', 
            'shared_job_id'=> null
            ]);

        factory(AppliedJob::class)->create([
            'job_seeker_id' => 5,
            'job_id' => 2,
            'status' => 'success', 
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 4,
            'job_id' => 2,
            'status' => 'success', 
            'shared_job_id'=> null
            ]);   
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 2,
            'status' => 'success', 
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 2,
            'job_id' => 4,
            'status' => 'success', 
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 1,
            'job_id' => 2,
            'status' => 'success', 
            'shared_job_id'=> 7
            ]); 

        factory(AppliedJob::class)->create([
            'job_seeker_id' => 5,
            'job_id' => 3,
            'status' => 'waiting',
            'shared_job_id'=> 8
            ]); 
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 4,
            'job_id' => 3,
            'status' => 'waiting',
            'shared_job_id'=> null
            ]); 
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 4,
            'status' => 'waiting',
            'shared_job_id'=> 9
            ]); 
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 2,
            'job_id' => 3,
            'status' => 'waiting',
            'shared_job_id'=> null
            ]); 
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 1,
            'job_id' => 3,
            'status' => 'waiting',
            'shared_job_id'=> null
            ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 5,
            'job_id' => 6,
            'status' => 'success',
            'shared_job_id'=> 12
        ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 6,
            'status' => 'waiting',
            'shared_job_id'=> 11
        ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 3,
            'job_id' => 7,
            'status' => 'waiting',
            'shared_job_id'=> NULL
        ]);
        factory(AppliedJob::class)->create([
            'job_seeker_id' => 1,
            'job_id' => 8,
            'status' => 'rejected',
            'shared_job_id'=> 13
        ]);      
    }
}
