<?php

namespace App\Http\Controllers\API\Manage;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobChoiceService;

use App\Models\Notification;
use App\Models\Publication;

use DB;

class NotificationController extends Controller
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
            $notifications = $this->jobChoiceService->notification()->index();
            $this->data['results']['notifications'] = $notifications;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
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
        DB::beginTransaction();

        try{
            validateInput($request->all(), Notification::createRules());
            validateInput($request->publication,  [
                'draft' => 'required',
                'published_start_date' => 'required',
                'published_end_date' => 'required',
            ]);

            $this->jobChoiceService->notification()->store($request);
            $this->data['results']['message'] = 'Notification successfully saved.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();            
            $this->data['results'] = [];
            $this->data['error'] = $e->getMessage();
        }

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
        try {
            $this->jobChoiceService->notification()->update($request, $id);
            $this->data['results'] = 'Notification has been updated.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();
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
        DB::beginTransaction();
        try {
            $this->jobChoiceService->notification()->delete($id);
            $this->data['results'] = 'Record successfully deleted.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollback();            
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Display notifications for admin review with search parameters.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {
            $notifications = $this->jobChoiceService->notification()->search($request);
            $this->data['results']['notifications'] = $notifications;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
