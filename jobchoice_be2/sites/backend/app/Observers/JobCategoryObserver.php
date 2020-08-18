<?php

namespace App\Observers;

use App\Models\JobCategory;

class JobCategoryObserver
{
    /**
     * Initialize Job Category
     * @param JobCategory $job_category
     */
    public function __construct(JobCategory $job_category)
    {
        $this->job_category = $job_category;
    }

    /**
     * Method is triggered when ever the delete eloquent is used in Model Job Category
     * @param JobCategory $jobCategory Model binded by id
     */
    public function deleting(JobCategory $job_category)
    {
        // deletes all job sub categories in relation to the recently deleted job category
        $job_category->job_sub_category()->get(['id'])->each(function ($job_sub_category) {
            // deletes all jobs in the lookup table using the sub categories of the deleted job category 
            $job_sub_category->job_job_sub_categories()->get(['id'])->each(function ($job_sub_sub_category) {
                $job_sub_sub_category->delete();
            });

            // delete the job sub category
            $job_sub_category->delete();
        });
    }
}
