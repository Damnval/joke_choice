<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobChoiceService;
use App\Models\PasswordReset;
use App\Models\User;

use Validator;
use Auth;
use DB;

class UserController extends Controller
{
	public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Delete access token logged in user
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        DB::beginTransaction();
        try {

            if (Auth::check()) {
                // Auth::user()->AauthAcessToken()->delete();
                Auth::user()->token()->revoke();
                $this->data['results']['message'] = 'User successfully logout.';
            }
            $this->data['status'] = 200;

        // @codeCoverageIgnoreStart
        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }
        // @codeCoverageIgnoreEnd

        DB::commit();
        return response()->json($this->data, $this->data['status']);
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
     * This is modified index resource where it gets all Users collection from db using get http type
     * @return  \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            if (Auth::id() != 1) {

                throw new \Exception('You don\'t have rights to process this request.');
            }

            $user = $this->jobChoiceService->user()->index();
            $this->data['results']['user'] = $user;

            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Function that sends a reset password token link to email 
     * @param  Object $request
     * @return \Illuminate\Http\Response
     */
    public function sendPasswordReset(Request $request)
    {
        DB::beginTransaction();
        try {
            validateInput($request->all(), PasswordReset::createSendTokenRules());

            $user = $this->jobChoiceService->user()->whereFirst($request);

            if ($user) {
                $this->jobChoiceService->password_reset()->store($user);
            }

       		$this->data['results']['message'] = 'Reset password link sent to your Email.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Resets the password given email
     * @param  Object $request
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        DB::beginTransaction();
        try {
            validateInput($request->all(), PasswordReset::createResetPasswordRules());

            $this->jobChoiceService->password_reset()->resetPassword($request);
            $this->data['results']['message'] = "Successfully changed password.";
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

     /**
     * Will get user dashboard info based on the logged in user.
     * @return \Illuminate\Http\Response
     */
    public function userDashboard()
    {
        try{

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
            = $this->jobChoiceService->user()->getUserInfoDashboard();

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

}
