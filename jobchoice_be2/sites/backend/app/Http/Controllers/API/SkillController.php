<?php

namespace App\Http\Controllers\API;

use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class SkillController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $skills = $this->jobChoiceService->skill()->index();
            $this->data['results']['skills'] = $skills;
            $this->data['status'] = 200;

        } catch (Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
