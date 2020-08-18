<?php

namespace App\Http\Controllers\API\Manage;

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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{

            $companies = $this->jobChoiceService->company()->index();
            if ($companies) {
                $companies = $this->jobChoiceService->publication()->appendPublishedDate($companies);
                $companies = $this->jobChoiceService->applied_job()->appendUndisclosed($companies);
            }
            $this->data['results']['companies'] = $companies;

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Display the specified resource.
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {

            $company = $this->jobChoiceService->company()->show($id);
            $this->data['results']['company'] = $company;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Method that search companies based on the search params
     * @param Object $request request parameters
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try{

            $companies = $this->jobChoiceService->company()->adminCompanySearch($request);
            if ($companies) {
                $companies = $this->jobChoiceService->publication()->appendPublishedDate($companies);
                $companies = $this->jobChoiceService->applied_job()->appendUndisclosed($companies);
            }
            $this->data['results']['companies'] = $companies;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
