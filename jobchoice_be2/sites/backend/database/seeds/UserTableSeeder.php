<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(User::class)->create([
            'email' => 'jobchoicetest@gmail.com',
            'type' => 'admin',
        ]);

        factory(User::class)->create([
            'email' => 'jobchoice@mediaflag.co.jp',
            'type' => 'admin',
            'password' => bcrypt('eM5DvGas')
        ]);
    }
}
