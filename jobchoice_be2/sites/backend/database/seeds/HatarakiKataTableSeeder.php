<?php

use Illuminate\Database\Seeder;

class HatarakiKataTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('hataraki_kata')->insert([
            [
                'item_jp'                   => '即日勤務可能',
                'item_en'                   => 'Can work on the same day',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/13.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '短期（1～7日）のお仕事',
                'item_en'                   => 'Short-term (1-7 days) work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-31.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '短期(1ヶ月以内)のお仕事',
                'item_en'                   => 'Short-term (within 1 month) work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-32.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '短期(3ヶ月以内)のお仕事',
                'item_en'                   => 'Short-term (within 3 months) work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-33.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '長期（1年以上～定めなし）のお仕事',
                'item_en'                   => 'Long-term (more than 1 year-no time limit) work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-34.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => 'オンシーズンのみ働く',
                'item_en'                   => 'Work only on season',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-35.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '単日（1日）のお仕事',
                'item_en'                   => 'One day work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/40.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '長期（3ケ月以上1年以内）',
                'item_en'                   => 'Long-term (3 months or more and 1 year or less',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/41.jpg',
                'hataraki_kata_category_id' => '1'
            ],
            [
                'item_jp'                   => '出勤・退勤時間交渉OK',
                'item_en'                   => 'Working time · Negotiation OK',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/02.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '1日4ｈ以内',
                'item_en'                   => 'Within 4 hours in a day',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/03.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '月毎のシフト制',
                'item_en'                   => 'Monthly shifting',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/05.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '残業なし・少なめ',
                'item_en'                   => 'No overtime work',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/06.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '午後、夕方から勤務可',
                'item_en'                   => 'Working from the afternoon or the evening',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/65.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => 'お子様が返ってくるまでの勤務でOK',
                'item_en'                   => 'It is OK by work until child comes back',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-36.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '午前中のみ勤務可',
                'item_en'                   => 'Working only in the morning',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-37.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => 'フレックスタイム制',
                'item_en'                   => 'Flex time system',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/0322-39.jpg',
                'hataraki_kata_category_id' => '2'
            ],
            [
                'item_jp'                   => '高収入のお仕事',
                'item_en'                   => 'High salary',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/09.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '時給1,000円以上',
                'item_en'                   => 'Salary more than 1,000 yen hourly',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/10.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '賞与・ボーナスあり',
                'item_en'                   => 'Bonus available',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/11.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '日払いor週払いあり',
                'item_en'                   => 'Daily or weekly payment ',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/12.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => 'インセンティブあり',
                'item_en'                   => 'There is an incentive',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/42.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '昇給あり',
                'item_en'                   => 'With salary raise',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/43.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '完全歩合制',
                'item_en'                   => 'Commission system',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/44.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '月給制',
                'item_en'                   => 'Monthly pay',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/45.jpg',
                'hataraki_kata_category_id' => '3'
            ],
            [
                'item_jp'                   => '外資企業',
                'item_en'                   => 'Foreign company',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/01.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => 'お子様連れOKのお仕事',
                'item_en'                   => 'Able to bring children',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/14.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => 'リゾート地でお仕事',
                'item_en'                   => 'Work at resort',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/16.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => '駅チカ・駅ナカ（徒歩5分以内）',
                'item_en'                   => 'Near station/inside station(takes less than 5 minutes)',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/17.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => 'おしゃれなオフィス・お店で働く ',
                'item_en'                   => 'Work in a fashionable office / shop I can learn and use language',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/53.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => '語学が身につく・活かせる',
                'item_en'                   => 'You can learn and use language skill',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/54.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => '中小アットホームな職場',
                'item_en'                   => 'Small and medium at-home workplace',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/55.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => '上場企業・有名企業',
                'item_en'                   => 'Listed companies / famous companies',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/56.jpg',
                'hataraki_kata_category_id' => '4'
            ],
            [
                'item_jp'                   => '託児所あり',
                'item_en'                   => 'Nursery ',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/15.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '交通費支給',
                'item_en'                   => 'With transportation expenses',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/24.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '産休・育休OK',
                'item_en'                   => 'Maternity leave is OK',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/25.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '寮・社宅あり',
                'item_en'                   => 'There is dormitory',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/26.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '資格取得支援あり',
                'item_en'                   => 'We support qualification acquisition',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/68.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '各種社会保険完備',
                'item_en'                   => 'Various social insurance complete',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/61.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '食事付',
                'item_en'                   => 'Free meals',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/63.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '駐車場・駐輪場完備',
                'item_en'                   => 'Parking lot and bicycle parking lot complete',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/64.jpg',
                'hataraki_kata_category_id' => '5'
            ],
            [
                'item_jp'                   => '学生活躍中',
                'item_en'                   => 'Student is accepted',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/21.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => '主婦（夫）が活躍中',
                'item_en'                   => 'Housewife (husband) is active',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/22.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => 'ミドル世代（40代）が活躍中',
                'item_en'                   => 'Middle(40’s) is welcome',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/28.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => 'エルダー世代（50代）が活躍中',
                'item_en'                   => 'Elder(50’s) is welcome',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/29.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => 'シニア世代（60代）が活躍中',
                'item_en'                   => 'Senior generation (60s) active',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/30.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => '外国人（留学生）活躍中',
                'item_en'                   => 'Foreigners (international students) are active',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/58.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => 'オープニングスタッフ',
                'item_en'                   => 'Opening staff',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/59.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => '20～30代活躍中',
                'item_en'                   => 'Active in the 20s-30s',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/60.jpg',
                'hataraki_kata_category_id' => '6'
            ],
            [
                'item_jp'                   => '家庭都合の休み調整可',
                'item_en'                   => 'Holiday adjustment possible for home convenience',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/04.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '週1～OK',
                'item_en'                   => 'Able to work from 1 day in a week',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/07.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '週末のみ',
                'item_en'                   => 'Weekend and holidays only',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/27.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '土日祝休み',
                'item_en'                   => 'Weekends and holidays are day off',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/08.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => 'Wワーク△ 副業で働く',
                'item_en'                   => 'Double work and Side job',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/18.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '在宅ワーク・内職のお仕事 ',
                'item_en'                   => 'Work at home work / job at home',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/19.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '扶養内で働く',
                'item_en'                   => 'Work within the range of tax deduction for dependents　',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/20.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '週2・3～OK',
                'item_en'                   => 'OK with 2 to 3 shifts a week',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/57.jpg',
                'hataraki_kata_category_id' => '7'
            ],
            [
                'item_jp'                   => '学歴不問',
                'item_en'                   => 'Regardless of educational background',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/46.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '新卒歓迎（3月卒予定）',
                'item_en'                   => 'Fresh graduates are welcome(who will graduate on March)',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/47.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '第二新卒歓迎（卒後3年以内）',
                'item_en'                   => 'New graduates welcome (within 3 years after graduation)',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/48.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '社員登用あり',
                'item_en'                   => 'Possibility of full-time employment',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/49.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '髪型・服装自由',
                'item_en'                   => 'You can have any hairstyle and uniform',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/51.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '経験者優遇',
                'item_en'                   => 'Give preference to experienced people',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/66.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '履歴書不要',
                'item_en'                   => 'No resume required',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/67.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            [
                'item_jp'                   => '未経験OK、充実した研修制度',
                'item_en'                   => 'Inexperienced OK, substantial training system',
                'image'                     => config('app.staging_url') . '/images/assets/hatarakikata/69.jpg',
                'hataraki_kata_category_id' => '8'
            ],
            
        ]);
    }
}
