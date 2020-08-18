<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewJobSeekerSearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE VIEW job_seeker_search AS
            SELECT
                job_seeker.id,
                GROUP_CONCAT(
                    DISTINCT
                    user.first_name,
                    user.last_name,
                    geo.complete_address,
                    geo.prefectures,
                    job_seeker.gender,
                    (YEAR(CURRENT_TIMESTAMP) - YEAR(job_seeker.birth_date)),
                    user.contact_no,
                    user.email,
                    COALESCE(user.last_login_at, '')
                ) AS item,
                if((applied.job_seeker_id), 1, 0) AS has_applied_job,
                if((shared.slug_id), 1, 0) AS has_shared_job


            FROM
                job_seekers job_seeker
            INNER JOIN
                users user
            ON
                job_seeker.user_id = user.id
            INNER JOIN
                geolocation geo
            ON
                geo.taggable_id = job_seeker.id
            INNER JOIN
                slugs slug
            ON
                slug.sluggable_id = user.id
            LEFT JOIN
                shared_jobs shared
            ON
                shared.slug_id = slug.id
            LEFT JOIN
                (
                SELECT
                    job_seeker_id

                FROM
                    applied_jobs
                GROUP BY
                    job_seeker_id
                ) applied
            ON
                applied.job_seeker_id = job_seeker.id

            WHERE
                slug.sluggable_type = 'User'
            AND
                geo.taggable_type = 'JobSeeker'
            GROUP BY
                job_seeker.id, shared.slug_id
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement("DROP VIEW job_seeker_search");
    }
}
