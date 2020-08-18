<?php

use Carbon\Carbon;
use App\Models\JobSubCategory;
use App\Models\JobJobSubCategory;

use Illuminate\Database\Seeder;

class JobSubCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();
        $faker = Faker\Factory::create();
        DB::table('job_sub_categories')->insert([
            [
                'sub_category' => '【一般事務・データ入力】一般事務、営業事務、データ入力、大学・学校事務',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【受付・秘書】受付・秘書',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ユーザーサポート・コールセンター】コールセンター・テレフォンオペレーター、メール(チャット)オペレーター',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【経理・人事・総務・士業】経理・財務、人事・総務・法務、税理士・会計事務所、法律事務所',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【金融事務】生保・損保金融事務、銀行・証券',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【英語事務】英文事務、英文経理、翻訳・通訳',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ﾏｰｹﾃｨﾝｸﾞ・広告】広報・PR、広告宣伝・販促、商品企画・商品開発、調査・リサーチ、WEBﾏｰｹﾃｨﾝｸﾞ、その他ﾏｰｹﾃｨﾝｸﾞ・広告',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他オフィスワーク】その他オフィスワーク',
                'job_category_id' => 1,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【薬剤師・登録販売者・薬局】薬剤師、登録販売者、薬局、調剤',
                'job_category_id' => 2,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【看護・介護】看護師・准看護師、ケアマネージャー、介護福祉士、看護助手、訪問介護・看護、施設内介護・看護',
                'job_category_id' => 2,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【歯科医・歯科衛生士・歯科助手】歯科医(歯科医師)、歯科衛生士、歯科助手',
                'job_category_id' => 2,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他医療・看護・介護】病院事務・受付(医療事務)、病院、栄養士・管理栄養士、マッサージ師・整体師、その他医療・看護・福祉',
                'job_category_id' => 2,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【クリエイティブ(WEB・DTP・CAD)】WEBデザイナー・コーダー、WEBディレクター、イラストレーター・グラフィックデザイナー、DTPオペレーター、CADオペレーター',
                'job_category_id' => 3,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【編集・ライター・制作・撮影】編集プロダクション(編集部)・校正・ライター、撮影スタッフ・映像制作会社、その他編集・制作・撮影',
                'job_category_id' => 3,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【エンジニア】システムエンジニア(SE)、プログラマー(PG)、ネットワークエンジニア・運用・保守、社内SE、テスト・評価、その他エンジニア',
                'job_category_id' => 3,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他クリエイティブ・エンジニア】パタンナー・縫製、研究職、インテリアコーディネーター、その他クリエイティブ・エンジニア',
                'job_category_id' => 3,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【商品管理・倉庫管理】仕分、品出し(ピッキング)、梱包、棚卸、検品、倉庫管理・入出荷',
                'job_category_id' => 4,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【食品製造・部品組立】食品製造、食品検査、部品組立、部品検査、その他食品製造・部品組立',
                'job_category_id' => 4,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【配達・ドライバー補助】配達・配送・宅配便、移転・引っ越し、ドライバー・運転手、ドライバー補助、タクシー運転手、送迎、新聞配達、バイク便・メッセンジャー',
                'job_category_id' => 4,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他軽作業・物流・製造】その他軽作業・物流・製造',
                'job_category_id' => 4,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【案内・受付(レセプション)・フロント】案内・受付(レセプション)・フロント',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【清掃・掃除】清掃・掃除',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【待ちの施設(クリーニング・公共施設)】クリーニング店、クリニック、ガソリンスタンド・洗車、レンタカー、公共施設・官公庁・郵便局、その他町の施設',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【映画館・美術館・ネットカフェ】映画館・劇場・プラネタリウム、美術館・博物館・図書館、ネットカフェ・漫画喫茶',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ホテル・ブライダル・セレモニー】ホテル・旅館・ペンション、ホテル客室清掃・ベッドメイキング、ブライダル・ウエディング(結婚式場)、葬儀屋・セレモニー',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【アミューズメント】アミューズメント・ゲームセンター、ボウリング場、カラオケ',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【遊園地・ゴルフ場・ゲレンデ】遊園地・動物園・水族館、ゴルフ場(キャディ)・ゴルフ練習場、温泉・銭湯・スーパー銭湯、ゲレンデ・スキー場、空港・鉄道、その他レジャー施設',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他施設サービス】設備・保守・点検、その他施設サービス、店長・マネージャー候補(サービス)',
                'job_category_id' => 5,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【家事代行・ハウスクリーニング】家事代行・ハウスクリーニング',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ベビーシッター】ベビーシッター',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【保育・学童】保育士・幼稚園教諭、学童・児童館・託児所・児童相談所',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【英会話教室・塾・予備校・家庭教師】英語講師、講師・チューター、家庭教師、個別指導、英会話教室・塾・予備校関連業務',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【インストラクター】スポーツインストラクター・コーチ、スポーツジム・フィットネスクラブ、その他インストラクター、PCインストラクター・パソコン教室、音楽教室・ピアノ講師',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他家事・保育・習い事】採点・添削、試験監督・試験官、その他家事・保育・習い事',
                'job_category_id' => 6,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【理美容・エステ】理容師・美容師（美容院）・ヘアメイク、アイリスト・まつげエクステ、ネイルサロン・ネイリスト、エステ・脱毛、トリマー',
                'job_category_id' => 7,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【リラクゼーション・リフレクソロジー】リフレクソロジー・マッサージ、アロマ、セラピスト、ヨガ・ピラティス',
                'job_category_id' => 7,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他理美容・リラクゼーション】その他理美容・リラクゼーション',
                'job_category_id' => 7,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【電話・内勤営業】テレマーケティング窓口営業（カウンターセールス）',
                'job_category_id' => 8,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【外勤営業】ルートセールス、法人営業、個人営業',
                'job_category_id' => 8,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【店舗巡回】ラウンダー、営業代行',
                'job_category_id' => 8,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他営業】その他営業',
                'job_category_id' => 8,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ホールスタッフ】ホールスタッフ・配膳',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【キッチンスタッフ】キッチンスタッフ・皿洗い・洗い場、調理師',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ランチタイムスタッフ】ランチタイムスタッフ',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【カフェ・喫茶・パン・ケーキ】カフェ・コーヒー・バリスタ・喫茶店、パン屋（ベーカリー）、パティシエ・スイーツ（アイスクリーム・ケーキ・クレープ）',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ファミレス・ファストフード・お弁当】ファミレス、ファストフード、お弁当、デリカ・テイクアウト',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【レストラン】和食、洋食、中華、イタリアン 、カレー、寿司屋・回転寿司（すし）、焼肉屋、その他レストラン',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【居酒屋・バー】居酒屋、ダイニングバー、バー（Bar）・バーテンダー 、ビアガーデン、その他居酒屋・バー',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ラーメン・蕎麦・うどん】ラーメン・蕎麦・うどん',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他フード・飲食】お好み焼き・たこ焼き屋 、ビュッフェ・食べ放題・バイキング、フードコート・食堂、フードデリバリー・ケータリング、その他フード・飲食、店長・マネージャー候補（フード・飲食）',
                'job_category_id' => 9,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【市場調査・覆面調査・モニター】市場調査 、交通量調査、覆面調査・ミステリーショッパー、アンケートモニター、その他調査業務',
                'job_category_id' => 10,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【ポスティング・サンプリング】ポスティング、サンプリング・ティッシュ・チラシ/ ビラ配り、その他キャンペーン関連',
                'job_category_id' => 10,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【イベント関連】イベントスタッフ、イベント会場設営、その他イベント関連',
                'job_category_id' => 10,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【コンビニ・スーパー・日用品】コンビニ、スーパー・業務スーパー、ドラッグストア、ホームセンター、100 円ショップ・99 円ショップ',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【専門店（花・ペット・本・雑貨）】花屋（フラワーショップ）、ペットショップ、書店（本屋）、CDショップ・レンタルビデオショップ、ワイン、酒類、茶・紅茶・コーヒー、雑貨・インテリア・家具・文房具、おもちゃ屋・カード・ゲームショップ、スポーツショップ カ、メラ・写真屋 、バイク・自転車ショップ そ、の他専門店',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【アパレル・化粧品・百貨店販売】アパレル（ファッション・服） 、子供服、化粧品・コスメ・美容部員、アクセサリー・ジュエリー、靴（シューズ）、デパート（百貨店）、ショッピングモール・アウトレット',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【食品販売】惣菜販売・デパ地下、精肉・青果',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【推奨販売】試飲/ 試食・デモンストレーター・マネキン',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【携帯・家電販売】携帯販売、家電量販店',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他販売】レジ打ち、その他販売、店長・マネージャー候補（販売）',
                'job_category_id' => 11,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'sub_category' => '【その他】',
                'job_category_id' => 12,
                'description' => $faker->text,
                'created_at' => $now,
                'updated_at' => $now
            ]
        ]);

    }

}
