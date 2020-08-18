<?php

namespace App\Services;

Use Illuminate\Support\Facades\Response;
use App\Repositories\JobChoiceRepository;
use Auth;

class NoteService
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
     * Logics and functions in saving Notes
     * @return Object $note Note Collection
     */
    public function index()
    {
        return $this->jobChoiceRepository->note()->all();
    }

    /**
     * Logics and functions in saving Note
     * @param  Object $request input by user
     * @return Object $note Note resource
     */
    public function store($request)
    {
        $params = [
            'taggable_type' => $request->taggable_type,
            'taggable_id' => $request->taggable_id,
        ];
        
        $note = $this->jobChoiceRepository->note()->whereFirst($params);

        if ($note) {
            throw new \Exception('Note already existing.');
        } 

        $note = $this->jobChoiceRepository->note()->create($request->all());
        
        return $note;
    }

     /**
     * Service logic to update Note from resource
     * @param Object $request Input by user
     * @param int $id Input by user
     * @return Object $note Note resource
     */
    public function update($request, $id)
    {
        if (!$id) {
            throw new \Exception('Needs a parameter ID to update.');
        }

        $requestData = $request->all();
    
        $note = $this->jobChoiceRepository->note()->update($requestData, $id);
        
        return $note;
    }

     /**
     * Service to retrieve job seekers notes
     * @param Object $job_seeker
     * @return array $notes array of different applied jobs notes
     */
    public function getJobSeekerAppliedJobNotes($job_seeker)  
    {
        $applied_jobs = $this->getAllappliedJobs($job_seeker);

        $notes = [];
        foreach ($applied_jobs as $applied_job) {
            if ($applied_job->note) {
                $notes[] = $applied_job->note;
            }
        }

        return $notes;
    }

    /**
     * Service to retreive all applied jobs of job seeker 
     * @param  Object $job_seeker
     * @return Object Applied job collection
     */
    public function getAllappliedJobs($job_seeker)
    {
        $params = [
           'job_seeker_id' => $job_seeker->id
        ];

       return $this->jobChoiceRepository->applied_job()->where($params);
    }
}
