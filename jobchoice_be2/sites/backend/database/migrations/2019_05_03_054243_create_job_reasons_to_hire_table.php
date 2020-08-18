<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobReasonsToHireTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_reasons_to_hire', function (Blueprint $table) {
            $table->increments('id');
            $table->text('reason');
            $table->integer('job_id')->unsigned();
            $table->foreign('job_id')
                  ->references('id')
                  ->on('jobs');
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
        Schema::dropIfExists('job_reasons_to_hire');
    }
}
