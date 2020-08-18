<?php

namespace App\Http\Controllers\API;

use DB;
use Validator;
use App\Models\Job;
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
            $jobs = $this->jobChoiceService->job()->approvedJobsList();
            $this->data['results']['jobs'] = $jobs;
            $this->data['status'] = 200;

        // @codeCoverageIgnoreStart
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }
        // @codeCoverageIgnoreEnd

        return response()->json($this->data, $this->data['status']);
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

            if ($request->input('publication')['draft'] == 0) {
                validateInput($request->all(), Job::createRules());
            }

            $job = $this->jobChoiceService->job()->store($request);

            if ($job) {
                $this->jobChoiceService->slug()->store($job);
                if ($request->input('publication')['draft'] == 0) {
                    $this->jobChoiceService->job()->sendAdminEmail('【JOBチョイス求人連絡】求人ページが作成されました。', 'created', $job);
                }
                $this->data['results']['message'] = 'Job successfully saved.';
                $this->data['status'] = 200;
            }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);

    }

    /**
     * Display the specified resource.
     *
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $job = $this->jobChoiceService->job()->show($id);
            $this->data['results']['job'] = $job;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request  $request
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try	{

            if ($request->input('publication')['draft'] == 0) {
                validateInput($request->all(), Job::createRules());
            }

            $job = $this->jobChoiceService->job()->update($request, $id);
            if ($request->input('publication')['draft'] == 0) {
                $this->jobChoiceService->job()->sendAdminEmail('Company Updated Job', 'updated', $job);
            }
            $this->data['results']['message'] = 'Record successfully Updated.';
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
     *
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $job = $this->jobChoiceService->job()->delete($id);
            $this->data['results'] = 'Record successfully deleted.';
            $this->data['status'] = 200;

        } catch (Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

     /**
     * Method that search jobs based on the search params
     * @param Object $request request parameters
     * @return Object job collection
     */
    public function search(Request $request)
    {
        try {

            $searchedJobs = $this->jobChoiceService->job()->search($request);
            $this->data['results']['jobs'] = $searchedJobs;
            $this->data['results']['total'] = count($searchedJobs);
            $this->data['status'] = 200;

        } catch (Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Check if the array returned has value
     * @param  array $data
     * @return array $data
     */
    public function hasResult($data)
    {
        if (count($data) > 0) {
            return $data;
        }
    }

    /**
     * Check if Request passed by the client is empty
     * @param  array  $data
     * @return boolean is empty or not
     */
    public function isRequestEmpty($data)
    {
        $empty = true;
        foreach ($data as $value) {
            if (!empty($value)) {
                $empty = false;
            }
        }
        return $empty;
    }

    /**
     * Results jobs with matching based on harakaki_kata
     * @return Object job collection
     */
    public function userMatchingJobs()
    {
        try {

            $jobs = $this->jobChoiceService->job()->userMatchingJobs();
            $this->data['results']['jobs'] = $jobs;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Retrieves job details for management for companies
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function companyJobDetails($id)
    {
        try {

            $job = $this->jobChoiceService->job()->companyJobDetails($id);
            $this->data['results']['job'] = $job;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Duplicates a specific job owned by company
     * @param Object $request request parameters
     * @return \Illuminate\Http\Response
     */
    public function duplicateJob(Request $request)
    {
        DB::beginTransaction();

        try {

            $job = $this->jobChoiceService->job()->duplicateJob($request);

            if ($job) {
                $this->jobChoiceService->slug()->store($job);                
                $this->data['results']['message'] = 'Successfully duplicated job.';
                $this->data['status'] = 200;
            }

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

}
