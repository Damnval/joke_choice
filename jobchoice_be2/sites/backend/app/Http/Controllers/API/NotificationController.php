<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobChoiceService;

class NotificationController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }
    
    /**
     * Create retrieval of specific Notification for Api
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
    
            $notification = $this->jobChoiceService->notification()->show($id);     
            $this->data['results']['notification'] = $notification;    
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Display a listing of the resource.
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
	public function getAllPublishedNotifications(Request $request)
	{
        try{

            $notifications = $this->jobChoiceService->notification()->getAllPublishedNotifications($request);
            $this->data['results']['notifications'] = $notifications;
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
    }
}
