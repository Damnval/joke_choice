<?php

namespace App\Observers;

use App\Models\Notification;

class NotificationObserver
{
    /**
     * Initialize Notification
     * @param Notification $notification
     */
    public function __construct(Notification $notification)
    {
        $this->notifcation = $notification;
    }

    /**
     * Method is triggered when ever the delete eloquent is used in Model Notification
     * @param Notification $notification Model binded by id
     */
    public function deleting(Notification $notification)
    {
        // delete publication in relation to the recently deleted notification
        $notification->publication()->delete();
    }
}
