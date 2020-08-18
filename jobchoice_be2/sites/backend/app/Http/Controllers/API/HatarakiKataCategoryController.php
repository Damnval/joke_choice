<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\JobChoiceService;

class HatarakiKataCategoryController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Create retrieval of all Hatarakikata categories with its smaller hataraki kata for Api
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->data = [];
        $this->data['status'] = 200;

        try{
    
            $hatarakiKataCategory = $this->jobChoiceService->hataraki_kata_category()->index();     
            $this->data['results']['hataraki_kata_categories'] = $hatarakiKataCategory;    
            
        } catch (Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
