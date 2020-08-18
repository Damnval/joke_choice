<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;

use Carbon\Carbon;
use Auth;

class NotificationService
{
    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */
    public function __construct(JobChoiceRepository $jobChoiceRepository)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Service that gets all job
     * Logics and functions in saving Notes
     * @return Object Notification Collection
     */
    public function index()
    {
        return $this->jobChoiceRepository->notification()->all(20);
    }

    /** 
     * Logics and functions involving password resets
     * @param  Object $request User client input
     * @return Object Notification Collection
     */
    public function store($request)
    {
        $notification = $this->jobChoiceRepository->notification()->create($request->toArray());

        return $this->jobChoiceRepository->publication()->createMorph($request->publication, $notification);
    }

    /**
     * Service that gets all notifications depending on user type with optional pagination
     * @param  Object $request User client input
     * @return Object Notification Collection
     */
    public function getAllPublishedNotifications($request)
    {
        // params that get notifications based on current logged in user's type
        $whereIn = 'recipient_type';
        $params = ['all', Auth::user()->type];

        // param that gets the relationship of notifications and its user viewed logs
        $with = ['notification_log'];

        // params that gets all published notifications
        $whereHasField = 'publication';
        $whereHasParams = [
            ['published_start_date', '<=', Carbon::now()],
            ['published_end_date', '>=', Carbon::now()],
            ['draft', '==', 0],
        ];

        return $this->jobChoiceRepository->notification()
                                         ->hybridWhereInWithAndWhereHas(
                                            $params,
                                            $whereIn,
                                            $with,
                                            $whereHasField,
                                            $whereHasParams,
                                            'DESC',
                                            $request->paginate
                                        );
    }

    /**
     * Service that gets a specific notification and creates a log of that user
     * @param  int $id User client input
     * @return Object $notification Notification Collection
     */
    public function show($id)
    {
        $params = [
            'notification_id' => $id,
            'user_id' => Auth::id()
        ];

        $notification = $this->jobChoiceRepository->notification()->show($id);

        // creates user notification log if it does not yet exist
        $notification_log = $this->jobChoiceRepository->notification_log()->whereFirst($params);
        if (!$notification_log) {
            $this->jobChoiceRepository->notification_log()->create($params);
        }

        return $notification;
    }

    /**
     * Service that delete notification
     * Logics and functions in saving Occupation
     * @param  int $id User client input
     * @return bool true or false
     */
    public function delete($id)
    {   
        if (Auth::user()->type != 'admin') {
            throw new \Exception('Unauthorized delete of notification.');
        }

        if (is_null($id)) {
            throw new \Exception('Please provide an ID parameter to delete notification.');
        }

        if (!(int)$id) {
            throw new \Exception('Input is not an integer');
        }

        return $this->jobChoiceRepository->notification()->destroy($id);
    }

     /**
     * Service logic to update Note from resource
     * @param Object $request Input by user
     * @param int $id Input by user
     * @return Object $notification Notification Collection
     */
    public function update($request, $id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to update.');
        }

        $notification = $this->jobChoiceRepository->notification()->update($request->toArray(), $id);
        $this->jobChoiceRepository->publication()->updateMorph($request->publication, $notification);

        return $notification;
    }

    /**
     * Service logic that retrieves notifications based on search inputs
     * @param  Object $request input by user
     * @return Object $notifications Notification Collection
     */
    public function search($request)
    {
        $field = null;
        $notification_ids = [];
        
        if ($request->keyword) {
            $field = 'id';
            $notification_ids = $this->keywordSearch($request->keyword)->pluck('id')->toArray(); 
        }

        $dates = [];

        if ($request->start_date && $request->end_date) {
            $dates = [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ];
        }

        $with = ['publication', 'image', 'document'];

        $notifications = $this->jobChoiceRepository->notification()
                                                   ->whereInAndWhereBetween(
                                                        $field,
                                                        $notification_ids,
                                                        'created_at',
                                                        $dates,
                                                        $with,
                                                        20
                                                   );                                                

        return $notifications;                 
    }

    /**
     * Service logic that retrieves notifications from view based on notifications given keyword
     * @param  string $keyword       input by user
     * @return Object $notifications Notification Collection
      */
    public function keywordSearch($keyword)
    {
        $notifications = $this->jobChoiceRepository->admin_notification_search()
                                                   ->keywordSearch($keyword);
        
        return $notifications;                                                       
    }
    
}
