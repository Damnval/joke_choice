<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewAdminJobSearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE VIEW admin_job_search AS
            SELECT 
                jobs.id,
                GROUP_CONCAT(
                    DISTINCT
                    jobs.title,
                    companies.company_name,
                    jobs.employment_type,
                    jobs.incentive_per_share,
                    publications.`status`
                ) as items
            FROM
                jobs
            LEFT JOIN
                companies
            ON 
                companies.id = jobs.company_id
            LEFT JOIN 
                publications
            ON
                publications.publishable_id = jobs.id
            WHERE
                publications.publishable_type = 'Job'
            GROUP BY
                jobs.id
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement("DROP VIEW admin_job_search");
    }
}
