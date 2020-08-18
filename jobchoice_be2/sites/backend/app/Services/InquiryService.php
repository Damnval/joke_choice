<?php

namespace App\Services;

use Mail;
use App\Repositories\JobChoiceRepository;
use App\Mail\Inquiry\Store\InformInquirerInquiry;
use App\Mail\Inquiry\Store\InformJobChoiceInquiry;

class InquiryService
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
     * Service and logics that saves inquiry in inquiries Table
     * @param  Object $request User client input
     * @return Object of inquiries
     */
    public function store($request)
    {

        $inquiry = $this->jobChoiceRepository->inquiry()->create($request->all());

        if ($inquiry) {
            // Sends inquiry email to user's personal email
            Mail::send(new InformInquirerInquiry($inquiry, $request->jobchoice_lang));
            // Sends inquiry email to job choice secretariat
            Mail::send(new InformJobChoiceInquiry($inquiry));
        }

        return $inquiry;

    }

}
