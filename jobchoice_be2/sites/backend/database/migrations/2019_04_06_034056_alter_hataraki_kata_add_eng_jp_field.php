<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterHatarakiKataAddEngJpField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hataraki_kata', function($table) {
            $table->dropColumn('item');
            $table->string('item_jp')->after('id');
            $table->string('item_en')->after('item_jp');
            $table->string('image')->after('item_en');
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
            $table->string('item');
            $table->dropColumn('item_jp');
            $table->dropColumn('item_en');
            $table->dropColumn('image');
        });
    }
}
