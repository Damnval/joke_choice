<?php

namespace App\Services;

/**
 * All repositories are loaded in one single class
 */
class JobChoiceService
{

	public function token()
	{
		return new \App\Services\TokenService(new \App\Repositories\JobChoiceRepository);
	}

	public function user()
	{
		return new \App\Services\UserService(new \App\Repositories\JobChoiceRepository, new \App\Services\UploadService);
	}

	public function job()
	{
		return new \App\Services\JobService(new \App\Repositories\JobChoiceRepository,  new \App\Services\UploadService);
	}

	public function job_category()
	{
		return new \App\Services\JobCategoryService(new \App\Repositories\JobChoiceRepository);
	}

	public function hataraki_kata()
	{
		return new \App\Services\HatarakiKataService(new \App\Repositories\JobChoiceRepository);
	}

	public function password_reset()
	{
		return new \App\Services\PasswordResetService(new \App\Repositories\JobChoiceRepository);
	}

	public function shared_job()
	{
		return new \App\Services\SharedJobService(new \App\Repositories\JobChoiceRepository);
	}

	public function slug()
	{
		return new \App\Services\SlugService(new \App\Repositories\JobChoiceRepository);
	}

	public function geolocation()
	{
		return new \App\Services\GeolocationService(new \App\Repositories\JobChoiceRepository);
	}

	public function applied_job()
	{
		return new \App\Services\AppliedJobService(new \App\Repositories\JobChoiceRepository);
	}

	public function sns_user()
	{
		return new \App\Services\SnSUserService(new \App\Repositories\JobChoiceRepository);
	}

	public function hataraki_kata_resource()
	{
		return new \App\Services\HatarakiKataResourceService(new \App\Repositories\JobChoiceRepository);
	}

	public function company()
	{
		return new \App\Services\CompanyService(new \App\Repositories\JobChoiceRepository);
	}

    public static function upload()
    {
        return new \App\Services\UploadService();
	}

	public function skill()
	{
        return new \App\Services\SkillService(new \App\Repositories\JobChoiceRepository);
	}

	public function inquiry()
	{
		return new \App\Services\InquiryService(new \App\Repositories\JobChoiceRepository);
	}

	public function occupation()
	{
		return new \App\Services\OccupationService(new \App\Repositories\JobChoiceRepository);
	}

	public function industry()
	{
		return new \App\Services\IndustryService(new \App\Repositories\JobChoiceRepository);
	}

	public function bank_account()
	{
		return new \App\Services\BankAccountService(new \App\Repositories\JobChoiceRepository);
	}

	public function note()
	{
		return new \App\Services\NoteService(new \App\Repositories\JobChoiceRepository);
	}

	public function hataraki_kata_category()
	{
		return new \App\Services\HatarakiKataCategoryService(new \App\Repositories\JobChoiceRepository);
	}

	public function twilio()
	{
		return new \App\Services\TwilioService(new \App\Repositories\JobChoiceRepository);
	}
	public function notification()
	{
		return new \App\Services\NotificationService(new \App\Repositories\JobChoiceRepository);
	}

	public function job_question_job_seeker_answer()
	{
		return new \App\Services\JobQuestionJobSeekerAnswerService(new \App\Repositories\JobChoiceRepository);
	}

	public function billing()
	{
		return new \App\Services\BillingService(new \App\Repositories\JobChoiceRepository);
	}

	public function analytic()
	{
		return new \App\Services\AnalyticService(new \App\Repositories\JobChoiceRepository);
	}

	public function publication()
	{
		return new \App\Services\PublicationService(new \App\Repositories\JobChoiceRepository);
	}

	public function job_seeker()
	{
		return new \App\Services\JobSeekerService(new \App\Repositories\JobChoiceRepository);
	}

	public function special_feature()
	{
		return new \App\Services\SpecialFeatureService(new \App\Repositories\JobChoiceRepository);
	}

}
