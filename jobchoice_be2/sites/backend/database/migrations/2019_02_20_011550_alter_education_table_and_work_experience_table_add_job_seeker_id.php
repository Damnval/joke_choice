<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEducationTableAndWorkExperienceTableAddJobSeekerId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('educational_backgrounds', function($table) {
            $table->integer('job_seeker_id')->unsigned()->after('month');
            $table->foreign('job_seeker_id')
                  ->references('id')
                  ->on('job_seekers');
        });

        Schema::table('work_experiences', function($table) {
            $table->integer('job_seeker_id')->unsigned()->after('position');
            $table->foreign('job_seeker_id')
                  ->references('id')
                  ->on('job_seekers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('educational_backgrounds', function($table) {
            $table->dropForeign('educational_backgrounds_job_seeker_id_foreign');
            $table->dropColumn('job_seeker_id');
        });
        
        Schema::table('work_experiences', function($table) {
            $table->dropForeign('work_experiences_job_seeker_id_foreign');
            $table->dropColumn('job_seeker_id');
        });
    }
}
