<?php

use App\Models\Job;
use Illuminate\Database\Seeder;

class CleanSeederScript extends Seeder
{
    /**
     * Since seeder used factory and random generating values,
     * some data are incorrect. e.g. Jobs can't be shared if job approval_status is not 'approved'
     * These scripts will clean the data and fix as if it went to correct procedure as how the data it should be.
     *
     * @return void
     */
    public function run()
    {
    	// change all publication draft to 1 if job's approval_status is not approved
    	\DB::table('publications')->whereIn('publishable_id', function($query){
						               $query->select('id')
						               		->from('jobs')
						               		->where('approval_status', '!=', 'approved');
								})
    							->where('publishable_type', 'Job')
    					  		->update(['draft' => 1]);

    	// Delete all jobs that has been shared if `approval_status` in jobs table is `waiting` or `rejected`
	  	\DB::table('shared_jobs')->whereIn('job_id', function($query){
					               $query->select('id')
					               		->from('jobs')
					               		->whereIn('approval_status', ['waiting', 'rejected']);
								})->delete();

	  	// Delete all applied_jobs data if job  `approval_status` in jobs table is `waiting` or `rejected`
	  	\DB::table('applied_jobs')->whereIn('job_id', function($query){
					               $query->select('id')
					               		->from('jobs')
					               		->whereIn('approval_status', ['waiting', 'rejected']);
								})->delete();

	  	// update all applied jobs set diclosed to 1 if company has viewed (disclosed) applicant
	  	\DB::table('applied_jobs')->where('status', '!=', 'waiting')
					            ->update(['disclosed' => 1]);
    }

}
