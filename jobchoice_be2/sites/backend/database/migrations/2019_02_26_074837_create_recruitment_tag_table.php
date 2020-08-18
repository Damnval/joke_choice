<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecruitmentTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recruitment_tag', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('hataraki_kata_id')->unsigned();
            $table->foreign('hataraki_kata_id')
                  ->references('id')
                  ->on('hataraki_kata');
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
        Schema::dropIfExists('recruitment_tag');
    }
}
