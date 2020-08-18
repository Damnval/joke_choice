<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterViewJobSearchAddCompanyNameAndWhereApprovedJobs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE OR REPLACE VIEW job_search AS
            SELECT
                jobs.id,
                GROUP_CONCAT(DISTINCT
                jobs.employment_period,
                jobs.employment_type,
                jobs.no_days_week,
                jobs.salary,
                jobs.title,
                jobs.service_company,
                companies.company_name,
                geolocation.complete_address,
                COALESCE(day.days_item, ''),
                hataraki_table.hataraki_kata_items) items
            FROM
                jobs
            LEFT JOIN
                geolocation
            ON
                jobs.id = geolocation.taggable_id
            LEFT JOIN
                (SELECT
                    job_id,
                    GROUP_CONCAT(DISTINCT day) days_item
                FROM
                    days
                GROUP BY
                    job_id) day
            ON
                jobs.id = day.job_id
            LEFT JOIN
                (SELECT
                    hataraki_kata_resource.taggable_id,
                    GROUP_CONCAT(
                                DISTINCT hataraki_kata.item_en,
                                hataraki_kata.item_jp
                                ) hataraki_kata_items
                FROM
                    hataraki_kata_resource
                LEFT JOIN
                    hataraki_kata
                ON
                    hataraki_kata_resource.hataraki_kata_id = hataraki_kata.id
                WHERE
                    hataraki_kata_resource.taggable_type = 'Job'
                GROUP BY
                    hataraki_kata_resource.taggable_id
                ) hataraki_table
            ON
                hataraki_table.taggable_id = jobs.id
            LEFT JOIN
                companies 
            ON 
                companies.id = jobs.company_id    
            WHERE
                geolocation.taggable_type = 'Job'
            AND 
                jobs.approval_status = 'approved'
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
        {
            // removes companies.company_name and rebuilds the view
            \DB::statement("
                CREATE OR REPLACE VIEW job_search AS
                SELECT
                    jobs.id,
                    GROUP_CONCAT(DISTINCT
                    jobs.employment_period,
                    jobs.employment_type,
                    jobs.no_days_week,
                    jobs.salary,
                    jobs.title,
                    jobs.service_company,
                    geolocation.complete_address,
                    day.days_item,
                    hataraki_table.hataraki_kata_items) items
                FROM
                    jobs
                LEFT JOIN
                    geolocation
                ON
                    jobs.id = geolocation.taggable_id
                LEFT JOIN
                    (SELECT
                        job_id,
                        GROUP_CONCAT(DISTINCT day) days_item
                    FROM
                        days
                    GROUP BY
                        job_id) day
                ON
                    jobs.id = day.job_id
                LEFT JOIN
                    (SELECT
                        hataraki_kata_resource.taggable_id,
                        GROUP_CONCAT(
                                    DISTINCT hataraki_kata.item_en,
                                    hataraki_kata.item_jp
                                    ) hataraki_kata_items
                    FROM
                        hataraki_kata_resource
                    LEFT JOIN
                        hataraki_kata
                    ON
                        hataraki_kata_resource.hataraki_kata_id = hataraki_kata.id
                    WHERE
                        hataraki_kata_resource.taggable_type = 'Job'
                    GROUP BY
                        hataraki_kata_resource.taggable_id
                    ) hataraki_table
                ON
                    hataraki_table.taggable_id = jobs.id
                WHERE
                    geolocation.taggable_type = 'Job'
                GROUP BY
                    jobs.id
            ");
        }
    }
}
