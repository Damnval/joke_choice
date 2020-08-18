<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('reference_id');
            $table->enum('employment_type', [
                'regular',
                'regular_with_rank',
                'contract_worker',
                'limited',
                'part_time',
                'temporary',
                'contract_outsourcing'
            ])->nullable();
            $table->enum('employment_period',[
                'long_term',
                'short_term',
                'single_term',
                'middle_term'
            ])->nullable();
            $table->foreign('company_id')
                  ->references('id')
                  ->on('companies');
            $table->integer('company_id')->unsigned();
            $table->string('service_company')->nullable();
            $table->longText('location_details')->nullable(); // To be deleted? not included in the new create job implementation
            $table->integer('incentive_per_share')->nullable();
            $table->string('title', 128)->nullable();
            $table->string('job_image')->nullable();
            $table->text('description')->nullable();
            $table->string('url_job_video')->nullable();
            $table->text('qualifications')->nullable();
            $table->integer('planned_hire')->nullable();
            $table->enum('payment_type', [
                'weekly',
                'hourly',
                'daily',
                'monthly',
                'yearly'
            ])->nullable();
            $table->integer('salary')->nullable();
            $table->integer('salary_max_range')->nullable();
            $table->string('benefits', 255)->nullable();
            $table->string('no_days_week')->nullable();
            $table->integer('no_days_week_max_range')->nullable();
            $table->enum('required_gender',[
                'male',
                'female'
            ])->nullable();
            $table->enum('ratio_gender_scope',[
                'required',
                'not_required',
                'preferable',
            ])->nullable();
            $table->integer('required_min_age')->nullable();
            $table->integer('required_max_age')->nullable();
            $table->enum('ratio_age_scope',[
                'required',
                'not_required',
                'preferable'
            ])->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('welfare_description')->nullable();
            $table->text('welfare_working_period')->nullable();
            $table->text('working_condition')->nullable();
            $table->longText('features')->nullable(); // To be deleted? not included in the new create job implementation
            $table->longText('mail_reply_template')->nullable();
            $table->string('mail_reply_email_address')->nullable();
            $table->string('published_comment')->nullable();
            $table->enum('approval_status', [
                'waiting',
                'approved',
                'rejected'
            ])->default('waiting');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs');
    }
}
