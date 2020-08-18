<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCompaniesTableWithNewFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('companies', function($table) {
            $table->string('prefectures')->after('user_id')->nullable();
            $table->enum('purpose', [
                'company_use',
                'personal_use',
            ])->after('prefectures')->nullable();
            $table->string('company_name')->after('purpose')->nullable();
            $table->string('company_kana')->after('company_name')->nullable();
            $table->enum('no_employees', [
              'owner',
              'less_than_10',
              'more_than_10_less_than_50',
              'more_than_50_less_than_100',
              'more_than_100'
            ])->after('company_kana')->nullable();
            $table->string('department')->after('no_employees')->nullable();
            $table->integer('occupation_id')->unsigned()->after('department')->nullable();
            $table->foreign('occupation_id')
                  ->references('id')
                  ->on('occupations')->nullable();
            $table->integer('industry_id')->unsigned()->after('occupation_id')->nullable();
            $table->foreign('industry_id')
                  ->references('id')
                  ->on('industries')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('companies', function($table) {
            $table->dropColumn('prefectures');
            $table->dropColumn('purpose');
            $table->dropColumn('company_name');
            $table->dropColumn('company_kana');
            $table->dropColumn('no_employees');
            $table->dropColumn('department');
            $table->dropForeign('companies_occupation_id_foreign');
            $table->dropColumn('occupation_id');
            $table->dropForeign('companies_industry_id_foreign');
            $table->dropColumn('industry_id');
        });
    }
}
