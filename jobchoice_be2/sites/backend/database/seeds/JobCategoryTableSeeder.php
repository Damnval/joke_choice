<?php

use Illuminate\Database\Seeder;
use App\Models\JobCategory;

class JobCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
                        'オフィスワーク',
                        '医療・看護・介護',
                        'クリエイティブ・エンジニア',
                        '軽作業・物流・製造',
                        '施設サービス',
                        '家事・保育・習い事',
                        '理美容・リラクゼーション',
                        '営業',
                        'フード・飲食',
                        '調査・ポスティング・イベント',
                        '小売・販売',
                        'その他',
                      ];

        foreach ($categories as $key => $category) {
            factory(JobCategory::class)->create(['category' => $category]);
        }
    }
}
