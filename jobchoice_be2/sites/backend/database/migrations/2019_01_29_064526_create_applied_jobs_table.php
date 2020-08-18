<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppliedJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applied_jobs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_seeker_id')->unsigned();
            $table->foreign('job_seeker_id')
                  ->references('id')
                  ->on('job_seekers');
            $table->integer('job_id')->unsigned();
            $table->foreign('job_id')
                  ->references('id')
                  ->on('jobs');
            $table->enum('status', ['pending', 'rejected', 'success', 'waiting'])->default('waiting');
            $table->integer('shared_job_id')->nullable();
            $table->boolean('disclosed')->default(0);
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
        Schema::dropIfExists('applied_jobs');
    }
}
