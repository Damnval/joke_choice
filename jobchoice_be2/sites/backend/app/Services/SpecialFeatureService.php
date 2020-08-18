<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;

class SpecialFeatureService
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
     * Service that gets all Special Feature
     * @return Collection Special Feature
     */
    public function index()
    {
        $with = ['images'];

        return $this->jobChoiceRepository->special_feature()->all($with);
    }

}
