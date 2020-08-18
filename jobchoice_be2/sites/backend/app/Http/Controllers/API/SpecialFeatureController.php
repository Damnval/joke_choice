<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\JobChoiceService;

class SpecialFeatureController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Create retrieval of all Special Feature for Api
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->data = [];
        $this->data['status'] = 200;

        try{

            $special_feature = $this->jobChoiceService->special_feature()->index();
            $this->data['results']['special_feature'] = $special_feature;

        } catch (Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
