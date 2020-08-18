<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;

use Auth;

class HatarakiKataResourceService
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
     * Saving hataraki kata in hataraki kata resource look up table
     * @return Boolean
     */
    public function store($request, $id)
    {
        if (!$id) {
            throw new \Exception('Please specify model ID.');
        }
        // client retrieved to check if the action is authorized or not
        $user = $this->jobChoiceRepository->user()->show(Auth::id());
        // find what model is being passed and then get its specific data
        $model = $this->getModelRecordBasedOnType($request->all(), $id);

        if ($request->type == 'job') {
            if (is_null($user->company) || $model->company_id != $user->company->id) {
                throw new \Exception('Unauthorized edit of hataraki kata of job.');
            }
        } else {
            if (is_null($user->job_seeker) || $id != $user->job_seeker->id) {
                throw new \Exception('Unauthorized edit of hataraki kata of job seeker.');
            }
        }

        $this->jobChoiceRepository->hataraki_kata_resource()->deleteMany($model);

        if (!is_null($request->hataraki_kata)) {
            if (count($request->hataraki_kata) > 4) {
                throw new \Exception('Only up to four hataraki kata can be chosen.');
            }
            
            return $this->jobChoiceRepository->hataraki_kata_resource()->createMany($request->hataraki_kata, $model);
        }         
    }

    /**
     * Initialize what model to use and get its record
     * @param  Array  $data Model type
     * @param  String $id
     * @return Object Initialized Model
     */
    public function getModelRecordBasedOnType(array $data, $id)
    {
        switch ($data['type']) {
            case 'job_seeker':
                $model = $this->jobChoiceRepository->job_seeker()->show($id);
                break;

            case 'job':
                $model = $this->jobChoiceRepository->job()->show($id);
                break;

            default:
                throw new \Exception('Unknown Model.');
                break;
        }

        return $model;
    }

    /**
     * Service and logic to get job seeker and job matching ratio
     * @param  Array  $request Client User input
     * @return Mixed Object or null
     */
    public function getMatchingRatio($request)
    {
        $job_id = $request->job_id;
        $job_seeker_id = $request->job_seeker_id;

        $matching_ratio = $this->jobChoiceRepository
                    ->hataraki_kata_resource()
                    ->computeMatchingRatio($job_seeker_id, $job_id);

        if ($matching_ratio) {
            return $matching_ratio->job_seeker_job_matching_ratio;
        }
        return null;
    }

}
