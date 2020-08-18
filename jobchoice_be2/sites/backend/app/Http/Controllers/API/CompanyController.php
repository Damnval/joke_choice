<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class CompanyController extends Controller
{

	public function __construct(JobChoiceService $jobChoiceService)
	{
		parent::__construct();

		$this->jobChoiceService = $jobChoiceService;
	}

	/**
	 * Get all job offers created by company which is currently logged in
	 * @param Object $request request parameters
	 * @return \Illuminate\Http\Response
	 */
	public function postedJobs(Request $request)
	{
		try	{

			$jobs = $this->jobChoiceService->company()->getJobs($request);

			$this->data['results']['jobs'] = $jobs;
			$this->data['status'] = 200;

		} catch (\Exception $e) {
			$this->data['error'] = $e->getMessage();
		}

		return response()->json($this->data, $this->data['status']);
	}

}
