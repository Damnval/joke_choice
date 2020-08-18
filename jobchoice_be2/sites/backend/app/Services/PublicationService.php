<?php

namespace App\Services;

use App\Repositories\JobChoiceRepository;

class PublicationService
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
     * Logic that will get the last published job of a company
     * @param  array $companies
     * @return Collection Publications
     */
    public function appendPublishedDate($companies)
    {
        foreach ($companies as $company => $value) {

            $company_id = $value['id'];
            // get date of last published job under current company in foreach
            $publication = $this->getLastPublishedJob($company_id);

            $value['last_published_date'] = $publication->pluck('updated_at');
        }

        return $companies;
    }

    /**
     * Logic that will get the last published job of a company
     * @param  int $company_id
     * @return Object Publication
     */
    public function getLastPublishedJob(int $company_id)
    {
        $params = [
            'company_id' => $company_id
        ];
        // gets all the jobs of the current company in foreach
        $job_ids = $this->jobChoiceRepository->job()->where($params)->pluck('id')->toArray();

        $publicationParams = [
            'publishable_type' => 'Job',
            'status' => 'published',
            'draft' => 0
        ];

        return $this->jobChoiceRepository
                    ->publication()
                    ->whereInlimit(
                                    'publishable_id',
                                    $job_ids,
                                    $publicationParams,
                                    1,
                                    'updated_at',
                                    'desc'
                                );
    }

}

