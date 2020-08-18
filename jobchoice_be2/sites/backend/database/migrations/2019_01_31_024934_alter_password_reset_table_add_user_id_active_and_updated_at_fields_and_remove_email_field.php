<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPasswordResetTableAddUserIdActiveAndUpdatedAtFieldsAndRemoveEmailField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('password_resets', function($table) {
            $table->increments('id')
                  ->after('email');
            $table->dropColumn('email');
            $table->tinyInteger('active')
                  ->after('token');
            $table->integer('user_id')
                  ->unsigned()
                  ->after('active');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users');
            $table->timestamp('updated_at')
                  ->after('created_at');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('password_resets', function($table) {
            $table->dropColumn('id');
            $table->dropForeign('password_resets_user_id_foreign');
            $table->dropColumn('user_id');
            $table->dropColumn('active');
            $table->dropColumn('updated_at');
            $table->string('email')->index();
        });
    }
}
