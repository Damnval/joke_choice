<?php

use Illuminate\Database\Seeder;
use App\Models\Occupation;
use Carbon\Carbon;

class OccupationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $occupations = [
            '職業を選択してください', 
            '学生', 
            '専業主婦', 
            'パート', 
            'アルバイト', 
            '派遣社員', 
            '正社員', 
            '契約社員', 
            '自営業', 
            '公務員', 
            '無職', 
            'その他'
        ];

        foreach ($occupations as $key => $occupation) {
            DB::table('occupations')->insert([
                'name' => $occupation,
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString(),
            ]);
        }
    }
}
