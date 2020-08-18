<?php

namespace App\Http\Controllers\API;

use DB;
use App\Models\AppliedJob;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\JobQuestionJobSeekerAnswer;

class AppliedJobController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Get applied jobs from a specific user
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
	public function userAppliedJobs(Request $request)
	{
        try {
            $applied_jobs = $this->jobChoiceService->applied_job()->index($request);

            $this->data['results']['applied_jobs'] = $applied_jobs;
            $this->data['status'] = 200;
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
	}

    /**
     * Saving applied job based on the current logged job seeker
     * @param  Request $request user client input
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       DB::beginTransaction();
        try {
            validateInput($request->all(), AppliedJob::createRules());
            $result = $this->jobChoiceService->applied_job()->store($request);
            if ($result) {
                if(!empty($request->job_questions)){
                    $this->jobChoiceService->job_question_job_seeker_answer()->store($request);
                }
            }

            $this->data['results']['message'] = "Successfully applied Job.";
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error']  = $e->getMessage();
        }
        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Get applicants of specific jobs
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function companyJobApplicants(Request $request)
    {
        try {
            $job_applicants = $this->jobChoiceService->applied_job()->getJobApplicants($request);

            $this->data['status'] = 200;
            //reffering to applied jobs table
            $this->data['results']['job_applicants'] = $job_applicants;
            $this->data['results']['total'] = count($job_applicants['applied_jobs']);
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Get applicant info with job ratio matching on the specific job
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function accountInformation(Request $request)
    {

        try {
            $job_seeker_information = $this->jobChoiceService
                                            ->applied_job()
                                            ->getApplicantInformation($request);

            $job_seeker_job_match_ratio = $this->jobChoiceService
                                                ->hataraki_kata_resource()
                                                ->getMatchingRatio($request);

            $this->data['results']['applicant_info'] = $job_seeker_information;
            $this->data['results']['applicant_info']['job_matching_ratio'] = $job_seeker_job_match_ratio;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Update the specified applied job from resource
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function discloseAppliedJob(Request $request)
    {
        DB::beginTransaction();
        try {
            $result = $this->jobChoiceService->company()->doesCompanyOwnThisJob($request->job_id);

            if ($result) {
                $this->jobChoiceService->applied_job()->updateDisClose($request);
            }

            $this->data['results'] = 'Record successfully Updated.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

   /**
     * Remove the specified resource from storage.
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $job = $this->jobChoiceService->applied_job()->delete($id);
            $this->data['results'] = 'Record successfully deleted.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
