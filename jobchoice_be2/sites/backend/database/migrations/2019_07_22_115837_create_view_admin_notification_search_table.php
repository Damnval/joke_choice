<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewAdminNotificationSearchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement("
            CREATE VIEW admin_notification_search AS
            SELECT 
                id,
                GROUP_CONCAT(
                    DISTINCT
                    title,
                    recipient_type,
                    created_at
                ) as items
            FROM 
                notifications 
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
        \DB::statement("DROP VIEW admin_notification_search");
    }
}
