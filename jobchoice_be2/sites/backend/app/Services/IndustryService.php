<?php

namespace App\Services;

use Auth;
use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;

class IndustryService
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
     * Service that gets all industries
     * Logics and functions in saving Industry
     */
    public function index()
    {
        return $this->jobChoiceRepository->industry()->all();
    }
}
