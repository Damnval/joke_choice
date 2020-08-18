<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class OccupationController extends Controller
{

	public function __construct(JobChoiceService $jobChoiceService)
	{
		parent::__construct();

		$this->jobChoiceService = $jobChoiceService;
	}

     /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Response
     */
	public function index()
	{
        try{

            $occupations= $this->jobChoiceService->occupation()->index();
            $this->data['results']['occupations'] = $occupations;

            $this->data['status'] = 200;
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
	}

}
