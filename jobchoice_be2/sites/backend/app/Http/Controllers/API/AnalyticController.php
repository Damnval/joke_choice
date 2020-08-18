<?php

namespace App\Http\Controllers\API;

use App\Models\Analytic;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AnalyticController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Store a newly created resource in storage.
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {

            validateInput($request->all(), Analytic::createRules());
            $this->jobChoiceService->analytic()->store($request);

            $this->data['results']['message'] = 'Record successfully saved.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

}
