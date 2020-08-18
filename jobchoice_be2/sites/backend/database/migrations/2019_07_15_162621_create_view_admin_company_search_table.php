<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewAdminCompanySearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE VIEW admin_company_search AS
            SELECT
                if(publication.updated_at, 1, 0) has_job_posted,
                if(publication.disclosed, 0, 1) has_not_disclosed,
                company.id,
                GROUP_CONCAT(
                company.id,
                company.company_name,
                user.contact_no,
                user.email,
                COALESCE(geo.complete_address, ''),
                COALESCE(geo.prefectures, ''),
                COALESCE(publication.updated_at, '')
                ) AS items

            FROM
                companies company
            INNER JOIN
                users user
            ON
                company.user_id = user.id
            INNER JOIN
                geolocation geo
            ON
                geo.taggable_id = company.id
            LEFT JOIN
                (
                SELECT
                    com.id AS company_id,
                    max(pub.updated_at) AS updated_at,
                    max(applied.disclosed) AS disclosed

                FROM
                  companies com
                INNER JOIN
                  jobs job
                ON
                  job.company_id = com.id
                LEFT JOIN
                  (
                    SELECT
                        publishable_id,
                        if(status = 'published', updated_at, '') AS updated_at

                    FROM
                        publications

                    WHERE
                        draft = 0
                    AND
                        publishable_type = 'Job'
                    ) pub
                ON
                  pub.publishable_id =  job.id
                LEFT JOIN
                    (
                    SELECT
                        job_id,
                        max(disclosed) AS disclosed

                    FROM
                        applied_jobs
                    GROUP BY
                        job_id
                    ) applied
                ON
                    applied.job_id = job.id

                GROUP BY
                    com.id
                ) publication
            ON
                publication.company_id = company.id

            WHERE
                geo.taggable_type = 'Company'
            GROUP BY
                id
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement("DROP VIEW admin_company_search");
    }
}
