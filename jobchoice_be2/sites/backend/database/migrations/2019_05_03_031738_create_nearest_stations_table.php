<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNearestStationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nearest_stations', function (Blueprint $table) {
            $table->increments('id');
            $table->morphs('stationable');
            $table->string('station')
                  ->nullable();
            $table->enum('transportation', [
                'car',
                'bus',
                'walk',
                'train'
            ])->nullable();
            $table->string('time_duration')
                  ->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nearest_stations');
    }
}
