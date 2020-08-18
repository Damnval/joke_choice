<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterJobSeekersTableAddEmploymentStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_seekers', function (Blueprint $table) {
            $table->enum('employment_status', [
                "regular",
                "temporary",
                "dispatch",
                "contract_less_35_hrs_week",
                "contract_more_35_hrs_week",
                "short_time",
                "outsourcing",
                "franchise"
            ])->after('marital_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_seekers', function($table) {
            $table->dropColumn('employment_status');
        });
    }
}
