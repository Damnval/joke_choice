<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;

use Auth;
use App\Models\User;
use App\Repositories\JobChoiceRepository;

class SlugService
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
     * Logics and functions in saving Slug using polymorph
     * @param  Object $model input by user
     */
    public function store($model)
    {        
        $slug = ($model instanceof User) ? $this->generateSlug(6) : $this->generateSlug(16);
        $data = [
            'value' => $slug
        ];

        $this->jobChoiceRepository->slug()->createMorph($data, $model);
    }

    /**
     * Generate another slug if already exist in resource
     * @param  int    $len  maximum number of characters of slug
     * @return string $slug Slug String
     */
    public function generateSlug($len)
    {
        $slug = ($len == 6) ? strtoupper(str_random($len)) : strtolower(str_random($len)) ;
        $data = [
            'value'  => $slug
        ];

        $this->slug = $this->jobChoiceRepository->slug()->whereFirst($data);

        if ($this->slug) {
           return $this->generateSlug($len);
        }

        return $slug;
    }

}
