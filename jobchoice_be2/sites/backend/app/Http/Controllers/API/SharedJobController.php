<?php

namespace App\Http\Controllers\API;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\JobChoiceService;
use App\Models\SharedJob;
use Validator;

class SharedJobController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Returns a link to be used in sharing in social medias
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function getLink(Request $request)
	{
        DB::beginTransaction();
        try {

        	$link = $this->jobChoiceService->shared_job()->generateLink($request);
            $this->data['results']['link'] = $link;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
	}

    /**
     * Store a newly created resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{

            $validator = Validator::make($request->all(), SharedJob::createRules());

            if ($validator->fails()) {
                throw new \Exception($validator->errors());
            }

            if ($request->isPosted === 'true') {
                $this->jobChoiceService->shared_job()->store($request);
            }

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Decrypts and return shared job's job id and job seeker id
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function decryptSharedJob(Request $request)
    {
        try {

            list($job_seeker_id, $job_id, $shared_job_id) = $this->jobChoiceService->shared_job()->decryptHref($request);
            $this->data['results']['job_seeker_id'] = $job_seeker_id;
            $this->data['results']['job_id'] = $job_id;
            $this->data['results']['shared_job_id'] = $shared_job_id;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Shares job through email
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function shareEmail(Request $request)
    {
        try {

            $sent = $this->jobChoiceService->shared_job()->shareEmail($request);
            if($sent) {
                $this->data['results']['message'] = 'Email Sent.';
                $this->data['status'] = 200;
            }

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Gets the top ten shared jobs
     * @return \Illuminate\Http\Response
     */
    public function topTenSharedJobs()
    {
        try {

            $top_ten_shared_jobs = $this->jobChoiceService->shared_job()->topTenSharedJobs();
            $this->data['results']['top_ten_shared_jobs'] = $top_ten_shared_jobs;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Get shared jobs from a specific logged in user
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
	public function userSharedJobs(Request $request)
	{
        try {

            $shared_jobs = $this->jobChoiceService->shared_job()->userSharedJobs($request);
            $total_compensation = $this->jobChoiceService->shared_job()->computeTotalCompensation($request); 
            $this->data['results']['shared_jobs'] = $shared_jobs;
            $this->data['results']['total_compensation'] = $total_compensation->total_compensation;
            $this->data['status'] = 200;
        // @codeCoverageIgnoreStart
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }
        // @codeCoverageIgnoreEnd

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Get Sharer Information
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function userSharerInformation(Request $request)
    {
        try {
            
            $shared_job = $this->jobChoiceService->shared_job()->userSharerInformation($request);
            $this->data['results']['shared_job'] = $shared_job;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
