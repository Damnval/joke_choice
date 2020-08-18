<?php

use Illuminate\Http\Request;
use Twilio\Rest\Client;
use App\Services\TwilioService;
use App\Repositories\JobChoiceRepository;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['auth:api']], function () {
    //user related
    Route::get('user-dashboard', 'API\UserController@userDashboard');
        //user must be logged in to access these routes
	Route::post('logout','API\UserController@logout');
    Route::resource('user', 'API\UserController');

    //job related
    Route::get('company/job/{id}', 'API\JobController@companyJobDetails');
    Route::resource('apply-job', 'API\AppliedJobController');
    Route::resource('job', 'API\JobController', [
        'except' => ['show', 'index']
    ]);
    Route::post('shared-jobs-generate-link', 'API\SharedJobController@getLink');
        //job seeker
    Route::post('user-shared-jobs', 'API\SharedJobController@userSharedJobs');
    Route::post('user-applied-jobs', 'API\AppliedJobController@userAppliedJobs');
    Route::get('user-matching-jobs','API\JobController@userMatchingJobs');
        //applied job
    Route::post('company-job-applicants', 'API\AppliedJobController@companyJobApplicants');
    Route::post('account-information','API\AppliedJobController@accountInformation');

    //applied_job
    Route::patch('disclose-apply-job', 'API\AppliedJobController@discloseAppliedJob');

    //shared_job
    Route::post('sharer-information', 'API\SharedJobController@userSharerInformation');

    //hataraki kata related
    Route::resource('hataraki-kata-resource', 'API\HatarakiKataResourceController');

    //CompanyController
    Route::post('company-jobs', 'API\CompanyController@postedJobs');
    Route::post('company-job/duplicate', 'API\JobController@duplicateJob');

    //notification
    Route::resource('notification', 'API\NotificationController');
    Route::post('published-notification', "API\NotificationController@getAllPublishedNotifications");

    //billing
    Route::post('company-billings', 'API\BillingController@companyBillings');

    //Admin
    Route::group(['prefix' => 'manage', 'middleware' => 'admin'], function() {
        Route::resource('job-category', 'API\Manage\JobCategoryController');
        Route::resource('user', 'API\Manage\UserController');
        Route::get('user-incentive', 'API\Manage\UserController@userIncentiveManagement');
        Route::post('user-incentive/search', 'API\Manage\UserController@userIncentiveManagementSearch');
        Route::resource('company', 'API\Manage\CompanyController');
        Route::post('company/search', 'API\Manage\CompanyController@search');
        Route::resource('job-seeker', 'API\Manage\JobSeekerController');
        Route::post('job-seeker/search', 'API\Manage\JobSeekerController@search');
        Route::resource('job', 'API\Manage\JobController');
        Route::post('job/search', 'API\Manage\JobController@search');
        Route::resource('notification', 'API\Manage\NotificationController');
        Route::post('notification/search', 'API\Manage\NotificationController@search');
    });

});

//public routes
    //user related
Route::post('check-user', 'API\RegisterController@checkUser');
Route::post('line', 'API\RegisterController@line');

Route::group(['prefix' => 'register'], function () {
    Route::post('email', 'API\RegisterController@registerEmail');
    Route::post('details', 'API\RegisterController@registerDetails');
    Route::post('social', 'API\RegisterController@registerSocial');
});

Route::group(['prefix' => 'password'], function () {
    Route::post('create', 'API\UserController@sendPasswordReset');
    Route::post('reset', 'API\UserController@resetPassword');
});
    //twitter related
Route::group(['prefix' => 'auth/twitter'], function () {
    Route::post('', 'API\TwitterController@twitterAuth');
    Route::post('credentials', 'API\TwitterController@twitterCredentials');
    Route::post('reverse', 'API\TwitterController@twitter');
    Route::post('post', 'API\TwitterController@twitterPost');
});

    //job related
Route::resource('job-category', 'API\JobCategoryController');
Route::post('job/search', 'API\JobController@search');
    //getting all jobs and job details should and can be viewed public
Route::get('job', 'API\JobController@index');
Route::get('job/{jobID}', 'API\JobController@show');

    //inquiry related
Route::resource('inquiry', 'API\InquiryController');
    //industry related
Route::resource('industry', 'API\IndustryController');
    //occupation related
Route::resource('occupation', 'API\OccupationController');
    //shared job related
Route::get('shared-job/top-ten', 'API\SharedJobController@topTenSharedJobs');
Route::post('decrypt-shared-job', 'API\SharedJobController@decryptSharedJob');
Route::resource('shared-job', 'API\SharedJobController');
    //hataraki kata related
Route::resource('hataraki-kata-categories', 'API\HatarakiKataCategoryController');
Route::resource('hataraki-kata', 'API\HatarakiKataController');
    //special features related
Route::resource('special-feature', 'API\SpecialFeatureController');
    //skill related
Route::resource('skill', 'API\SkillController');
    //zipcode related
Route::post('zipcode', 'API\ZipCodeController@zipcode');
    //notes
Route::resource('note', 'API\NoteController');
    //sns share
        //email share
Route::post('share/email', 'API\SharedJobController@shareEmail');
        //twilio related
Route::post('/verify-code', 'API\TwilioController@verifyCode');
Route::post('/verify-phone-number', 'API\TwilioController@verifyPhoneNumber');
Route::resource('send-verification-code', 'API\TwilioController');
    //token related
Route::post('token/verify', 'API\TokenController@isTokenExisting');
    //Analytic related
Route::resource('analytic', 'API\AnalyticController');

//Initial commit

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user()->load(
                            'company.geolocation',
                            'job_seeker.hataraki_kata_resource.hataraki_kata',
                            'job_seeker.bank_account',
                            'job_seeker.geolocation',
                            'job_seeker.work_experience',
                            'job_seeker.educational_background',
                            'job_seeker.job_seeker_skills',
                            'slug'
    						);
});
