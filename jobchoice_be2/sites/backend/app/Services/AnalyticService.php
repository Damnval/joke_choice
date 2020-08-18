<?php

namespace App\Services;

use App\Repositories\JobChoiceRepository;

class AnalyticService
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
     * Service and logics that saves or update analytic in analytics Table
     * @param  Object $request User client input
     */
    public function store($request)
    {
        // validates Model format
        $this->modelChecker($request->model, $request->id);

        $params = [
            'trackable_type' => $request->model,
            'trackable_id' => $request->id
        ];

        $analytic =  $this->jobChoiceRepository->analytic()->whereFirst($params);

        // checks if record already exists
        if ($analytic) {
            // updates column views if record already exists
            $data = [
                'views' => $analytic->views + 1
            ];

            $this->jobChoiceRepository->analytic()->update($data, $analytic->id);
        } else {
            // create a new record
            $this->jobChoiceRepository->analytic()->create($params);
        }

    }

    /**
     * Passed model might be uppper case or lower case that can lead to error
     * This method will check if passed model is correct as polymorhp
     * @param  String $model_param Model to check
     * @param  Int $model_id Model ID
     */
    public function modelChecker($model_param, $model_id)
    {
        // this variable should be updated whenever there is a new model to be included in anaylitic
        $models = [
            'Job'
        ];
        // this checks if the model format passed from user end is correct
        if (!in_array($model_param, $models)) {

            throw new \Exception("Incorrect format of Model inputted or model not known.");
        } else {
            // maps what table is being used under that Model
            $tableModelMappers = [
                'Job' => 'jobs'
            ];
            // Analytic is polymorph, that is why checking of ID in that table exist with respect to model
            validateInput(
                ['id' => $model_id],
                ['id' => 'exists:'.$tableModelMappers[$model_param].',id'],
                ['exists' => 'No records found under the passed model.']
            );
        }
    }

}
