<?php

use Illuminate\Database\Seeder;

class JobWelfareTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		$timestamp = now();
        DB::table('job_welfares')->insert([
	            [
	                'name' => 'health_insurance',
	                'job_id' => 1,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'health_insurance',
	                'job_id' => 2,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'health_insurance',
	                'job_id' => 3,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            	            [
	                'name' => 'health_insurance',
	                'job_id' => 4,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'welfare_pension',
	                'job_id' => 1,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'welfare_pension',
	                'job_id' => 2,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'welfare_pension',
	                'job_id' => 3,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'employment_insurance',
	                'job_id' => 1,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'employment_insurance',
	                'job_id' => 2,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'labor_accident_insurance',
	                'job_id' => 1,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
				],
				[
	                'name' => 'welfare_pension',
	                'job_id' => 6,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'welfare_pension',
	                'job_id' => 7,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'employment_insurance',
	                'job_id' => 6,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'employment_insurance',
	                'job_id' => 8,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
	            [
	                'name' => 'labor_accident_insurance',
	                'job_id' => 10,
	                'created_at' => $timestamp,
	                'updated_at' => $timestamp
	            ],
           ]);
    }
}
