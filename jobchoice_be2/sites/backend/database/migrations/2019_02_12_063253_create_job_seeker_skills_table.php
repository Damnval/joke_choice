<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobSeekerSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_seeker_skills', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_seeker_id')
                  ->unsigned();
            $table->foreign('job_seeker_id')
                  ->references('id')
                  ->on('job_seekers');
            $table->integer('skill_id')
                  ->unsigned();
            $table->foreign('skill_id')
                  ->references('id')
                  ->on('skills');
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
        Schema::dropIfExists('job_seeker_skills');
    }
}
