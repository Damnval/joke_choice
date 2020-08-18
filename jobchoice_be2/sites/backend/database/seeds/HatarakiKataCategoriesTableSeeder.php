<?php

use Illuminate\Database\Seeder;

class HatarakiKataCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('hataraki_kata_categories')->insert([
            [
                'item_jp' => '期間',
                'item_en' => 'Duration',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/01.jpg'
            ],
            [
                'item_jp' => '時間',
                'item_en' => 'Time',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/02.jpg'
            ],
            [
                'item_jp' => '給料・手当',
                'item_en' => 'Salaries and benefits',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/03.jpg'
            ],
            [
                'item_jp' => '職場環境',
                'item_en' => 'Environment of work place',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/04.jpg'
            ],
            [
                'item_jp' => '福利厚生',
                'item_en' => 'Welfare',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/05.jpg'
            ],
            [
                'item_jp' => '働く仲間',
                'item_en' => 'Co-worker',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/06.jpg'
            ],
            [
                'item_jp' => '働き方',
                'item_en' => 'How to work',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/07.jpg'
            ],
            [
                'item_jp' => '応募・採用',
                'item_en' => 'Application / Recruitment',
                'image'   => config('app.staging_url') . '/images/assets/hatarakikata_categories/08.jpg'
            ],
        ]);
    }
}
