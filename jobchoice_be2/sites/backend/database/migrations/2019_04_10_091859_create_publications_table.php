<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePublicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->increments('id');
            $table->date('published_start_date')->nullable();
            $table->date('published_end_date')->nullable();
            $table->boolean('draft')->default(1);
            $table->enum('status', [
                'private',
                'published',
                'post_end',
            ])->default('private')->nullable();
            $table->integer('publishable_id')->unsigned();
            $table->string('publishable_type');
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
        Schema::dropIfExists('publications');
    }
}
