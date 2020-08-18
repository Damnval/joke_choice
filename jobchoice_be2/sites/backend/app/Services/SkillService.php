<?php

namespace App\Services;

use App\Repositories\JobChoiceRepository;

class SkillService
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
     * Logics and functions in saving Token
     * @param  Object $request input by user
     */
    public function index()
    {
        return $this->jobChoiceRepository->skill()->all();
    }

}
