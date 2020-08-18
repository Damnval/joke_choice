<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterJobSeekersTableAddFieldsEducationalBackgroundAndWorkExperience extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_seekers', function (Blueprint $table) {
            $table->string('bank_account')
                  ->after('user_id')
                  ->nullable();
            $table->string('station')
                  ->after('bank_account')
                  ->nullable();
            $table->tinyInteger('mail_setting')
                  ->after('station')
                  ->nullable();
            $table->enum('marital_status', ['yes', 'no'])
                  ->after('mail_setting')
                  ->nullable();
            $table->string('description')
                  ->after('marital_status')
                  ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_seekers', function (Blueprint $table) {
            $table->dropColumn('bank_account');
            $table->dropColumn('station');
            $table->dropColumn('mail_setting');
            $table->dropColumn('marital_status');
            $table->dropColumn('description');
        });
    }
}
