import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ButtonGroup } from 'react-bootstrap'
import './TermsOfUse.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class TermsOfUse extends Component {
  
  render() {
    
    return (
      <div>
        <JobChoiceLayout className="jobchoice-body">
        <div className='privacy-container container'>
          <div className='text-center'>
            <div className="terms-wrapper">
              <div className="condition-wrapper">
                  <p>
                    <strong>
                      利用規約
                    </strong>
                  </p>
                  <p>
                     【総則】
                  </p>
                  <p> 
                      1．本サイトは「定義」に定めるサービス（以下「本サービス」という）を提供するウェブサイトです。
                  </p>
                  <p>
                      2．本利用規約（以下「本規約」という）は、本サービスの登録者（以下「登録者」という）が本サービスを利用する際の、株式会社MEDIAFLAG沖縄（以下、「弊社」といいます。）との権利及び義務について定めるものです。
                  </p>

                  <p>
                     【総則】
                  </p>
                  <p> 
                      1．本サービスは弊社が運営するWebサイト『JOBチョイス』（以下、「本サイト」といいます。）において、インターネットサイト・モバイルサイト上の求職・求人のための検索サイト及び、それに関連するサービスです。
                  </p>
                  <p>
                      2．本サービスは登録者に次のサービスを提供します。
                  </p>
                  <p className="policy-sub-title">
                    ・本サイトに掲載している求人に応募すること
                  </p>
                  <p className="policy-sub-title">
                    ・求人をSMSなどでシェアし、友人・知人にお仕事の紹介を行うことなお、紹介した方が応募し、企業が選考を決定したら、紹介した登録者にシェアマネーをお支払します。
                  </p>

                  <p>
                      【登録者】
                  </p>
                  <p> 
                      1. 登録者とは、弊社に個人情報（「個人情報の取り扱いについて」の定義に従います）および、その他の情報を登録（以下「登録者登録」といいます）し、弊社がこれを承認した方をいいます。登録者は、登録者登録および承認後、本サービスを利用できるものとします。
                  </p>
                  <p>
                     2. 登録者は登録者登録した時点で本規約および「個人情報の取り扱いについて」（以下あわせて「登録者規約」といいます）の内容をすべて承諾したものとみなされます。不承諾の意思表示は、本サービスへの登録をしないことをもってのみ認められるものとします。
                  </p>
                  <p>
                      【本サービスへの登録】
                  </p>
                  <p> 
                     1．本サービスへの登録は以下の要件を満たすこととします。
                  </p>
                  <p className="policy-sub-title">
                    （1）義務教育終了後で満１５歳以上であること。
                  </p>
                  <p className="policy-sub-title">
                    （2）弊社が登録者として不適当と判断する場合に該当しないこと。
                  </p>
                  <p> 
                    2．登録者は、常に登録情報を最新のものに更新するとともに、登録者が入力した情報の内容について責任を負うものとします。なお、登録内容について、登録者自身が登録した内容にて登録者又は第三者が損害を被った場合、弊社は一切の責を負わず、登録者自身がすべての責を負うものとします。
                  </p>
                  <p> 
                    3．次に該当する登録者は、弊社が登録の停止などを行う事ができます。
                  </p>
                  <p className="policy-sub-title">
                    （1）登録希望者が、すでに登録されていた場合
                  </p>
                  <p className="policy-sub-title">
                    （2）登録希望者が、過去にスタッフの資格の取り消し等の処分を受けていた場合
                  </p>
                  <p className="policy-sub-title">
                    （3）登録内容に虚偽があった場合
                  </p>
                  <p className="policy-sub-title">
                    （4）本利用規約に違反したと判断した場合
                  </p>
                  <p className="policy-sub-title">
                    （5）その他、当社が登録者としての登録を不適当と判断した場合・過去に登録者の責任によって登録停止している場合
                  </p>
                  <p>
                    【IDおよびパスワードの管理】
                  </p>
                  <p> 
                    1．登録者は、本サービスを利用するにあたり、ID（メールアドレス）およびパスワードを使用するものとします。
                  </p>
                  <p> 
                    2．登録者は本サービスの ID及びパスワードについて、秘密としてこれを管理し、第三者に開示せず、又使用させないものとします。登録者の管理ミスにより弊社又はに損害が生じた場合、その損害は登録者が負うものとします。
                  </p>
                  <p> 
                    3．ID及びパスワードの管理とその使用に関しての責任は、全て登録者本人が負うものとします。
                  </p>
                  <p> 
                    4. 登録者は理由の如何を問わず、ＩＤ及びパスワードを第三者に使用させ、あるいは譲渡、貸与、名義変更、売買、担保設定等をすることはできません。
                  </p>
                  <p>
                    【利用規約の範囲】
                  </p>
                  <p> 
                    本利用規約は、本サービスが提供するすべてのサービスに対して適用されます。
                  </p>
                  <p>
                    【利用規約の変更】
                  </p>
                  <p> 
                    本利用規約は、如何なる理由でも通知なしに変更することがあります。
                  </p>
                  <p>
                    【お仕事シェア】
                  </p>
                  <p> 
                    1．登録者は、本サイト内に掲載されている求人等の情報を弊社が指定するSNSやメールなどを通じ、弊社が指定する方法でシェア（以下「シェア」という）する事ができます。
                  </p>
                  <p> 
                    2．シェアした求人情報に第三者が弊社が定める手順により応募を行い、応募者が企業選考決定した際に、シェアを行った登録者（以下「紹介者」）にシェアマネーをお支払いします。
                  </p>
                  <p> 
                    3．シェアの方法、その他手続きについては、弊社が指定しするものとし、弊社が定める要件を満たさない場合、シェアは成立しないものとします。
                  </p>
                  <p>
                  【シェアマネーについて】
                  </p>
                  <p> 
                    本サイト内で掲載している求人を本サイト内のシェア機能を使い各種SNS等にシェアし、そのシェアから応募した方に対し、企業が選考決定（企業が応募者の情報開示）を行ったときに、紹介者にお支払いする報酬をシェアマネーと呼びます。
                  </p>
                  <p> 
                    1. シェアマネーは次のすべての要件を満たすことにより発生します
                  </p>
                  <p className="policy-sub-title">
                    （1）本サイト内の求人シェア機能を利用する
                  </p>
                  <p className="policy-sub-title">
                    （2）発行されたURLないしリンクから第三者が求人に応募する
                  </p>
                  <p className="policy-sub-title">
                    （3）求人掲載企業が応募者の情報開示を本サイト上で行う
                  </p>
                  <p> 
                    2. シェアマネーのお支払は、毎月月末を締め日とし、月末当月のシェアマネーを集計し、登録口座に翌月15日にお振込みいたします。
                  </p>
                  <p> 
                    3. 紹介者の振込口座情報が登録されていない場合、または振込口座の誤り、その他振込ができない場合は、初回振込日から180日間を経過した時点で、シェアマネーは消滅します。また当該期間より後の申請・提出は、無効となります。なお、初回振込日から弊社定める期間内の月末までに、正しい口座情報を登録いただいた場合は、振込口座情報を登録頂いた翌月15日にお支払いします。
                  </p>
                  <p> 
                    4. シェアマネーの振込日が土曜・日曜・祝日の場合は、前銀行営業日に振り込むものとします。
                  </p>
                  <p> 
                    5. シェアマネーは、登録本人名義の銀行口座への振込とします。
                  </p>
                  <p> 
                    6. シェアマネー明細は、本サイトより確認するものとし、明細書は発行しないこととします。
                  </p>
                  <p> 
                    7. 登録者側の不備が原因で、指定口座への振込みができなかった場合、弊社は支払遅延について一切の責任を負いません。
                  </p>
                  <p> 
                    8. 弊社は、登録者が次の各号のいずれかに該当する場合、シェアマネーの振込を停止、または登録者がシェアマネーを受け取っているときは、返金を求めることができるものとします。
                  </p>
                  <p className="policy-sub-title">
                    （1）設定口座に誤りがある場合
                  </p>
                  <p className="policy-sub-title">
                    （2）応募者ないし紹介者との本サイト内での求人シェアが確認できない場合
                  </p>
                  <p className="policy-sub-title">
                    （3）短期間に応募と退職を繰り返す場合
                  </p>
                  <p className="policy-sub-title">
                    （4）シェアにより入職した者が勤務の意思がないと弊社が判断した場合
                  </p>
                  <p className="policy-sub-title">
                    （5）虚偽の内容で登録や応募が発覚した場合
                  </p>
                  <p className="policy-sub-title">
                    （6）その他弊社がシェアマネーを支払うことが不適当と判断した場合
                  </p>
                  <p>
                    【サービスの変更・停止】
                  </p>
                  <p> 
                    本サイトは如何なる理由でも、通知なしにサービスの変更・停止をすることができます。サービスの変更・停止に関し登録者・その他の登録者・第三者に対して、本サイトは一切の責任を負いません。
                  </p>
                  <p> 
                    また本サイトは、提供するサービスの品質についてはいかなる保証もおこなっておらず、サービスの停止、欠陥およびそれらが原因となり発生した損失や損害について一切責任を負いません。
                  </p>
                  <p>
                    【責任の制約】
                  </p>
                  <p> 
                    本サイトは誤った使用に対しては一切責任を負いません。
                  </p>
                  <p> 
                    本サイトのご利用によって生じたソフトウェア、ハードウェアその他の損害についても責任を負いません。
                  </p>
                  <p> 
                    本サイトは登録者の皆様が利用されたこと、もしくは何らかの原因により利用できなかったこと、または本サイトの利用によって生じるいかなる損害についても責任を負うものではありません。
                  </p>
                  <p>
                    第9条（企業等からの連絡）
                  </p>
                  <p> 
                    登録者は、登録者登録した情報および活動情報にもとづき、職業紹介事業者や求人企業等から諸連絡を受け取る場合があることを承諾するものとします。
                  </p>
                  <p>
                    第10条（個人情報の取り扱い）
                  </p>
                  <p> 
                    本サイトにおける登録者の個人情報の取扱いについては「個人情報の取り扱いについて（本サイト）」をご確認下さい。
                  </p>
                  <p>
                    第11条（情報の利用）
                  </p>
                  <p> 
                    1. 弊社は、前条に定めるほか、本サイトを利用して登録者が登録した登録者の個人情報、および本サイトの利用履歴等の情報（閲覧履歴、応募履歴、シェア履歴、登録者・企業間の交信内容等を含みますが、これらに限りません）、ならびにこれらの情報を個人を識別・特定できないように加工、集計、分析した統計的な情報を、何らの制限なく利用することができるものとし、登録者はこれを予め承諾するものとします。なお、この利用の期間は登録者でなくなった（理由を問いません）後も継続することがあります。
                  </p>
                  <p> 
                    2. 弊社は、登録者が本サイトを通じて応募した企業または職業紹介事業者から、登録者の転職活動の進捗状況の報告を受ける場合があり、登録者はこれを予め承諾するものとします。
                  </p>
                  <p>
                    第12条（著作権および提供された情報の利用）
                  </p>
                  <p> 
                    1. 本サイトに掲載されているすべてのコンテンツ（写真、イラスト等を含みます、以下同じ）の著作権は弊社に帰属します。ただし、求人企業または職業紹介事業者が投稿したコンテンツはその限りではありません。
                  </p>
                  <p> 
                    2. 弊社は、本サイトへの提供情報（個人が特定される情報を除く）およびそれを基に弊社が作成したすべてのコンテンツを、弊社が編集、発行、発売等を行うものに二次利用できるものとします。なお、二次利用において生じたものに関する著作権は弊社に帰属します。
                  </p>
                  <p>
                    第13条（反社会的勢力の排除）
                  </p>
                  <p> 
                    1. 登録者は、現在および将来にわたり、暴力団、暴力団員、暴力団員でなくなった時から５年を経過しない者、暴力団準構成員、暴力団関係企業、総会屋等、社会運動等標ぼうゴロまたは特殊知能暴力集団等、その他これらに準ずる者（以下これらを「暴力団員等」といいます）に該当しないこと、および次の各号のいずれかに該当しないことを、弊社に対して確約するものとします。
                  </p>
                  <p> 
                    （1）暴力団員等が経営を支配していると認められる関係を有すること。
                  </p>
                  <p> 
                    （2）暴力団員等が経営に実質的に関与していると認められる関係を有すること。
                  </p>
                  <p> 
                    （3）自己、自社もしくは第三者の不正の利益を図る目的または第三者に損害を加える目的をもってするなど、不当に暴力団員等を利用していると認められる関係を有すること。
                  </p>
                  <p> 
                    （4）暴力団員等に対して資金等を提供し、または便宜を供与するなどの関与をしていると認められる関係を有すること。
                  </p>
                  <p> 
                    （5）役員または経営に実質的に関与している者が暴力団員等と社会的に非難されるべき関係を有すること。
                  </p>
                  <p> 
                    2. 登録者は、自らまたは第三者を利用して次の各号のいずれかに該当する行為を行わないことを、弊社に対して確約するものとします。
                  </p>
                  <p> 
                    （1）暴力的な要求行為。
                  </p>
                  <p> 
                    （2）法的な責任を超えた不当な要求行為。
                  </p>
                  <p> 
                    （3）脅迫的な言動、または暴力を用いる行為。
                  </p>
                  <p> 
                    （4）風説を流布し、偽計を用いまたは威力を用いて弊社もしくは企業等の信用を毀損し、または弊社もしくは企業等の業務を妨害する行為。
                  </p>
                  <p> 
                    （5）その他前各号に準ずる行為。
                  </p>
                  <p> 
                    第14条（除名）
                  </p>
                  <p> 
                    登録者が登録者規約に違反したものと弊社が判断した場合、弊社は当該登録者に対し事前に通知することなく、当該登録者の登録者向けサービスの全部または一部の利用を中止し、または除名処分とするなど、弊社が適当と認めるあらゆる措置を講ずることができるものとします。なお、弊社は、登録者への除名等の処分に関するいかなるお問い合わせにもお答えいたしません。
                  </p>
                  <p> 
                    第15条（損害賠償）
                  </p>
                  <p> 
                    登録者が本規約に違反し弊社に対し損害を与えた場合、登録者は弊社に対し一切の損害の賠償義務を負うものとします。
                  </p>
                  <p> 
                    第16条（サービスの変更等）
                  </p>
                  <p> 
                    1. 弊社は、登録者への事前の通知なくして、サービスの変更、または中断を行うことができるものとします。
                  </p>
                  <p> 
                    2. 弊社は１ケ月の予告期間をもって登録者に通知のうえ、サービス全体の提供を終了することができるものとします。
                  </p>
                  <p> 
                    第17条（規約の変更）
                  </p>
                  <p> 
                    弊社は、本規約を随時変更することができるものとします。変更の内容については本サイト上に表示した時点で、直ちにすべての登録者が承諾したものとみなします。
                  </p>
                  <p> 
                    第18条（準拠法および管轄）
                  </p>
                  <p> 
                    弊社が提供する本サイトの諸サービス、および本規約は日本法を準拠法とし、これらに関して生じる一切の紛争については、東京地方裁判所または東京簡易裁判所を第一審の専属的合意管轄裁判所とします。
                  </p>
                  <p> 
                    【禁止事項】
                  </p>
                  <p> 
                    登録者は、本サイトにおいて以下の行為をすることはできません。
                  </p>
                  <p> 
                  （1）意図的に虚偽の情報を登録する行為
                  </p>
                  <p> 
                  （2）他のサイト利用者または第三者に無断で該当人物の特定できる情報を登録・公開する行為
                  </p>
                  <p> 
                  （1）意図的に虚偽の情報を登録する行為
                  </p>
                  <p> 
                  （3）他のサイト利用者、第三者及び当社の著作権、肖像権、その他知的財産権を侵害する、または侵害のおそれがある行為
                  </p>
                  <p> 
                  （4）他のサイト利用者、第三者及び当社第三者及び当社の財産、信用、名誉、プライバシー等を侵害する、または侵害のおそれがある行為
                  </p>
                  <p> 
                  （5）他のサイト利用者、第三者及び当社を誹謗中傷する行為
                  </p>
                  <p> 
                  （6）他のサイト利用者、第三者及び当社に不利益または損害を与える行為
                  </p>
                  <p> 
                  （7）犯罪的行為を助長、又はその実行を暗示する行為
                  </p>
                  <p> 
                  （8）公序良俗に反する行為
                  </p>
                  <p> 
                  （9）その他いかなる法に違反する行為、またはそのおそれのある行為
                  </p>
                  <p> 
                  （10）本サービスの提供される地域において法令に反する行為
                  </p>
                  <p> 
                  （11）過度あるいは不適切に特定の外部ＷＥＢサイトへ誘導することが目的と判断される行為
                  </p>
                  <p> 
                  （12）アダルトサイト・出会い系サイトなど年齢制限を有するサイトや、違法・有害サイトなどへのリンク行為
                  </p>
                  <p> 
                  （13）本サイトを通じて入手した情報を、複製、販売、出版その他私的利用の範囲を超えて使用する行為
                  </p>
                  <p> 
                  （14）本サイトを利用した、営業活動、営利を目的とする情報提供活動行為
                  </p>
                  <p> 
                  （15）ウィルス、ワーム、その他の有害プログラムを本サイトもしくは弊社のサーバーに送信し、または第三者に送信する行為
                  </p>
                  <p> 
                  （16）当サービスの運営を妨げる、あるいは当社の信用を毀損するような行為、またはそのおそれのある行為
                  </p>
                  <p> 
                  （17）本規約に違反する行為
                  </p>
                  <p> 
                    【検索結果の内容】
                  </p>
                  <p> 
                    本サイトは、サイト内に掲載された求人情報を自動的に検索し、結果を作成しております。
                  </p>
                  <p> 
                    本サイトは、検索結果として表示される内容に関して、カテゴリ分類目的以外の内容確認をおこなっておりません。
                  </p>
                  <p> 
                    検索結果として表示される情報の正確さ、信頼性、完全性、合法性、道徳性、著作権の許諾などについて一切の責任を負いません。
                  </p>
                  <p> 
                    【著作権】
                  </p>
                  <p> 
                    本サイトのレイアウト、デザインおよび構造に関する著作権は株式会社MEDIAFLAG沖縄に帰属します。
                  </p>
                  <p> 
                    本サイトのサイトや検索結果ページをWEBサイトで反映したり、検索結果をリフォーマットして表示することは禁じられています。
                  </p>
                  <p> 
                    【その他】
                  </p>
                  <p> 
                     情報などを快適にご利用いただくためにも、登録者の皆様と本サイトの関係につきましては、日本国法が適用されるものとします。
                  </p>
                  <p>
                    <strong>
                      免責事項
                    </strong>
                  </p>
                  <p> 
                    ■以下1～3の場合は、第三者による個人情報の取得に関し、弊社では何らの責任を負いません。
                  </p>
                  <p> 
                    1.ユーザー本人自らが本サイト上の機能または別の手段を用いて特定の企業に個人情報を明らかにする場合
                  </p>
                  <p> 
                    2.登録者本人またはその他の登録者が本サイト上に入力した情報により、期せずして本人が特定できてしまった場合
                  </p>
                  <p> 
                    ■掲載されている求人広告情報に関する免責
                  </p>
                  <p> 
                    本サイトの求人情報は、広告主の責任において提供された情報を編集したものです。
                  </p>
                  <p> 
                    充分に注意して正確な情報を掲載するよう心がけておりますが、その正確性については保証しておりません。
                  </p>
                  <p> 
                    本サイトの求人広告を利用した求職活動・入社の際は、労働条件・待遇等について、ご自身での十分な確認をお願い致します。
                  </p>
                  <p> 
                    本サービスのご利用（これらに伴う第三者の情報提供行為等を含みます）により生じる一切の損害（精神的苦痛、金銭的損失などを含む一切の損害）は、弊社に過失がない限り責任を負わないものとします。
                  </p>
                  <p> 
                    応募・採用に関するお問い合わせについては、登録者の皆様と各広告主、各求人掲載主間で直接連絡をお取りください。
                  </p>
                  <p> 
                    両者間でのトラブルに関しては、弊社では一切関知致しておりません。
                  </p>
                  <p> 
                    ■リンク先サイトの情報に関する免責
                  </p>
                  <p> 
                    本サイトのサービスから他のウェブサイトへのリンクを提供している場合があります。
                  </p>
                  <p> 
                    移動先のホームページは弊社が管理するものではございません。
                  </p>
                  <p> 
                    その内容の真偽、利用から生じる損害につきましては弊社は一切責任を負いかねます。
                  </p>
                  <p> 
                    ■システム障害・不可抗力に関する免責
                  </p>
                  <p> 
                    本サイトでは、サイトメンテナンスや障害によるサービスの中断・延滞・データの消失、サービスの中止等いかなる原因に基づき生じた損害について、一切責任を負いません。
                  </p>
                  <p> 
                    登録者は、本サイトにおけるデータを自己の責任において保存いただくようお願いします。
                  </p>
                  <p> 
                    本サービスは通常講ずるべき対策では防止できないウィルス被害、停電被害、サーバー故障、回線障害、及び天変地異による被害等、不可抗力による被害が生じた場合には、弊社では何らの責任を負いません。
                  </p>
                  <p> 
                    サイトメンテナンスや障害によるサービスの中断・延滞・データの消失、サービスの中止等いかなる原因に基づき生じたデータが消去・変更されないことを保証できません。
                  </p>
                  <p> 
                    ■免責事項についてのお問合せ
                  </p>
                  <p> 
                    「求人広告の内容が実態と違う」等の場合は、下記メールアドレスまでご連絡ください。
                  </p>
                  <p> 
                    こちらで事実確認を行い、掲載内容の訂正・掲載停止などの対応を行わせていただきます。
                  </p>
                  <p className="policy-sub-title">
                    <strong>
                      【『JOBチョイス』のお問い合わせ窓口】
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                  〒905-2172　沖縄県名護市豊原224-3 名護市マルチメディア館1F株式会社MEDIAFLAG沖縄 JOBチョイス事務局Email：jobchoice-info@mediaflag.co.jp
                  </p>
              </div>
            </div>
          </div>
        </div>
        </JobChoiceLayout>

      </div>
    )

  }
  
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
      actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse)
