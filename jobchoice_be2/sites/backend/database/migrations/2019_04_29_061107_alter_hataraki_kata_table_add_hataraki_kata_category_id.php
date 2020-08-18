<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterHatarakiKataTableAddHatarakiKataCategoryId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hataraki_kata', function (Blueprint $table) {
            $table->integer('hataraki_kata_category_id')
                  ->after('id')
                  ->unsigned();
            $table->foreign('hataraki_kata_category_id')
                  ->references('id')
                  ->on('hataraki_kata_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hataraki_kata', function($table) {
            $table->dropForeign('hataraki_kata_hataraki_kata_category_id_foreign');
            $table->dropColumn('hataraki_kata_category_id');
        });
    }
}
