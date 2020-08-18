<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterGeolocationTableAddLatLngAndZipCodeFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('ALTER TABLE `geolocation` CHANGE `address` `complete_address` VARCHAR(60) NULL');

        Schema::table('geolocation', function (Blueprint $table) {
            $table->float('lat', 8, 3)
                  ->after('complete_address')
                  ->nullable();
            $table->float('lng', 8, 3)
                  ->after('lat')
                  ->nullable();
            $table->string('zip_code')
                  ->after('lng')
                  ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE `geolocation` CHANGE `complete_address` `address` VARCHAR(60) NULL');

        Schema::table('geolocation', function (Blueprint $table) {
            $table->dropColumn('lat');
            $table->dropColumn('lng');
            $table->dropColumn('zip_code');
        });
    }
}
