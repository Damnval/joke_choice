<?php

use Illuminate\Database\Seeder;
use App\Models\SpecialFeature;

class SpecialFeatureTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::table('special_features')->insert([
            [
		 		'title_jp' =>  '家庭や子供の用事でお休み調整OK！の仕事特集',
		        'des_header_jp' =>  '子育て中ママには絶対条件？！ご家庭の事情でのお休み調整ＯＫ！',
		        'des_body_jp' =>  '<div class="joboffercat-description-area"><span>主婦に人気の条件、</span><br/><span>【家庭や子供の用事でお休み調整OK】☆</span><br/><span>JOBチョイスには、こんな理想的な求人がいっぱい掲載されているんですよ♪</span><br/><br/><span class="joboffercat-description-red">子育て中ママには絶対条件？！ご家庭の事情でのお休み調整ＯＫ！</span><br/><span>「急に子どもが熱を出して…」</span><br/><span>「子どものクラスが学級閉鎖になっちゃって」</span><br/><span>「学校の役員の集まりがあるんだけど」</span><br/><span>などの場合でも、大丈夫！</span><br/><span>みんな似たような境遇で働いているので、お互い様！</span><br/><span>ご家庭やお子さまの用事でお休み調整も気兼ねなくできるのです☆</span><br/><br/><span>子育て真っ最中の方はもちろん、</span><br/><span>久々のブランク復帰の方、「時間はこだわらないけど融通が利く職場がいい」という方も！</span><br/><span>この特集を眺めているだけであなたの理想の職場が見つかる可能性も…☆</span><br/></div>',
		        'title_en' =>  'Job feature of "You can adjust to set your dayoff because of home event and chilidren\'s event."',
		        'des_header_en' =>  'It is an absolute condition for mothers while raising children?! You can take day off even if the reason is home event.',
		        'des_body_en' =>  '<div class="joboffercat-description-area"><span>The popular condition for housewives,</span><br/><span>【You can take a day off even home event or children\'s event.】☆</span><br/><span>Job Choice has a lot of job offer such ideal♪</span><br/><br/><span class="joboffercat-description-red">It is an absolute condition for Ma\'am while raising children?! You can take a day off even the home event!</span><br/><span>"Suddenly children get a fever .."</span><br/> <span>"Children\'s classes are closing classes"</span><br/><span>"There is a gathering of school officials"</span><br/><span>Even in the above case, there is no problem!</span><br/><span>Everyone works in a similar situation, so each other!</span><br/><span>We can adjsut your day off without hestaion☆</span><br/><br/><span>Of course, those in the middle of raising children,</span><br/><span>For those who have been back for a long time, even those who say "I don\'t care about time, but I can work at a flexible workplace"!</span><br/><span>You may find your ideal workplace just by looking at this feature ... ☆</span><br/></div>'
            ],
            [
            	'title_jp' => '週1or2日のスキマ時間だけで働くお仕事特集',
		        'des_header_jp' => '自分のペースで働ける♪ シフトが柔軟なお仕事だけ♪',
		        'des_body_jp' => '<div class="joboffercat-description-area"><span>この特集では、"スキマ"時間で働けるお仕事だけをご紹介しています！</span><br/><br/><span class="joboffercat-description-red">自分のペースで働ける♪ シフトが柔軟なお仕事だけ♪</span><br/><span>この中に、当てはまる項目はありませんか？</span><br/><br/><ul><li>久々のブランク復帰だから、無理のないペースで働きたい</li><li>空いている日を使って、少しだけお小遣い稼ぎしたい</li><li>今やっている仕事だけでは収入が足りないので、もう１つお仕事したい</li></ul><br/><br/><span>【スキマ時間で働ける】お仕事は、その希望をかなえることができますよ♪</span><br/><br/><span>しかも今回は、【時間や曜日が選べる】お仕事のみを掲載してます♪ </span><br/><span>シフトが選べるって、嬉しいですよね。</span><br/><br/><span>＼期間限定公開／</span><br/><span>のこのお仕事特集、見逃さないでくださいね！</span><br/></div>',
		 		'title_en' =>  'Job feature to work only in the available time of 1 or 2 days a week',
		        'des_header_en' =>  'I can work at my own pace ♪  Only work that is flexible shift ♪',
		        'des_body_en' =>  '<div class="joboffercat-description-area"><span>In this feature, we introduce only work that can work in "available" time!</span><br/><br/><span class="joboffercat-description-red">I can work at my own pace ♪  Only work that is flexible shift ♪</span><br/><span>Don\'t you have any items that apply to this?</span><br/><br/><ul><li>I want to work at an unressonable pace because it is a long time blank return.</li><li>I want to earn small money using my available time.</li><li>I want to have one more job because my income is not enough.</li></ul><br/><br/><span>The work that can work in your availble time can fulfill your hope♪</span><br/><br/><span>Also this time, we post just the job that can chose time and date.♪</span><br/><span>Chosing your shift is good for you right?</span><br/><br/><span>＼Limited Time Release／</span><br/><span>Do not miss this job feature!</span><br/></div>'
            ],
            [
		 		'title_jp' => '40・50代がきらきら活躍！している職場特集',
		        'des_header_jp' => '事務から接客、資格を活かせるお仕事までたくさん♪',
		        'des_body_jp' => '<div class="joboffercat-description-area"><span>ここ1,2年で、40・50代の方を積極的に採用している企業が増えてきました。</span><br/><br/><span>『子供が中・高・大学生となり手が離れたので、また腰を据えて仕事を再開したい！』</span><br/><span>『「 ブランク」 「スキルがない」ことが気になってしまい、応募をためらってしまう...』</span><br/><span>『同年代の人がいる職場で仕事をしたい。』</span><br/><br/><span>そんな方にオススメの求人がたくさんあります♪</span><br/><br/><span class="joboffercat-description-red">事務から接客、資格を活かせるお仕事までたくさん♪</span><br/><span>▽未経験でもOKのお仕事</span><br/><span>【事務・データ入力・コールスタッフ・経理・接客販売　など】</span><br/><span>▽資格・経験を活かせるお仕事</span><br/><span>【WEBデザイナー・営業事務・経理・生保/損保事務・　など】</span><br/><br/><span>条件が良いものはすぐに応募締切になるかもしれないので、</span><br/><span>エントリーはお早めにっ☆</span><br/><br/><span>▽ご希望の職種や勤務条件、働きたい地域を選んで探してみてください！▽</span><br/></div>',
		        'title_en' => 'Workplace feature that 40, 50 generations play an active part!',
		        'des_header_en' => 'A lot from office work to customer service, work to make use of qualification ♪',
		        'des_body_en' => '<div class="joboffercat-description-area"><span>In the past one or two years, there are more companies that are actively hiring people in their 40s and 50s.</span><br/><br/><span>"Since my children are middle and high and college students and I have left my hands, I would like to go back to work and resume work!"</span><br/><span>"I\'m worried about" blank "" no skills "and I hesitate to apply ..."</span><br/><span>"I want to work in a workplace with people of the same age."</span><br/><br/><span>There are many recommended jobs for such people ♪</span><br/><br/><span class="joboffercat-description-red">A lot from office work to customer service, work to make use of qualification ♪</span><br/><span>▽Work that can be done even without experience</span><br/><span>【Office work, data entry, call staff, accounting, customer service etc.】</span><br/><span>▽Work that can make use of qualifications and experience</span><br/><span>【WEB designer, sales office work, accounting, life insurance / non-life insurance office work, etc】</span><br/><br/><span>Since good jobs with good conditions may soon be closed,</span><br/><span>Entry is early ☆</span><br/><br/><span>▽Please select and search for your desired job type, working conditions and the area where you want to work! ▽</span><br/></div>'
            ],
            [
		 		'title_jp' => '憧れのお店で働こう！「shopスタッフ特集」',
		        'des_header_jp' => '全国好きなエリア・ブランドが選べる♪',
		        'des_body_jp' => '<div class="joboffercat-description-area"> <span>この特集では、"shopスタッフだけをご紹介しています！</span><br/><br/><ul><li>久々のブランク復帰の方</li><li>がっつり働きたい方</li><li>次のステップを見据えて、店長やエリアマネージャーを考えている方</li><li>最短入社～1年以内で正社員登用有</li></ul><br/><br/><span>条件が良いものはすぐに応募締切になるかもしれないので、</span><br/><span>エントリーはお早めにっ☆</span><br/><br/><span>▽ご希望の職種や勤務条件、働きたい地域を選んで探してみてください！</span><br/></div>',
		        'title_en' => 'Let\'s work in a longing shop! "Shop staff feature"',
		        'des_header_en' => 'You can choose your favorite area brand nationwide ♪',
		        'des_body_en' => '<div class="joboffercat-description-area"><span>In the past one or two years, there are more companies that are actively hiring people in their 40s and 50s.</span><br/><br/><ul><li>The person who return from a long time blank</li><li>The person who wants to work hard</li><li>The person who think of a store manager or area manager looking to the next step</li><li>Join a full-time employee within 1 year</li> </ul><br/><br/><span>Those with good conditions may soon be closed,</span><br/><span>So entry is early ☆</span><br/><br/><span>▽Please select and search for your desired job type, working conditions and the area where you want to work!</span><br/></div>'
            ],
            [
		 		'title_jp' => '憧れのメーカーのお仕事！「ラウンダー特集」',
		        'des_header_jp' => '選べる直行直帰のお仕事♪',
		        'des_body_jp' => '<div class="joboffercat-description-area"><span>この特集では、"shopスタッフだけをご紹介しています！</span><br/><br/><ul><li>久々のブランク復帰の方</li><li>がっつり働きたい方</li><li>次のステップを見据えて、店長やエリアマネージャーを考えている方</li><li>最短入社～1年以内で正社員登用有</li></ul><br/><br/><span>条件が良いものはすぐに応募締切になるかもしれないので、</span><br/><span>エントリーはお早めにっ☆</span><br/><br/><span>▽ご希望の職種や勤務条件、働きたい地域を選んで探してみてください！</span><br/></div>',
		        'title_en' => 'Longing maker\'s work! "Rounder Feature',
		        'des_header_en' => 'You can chose direct bounce job♪',
		        'des_body_en' => '<div class="joboffercat-description-area"><span>In this feature, we introduce only the work of the rounder!</span><br/><br/><ul><li>The person who return from a long time blank</li><li>The person who likes a car</li><li>Your activity, suggestions lead to sales!</li><li>Join a full-time employee within 1 year</li></ul><br/><br/><span>Those with good conditions may soon be closed,</span><br/><span>So entry is early ☆</span><br/><br/><span>▽Please select and search for your desired job type, working conditions and the area where you want to work!</span><br/></div>'
            ]
        ]);
    }
}
