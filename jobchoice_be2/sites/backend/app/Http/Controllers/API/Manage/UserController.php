<?php

namespace App\Http\Controllers\API\Manage;

use DB;
use Auth;
use Validator;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

	 /**
     * Update the specified user from resource
     * @param  int  $id
     * @param  Object $request Input from user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try	{
            $rules = $this->jobChoiceService->user()->validatorToUse($request, $id);
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                throw new \Exception($validator->errors());
            }
       		$user = $this->jobChoiceService->user()->update($request, $id);
       		if ($user) {
       		 	$this->data['results'] = 'Record successfully Updated.';
       		}
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

	 /**
     * Remove the specified user from resource
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {

       		$user = $this->jobChoiceService->user()->delete($id);
       		if ($user) {
       		 	$this->data['results'] = 'Record successfully deleted.';
       		 }

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Retrieval of specific User with its relationship using Api
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{

            $user = $this->jobChoiceService->user()->show($id);
            $this->data['results']['user'] = $user;

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Retrieve list of all users except admin record
     * @return  \Illuminate\Http\Response
     */
    public function index()
    {
        try{

            $user = $this->jobChoiceService->user()->index();
            $this->data['results']['user'] = $user;

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Retrieve list of all users with job seeker type for incentive management
     * 
     * @return  \Illuminate\Http\Response
     */
    public function userIncentiveManagement()
    {
        try {
            
            $user = $this->jobChoiceService->user()->userIncentiveManagement();
            $this->data['results']['user'] = $user;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Retrieve list of all users with job seeker type for incentive management
     * @param  \Illuminate\Http\Request  $request
     * @return  \Illuminate\Http\Response
     */
    public function userIncentiveManagementSearch(Request $request)
    {
        try {
            
            $user = $this->jobChoiceService->user()->userIncentiveManagementSearch($request);
            $this->data['results']['user'] = $user;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

}
