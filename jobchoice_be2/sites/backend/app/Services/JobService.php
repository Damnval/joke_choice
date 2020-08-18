<?php

namespace App\Services;

use Auth;
use Mail;
use Carbon\Carbon;
use App\Models\Day;
use App\Models\Gallery;
use App\Models\JobWelfare;
use App\Models\Geolocation;
use App\Models\JobQuestion;
use App\Models\JobStrength;
use App\Models\Publication;
use App\Models\NearestStation;
use App\Models\JobReasonsToHire;
use App\Models\JobJobSubCategory;
use App\Models\JobQuestionAnswer;
use App\Repositories\JobChoiceRepository;
use App\Mail\Job\Update\SendCompanyJobApprovalStatus;

class JobService
{

    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */

    public function __construct(JobChoiceRepository $jobChoiceRepository, UploadService $uploadService)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
        $this->uploadService = $uploadService;
    }

    /**
     * Service that gets jobs list for admin management
     * @return Object Jobs Collection
     */
    public function getAdminJobsList()
    {
        $whereInParams = $this->getAllNonDraftJobs();
        return $this->adminJobsList($whereInParams);
    }

    /**
     * Service that appends admin Jobs List jobs that are non-draft and search
     * @param  array   $searchInParams params to search where in
     * @param  boolean $touched        checker if search function was used
     * @return Mixed Collection/Array of Job with its count on applied details
     */
    public function appendAdminJobsList($searchInParams = [], $touched = false)
    {
        $whereInParams = $this->getAllNonDraftJobs();

        if ($touched) {
            $whereInParams = array_intersect($whereInParams, $searchInParams);
        }

        return $this->adminJobsList($whereInParams);
    }

    /**
     * Service that gets the base admin Jobs List with its appends
     * @param  array $whereInParams params to use for where in
     * @return Mixed Collection/Array of Job with its count on applied details
     */
    public function adminJobsList($whereInParams)
    {
        $with = [
            'company',
            'publication'
        ];
        $select = ['id', 'company_id', 'title', 'incentive_per_share', 'employment_type'];

        $jobs = $this->jobChoiceRepository->job()->whereInAndWith(
                                                                    'id',
                                                                    $whereInParams,
                                                                    $with,
                                                                    20,
                                                                    $select
                                                                 );

        return $this->appendJobAppliedCountAndLastApplicant($jobs);
    }

    /**
     * Append job details on how many it was applied and last applicant
     * @param  Object $jobs Job Collections
     * @return Mixed  $jobs Collection/Array of Job with its count on applied details
     */
    public function appendJobAppliedCountAndLastApplicant($jobs)
    {
        foreach ($jobs as $key => $value) {
            $relatedParams = [
                'job_id' => $value['id']
            ];

            $applied_job = $this->jobChoiceRepository->applied_job()->where($relatedParams);
            // append counts for each job and last applied job
            $value['num_applied'] = count($applied_job);
            $value['num_waiting'] = count($applied_job->where('status', 'waiting'));
            $value['num_disclosed'] = count($applied_job->where('disclosed', 1));
            $value['num_hired'] = count($applied_job->where('status', 'success'));
            // resets the keys to the newly sorted collection and gets the first object
            $value['latest_application'] = $applied_job->sortByDesc('created_at')->values()->first();
        }

        return $jobs;
    }

    /**
     * Service that searches jobs given user input request
     * @param  Object $request Input by User
     * @return Mixed  $jobs Collection/Array of Job with its count on applied details
     */
    public function adminJobsListSearch($request)
    {
        $finalWhereInParams = $whereInParams = [];
        $touched = false;
        // Keyword search
        if ($request->keyword) {
            $touched = true;
            $whereInParams[] = $this->jobChoiceRepository->admin_job_search()->keywordSearch($request->keyword)
                                                                             ->pluck('id')
                                                                             ->toArray();
        }
        // Publication search
        if ($request->published_start_date || $request->published_end_date || $request->publication_status) {
            $touched = true;
            $whereInParams[] = $this->getJobIdsOnPublicationParams($request);
        }
        // Disclosed search
        if (isset($request->disclosed)) {
            $touched = true;
            $whereInParams[] = $this->getJobIdsOnDisclosedParams($request);
        }
        // Intersects all results of all search options used
        if ($touched) {
            $finalWhereInParams = arrayIntersectResults($whereInParams);
        }

        return $this->appendAdminJobsList($finalWhereInParams, $touched);
    }

    /**
     * Service that returns job ids based on publication params
     * @param  Object $request input by User
     * @return array  $job_ids array of job ids
     */
    public function getJobIdsOnPublicationParams($request)
    {
        $published_date_params = [
            ['publishable_type', 'Job'],
            ['draft', 0]
        ];

        if ($request->published_start_date) {
            $published_date_params[] = [
                'published_start_date', '>=',$request->published_start_date
            ];
        }

        if ($request->published_end_date) {
            $published_date_params[] = [
                'published_end_date', '<=', $request->published_end_date
            ];
        }

        if ($request->publication_status) {
            $published_date_params[] = ['status', $request->publication_status];
        }

        $job_ids =  $this->jobChoiceRepository->publication()->where($published_date_params)
                                                             ->pluck('publishable_id')
                                                             ->toArray();

        return $job_ids;
    }

    /**
     * Service that returns job ids based on disclosed params
     * @param  Object $request input by User
     * @return array  $job_ids array of job ids
     */
    public function getJobIdsOnDisclosedParams($request)
    {
        $params = [
            'draft' => 0,
            'publishable_type' => 'Job'
        ];
        $published_job_ids = $this->jobChoiceRepository->publication()->where($params)
                                                                      ->pluck('publishable_id')
                                                                      ->toArray();
        $job_ids = [];
        foreach ($published_job_ids as $published_job_id) {
            $params = [
                'job_id' => $published_job_id
            ];

            $applied_jobs = $this->jobChoiceRepository->applied_job()->where($params);
            // applied job counts to determine if the job has disclosed or not
            $undisclosed_count = count($applied_jobs->where('disclosed', 0));
            $applied_jobs_count = count($applied_jobs);
            if ($request->disclosed == 0) {
                if ($undisclosed_count == $applied_jobs_count) {
                    $job_ids[] = $published_job_id;
                }
            } else {
                if ($undisclosed_count != $applied_jobs_count) {
                    $job_ids[] = $published_job_id;
                }
            }
        }

        return $job_ids;
    }

    /**
     * Service that gets all job ids from publications that are non drafted
     * @return array  $job_ids array of job ids
     */
    public function getAllNonDraftJobs()
    {
        $publication_params = [
            'draft' => 0,
            'publishable_type' => 'Job'
        ];

        $job_ids = $this->jobChoiceRepository->publication()->where($publication_params)
                                                            ->pluck('publishable_id')
                                                            ->toArray();

        return $job_ids;
    }

    /**
     * Service that gets all approved jobs by admin
     * @return Object $job collection
     */
    public function approvedJobsList()
    {
        $params = [
            'approval_status' => 'approved'
        ];
        $with = [
            'job_job_sub_categories.job_sub_category.job_category',
            'company.user',
            'hataraki_kata_resource.hataraki_kata',
            'days',
            'geolocation',
            'nearest_station'
        ];

        return $this->jobChoiceRepository->job()->where($params, $with, 20);
    }

    /**
     * Service that logics that saves a job
     * @param Object $request input by user
     */
    public function store($request)
    {
        $request->merge([
            'company_id' => Auth::user()->load('company')->company->id,
        ]);

        $requestData = $request->all();
        // removes job image to be later added after job row is created
        unset($requestData['job_image']);

        $requestData['reference_id'] = $this->generateReferenceId();
        $job = $this->jobChoiceRepository->job()->create($requestData);

        //once the fields in jobs table are saved, start saving other fields in their respected table (with job_id relationsship)
        if ($job) {

            if ($request->job_image) {
                $file_path = $this->saveJobImage($request, $job->id);
                $job_image_params = ['job_image' => $file_path];
                $job = $this->jobChoiceRepository->job()->update($job_image_params, $job->id);
            }

            // Validates depending if job is a draft or not before saving
            if ($request->input('publication')['draft'] == 0) {
                $this->validateNonDraftJobData($request, $job);
            }

            if (isset($request->geolocation)) {
                $this->saveGeolocation($request->geolocation, $job);
            } else {
                $this->saveGeolocation([], $job);
            }

            if (isset($request->nearest_stations) && !empty($request->nearest_stations)) {
                $this->saveNearestStations($request->nearest_stations, $job);
            }

            if (isset($request->hataraki_kata) && !empty($request->hataraki_kata)) {
                $this->saveHatarakiKata($request->hataraki_kata, $job);
            }

            if (isset($request->other_hataraki_kata) && !empty($request->other_hataraki_kata)) {
                $this->saveOtherHatarakiKata($request->other_hataraki_kata, $job);
            }

            if (isset($request->job_strengths) && !empty($request->job_strengths)) {
                $this->saveJobStrengths($request->job_strengths, $job);
            }

            if (isset($request->job_sub_categories) && !empty($request->job_sub_categories)) {
                $this->saveJobSubCategories($request->job_sub_categories, $job);
            }

            if (isset($request->job_questions) && !empty($request->job_questions)) {
                $this->saveJobQuestions($request->job_questions, $job);
            }

            if (isset($request->days) && !empty($request->days)) {
                $this->saveDays($request->days, $job);
            }

            if (isset($request->job_welfares) && !empty($request->job_welfares)) {
                $this->saveJobWelfares($request->job_welfares, $job);
            }

            if (isset($request->job_reasons_to_hire)) {
                $this->saveJobReasonsToHire($request->job_reasons_to_hire, $job);
            }

            if (isset($request->publication)) {
                $this->savePublication($request->publication, $job);
            } else {
                throw new \Exception('Publication Object is missing.');
            }

            $subImagesData = null;
            if (isset($request->sub_image1)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image1', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption1);
            }

            if (isset($request->sub_image2)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image2', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption2);
            }

            if (isset($request->sub_image3)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image3', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption3);
            }
            //saves gallery images to galleries table using morph
            if ($subImagesData) {
                $this->jobChoiceRepository->gallery()->saveMany($subImagesData, $job);
            }
        }

        return $job;
    }

    /**
     * Creates a gallery instance to be saved in galleries
     * @param  string $file_path   where the file was saved in storage
     * @param  string $sub_caption caption of image inputted by user
     * @return Object Gallery
     */
    public function getSubImagesData($file_path, $sub_caption)
    {
        $sub_images_to_save = new Gallery([
            'file_path' => $file_path,
            'caption' => $sub_caption
        ]);

        return $sub_images_to_save;
    }

    /**
     * Saves the sub images file in storage
     * @param  Object $request   Request $request input by client
     * @param  string $sub_image
     * @param  int $job_id
     * @return string            Path where the file was saved
     */
    public function saveInStorageSubImages($request, $sub_image, $job_id)
    {
        //dynamic uploading of image
        //will return file path if image was not changed
        //1st param is Request $request passed by user
        //2nd param is field passed in request
        //3 param is path where to save the image. If not defined it will be saved on Documents folder by default
        //4 params = if specified, all name will saved as this argument, else will save orginal file name.

        $file_path = $request->$sub_image;

        if ($this->is_image($request->input($sub_image))) {
            $file_path = $this->uploadService->uploadImage(
                $request,
                $sub_image,
                'images/job/' . $job_id . '/galleries'
            );
        }

        return $file_path;
    }

    /**
     * Will save the job image in storage
     * @param  Object $request
     * @return String Path where the image was saved.
     */
    public function saveJobImage($request, $job_id)
    {
        //dynamic uploading of image
        //will return file path if image was not changed
        //1st param is Request $request passed by user
        //2nd param is field passed in request
        //3 param is path where to save the image. If not defined it will be saved on Documents folder
        //4 params = if specified, all name will saved as the argument, else will save orginal file name.

        $file_path = $request->job_image;

        if ($this->is_image($request->input('job_image'))) {
            $file_path = $this->uploadService->uploadImage(
                $request,
                'job_image',
                'images/job/' . $job_id,
                'job_image'
            );
        }

        return $file_path;
    }

    /**
     * Check if request data is image file or string
     * @param String $data
     * @return Bool $return
     */
    private function is_image($data)
    {
        $output = false;

        if (preg_match_all('/data\:image\/([a-zA-Z]+)\;base64/', $data)) {
            $output = true;
        }

        return $output;
    }

    /**
    * Store array of hataraki_kata in Hataraki_kata
    * @param  array  $data Hataraki_kata to save
    * @param  Object $job Model of its relationship to save
    */
    public function saveHatarakiKata($hataraki_kata, $job)
    {
        foreach ($hataraki_kata as $key => $value ){
            if (is_null($value['hataraki_kata_id']) || empty($value['hataraki_kata_id'])) {
                throw new \Exception("Hataki kata value is empty");
            }
        }

        $this->jobChoiceRepository->hataraki_kata_resource()->createMany($hataraki_kata, $job);
    }

    /**
    * Store array of hataraki_kata in Other_Hataraki_Kata resource
    * @param  array  $other_hataraki_kata other_hataraki_kata to save
    * @param  Object $job Model of its relationship to save
    */
    public function saveOtherHatarakiKata($other_hataraki_kata, $job)
    {
        foreach ($other_hataraki_kata as $key => $value ){
            if (is_null($value['hataraki_kata_id']) || empty($value['hataraki_kata_id'])) {
                throw new \Exception("Other Hataraki kata value is empty");
            }
        }

        $this->jobChoiceRepository->other_hataraki_kata()->createMany($other_hataraki_kata, $job);
    }

    /**
     * Store array of geolocation in Geolocation
     * @param  array  $data Geolocation to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveGeolocation($geolocation, $job)
    {
        $this->jobChoiceRepository->geolocation()->createMorph($geolocation, $job);
    }

    /**
     * Store array of Nearest Stations in Nearest Stations table
     * @param  array $nearest_station Nearest Stations to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveNearestStations($nearest_stations, $job)
    {
        foreach ($nearest_stations as $nearest_station => $value) {
            $data[] = new NearestStation([
                'station' => $value['station'],
                'transportation' => $value['transportation'],
                'time_duration' => $value['time_duration']
            ]);
        }

        $this->jobChoiceRepository->nearest_station()->saveMany($data, $job);
    }

    /**
     * Store array of Job strength in job_strengths table
     * @param  array $job_strengths Job Strengths to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveJobStrengths($job_strengths, $job)
    {
        $data = [];

        foreach ($job_strengths as $job_strength => $value) {
            $data[] = new JobStrength([
                'item' => $value['item'],
                'description' => $value['description']
            ]);
        }

        $this->jobChoiceRepository->job_strength()->saveMany($data, $job);
    }

    /**
     * Store array of Job sub categories in job_job_sub_categories table
     * job_job_sub_categories is a look up table for jobs and job_sub_categories
     * @param  array $job_categories Job Categories to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveJobSubCategories($job_sub_categories, $job)
    {
        $data = [];

        foreach ($job_sub_categories as $job_sub_category => $value) {
            $data[] = new JobJobSubCategory([
                'job_sub_category_id' => $value['job_sub_category_id']
            ]);
        }

        $this->jobChoiceRepository->job_job_sub_category()->saveMany($data, $job);
    }

    /**
     * Store array of day in Days
     * @param  array  $data Days to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveDays($days, $job)
    {
        $data = [];

        foreach ($days as $day => $value) {
            $data[] = new Day([
                'day' => $value,
            ]);
        }

        $this->jobChoiceRepository->day()->saveMany($data, $job);
    }

    /**
     * Store array of welfares in job_welfare
     * @param  array $welfares Welfares to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveJobWelfares($welfares, $job)
    {
        $data = [];

        foreach ($welfares as $welfare => $value) {
            $data[] = new JobWelfare([
                'name' => $value,
            ]);
        }

        $this->jobChoiceRepository->job_welfare()->saveMany($data, $job);
    }

    /**
     * Store array of reasons to hire in job_reasons_to_hire
     * @param  array $job_reasons_to_hire Welfares to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveJobReasonsToHire($job_reasons_to_hire, $job)
    {
        $data = [];

        foreach ($job_reasons_to_hire as $job_reasons_to_hire => $value) {
            if (!empty($value)) {
               $data[] = new JobReasonsToHire([
                    'reason' => $value,
                ]);
            }
        }

        if (count($data) > 0){
            $this->jobChoiceRepository->job_reason_to_hire()->saveMany($data, $job);
        }
    }

    /**
     * Store array of job questions in job_questions
     * @param  array $job_questions Job Questions to save
     * @param  Object $job Model of its relationship to save
     */
    public function saveJobQuestions($job_questions, $job)
    {
        $data = [];

        //loop each job question with their correspoding answers and save them by batch
        foreach ($job_questions as $job_question => $value) {
            $data = [
                    'question' => $value['question'],
                    'answer_type' => $value['answer_type'],
                    'required_answer' => $value['required_answer'],
                    'job_id' => $job->id
                ];
            //saves the job question
            $job_question = $this->jobChoiceRepository->job_question()->create($data);
            //if job question answer is not free text
            if (isset($value['answers']) && count($value['answers']) > 0) {
                $result = isFieldArrayNull($value['answers']);

                if (!$result) {
                    $answer_data = [];
                    foreach ($value['answers'] as $key => $answer ) {
                        $answer_data[] = new JobQuestionAnswer([
                            'answer' => $answer,
                        ]);
                    }

                    $this->jobChoiceRepository->job_question_answer()->saveMany($answer_data, $job_question);
                }
            }
            //for duplicating job questions answers with the same method above but since accessing of key is
            //different from create job and duplicate job and is using relationhips
            if (isset($value['job_question_answers'])) {
                $answer_data = [];
                foreach ($value['job_question_answers'] as $key => $answer ) {
                    $answer_data[] = new JobQuestionAnswer([
                        'answer' => $answer['answer'],
                    ]);
                }

                $this->jobChoiceRepository->job_question_answer()->saveMany($answer_data, $job_question);
            }
        }
    }

    /**
    * Store publication in Publications table
    * @param  array  $publication publication to save
    * @param  Object $job Model of its relationship to save
    */
    public function savePublication($publication, $job)
    {
        validateInput($publication, Publication::createRules());
        $this->jobChoiceRepository->publication()->createMorph($publication, $job);

    }

    /**
     * Update array of geolocation in Geolocation
     * @param  array  $data Geolocation to update
     * @param  Object $job Model of its relationship to update
     */
    public function updateGeolocation($geolocation, $job)
    {
        $this->jobChoiceRepository->geolocation()->updateMorph($geolocation, $job);
    }

    /**
     * Update array of publication in Publication
     * @param  array  $publication Publication to update
     * @param  Object $job Model of its relationship to update
     */
    public function updatePublication($publication, $job)
    {
        validateInput($publication, Publication::createRules());
        $this->jobChoiceRepository->publication()->updateMorph($publication, $job);
    }

    /**
     * Delete job questions answers' in job_question_answer and objects associated to it
     * @param  Object job_questions collection models of job_question_answers to delete
     */
    public function deleteJobQuestionAnswer($job_questions)
    {
        foreach ($job_questions as $job_question_key => $job_question_model) {

            // deletes all job question's choices of answers and all job question job seeker answer table associated to it
            foreach ($job_question_model->job_question_answers as $job_question_answer_key => $job_question_answer_model) {
                $this->jobChoiceRepository->job_question_job_seeker_answer()->deleteMany($job_question_answer_model);
            }

            // deletes all free text answers in job question job seeker answer table
            $this->jobChoiceRepository->job_question_job_seeker_answer()->deleteMany($job_question_model);
            // deletes all job questions
            $this->jobChoiceRepository->job_question_answer()->deleteMany($job_question_model);
        }

    }

    /**
     * Service that gets specific job
     * @param int $id
     * @return Object Job Collection
     */
    public function show($id)
    {
        return $this->jobChoiceRepository->job()->show($id);
    }

    /**
     * Dynamic function that returns job ids based on the searched fields in geolocation table
     * @param  String $key
     * @param  String $value
     * @return array Array of job ids
     */
    public function searchUnderGeolocationFields($key, $value)
    {
        $params = [
            [$key, 'like', '%' .$value. '%'],
            ['taggable_type', '=', 'Job']
        ];
        return $this->jobChoiceRepository->geolocation()->where($params)->pluck('taggable_id')->toArray();
    }

    /**
     * Find Jobs by using key words
     * @param  String $value String of key words
     * @return Object Collection of jobs
     */
    public function keyWordSearch($value)
    {
        $job_ids = $this->jobChoiceRepository->job_search()->keywordSearch($value)->pluck('id')->toArray();

        return $job_ids;
    }

    /**
     * Service that returns a collection of jobs
     * @param array $whereInParams
     * @param array $whereBetweenParams
     * @return Object Job collection
     */
    public function jobSearch($whereInParams, $whereBetweenParams, $hataraki_kata_special_case_query)
    {
        $with = [
                    'job_job_sub_categories.job_sub_category.job_category',
                    'company.user',
                    'hataraki_kata_resource.hataraki_kata',
                    'days',
                    'geolocation',
                    'nearest_station'
                ];

        return $this->jobChoiceRepository->job()->hybridWhere(
                                                    'id',
                                                    $whereInParams,
                                                    'salary',
                                                    $whereBetweenParams,
                                                    $with,
                                                    20,
                                                    $hataraki_kata_special_case_query
                                                );
    }

    /**
     * Service that returns a collection of matching jobs based on job seeker's hatakari_kata
     * @return Object Job collection
     */
    public function userMatchingJobs()
    {
        $user = $this->jobChoiceRepository->user()->show(Auth::id());

        if ($user->type != 'job_seeker') {
            throw new \Exception('Only Job seekers can see matching ratio to jobs.');
        }

        $jobs = $this->jobChoiceRepository->job()->matchingJobsWithRatio($user->job_seeker->id, 20);

        return $jobs;
    }

    /**
     * Service logic to remove Job from resource
     * @param int $id Input by user
     * @return boolean Job successfully deleted
     */
    public function delete($id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to delete.');
        }

        $job = $this->jobChoiceRepository->job()->show($id);

        if (Auth::id() != $job->company->user_id) {
            throw new \Exception('You don\'t have permission to delete this job.');
        }

        $job = $this->jobChoiceRepository->job()->destroy($id);

        if (!$job) {
            throw new \Exception('Job doesn\'t exist.');
        }

        return $job;
    }

    /**
     * Service logic to update Job from resource
     * @param int $id Input by user
     */
    public function update($request, $id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to update.');
        }

        $job = $this->jobChoiceRepository->job()->show($id);

        if (Auth::id() != 1) {
            if (Auth::id() != $job->company->user_id) {
                throw new \Exception('You don\'t have permission to update this job.');
                }
        }

        $requestData = $request->all();
        $file_path = null;
        if ($request->job_image) {
            $file_path = $this->saveJobImage($request, $id);
        }

        $requestData['job_image'] = $file_path;
        $requestData['approval_status'] = 'waiting';

        $job = $this->jobChoiceRepository->job()->update($requestData, $id);

        if ($job) {
            // Validates depending if job is a draft or not before updating
            if ($request->input('publication')['draft'] == 0) {
                $this->validateNonDraftJobData($request, $job);
            }

            if (isset($request->geolocation)) {
                $this->updateGeolocation($request->geolocation, $job);
            }

            if (isset($request->nearest_stations)) {
                $this->jobChoiceRepository->nearest_station()->deleteMany($job);
                $this->saveNearestStations($request->nearest_stations, $job);
            }

            if (isset($request->hataraki_kata)) {
                $this->jobChoiceRepository->hataraki_kata_resource()->deleteMany($job);
                $this->saveHatarakiKata($request->hataraki_kata, $job);
            }

            if (isset($request->other_hataraki_kata)) {
                $this->jobChoiceRepository->other_hataraki_kata()->deleteMany($job);
                $this->saveOtherHatarakiKata($request->other_hataraki_kata, $job);
            }

            if (isset($request->job_strengths)) {
                $this->jobChoiceRepository->job_strength()->deleteMany($job);
                $this->saveJobStrengths($request->job_strengths, $job);
            }

            if (isset($request->job_sub_categories)) {
                $this->jobChoiceRepository->job_job_sub_category()->deleteMany($job);
                $this->saveJobSubCategories($request->job_sub_categories, $job);
            }

            if (isset($request->job_questions)) {
                $this->deleteJobQuestionAnswer($job->job_questions);
                $this->jobChoiceRepository->job_question()->deleteMany($job);
                $this->saveJobQuestions($request->job_questions, $job);
            }

            if (isset($request->days)) {
                $this->jobChoiceRepository->day()->deleteMany($job);
                $this->saveDays($request->days, $job);
            }

            if (isset($request->job_welfares) && !empty($request->job_welfares)) {
                $this->jobChoiceRepository->job_welfare()->deleteMany($job);
                $this->saveJobWelfares($request->job_welfares, $job);
            }

            if (isset($request->job_reasons_to_hire)) {
                $this->jobChoiceRepository->job_reason_to_hire()->deleteMany($job);
                $this->saveJobReasonsToHire($request->job_reasons_to_hire, $job);
            }

            if (!isset($request->publication)) {
                throw new \Exception('Publication object is missing.');
            } else {
                $this->updatePublication($request->publication, $job);
            }

            $subImagesData = null;
            if (isset($request->sub_image1)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image1', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption1);
            }

            if (isset($request->sub_image2)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image2', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption2);
            }

            if (isset($request->sub_image3)) {
                $file_path = $this->saveInStorageSubImages($request, 'sub_image3', $job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $request->sub_caption3);
            }

            //saves gallery images to galleries table using morph
            if ($subImagesData) {
                $this->jobChoiceRepository->gallery()->deleteMany($job);
                $this->jobChoiceRepository->gallery()->saveMany($subImagesData, $job);
            }
        }

        return $job;
    }

    /**
     * Service logic that generates a unique reference ID to the newly created job
     * @return string $reference_id newly created job's reference id
     */
    public function generateReferenceId()
    {
        do {
            $reference_id = date('Y').mt_rand(100000, 999999);
            
            $params = [
                'reference_id' => $reference_id
            ];

            $job = $this->jobChoiceRepository->job()->whereFirst($params);
        } while ($job);

        return $reference_id;
    }

    /**
     * Service logic that returns details needed for a company's job
     * @param int $id job id
     * @return $job resource
     */
    public function companyJobDetails($id)
    {
        $auth_company_id = Auth::user()->company->id;
        $company_id = $this->jobChoiceRepository->job()->show($id)->company_id;

        if ($auth_company_id != $company_id) {
            throw new \Exception('Unauthorized access or job does not exist.');
        }

        $params = ['jobs.id' => $id];
        $relatedParams = ['job_id' => $id];

        $shared_job = $this->jobChoiceRepository->shared_job()->where($relatedParams);
        $applied_job = $this->jobChoiceRepository->applied_job()->where($relatedParams);
        $job = $this->jobChoiceRepository->job()->companyJobDetails($params);

        $job['num_shares'] = count($shared_job);
        $job['num_applied'] = count($applied_job);
        $job['num_waiting'] = count($applied_job->where('status', 'waiting'));
        $job['num_disclosed'] = count($applied_job->where('disclosed', 1));
        $job['num_hired'] = count($applied_job->where('status', 'success'));

        return $job;
    }

    /**
     * Service that sends a dynamic email to admin that relates to jobs
     * @param string $topic Topic of email
     * @param string $action updated, created
     * @param Object $job
     */
    public function sendAdminEmail($topic, $action,  $job)
    {
        if (!$job) {
            throw new \Exception('Job does not exist, sending of email cancelled.');
        }

        $company = $job->company;
        $geolocation = $job->geolocation;
        $params = [
            'type' => 'admin'
        ];


        $admin = $this->jobChoiceRepository->user()->whereFirst($params)->toArray();

        Mail::send('emails.adminJob', ['company' => $company,'geolocation' => $geolocation, 'admin' => $admin, 'job' => $job, 'action' => $action],
                   function ($message) use ($topic, $admin) {
            $message->from("No-reply@notifications.com", " ");
            //will change to jobchoice@mediaflag.co.jp
            $message->to($admin['email'])->subject($topic);
        });
    }


    /**
     * Service that sends a dynamic email to company that relates to approval status
     * @param object $request request user client input
     * @param int $job_id id of job
     */
    public function sendCompanyEmailApprovalStatus($request, $job_id)
    {
        $approval_status = $request->approval_status;
        $params = [
            'id' => $job_id
        ];

        $job = $this->jobChoiceRepository->job()->whereFirst($params);

        $subject = ($request->approval_status == 'approved')?'【JOBチョイス：通知】作成した求人ページが承認されました。': '【JOBチョイス：通知】作成した求人ページが差し戻しされました';

        //Sends an email to company whether job is approved or rejected by company
        Mail::send(new SendCompanyJobApprovalStatus($approval_status, $job, $subject));
    }

   /**
    * Service and Logic to update approval_status field in applied jobs table
    * @param  Object $request User input
    * @return Boolean If updated was successful or not
    */
    public function approveCompanyJob($request, $job_id)
    {
        $param = [
            'id' => $job_id
        ];

        $toUpdate = [
            'approval_status' => $request->approval_status
        ];

        if (!isset($request->approval_status)){
            throw new \Exception('Please choose approval status.');
        }
        $result = $this->jobChoiceRepository->job()->updateWhere($toUpdate, $param);
        if (!$result) {
            throw new \Exception('Job does not exist');
        }

    }

    /**
     * Function that duplicates an existing job
     * @param  Object $request User Input
     * @return Object $duplicate_job Job Collection
     */
    public function duplicateJob($request)
    {
        $auth_company_id = Auth::user()->company->id;
        $job_data = $this->jobChoiceRepository->job()->show($request->job_id)->toArray();

        if (!$job_data) {
            throw new \Exception('Job to duplicate does not exist.');
        }
        
        if ($job_data['company_id'] != $auth_company_id) {
            throw new \Exception('You are unauthorized to duplicate this job.');
        }        
        // generates a new reference id
        $job_data['reference_id'] = $this->generateReferenceId();
        // sets the job's title as a copied job and approval status to waiting
        $job_data['approval_status'] = 'waiting';
        $job_data['title'] = $job_data['title'] . ' - COPY';
        $duplicate_job = $this->jobChoiceRepository->job()->create($job_data);

        if (!$duplicate_job) {
            throw new \Exception('Failed to duplicate job.');
        }

        // duplicates image and updates the job_image field of the newly duplicated job
        $file_path = (isset($job_data['job_image'])) ? $this->duplicateJobImage($job_data, $duplicate_job->id) : NULL;
        $job_image_params = ['job_image' => $file_path];
        $duplicate_job = $this->jobChoiceRepository->job()->update($job_image_params, $duplicate_job->id);

        $this->saveGeolocation($job_data['geolocation'], $duplicate_job);
        $this->saveHatarakiKata($job_data['hataraki_kata_resource'], $duplicate_job);
        $this->saveOtherHatarakiKata($job_data['other_hataraki_kata'], $duplicate_job);
        $this->saveJobQuestions($job_data['job_questions'], $duplicate_job);

        if (!isFieldArrayNull($job_data['nearest_station'])) {
            $this->saveNearestStations($job_data['nearest_station'], $duplicate_job);
        }

        if (!isFieldArrayNull($job_data['job_strengths'])) {
            $this->saveJobStrengths($job_data['job_strengths'], $duplicate_job);
        }

        if (!isFieldArrayNull($job_data['job_job_sub_categories'])) {
            $this->saveJobSubCategories($job_data['job_job_sub_categories'], $duplicate_job);
        }
        // set publication of newly duplicated job to private and draft status
        $job_data['publication']['draft'] = '1';
        $job_data['publication']['status'] = 'private';
        $this->savePublication($job_data['publication'], $duplicate_job);

        if (!isFieldArrayNull($job_data['days'])) {
            foreach ($job_data['days'] as $key => $value) {
                $days_data[$key] = $value['day'];
            }

            $this->saveDays($days_data, $duplicate_job);
        }

        if (!isFieldArrayNull($job_data['job_welfares'])) {
            foreach ($job_data['job_welfares'] as $key => $value) {
                $job_welfares_data[$key] = $value['name'];
            }

            $this->saveJobWelfares($job_welfares_data, $duplicate_job);
        }

        if (!isFieldArrayNull($job_data['job_reasons_to_hire'])) {
            foreach ($job_data['job_reasons_to_hire'] as $key => $value) {
                $job_reasons_to_hire_data[$key] = $value['reason'];
            }

            $this->saveJobReasonsToHire($job_reasons_to_hire_data, $duplicate_job);
        }

        if (!isFieldArrayNull($job_data['galleries'])) {
            $subImagesData = [];
            foreach ($job_data['galleries'] as $key => $value) {
                $file_path = $this->duplicateInJobSubImage($value, $duplicate_job->id);
                $subImagesData[] = $this->getSubImagesData($file_path, $value['caption']);
            }

            if ($subImagesData) {
                $this->jobChoiceRepository->gallery()->saveMany($subImagesData, $duplicate_job);
            }
        }

        return $duplicate_job;
    }

    /**
     * Function that uses the job image path file and copies it to the new job's folder
     * @param  array  $job_data           data of the job to be copied
     * @param  int    $duplicate_job_id   id of the newly duplicated job
     * @return string $file_path          file path of the newly duplicated job
     */
    public function duplicateJobImage($job_data, $duplicate_job_id)
    {
        // default image if job image was not found
        $file_path = config('app.staging_url') . '/images/seeder/job-avatar.jpg';

        $image_path_array = explode('/', $job_data['job_image']);
        $image_name = end($image_path_array);
        $job_image = public_path('/images/job/' . $job_data['id'] . '/' . $image_name);

        if (file_exists($job_image)) {
            $file_path = $this->uploadService->copyImage(
                $job_image,
                'images/job/' . $duplicate_job_id,
                $image_name
            );
        }

        return $file_path;
    }

    /**
     * Function that uses the job sub image path and file and copies it to the new job's folder
     * @param array   $gallery           data of the job's gallery to be copied
     * @param int     $duplicate_job_id  id of the newly duplicated job
     * @return string $file_path         file path of the newly duplicated job
     */
    public function duplicateInJobSubImage($gallery, $duplicate_job_id)
    {
        // default image if job sub image was not found
        $file_path = config('app.staging_url') . '/images/seeder/job-avatar.jpg';

        $image_path_array = explode('/', $gallery['file_path']);
        $image_name = end($image_path_array);
        $job_image = public_path('/images/job/' . $gallery['job_id'] . '/galleries/' . $image_name);

        if (file_exists($job_image)) {
            $file_path = $this->uploadService->copyImage(
                $job_image,
                'images/job/' . $duplicate_job_id . '/galleries',
                $image_name
            );
        }

        return $file_path;
    }

    /**
     * Job further search
     * @param  Object $request User Input
     * @return Colelction      Searched Job results
     */
    public function search($request)
    {
        $whereParams =
        $whereInParams =
        $finalWhereInParams =
        $whereBetweenParams =
        $toIntersect =
        $hataraki_kata_special_case_query = [];
        // boolean checker if field has passed a parameter but return 0 results
        // once 0, and since we are using && on search, it will automatically return 0 results
        $touched_whereIn =
        $touched_where =
        $touched_whereBetween = false;

        // limits results to only show approved jobs
        $whereParams[] = ['approval_status', '=', 'approved'];
        // gather all where params
        if (isset($request->title)){
            $touched_where = true;
            $whereParams[] = ['title', 'like', '%' .$request->title. '%'];
        }

        if (isset($request->no_days_week)){
            $touched_where = true;
            $whereParams[] = ['no_days_week', '=', $request->no_days_week];
        }

        if (isset($request->end_time)){
            $touched_where = true;
            $whereParams[] = ['end_time', 'like', Carbon::parse($request->end_time)->format('H:i').'%'];
        }

        if (isset($request->start_time)){
            $touched_where = true;
            $whereParams[] = ['start_time', 'like', Carbon::parse($request->start_time)->format('H:i').'%'];
        }

        if (isset($request->employment_type)){
            $touched_where = true;
            $whereParams[] = ['employment_type', '=', $request->employment_type];
        }

        if (isset($request->employment_period)){
            $touched_where = true;
            $whereParams[] = ['employment_period', '=', $request->employment_period];
        }
        // Query first all jobs with where params
        $job_ids_from_where = $this->getJobSearchedUsingWhere($whereParams);
        // Initialize job_ids
        $whereInParams[] = $job_ids_from_where;

        if (isset($request->salary)){
            $touched_whereBetween = true;
            $whereBetweenParams[] = [$request->salary['min'], $request->salary['max']];
        }

        // gather all whereIn params
        if (isset($request->days)){
            // days is always isset because front ent passed an array, though empty
            if (count($request->days) > 0) {
                $touched_whereIn = true;
                $days = $this->jobChoiceRepository->day()->whereIn('day', $request->days);
                $whereInParams[] = array_unique($days->pluck('job_id')->toArray());
            }
        }

        if (isset($request->complete_address)){
            $touched_whereIn = true;
            $whereInParams[] = $this->searchUnderGeolocationFields('complete_address', $request->complete_address);
        }

        // used for jobs page search. not included in further search.
        if (isset($request->job_category_id)){
            $touched_whereIn = true;
            $whereInParams[] = $this->getJobsBasedOnJobCategory($request->job_category_id);
        }

        // used for jobs page search. not included in further search.
        if (isset($request->prefectures)){
            $touched_whereIn = true;
            $whereInParams[] = $this->searchUnderGeolocationFields('prefectures', $request->prefectures);
        }

        //multiple keyword search
        if (isset($request->keyword)){
            $touched_whereIn = true;
            $whereInParams[] = $this->keyWordSearch($request->keyword);
        }

        if (isset($request->hataraki_kata_id)){
            // hataraki_kata_id is always isset because front ent passed an array, though empty
            if (count($request->hataraki_kata_id) > 0) {
                $hataraki_kata_special_case_query = $this->getJobsThatHasThisHarakiKata($request);
            }

        }

        if (!$touched_whereIn && !$touched_where && !$touched_whereBetween) {
            // logged in job seekers jobs list in descending order based on matching ratio if search params are empty
            if (count($hataraki_kata_special_case_query) == 0 && $request->job_seeker_id) {
                return $this->jobChoiceRepository->job()->matchingJobsWithRatio(
                                                            $request->job_seeker_id,
                                                            20
                                                        );
            }

            if (count($hataraki_kata_special_case_query) == 0) {
                return $this->approvedJobsList();
            } 
        }

        $finalWhereInParams = arrayIntersectResults($whereInParams);

        $searchedJobs = $this->jobSearch(
            $finalWhereInParams,
            $whereBetweenParams,
            $hataraki_kata_special_case_query
        );
        // logged in job seekers searched jobs list in descending order based on matching ratio
        if ($request->job_seeker_id) {
            return $this->jobChoiceRepository->job()->matchingJobsWithRatio(
                                                        $request->job_seeker_id,
                                                        20,
                                                        null,
                                                        'id',
                                                        $searchedJobs->pluck('id')->toArray()
                                                    );
        } 

        return $searchedJobs;
    }

    /**
     * Get all job ids that matched the hataraki kata passed in the search field
     * @param  Object $request Clinet user input
     * @return  $hataraki_kata_special_case_query
     */
    public function getJobsThatHasThisHarakiKata($request)
    {
        $where = [
            'taggable_type' => 'Job'
        ];
        $hataraki_katas = $this->jobChoiceRepository->hataraki_kata_resource()->whereWhereIn($where, 'hataraki_kata_id', $request->hataraki_kata_id);
        // hataraki_kata_special_case_query is a special query that uses OR in where statement instead of AND
        // e.g. select * from jobs where title = {title} and (id in [hataraki_kata_special_case_query])
        $hataraki_kata_special_case_query =
        array_unique($hataraki_katas->pluck('taggable_id')->toArray());

        return $hataraki_kata_special_case_query;
    }

    public function getJobSearchedUsingWhere($where)
    {
        $job_ids = $this->jobChoiceRepository->job()->where($where)->pluck('id')->toArray();
        return $job_ids;
    }

    /**
     * get all jobs based on job category
     * @param  int $job_category_id Job Category id to be search
     * @return Array $job_ids Job ids that belongs to the job category id passed
     */
    public function getJobsBasedOnJobCategory($job_category_id)
    {
        $params = [
            'job_category_id' => $job_category_id
        ];

        $job_sub_category_ids = $this->jobChoiceRepository
                                    ->job_sub_category()
                                    ->where($params)
                                    ->pluck('id')
                                    ->toArray();

        $job_ids = $this->jobChoiceRepository
                        ->job_job_sub_category()
                        ->whereIn('job_sub_category_id', $job_sub_category_ids)
                        ->pluck('job_id');

        return array_unique($job_ids->toArray());
    }

    /**
     * Validates a non draft job's input for saving or updating
     * @param  Object $request Input by User
     */
    public function validateNonDraftJobData($request)
    {
        if (isset($request->geolocation)) {
            validateInput($request->geolocation,
                          array_merge(Geolocation::createRules(), ['complete_address' => 'required|max:100'])
            );
        } else {
            throw new \Exception('Please input geolocation values.');
        }

        if (isset($request->nearest_stations) && !empty($request->nearest_stations)) {
            foreach ($request->nearest_stations as $nearest_station => $value) {
                validateInput($value, NearestStation::createRules());
            }
        } else {
            throw new \Exception('Please input nearest station values.');
        }

        if (isset($request->hataraki_kata)) {
            if (count($request->hataraki_kata) != 4) {
                throw new \Exception("Please choose four Hataraki kata.");
            }
        } else {
            throw new \Exception('Please input Hataraki Kata values.');
        }

        if (isset($request->job_strengths)) {
            foreach ($request->job_strengths as $job_strength => $value) {
                validateInput($value, JobStrength::createRules());
            }
        }

        if (!isset($request->job_sub_categories)) {
            throw new \Exception('Please select Job categories');
        }

        if (isset($request->job_questions)) {
            foreach ($request->job_questions as $job_question => $value) {
                validateInput($value, JobQuestion::createRules());
            }
        }
    }

    /**
     * As admin it requires applied_job counts on getting job offer details
     * @param  Int $job_id
     * @return Array Counts of applied_jobs with different statuses
     */
    public function getAppliedCountInJobOfferDetail($job_id)
    {
        $params = [
            'job_id' => $job_id
        ];

        $applied_jobs =  $this->jobChoiceRepository->applied_job()->where($params);
        $result['number_of_applicants'] = count($applied_jobs);
        $result['number_of_undisclosed'] = count($applied_jobs->where('status', 'waiting'));
        $result['number_of_rejected'] = count($applied_jobs->where('status', 'rejected'));
        $result['number_of_disclosed'] = count($applied_jobs->where('disclosed', 1));

        return $result;
    }

}
