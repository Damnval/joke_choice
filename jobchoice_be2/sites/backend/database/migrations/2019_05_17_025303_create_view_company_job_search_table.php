<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewCompanyJobSearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE VIEW company_job_search AS
            SELECT
                job.id,
                REPLACE(group_concat(
                published_start_date,
                published_end_date,
                status,
                job.job_items), '_', ' ')
                AS items
            FROM
                publications publication
            INNER JOIN
                (SELECT
                    id,
                    GROUP_CONCAT(
                    title,
                    employment_type,
                    incentive_per_share) AS job_items
                FROM
                    jobs
                GROUP BY id) job
            ON
                job.id = publication.publishable_id
            WHERE
                publishable_type = 'Job'
            GROUP BY
            publishable_id
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement("DROP VIEW company_job_search");
    }
}
