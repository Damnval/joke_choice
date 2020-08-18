<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;

use Auth;

class JobCategoryService
{
    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */

    public function __construct(JobChoiceRepository $jobChoiceRepository)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Service that gets all Job Category
     * Logics and functions in saving Job Category
     * @param  Object $request input by user
     */
    public function index()
    {
        return $this->jobChoiceRepository->job_category()->all();
    }

    /**
     * Service that gets all Job Category with pagination
     * Logics and functions in saving Job Category
     * @param  Object $request input by user
     */
    public function indexWithpaginate()
    {
        return $this->jobChoiceRepository->job_category()->all(20);
    }

    /**
     * Service that gets specific job category
     * @param  Int $id
     * @return Object Job Category Collection
     */
    public function show($id)
    {
        return $this->jobChoiceRepository->job_category()->show($id);
    }

    /**
     * Service and logics that saves category in job_categories Table
     * @param  Object $request User client input
     * @return Object of job category
     */
    public function store($request)
    {
        $params = [
            'category' => $request->category
        ];

        // validation is done here instead of models since soft deletes are being used
        $job_category = $this->jobChoiceRepository->job_category()->whereFirst($params);

        if ($job_category) {
            throw new \Exception('The category has already been taken.');
        }

        return $this->jobChoiceRepository->job_category()->create($request->toArray());
    }

    /**
     * Service and logics that deletes category in job_categories Table along with its relationship.
     * @param int $id User client input
     */
    public function delete($id)
    {
        if (Auth::user()->type != 'admin') {
            throw new \Exception('Unauthorized delete of job category.');
        }

        if (is_null($id)) {
            throw new \Exception('Please provide an ID parameter to delete job category.');
        }

        if (!(int)$id) {
            throw new \Exception('Input is not an integer');
        }

        $job_category = $this->jobChoiceRepository->job_category()->destroy($id);

        if (!$job_category) {
            throw new \Exception('No record found to delete or account has already been deleted.');
        }

    }
}
