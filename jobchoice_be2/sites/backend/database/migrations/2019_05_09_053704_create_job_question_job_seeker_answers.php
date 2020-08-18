<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobQuestionJobSeekerAnswers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_question_job_seeker_answers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_question_id')
                  ->unsigned();
            $table->foreign('job_question_id')
                  ->references('id')
                  ->on('job_questions');
            $table->integer('job_seeker_id')
                  ->unsigned();
            $table->foreign('job_seeker_id')
                  ->references('id')
                  ->on('job_seekers');
            $table->integer('job_question_answer_id')
                  ->unsigned()
                  ->nullable();
            $table->foreign('job_question_answer_id')
                  ->references('id')
                  ->on('job_question_answers');
            $table->string('free_text_answer')
                  ->nullable();
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
        Schema::dropIfExists('job_question_job_seeker_answers');
    }
}
