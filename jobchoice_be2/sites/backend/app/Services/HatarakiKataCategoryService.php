<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;

class HatarakiKataCategoryService
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
     * Service that gets all Hataraki Kata categories with its hataraki kata
     * @return Object Hataraki Kata Category
     */
    public function index()
    {
        return $this->jobChoiceRepository->hataraki_kata_category()->all();
    }
}
