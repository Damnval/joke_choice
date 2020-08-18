<?php

namespace App\Http\Controllers\API\Manage;

use DB;
use Auth;
use Validator;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class JobController extends Controller
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

            $jobs = $this->jobChoiceService->job()->getAdminJobsList();
            $this->data['results']['jobs'] = $jobs;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

	 /**
     * Update the specified job from resource
     * @param  int  $id
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $job = $this->jobChoiceService->job()->approveCompanyJob($request, $id);
            $this->jobChoiceService->job()->sendCompanyEmailApprovalStatus($request, $id);
            $status = 'approved';
            if ($request->approval_status == 'rejected'){
                $status = 'rejected';
            }
            $this->data['results'] = 'Job posting has been ' . $status;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
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
            $job = $this->jobChoiceService->job()->show($id);
            $applied_job_counts = $this->jobChoiceService->job()->getAppliedCountInJobOfferDetail($id);
            $this->data['results']['job'] = $job;
            $this->data['results']['applied_job_counts'] = $applied_job_counts;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Display jobs for admin review with search parameters.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {

            $jobs = $this->jobChoiceService->job()->adminJobsListSearch($request);
            $this->data['results']['jobs'] = $jobs;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
