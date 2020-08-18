<?php

namespace App\Http\Controllers\API\Manage;

use DB;
use Validator;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class JobCategoryController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Create retrieval of job categories in Admin for Api
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $jobCategories = $this->jobChoiceService->job_category()->indexWithpaginate();
            $this->data['results']['jobs'] = $jobCategories;
            $this->data['status'] = 200;
        } catch (\Exception $e) {

            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

     /**
     *  Retrieval of specific job category in admin page using Api
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{

            $jobCategory = $this->jobChoiceService->job_category()->show($id);
            $this->data['results']['job_category'] = $jobCategory;
            $this->data['status'] = 200;
        } catch (\Exception $e) {

            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Store a newly created resource in storage using admin account.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $validator = Validator::make($request->all(), JobCategory::createRules());

            if ($validator->fails()) {
                throw new \Exception($validator->errors());
            }

            $jobCategory = $this->jobChoiceService->job_category()->store($request);
            $this->data['results']['message'] = 'Job Category successfully saved.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Deletes job category and all jobs under it.
     * @param  int $id job category id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try{

            $jobCategory = $this->jobChoiceService->job_category()->delete($id);
            $this->data['results']['message'] = 'Job Category and with its relationship has been successfully deleted.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

}
