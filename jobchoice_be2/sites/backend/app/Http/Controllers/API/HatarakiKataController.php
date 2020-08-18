<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\JobChoiceService;

class HatarakiKataController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Create retrieval of all Hataraki kata for Api
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->data = [];
        $this->data['status'] = 200;

        try{
    
            $hatarakiKata = $this->jobChoiceService->hataraki_kata()->index();     
            $this->data['results']['hataraki_kata'] = $hatarakiKata;    
            
        } catch (Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

     /**
     * Create retrieval of specific Hataraki kata for Api
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
		$this->data = [];
        $this->data['status'] = 200;

        try{
    
            $hatarakiKata = $this->jobChoiceService->hataraki_kata()->show($id);     
            $this->data['results']['hataraki_kata'] = $hatarakiKata;    
            
        } catch (Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
