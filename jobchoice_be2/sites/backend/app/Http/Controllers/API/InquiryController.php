<?php

namespace App\Http\Controllers\API;

use DB;
use Validator;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class InquiryController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Store a newly created inquiry in inquries resource as well as send email to admin.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {

            $validator = Validator::make($request->all(), Inquiry::createRules());

            if ($validator->fails()) {
                throw new \Exception($validator->errors());
            }

            $inquiry = $this->jobChoiceService->inquiry()->store($request);

            if ($inquiry) {
                $this->data['results']['message'] = 'Inquiry successfully sent.';
                $this->data['status'] = 200;
            }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);

    }

}
