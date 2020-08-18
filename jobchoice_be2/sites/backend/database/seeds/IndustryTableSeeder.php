<?php

use Illuminate\Database\Seeder;
use App\Models\Industry;

use Carbon\Carbon;

class IndustryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $industies = ['業種を選択してください', '飲食', '小売・卸売', '美容・エステ', '不動産', '旅行・宿泊', 'レジャー・娯楽', 'スポーツ', '冠婚葬祭', '医療・福祉', '学校教育', 'その他教育・保育', '人材サービス',
        '弁護士・会計士等士業', 'コンサルティング', 'マスコミ・広告', 'デザイン・アート', '印刷', 'IT・通信', '電気・ガス・水道', '製造・運輸', '農業・林業・漁業', '土木・建設', '金融・保険', '商社', '官公庁', 
        '宗教法人', '団体・組合', 'その他'];

        foreach ($industies as $key => $industry) {
            
            DB::table('industries')->insert([
                'name' => $industry,
                'created_at' => Carbon::now()->toDateTimeString(),
                'updated_at' => Carbon::now()->toDateTimeString(),
            ]);
        }
    }
}
