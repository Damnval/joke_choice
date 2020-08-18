<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobQuestionAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_question_answers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('answer');
            $table->integer('job_question_id')->unsigned();
            $table->foreign('job_question_id')
                  ->references('id')
                  ->on('job_questions');
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
        Schema::dropIfExists('job_question_answers');
    }
}
