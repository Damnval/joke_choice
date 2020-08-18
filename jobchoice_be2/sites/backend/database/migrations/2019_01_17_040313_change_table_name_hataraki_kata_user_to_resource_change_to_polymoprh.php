<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTableNameHatarakiKataUserToResourceChangeToPolymoprh extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hataraki_kata_users', function (Blueprint $table) {
            $table->dropForeign('hataraki_kata_users_user_id_foreign');
            $table->dropColumn('user_id');
            $table->integer('taggable_id')->after('hataraki_kata_id');
            $table->string('taggable_type')->after('taggable_id');
        });
        Schema::rename('hataraki_kata_users', 'hataraki_kata_resource');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hataraki_kata_resource', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->after('id');
            $table->dropColumn('taggable_id');
            $table->dropColumn('taggable_type');
        });
        Schema::rename('hataraki_kata_resource', 'hataraki_kata_users'); 
    }
}
