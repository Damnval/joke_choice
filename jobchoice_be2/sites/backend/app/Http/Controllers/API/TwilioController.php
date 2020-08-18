<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobChoiceService;

use App\Models\Twilio;
use DB;

class TwilioController extends Controller
{

    /**
     * @var App\Services\JobChoiceService
     */
    private $jobChoiceService;

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
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            
            // Validate action 
            if($request['action'] == 'resend') {
                // Validate and resend code
                $twilio = $this->jobChoiceService->twilio()->resend($request);
            } else {
                // Validate and send data
                $twilio = $this->jobChoiceService->twilio()->store($request);
            }
            
            // Validate Twilio Model
            if ($twilio) {
                $this->data['results']['message'] = "Successfully Send Verification Code.You can now login to your dashboard.";
                $this->data['results']['twilio'] = $twilio;
                $this->data['status'] = 200;
            }

        } catch(\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
       //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Verify Twilio Verification Code
     * @param string $code
     * 
     */
    public function verifyCode(Request $request) {
        DB::beginTransaction();
        try	{
            $twilio = $this->jobChoiceService->twilio()->update($request);

            if ($twilio) {
                $this->data['results']['message'] = "Successfully Verified Code. You can now sign in to your account.";
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
     * Verify Phone Number
     * @param App\Http\Request $request
     */
    public function verifyPhoneNumber(Request $request) {
        try {  
            $twilio = $this->jobChoiceService->twilio()->verifyPhoneNumber($request);

            if ($twilio) {
                $this->data['results']['message'] = "This is a valid phone number";
                $this->data['status'] = 200;
            }

        } catch(\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }
        return response()->json($this->data, $this->data['status']);
    } 
}
