<?php

namespace App\Repositories;

use Illuminate\Container\Container as App;

/**
 * All repositories are loaded in one single class
 */
class JobChoiceRepository
{

    private $app;

    public function __construct()
    {
        //needs to fix
        $this->app = new App();
    }

    public function token()
    {
        return new \App\Repositories\TokenRepository(new \App\Models\Token);
    }

    public function user()
    {
        return new \App\Repositories\UserRepository(new \App\Models\User);
    }

    public function job()
    {
        return new \App\Repositories\JobRepository(new \App\Models\Job);
    }

    public function job_category()
    {
        return new \App\Repositories\JobCategoryRepository(new \App\Models\JobCategory);
    }

    public function hataraki_kata()
    {
        return new \App\Repositories\HatarakiKataRepository(new \App\Models\HatarakiKata);
    }

    public function company()
    {
        return new \App\Repositories\CompanyRepository(new \App\Models\Company);
    }

    public function shared_job()
    {
        return new \App\Repositories\SharedJobRepository(new \App\Models\SharedJob);
    }

    public function slug()
    {
        return new \App\Repositories\SlugRepository(new \App\Models\Slug);
    }

    public function applied_job()
    {
        return new \App\Repositories\AppliedJobRepository(new \App\Models\AppliedJob);
    }

    public function job_seeker()
    {
        return new \App\Repositories\JobSeekerRepository(new \App\Models\JobSeeker);
    }

    public function geolocation()
    {
        return new \App\Repositories\GeolocationRepository(new \App\Models\Geolocation);
    }

    public function sns_user()
    {
        return new \App\Repositories\SnSUserRepository(new \App\Models\SnSUser);
    }

    public function hataraki_kata_resource()
    {
        return new \App\Repositories\HatarakiKataResourceRepository(new \App\Models\HatarakiKataResource);
    }

    public function password_reset()
    {
        return new \App\Repositories\PasswordResetRepository(new \App\Models\PasswordReset);
    }

    public function job_seeker_skill()
    {
        return new \App\Repositories\JobSeekerSkillRepository(new \App\Models\JobSeekerSkill);
    }

    public function educational_background()
    {
        return new \App\Repositories\EducationalBackgroundRepository(new \App\Models\EducationalBackground);
    }

    public function work_experience()
    {
        return new \App\Repositories\WorkExperienceRepository(new \App\Models\WorkExperience);
    }

    public function skill()
    {
        return new \App\Repositories\SkillRepository(new \App\Models\Skill);
    }

    public function day()
    {
        return new \App\Repositories\DayRepository(new \App\Models\Day);
    }

    public function inquiry()
	{
		return new \App\Repositories\InquiryRepository(new \App\Models\Inquiry);
	}

    public function industry()
	{
		return new \App\Repositories\IndustryRepository(new \App\Models\Industry);
	}

    public function occupation()
    {
        return new \App\Repositories\OccupationRepository(new \App\Models\Occupation);
    }

    public function provider()
    {
        return new \App\Repositories\ProviderRepository(new \App\Models\Provider);
    }

    public function job_search()
    {
        return new \App\Repositories\JobSearchRepository(new \App\Models\JobSearch);
    }

   public function gallery()
    {
        return new \App\Repositories\GalleryRepository(new \App\Models\Gallery);
    }

    public function bank_account()
    {
        return new \App\Repositories\BankAccountRepository(new \App\Models\BankAccount);
    }

    public function other_hataraki_kata()
    {
        return new \App\Repositories\OtherHatarakiKataRepository(new \App\Models\OtherHatarakiKata);
    }

    public function note()
    {
        return new \App\Repositories\NoteRepository(new \App\Models\Note);
    }

    public function publication()
    {
        return new \App\Repositories\PublicationRepository(new \App\Models\Publication);
    }

    public function hataraki_kata_category()
    {
        return new \App\Repositories\HatarakiKataCategoryRepository(new \App\Models\HatarakiKataCategory);
    }

    public function twilio() {
        return new \App\Repositories\TwilioRepository(new \App\Models\Twilio);
    }
    public function nearest_station()
    {
        return new \App\Repositories\NearestStationRepository(new \App\Models\NearestStation);
    }

    public function job_strength()
    {
        return new \App\Repositories\JobStrengthRepository(new \App\Models\JobStrength);
    }

    public function job_job_sub_category()
    {
        return new \App\Repositories\JobJobSubCategoryRepository(new \App\Models\JobJobSubCategory);
    }

    public function job_welfare()
    {
        return new \App\Repositories\JobWelfareRepository(new \App\Models\JobWelfare);
    }

    public function job_reason_to_hire()
    {
        return new \App\Repositories\JobReasonToHireRepository(new \App\Models\JobReasonsToHire);
    }

    public function job_question()
    {
        return new \App\Repositories\JobQuestionRepository(new \App\Models\JobQuestion);
    }

    public function job_question_answer()
    {
        return new \App\Repositories\JobQuestionAnswerRepository(new \App\Models\JobQuestionAnswer);
    }

    public function notification()
    {
        return new \App\Repositories\NotificationRepository(new \App\Models\Notification);
    }

    public function notification_log()
    {
        return new \App\Repositories\NotificationLogRepository(new \App\Models\NotificationLog);
    }

    public function job_question_job_seeker_answer()
    {
        return new \App\Repositories\JobQuestionJobSeekerAnswerRepository(new \App\Models\JobQuestionJobSeekerAnswer);
    }

    public function company_job_search()
    {
        return new \App\Repositories\CompanyJobSearchRepository(new \App\Models\CompanyJobSearch);
    }

    public function job_sub_category()
    {
        return new \App\Repositories\JobSubCategoryRepository(new \App\Models\JobSubCategory);
    }

    public function billing()
    {
        return new \App\Repositories\BillingRepository(new \App\Models\Billing);
    }

    public function analytic()
    {
        return new \App\Repositories\AnalyticRepository(new \App\Models\Analytic);
    }

    public function job_seeker_search()
    {
        return new \App\Repositories\JobSeekerSearchRepository(new \App\Models\JobSeekerSearch);
    }

    public function admin_job_search()
    {
        return new \App\Repositories\AdminJobSearchRepository(new \App\Models\AdminJobSearch);
    }

    public function admin_company_search()
    {
        return new \App\Repositories\AdminCompanySearchRepository(new \App\Models\AdminCompanySearch);
    }

    public function special_feature()
    {
        return new \App\Repositories\SpecialFeatureRepository(new \App\Models\SpecialFeature);
    }

    public function admin_notification_search()
    {
        return new \App\Repositories\AdminNotificationSearchRepository(new \App\Models\AdminNotificationSearch);
    }

}
