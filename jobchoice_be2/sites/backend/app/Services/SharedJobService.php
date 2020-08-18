<?php

namespace App\Services;

use Mail;
use Auth;
use App\Repositories\JobChoiceRepository;

class SharedJobService
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
   * Logics and functions in saving Shared Job
   * @param  Object $request input by user
   */
  public function store($request)
  {
      $params = [
          'href' => $request->href
      ];

      $shared_job = $this->jobChoiceRepository->shared_job()->where($params);

      if ($shared_job->isEmpty()) {
          list($user_slug_value, $job_slug_value, $provider) = $this->explodeHref($request->href);
          $user_slug = $this->getSlug($user_slug_value);
          $job_slug = $this->getSlug($job_slug_value);

          $params = [
              'slug_id'     => $user_slug->id,
              'job_id'      => $job_slug->sluggable_id,
              'provider_id' => $provider->id,
              'href'        => $request->href,
          ];

          $shared_job = $this->jobChoiceRepository->shared_job()->create($params);
      }
  }

  /**
   * Logic that explodes and retrieves the slugs to be queried
   * @param  string $href input by user
   * @return array $user_slug_value, $job_slug_value
   */
  public function explodeHref($href)
  {
      if (strpos($href, '?') == true ) {
          $hrefJobchoice = explode('?', $href);
          $href = current($hrefJobchoice);
      }

      $hrefArray = explode('/', $href);
      $slugs = end($hrefArray);
      $slugArray = explode('.', $slugs);

      $user_slug_value = $slugArray[0];
      $job_slug_value = $slugArray[1];
      $provider = null;
      if (isset($slugArray[2])) {
          $provider = $this->getProvider($slugArray[2]);
      }

      return [$user_slug_value, $job_slug_value, $provider];
  }

  /**
   * Dynamic Logic that retrieves slug based on given value
   * @param  string $slug_value
   * @return Object $slug
   */
  public function getSlug($slug_value)
  {
      $params = [
          'value' => $slug_value
      ];

      $slug = $this->jobChoiceRepository->slug()->whereFirst($params);

      if (!$slug) {
          throw new \Exception('Slug does not exist.');
      }

      return $slug;
  }

  /**
   * Logic that retrieves provider id based on given provider name
   * @param  string $provider input by user
   * @return Object $provider
   */
  public function getProvider($data)
  {
      $params = [
          'name' => $data,
      ];

      $provider = $this->jobChoiceRepository->provider()->whereFirst($params);

      if ($provider) {
          return $provider;
      }
      throw new \Exception('Provider not registered in Database.');
  }

  /**
   * Generates a link to be used in sharing in social medias
   * Dynamic method, can generate using admin or user account
   * @param Object $request
   * @return String href format
   */
  public function generateLink($request)
  {
  	if (Auth::user()->type = 'job_seeker') {
		$user_id = Auth::user()->id;
  	} else {
  		$user_id = $request->user_id;
  	}

	$user = $this->jobChoiceRepository->user()->show($user_id);
  	$user_slug = $this->jobChoiceRepository->slug()->getMorph($user);

	$job = $this->jobChoiceRepository->job()->show($request->job_id);
  	$job_slug = $this->jobChoiceRepository->slug()->getMorph($job);

  	$link = config('app.url') . '/job-share/' . $user_slug->value . '.' . $job_slug->value;

  	return $link;
  }

  /**
   * Logic that decrypts href link and returns the job seeker and job ids
   * @param Object $request
   * @return array $job_seeker->id, $job_id
   */
  public function decryptHref($request)
  {
      list($user_slug_value, $job_slug_value, $provider) = $this->explodeHref($request->href);
      //Getting job_seeker_id
      $user_slug = $this->getSlug($user_slug_value);

      $params = [
          'user_id' => $user_slug->sluggable_id, // this is user_id
      ];

      $job_seeker = $this->jobChoiceRepository->job_seeker()->whereFirst($params);

      //Getting job_id
      $job_slug = $this->getSlug($job_slug_value);

      //Getting shared_job_id
      $shared_job_params = [
          'slug_id' => $user_slug->id,
          'job_id' => $job_slug->sluggable_id,
          'provider_id' => $provider->id
      ];

      $shared_job = $this->jobChoiceRepository->shared_job()->whereFirst($shared_job_params);

      $shared_job_id = null;
      if ($shared_job) {
          $shared_job_id = $shared_job->id;
      }
      //job_seeker_id, job_id, shared_job_id
      return [$job_seeker->id, $job_slug->sluggable_id, $shared_job_id];
  }

  /**
   * Logic that creates email and sends it to the specified users
   * @param Object $request
   * @return boolean
   */
  public function shareEmail($request)
  {
      $email = $request->all();

      $user = $this->jobChoiceRepository->user()->show($email['user_id']);

      Mail::send('emails.shareEmail', ['email' => $email], function ($message) use ($email) {
          $message->from(config('app.job_choice_email'));
          $message->to($email['to'])->subject($email['subject']);
      });

      if(Mail::failures()) {
          return false;
      }

      return true;
  }

  /**
   * Logic that returns the top ten shared jobs and only specific fields
   * @return Object $top_ten_shared_jobs
   */
  public function topTenSharedJobs()
  {
      // to search that only jobs has been approved.
      $whereHasData = [
          ['approval_status', '=', 'approved']
      ];

      $top_ten_shared_jobs = $this->jobChoiceRepository->shared_job()
                                                       ->selectGroupBy('job_id', 'job_id', 'job', $whereHasData, 'DESC', 10);
      // map only the fields to be returned
      $top_ten_shared_jobs = $top_ten_shared_jobs->map(function ($item) {
          return [
              'id'          => $item->job_id,
              'no_shares'   => $item->num,
              'title'       => $item->job->title,
              'description' => $item->job->description,
              'job_image'   => $item->job->job_image
          ];
      });

      return $top_ten_shared_jobs;
  }

  /**
   * Logic that gets shared jobs of a specific user by using its slug
   * @param Object $request input by user
   * @return Object $shared_jobs Shared job resource
   */
  public function userSharedJobs($request)
  {
      $whereHasField = null;
      $whereHasData = $dates = [];
      $user = $this->jobChoiceRepository->user()->show(Auth::id());
      $params = [
          'slug_id' => $user->slug->id
      ];

      if ($request->disclosed) {
          $whereHasField = 'applied_job';
          $whereHasData = [
              'disclosed' => $request->disclosed
          ];
      }

      $with = [
          'applied_job' => function($query) use ($whereHasData){
              $query->select('id', 'shared_job_id', 'status', 'disclosed', 'job_seeker_id', 'updated_at')
                    ->where($whereHasData);
          },
          'applied_job.job_seeker' => function($query) {
              $query->select('id', 'user_id', 'nickname');
          },
          'applied_job.job_seeker.user' => function($query) {
              $query->select('id', 'first_name');
          },
          'job' => function($query) {
              $query->select('id', 'incentive_per_share','title');
          },
          'provider' => function($query) {
              $query->select('id', 'name');
          },
      ];

      if ($request->start_date && $request->end_date) {
          $dates = [
              $request->start_date. ' 00:00:00',
              $request->end_date. ' 23:59:59',
          ];
      }

      $shared_jobs = $this->jobChoiceRepository->shared_job()->hybridWhere(
                                                                            $params,
                                                                            'created_at',
                                                                            $dates,
                                                                            $with,
                                                                            'created_at',
                                                                            'ASC',
                                                                            $whereHasField,
                                                                            $whereHasData,
                                                                            20
                                                                          );

      return $shared_jobs;
  }

  /**
   * Logic that computes the total compensation of a user by using its slug
   * @param Object $request input by user
   * @return Object $shared_jobs Shared job resource
   */
  public function computeTotalCompensation($request)
  {
      $dates = [];
      $user = $this->jobChoiceRepository->user()->show(Auth::id());
      $params = ['slug_id' => $user->slug->id];

      if ($request->start_date && $request->end_date) {
          $dates = [
              $request->start_date. ' 00:00:00',
              $request->end_date. ' 23:59:59',
          ];
      }

      $compensation = $this->jobChoiceRepository->shared_job()->hybridSumCompensation($params, 'shared_jobs.created_at', $dates);

      return $compensation;
  }

  /**
   * Logic that retrieves the sharer information based on shared job id given
   * @param Object $request input by user
   * @return array $result mixed results with object and int
   */
  public function userSharerInformation($request)
  {
      $auth_company_id = Auth::user()->company->id;

      $params = [
          'id' => $request->shared_job_id
      ];

      $shared_job = $this->jobChoiceRepository->shared_job()
                                              ->whereFirst($params, ['slug.user.job_seeker', 'notes'])
                                              ->toArray();
      $company =  $this->jobChoiceRepository->job()->show($shared_job['job_id'])->company_id;

      if ($company != $auth_company_id) {
          throw new \Exception('You have no rights to view this sharer.');
      }

      $sharers_shared_jobs_ids = $this->jobChoiceRepository->shared_job()
                                                           ->where(['slug_id' => $shared_job['slug_id']])
                                                           ->pluck('id')
                                                           ->toArray();
      $applicants_on_shared_jobs = $this->jobChoiceRepository->applied_job()
                                                             ->whereIn('shared_job_id', $sharers_shared_jobs_ids);

      $shared_job['num_applicants_on_shared_jobs'] = count($applicants_on_shared_jobs);
      $shared_job['num_applicants_pending_on_shared_jobs'] = count($applicants_on_shared_jobs->where('status', 'pending'));
      $shared_job['num_applicants_success_on_shared_jobs'] = count($applicants_on_shared_jobs->where('status', 'success'));
      $shared_job['num_applicants_rejected_on_shared_jobs'] = count($applicants_on_shared_jobs->where('status', 'rejected'));

      return $shared_job;
  }

  /**
   * Service and logic that appends the total shared jobs of a job seeker
   * @param  Collection $job_seekers job_seekers Collections
   * @return Hybrid $job_seekers Job Seeker collection appended by total shared jobs
   */
  public function appendCountSharedJobs($job_seekers)
  {
      $shared_count = 0;
      foreach ($job_seekers as $job_seeker) {

        // accessing the slug id directly will cause a mutation in return
        $slug_id = $job_seeker->user->slug->id;
        // gets the total count of applications
        $shared_jobs = $this->getAllSharedJobs($slug_id);
        $shared_count = $shared_jobs->count();

        $job_seeker['count_shared_jobs'] = $shared_count;
      }

      return $job_seekers;
  }

  /**
   * get all shared jobs of job seeker
   * @param  Int $slug_id
   * @return Collection $shared_jobs applied jobs
   */
  public function getAllSharedJobs($slug_id)
  {
      $params = [
          'slug_id' => $slug_id
      ];

      $shared_jobs = $this->jobChoiceRepository->shared_job()->where($params);

      return $shared_jobs;
  }

}
