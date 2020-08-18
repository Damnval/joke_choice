<?php

namespace App\Http\Controllers\API\Manage;

use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class JobSeekerController extends Controller
{
  public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Retrieve list of all job seekers
     * @return  \Illuminate\Http\Response
     */
    public function index()
    {
        try{    

            $job_seekers = $this->jobChoiceService->job_seeker()->index();

            if (count($job_seekers) > 0) {
                $job_seekers = $this->jobChoiceService->applied_job()->appendCountAppliedJobs($job_seekers);
                $job_seekers = $this->jobChoiceService->shared_job()->appendCountSharedJobs($job_seekers);
            }
            $this->data['results']['job_seekers'] = $job_seekers;

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
        try{
        
            $job_seeker = $this->jobChoiceService->job_seeker()->show($id);

            list(
                    $count_applied_jobs,
                    $count_shared_jobs,
                    $this_month_shared_jobs,
                    $count_disclosed_shared_jobs,
                    $count_this_month_disclosed_shared_jobs,
                    $count_work_experiences,
                    $sum_disclosed_incentives,
                    $this_month_sum_disclosed_incentives,
                )
            = $this->jobChoiceService->user()->getUserInfoDashboard($job_seeker->user->id);

            $notes = $this->jobChoiceService->note()->getJobSeekerAppliedJobNotes($job_seeker);

            $this->data['results']['job_seeker'] = $job_seeker;
            $this->data['results']['notes'] = $notes;
            $this->data['results']['count_applied_jobs'] = $count_applied_jobs;
            $this->data['results']['count_shared_jobs'] = $count_shared_jobs;
            $this->data['results']['this_month_shared_jobs'] = $this_month_shared_jobs;
            $this->data['results']['count_disclosed_shared_jobs'] = $count_disclosed_shared_jobs;
            $this->data['results']['count_this_month_disclosed_shared_jobs'] = $count_this_month_disclosed_shared_jobs;
            $this->data['results']['count_work_experiences'] = $count_work_experiences;
            $this->data['results']['sum_disclosed_incentives'] = $sum_disclosed_incentives;
            $this->data['results']['this_month_sum_disclosed_incentives'] = $this_month_sum_disclosed_incentives;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }


  /**
  * Method that search JobSeekers based on the search params
  * @param Object $request request parameters
  * @return  \Illuminate\Http\Response
  */
  public function search(Request $request)
  {
      try{

          $job_seekers = $this->jobChoiceService->job_seeker()->jobSeekerSearch($request);
          if (count($job_seekers) > 0) {
              $job_seekers = $this->jobChoiceService->applied_job()->appendCountAppliedJobs($job_seekers);
              $job_seekers = $this->jobChoiceService->shared_job()->appendCountSharedJobs($job_seekers);
          }
          $this->data['results']['job_seekers'] = $job_seekers;

          $this->data['status'] = 200;

      } catch (\Exception $e) {
          $this->data['error'] = $e->getMessage();
      }

      return response()->json($this->data, $this->data['status']);
  }

}

