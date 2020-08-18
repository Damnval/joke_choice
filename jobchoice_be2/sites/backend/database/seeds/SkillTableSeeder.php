<?php

use Illuminate\Database\Seeder;

class SkillTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $timestamp = now();
        
        DB::table('skills')->insert([
            [
                'name'       => '特になし',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '普通自動車免許（AT限定含む）',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'SE経験',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'Illustrator・Photoshop経験',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'WEBデザイン・開発経験',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '建築士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '土木施工管理技士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '自動車整備士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '電気工事士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '登録販売者',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '宅地建物取引主任者',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '日商簿記',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '看護師（正・准）',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '医療事務',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '薬剤師',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '歯科衛生士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '介護福祉士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '社会福祉士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'ケアマネージャー（介護支援専門員）',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'ヘルパー（介護職員初任者研修者）',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '保育士',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '理容師',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '美容師',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '調理師',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '英語',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '中国語',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '韓国語',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => 'その他言語',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name'       => '障がい者手帳保持者',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
        ]);
    }
}
