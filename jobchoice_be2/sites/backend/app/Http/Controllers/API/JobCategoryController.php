<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class JobCategoryController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Create retrieval of job categories for Api
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $jobCategories = $this->jobChoiceService->job_category()->index();
            $this->data['results']['jobs'] = $jobCategories;
            $this->data['status'] = 200;

        } catch (Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
