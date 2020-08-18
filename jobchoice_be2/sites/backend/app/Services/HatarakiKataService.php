<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use App\Repositories\JobChoiceRepository;

class HatarakiKataService
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
     * Service that gets all Hataraki Kata
     * Logics and functions in saving Hataraki Kata
     * @return Object Hataraki Kata
     */
    public function index()
    {
        return $this->jobChoiceRepository->hataraki_kata()->all();
    }

    /**
     * Service that gets specific job category
     * @param  Int $id
     * @return Object Hataraki Kata Collection
     */
    public function show($id)
    {
        return $this->jobChoiceRepository->hataraki_kata()->show($id);
    }
}
