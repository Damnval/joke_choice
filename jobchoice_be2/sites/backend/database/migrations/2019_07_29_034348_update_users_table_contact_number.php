<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersTableContactNumber extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Users Table
        // Updates users contact number to japanese locale
        for ($x = 1; $x <= 12; $x++) { 
            // Randomly generated japanese contact number
            $contact_no = '+81' . mt_rand(1000000000, 9999999999);
            DB::table('users')->where('id', '=', $x)
                              ->update([
                                'contact_no' => $contact_no
                              ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
