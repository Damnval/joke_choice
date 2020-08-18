<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class BillingController extends Controller
{

	public function __construct(JobChoiceService $jobChoiceService)
	{
		parent::__construct();

		$this->jobChoiceService = $jobChoiceService;
	}

     /**
     * Display a listing of the resource.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function companyBillings(Request $request)
	{
        try{

            $billings = $this->jobChoiceService->billing()->companyBillings($request);
            $this->data['results'] = $billings;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
	}
}
