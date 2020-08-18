import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import './FAQ.scss'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal'
import store from '../../../store/config'
import api from '../../../utilities/api'
import { logoutUser } from '../../../store/auth/actions'
import LoadingIcon from '../../../components/loading/Loading'
import Modal from '../../../components/modal/Modal'

class FAQ extends Component {
  constructor( props ) {
      super( props )
      this.state = {
        questions: [],
        modal: {
          messageKey: "forgetPWFAQ",
          message: '',
          show: false,
        },
        isLoading: false
      }

      this.handleParentClose = this.handleParentClose.bind(this)
      this.handleParentSuccess = this.handleParentSuccess.bind(this)
  }

  componentDidMount() {
    this.setState({
      questions: [
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 1  /////////////////////////////
        //////////////////////// 5 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: 'JOBチョイスについて',
            US: 'About Job choice'
          },
          answers: [
            {
              subQuestion: {
                JP: "JOBチョイスとは何ですか",
                US: 'What is JOB choice?'
              },
              answer: {
                US: <><p>JOB choice is a new recruitment media to support finding job with a concept of sharing jobs with everyone. There are many posts for Regular/Contract/Part time employees.</p>
                　  <p>To find better job for you, you can choose working condition that you want which we call "Hatarakikata choice". We analyzed your working condition and posted jobs with our own algorithm, and show its matching rate to help you in finding a job.</p>
                　  <p>Also, you can share jobs via SMS and etc. to your friends and acquaintances other than finding a job. If they apply and the company chooses them from applicants, you can earn "share money" as their sharer.</p></> ,
                JP: <><p>JOBチョイスとは、みんなで届けるシェア求人をコンセプトに、新しいお仕事探しをサポートする求人サイトです。正社員・契約社員・アルバイトなど、様々なお仕事を掲載しています。</p>
                　  <p>より自分にあったお仕事を探しやすくするため、働き方チョイスという、自分の希望する労働条件を選択することができます。希望する労働条件である働き方チョイスと掲載している求人を、独自のアルゴリズムで分析し、あなたにマッチした求人をマッチング率で表示しているため、 よりあなたの希望するお仕事に出会えます。</p>
                　  <p>また、お仕事を探すだけでなく、求人をSMSなどでシェアすることで、友人・知人にお仕事の紹介を行うことができます。 紹介した方が応募し、企業が選考決定したら、紹介したあなたにシェアマネーをお支払いたします。</p></>
              },
            },
            {
              subQuestion: {
                JP: "お仕事シェアとはなんですか",
                US: 'What is sharing jobs?'
              },
              answer: {
                US: <p>"Sharing jobs" is to share post jobs in JOB choice via SNS.</p>,
                JP: <p>JOBチョイスでは、掲載されている求人情報をSNSなどでシェアし拡散することを「お仕事シェア」と呼んでおります。</p>
              },
            },
            {
              subQuestion: {
                JP: "JOBチョイスでシェアするメリットはなんですか",
                US: 'What is the benefit of sharing jobs?'
              },
              answer: {
                US: <p>You can share jobs to your friends/acquaintances via SMS and the likes.
                       if they apply and the company chooses them from applicants, you can earn "share money" as their sharer. 
                    </p>,
                JP: <p>求人をSMSなどでシェアすることで、友人・知人にお仕事の紹介を行うことができます。 紹介した方が応募し、企業が選考決定したら、紹介したあなたにシェアマネーを受け取ることができます。</p>
              },
            },
            {
              subQuestion: {
                JP: "SNSを利用していなくてもシェアできますか",
                US: 'Is it possible to share even if I am not using any SNS?'
              },
              answer: {
                US: <p>You can also share via Email and SMS(shot mail). So using SNS is not required to share jobs.</p>,
                JP: <p>メールやSMS（ショートメール）で、お仕事情報を簡単に送られる仕組みも取り入れておりますので、SNSを利用していなくてもシェアする事が可能です。</p>
              },
            },
            {
              subQuestion: {
                JP: "シェア以外の利用はできますか",
                US: 'What is the use of Job choice other than sharing?'
              },
              answer: {
                US: <p>You can search and apply jobs.</p>,
                JP: <p>お仕事情報の検索、お仕事への応募ができます。</p>
              },
            },
          ],
          showAnswer: false,
        },
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 2  /////////////////////////////
        //////////////////////// 6 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: 'シェア・シェアマネーについて',
            US: 'About Share/Share money'
          },
          answers: [
            {
              subQuestion: {
                JP: "シェアのやり方を知りたい",
                US: 'How to share?'
              },
              answer: {
                US: <p>Facebook, twitter, and LINE are supported. Other than them, you can share via SMS, QR code and URL copy. In job detail page, you can share with your own message.</p>,
                JP: <p>SNSはFacebook、twitter、LINEに対応しております。SNS以外ではメールやSMS（ショートメール）、
                       その他として、QRコード、URLコピー機能があります。求人詳細のシェアから簡単にメッセージを作成し送る事ができるようになっています。
                    </p>
              },
            },
            {
              subQuestion: {
                JP: "シェアしたお仕事から応募した方がいるか知りたい。",
                US: "Want to know whether I have people who apply for a job from my sharing?"
              },
              answer: {
                US: <p>You can see number of disclosed applicants at "confirmed shared job" in dashboard.</p>,
                JP: <p>ダッシュボードの「シェアマネー確定のお仕事」から、情報開示された応募者数をご覧になれます。</p>
              },
            },
            {
              subQuestion: {
                JP: "シェアマネーとはなんですか",
                US: "What is share money?"
              },
              answer: {
                US: <p>If you share the job and the applicants from the share are selected by the company, 
                       the money that you introduced will be called share money. The amount of shared money also varies depending on the content of the job.
                    </p>,
                JP: <p>お仕事をシェアし、そのシェアから応募した方が企業が選考決定したら、紹介したあなたが受け取るお金をシェアマネーと呼びます。求人内容によってシェアマネーの金額も異なります。</p>
              },
            },
            {
              subQuestion: {
                JP: "シェアマネーはどうやって受け取りますか",
                US: "How to receive share money?"
              },
              answer: {
                US: <p>We will transfer it to the bank account you registered. If you do not register your bank account information, you can not receive it. 
                       Please do not forget to register. ※ Because we can not pay even if the account information is incorrect, 
                       please list the correct bank account information.</p>,
                JP: <p>ご登録頂きました口座に振り込ませて頂きます。口座情報が登録されていないとお受け取りができませんので、忘れずにご登録をお願い致します。※口座情報が不正の場合もお支払い出来かねますので、正しい口座情報を記載下さい。</p>
              },
            },
            {
              subQuestion: {
                JP: "シェアマネーはいつ受け取れますか",
                US: "When is the share money paid?"
              },
              answer: {
                US: <p>The cut-off is every end of month at 23:59, and it will be paid into registered bank account on 15th of following month
                      (if weekends or holiday, will be paid next working day). 
                      <a href="#" onClick={()=>this.handleInDevelopment()}> For further info</a>
                    </p>,
                JP: <p>毎月末23：59時点でのシェアマネー額を計上し、翌月15日（土日祝祭日の場合は翌営業日）に、ご登録頂いた口座に振り込ませて頂きます。
                      <a href="#" onClick={()=>this.handleInDevelopment()}> 詳しくはこちら</a>
                    </p>
              },
            },
            {
              subQuestion: {
                JP: "受け取り予定のシェアマネー額を知りたい",
                US: "Want to know how much I'll receive?"
              },
              answer: {
                US: <p>You can check at "shared compensation" in dashboard</p>,
                JP: <p>ダッシュボードの「シェアマネー額」からご覧になれます。</p>
              },
            },
          ],
          showAnswer: false,
        },
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 3  /////////////////////////////
        //////////////////////// 7 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: '会員登録について',
            US: 'About registration'
          },
          answers: [
            {
              subQuestion: {
                JP: "会員登録は必須ですか",
                US: 'Is registration required?'
              },
              answer: {
                US: <p>You can use job search but can't share and apply without registration.</p>,
                JP: <p>会員登録しなくてもお仕事検索機能はご利用頂けますが、お仕事のシェア、お仕事応募はできません。</p>
              },
            },
            {
              subQuestion: {
                JP: "会員登録に料金は発生しますか",
                US: 'Is registration charged?'
              },
              answer: {
                US: <p>There is no charge for registration.</p>,
                JP: <p>会員登録に料金は一切かかりません。</p>
              },
            },
            {
              subQuestion: {
                JP: "ログインID・パスワードにはどんなものが使えますか",
                US: 'What can be used as Login ID/Password?'
              },
              answer: {
                US: <p>
                      If you have SNS(Facebook、twitter、LINE) account, you can use its ID/Password. 
                      It'd be easier for you to share a job if you register through SNS account. Other than the SNS, 
                      E-mail address can be used for ID and  you can set as you like with half-width alphabet and numbers.
                    </p>,
                JP: <p>
                      Facebook、twitter、LINEのアカウントをお持ちの方は、ID・パスワードはそのまま使えます。SNSのIDをご登録頂くと、
                      お仕事シェアもより簡単にできるのでオススメです。それ以外だと、IDはメールアドレスが使用でき、パスワードは任意の半角英数字が使用できます。
                    </p>
              },
            },
            {
              subQuestion: {
                JP: "パスワードを忘れてしまいました",
                US: 'Forget password?'
              },
              answer: {
                US: <p>Click 
                      ({this.props.user.data ?
                        <button className="btn btn-link" onClick={() => this.setState({modal:{...this.state.modal,show: true}})}>forgot password</button> :
                        <Link to="/forgot-password/">forgot password</Link>})
                       on the login page, then enter email address and submit. 
                       An email will be sent to you with a link on reset password page. Please reset your password there in the page.
                    </p>,
                JP: <p> ログイン画面のログインボタンの下にある「
                        {this.props.user.data ?
                        <button className="btn btn-link" onClick={() => this.setState({modal:{...this.state.modal,show: true}})}>パスワードを忘れた場合</button> :
                        <Link to="/forgot-password/">パスワードを忘れた場合</Link>}
                        」をクリックし、メールアドレスを入力して送信してください。
                        パスワード再設定画面へのリンクが記載されたメールをお送り致します。パスワード再設定画面からパスワードを再設定してください。
                    </p>
              },
            },
            {
              subQuestion: {
                JP: "ログインID・パスワードが違うといわれログインできません",
                US: "Can't login displaying message 'login ID/Password is invalid'?"
              },
              answer: {
                US: <p>Please check for typo or lacking Capital/Small letters. 
                       If you still can't login, please click
                       ({this.props.user.data ?
                        <button className="btn btn-link" onClick={() => this.setState({modal:{...this.state.modal,show: true}})}>forgot password</button> :
                        <Link to="/forgot-password/">forgot password</Link>}) and reset your password.
                    </p>,
                JP: <p> 大文字小文字のご入力や抜け漏れがないかご確認ください。それでもログインできない場合は、
                        ログイン画面のログインボタンの下にある「
                        {this.props.user.data ?
                        <button className="btn btn-link" onClick={() => this.setState({modal:{...this.state.modal,show: true}})}>パスワードを忘れた場合</button> :
                        <Link to="/forgot-password/">パスワードを忘れた場合</Link>}」をクリックし、パスワードを再設定してください。
                    </p>
              },
            },
            {
              subQuestion: {
                JP: "登録した内容を確認、変更、削除したい",
                US: 'How to check/edit/delete registered information?'
              },
              answer: {
                US: <p>You can check/edit/delete your registered information in user dashboard</p>,
                JP: <p> ご登録頂きました情報は、ユーザーダッシュボードから確認、変更、削除することができます。</p>
              },
            },
            {
              subQuestion: {
                JP: "登録を解除したい",
                US: 'How to cancel your registration'
              },
              answer: {
                US: <p>Could you inform us that you want to cancel your registration from inqury page? Inqury form is <Link to="/contact">here</Link>.</p>,
                JP: <p> 恐れ入りますが、問い合わせフォームより、登録を解除したい旨をお伝え下さい。問い合わせフォームは<Link to="/contact">こちら</Link></p>
              },
            },
            ]
          },
          ////////////////////////////////////////////////////////////////////
          ///////////////////////  QUESTION # 4  /////////////////////////////
          //////////////////////// 4 SUBQUESTIONS  ///////////////////////////
          ////////////////////////////////////////////////////////////////////
          {
            question: {
              JP: '働き方チョイスについて',
              US: 'About Hatarakikata choice'
            },
            answers: [
              {
                subQuestion: {
                  JP: "働き方チョイスとはなんですか",
                  US: 'What is Hatarakikata choice?'
                },
                answer: {
                  US: <p>You can find a job that suit your lifestyle by choosing 64 conditions. 
                         By calculating matching ratio with each job, you'll find a job that matches with the conditions presented</p>,
                  JP: <p>64の労働条件から自分が働きたい条件を選択することで、ライフスタイルにあわせた求人を選ぶことができます。
                         求人との一致率を算出することで、より条件に合った求人が提示されます。</p>
                },
              },
              {
                subQuestion: {
                  JP: "マッチング率とはなんですか",
                  US: 'What is Matching ratio?'
                },
                answer: {
                  US: <p>Matching ratio is calculated by our own algorithm between your desired work style and jobs. 
                         Please refer when you look for a job</p>,
                  JP: <p>独自のアルゴリズムで、希望する働き方とお仕事との一致率（マッチング率）を算出しております。お仕事選びの際に、ご参考ください。</p>
                },
              },
              {
                subQuestion: {
                  JP: "働き方チョイスの登録は必須ですか",
                  US: 'Is Hatarakikata choice required to set?'
                },
                answer: {
                  US: <p>This is not required, but without setting it, you can't see the Matching ratio. Kindly be advised</p>,
                  JP: <p>必須ではありませんが、ご登録頂けない場合、お仕事とのマッチング率は算出できませんので、ご了承ください。</p>
                },
              },
              {
                subQuestion: {
                  JP: "登録した働き方チョイスを確認、変更、削除したい",
                  US: 'How to check/change/delete Hatarakikata choice?'
                },
                answer: {
                  US: <p>You can check/change/delete Hatarakikata choice in dashboard</p>,
                  JP: <p>ご登録頂いた働き方チョイスは、ダッシュボードで確認、変更、削除することができます。</p>
                },
              }
            ],
            showAnswer: false,
          },
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 5  /////////////////////////////
        //////////////////////// 9 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: '応募について',
            US: 'About application'
          },
          answers: [
            {
              subQuestion: {
                JP: "お仕事に応募したい",
                US: 'How to apply for a job?'
              },
              answer: {
                US: <p>After login, you can apply in job detail page.</p>,
                JP: <p>ログイン後、お仕事の詳細からご応募頂けます。</p>
              },
            },
            {
              subQuestion: {
                JP: "応募後の流れを教えてください",
                US: 'What is the process after application?'
              },
              answer: {
                US: <p>Company will check your application after you apply. It refers your registered information in Job choice. Once company makes a decistion, 
                       the status will be changed from applying to waiting. after that, you will receive response from the company you applied through email or phone call. 
                       ※Job choice only offers up to apply, once you apply, please contact with the company you applied</p>,
                JP: <p>応募後、求人掲載企業の選考に入ります。あなたのJOBチョイスに登録している情報を確認し、検討します。
                       企業が選考決定したら、応募中のお仕事のステータスが「企業選考中」となります。その後、ご応募頂いた企業から選考に関して、
                       メールまたはお電話でご連絡があります。※JOBチョイスでは選考決定までとなっていますので、
                       その後のやり取りは企業と直接やりとりをお願い致します。</p>
              },
            },
            {
              subQuestion: {
                JP: "応募後に「応募完了メール」が届きません",
                US: "I can't receive [application complete email] after application?"
              },
              answer: {
                US: <p>Kindly check your email address you registered. 
                       If your email address is correct, you may not have applied successfully, 
                       please login and check your application history. If there is no history, please apply again.</p>,
                JP: <p>ご登録頂いているメールアドレスにお間違いが無いか、再度ご確認をお願い致します。間違いが無い場合、
                       応募出来ていない可能性がありますので、ログインして応募一覧を確認ください。もし、応募されていなければ、再度応募して頂きますようお願い致します。</p>
              },
            },
            {
              subQuestion: {
                JP: "応募後、どれくらいで選考結果が分かりますか",
                US: "How long a company takes to make a decision after application?"
              },
              answer: {
                US: <p>Though it depends on job detail, we apply a system that encourage company to response for applicant as soon as possible. 
                       Basically, we ask all company to decide 7 days after application.</p>,
                JP: <p>求人内容にもよりますが、応募者に対しより早く対応して頂けるよう、企業に案内する仕組を取っております。
                       基本的に、ご応募頂いてから7日以内に選考結果を明示する事を、求人掲載企業にお願いしております。</p>
              },
            },
            {
              subQuestion: {
                JP: "マッチング率100％と表示されているお仕事は、必ず採用されますか",
                US: "If matching ratio is 100%, the applicants always get hired?"
              },
              answer: {
                US: <p>Matching ratio is to refer how much your desire and job maches. Not the possiblity of being hired.</p>,
                JP: <p>マッチング率は、ご希望の働き方と求人がどれくらいマッチしているかの目安として算出しております。
                       採用される可能性ではございませんので、ご了承願います。</p>
              },
            },
            {
              subQuestion: {
                JP: "応募した企業を忘れてしまいました",
                US: "Forgot which company I applied for?"
              },
              answer: {
                US: <p>You can check [applying job] in dashboard.</p>,
                JP: <p>ユーザーダッシュボードの「応募中のお仕事」からご覧頂けます。</p>
              },
            },
            {
              subQuestion: {
                JP: "応募を取り消したい",
                US: "How to cancel the application?"
              },
              answer: {
                US: <p>If the status of job in [applying job] is [applying], you can cancel the application. 
                       But if the status is [waiting] or [rejected], you can't.</p>,
                JP: <p>ユーザーダッシュボードの「応募中のお仕事」のステータスが「応募中」のものは、
                       いつでも取り消して頂けます。ステータスが「企業選考」「不採用」となっているものは、取り消すことはできません。</p>
              },
            },
            {
              subQuestion: {
                JP: "当選したがお断りしたい",
                US: "I was chosen but want to cancel"
              },
              answer: {
                US: <p>When the company contacts you, please tell them directly.</p>,
                JP: <p>企業から連絡があった際に、企業に直接お断りしたい旨をお話してください。</p>
              },
            },
            {
              subQuestion: {
                JP: "プロフィールを変更したい",
                US: "How to change Profile?"
              },
              answer: {
                US: <p>You can change your profile information at [Profile] in user dashboard.</p>,
                JP: <p>ユーザーダッシュボードの「プロフィール」から変更して頂けます。</p>
              },
            },
          ],
          showAnswer: false,
        },
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 6  /////////////////////////////
        //////////////////////// 2 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: '求人について',
            US: 'About job offer'
          },
          answers: [
            {
              subQuestion: {
                JP: "求人の掲載期限を知りたい",
                US: 'How long the job would be posted?'
              },
              answer: {
                US: <p>Refer to posting period in job detail page. However, 
                       if the position is full already or hired, they may close the posting</p>,
                JP: <p>求人詳細の掲載期限をご参考下さい。ただし、企業が希望する人数の応募者が集まったり、採用が決定したら企業が掲載を終了する可能性はございます。</p>
              },
            },
            {
              subQuestion: {
                JP: "求人の仕事内容、勤務条件について知りたい",
                US: 'How to know the task detail and work conditions?'
              },
              answer: {
                US: <p>We offically do not accept inquiry about detail of any job offer to be fair. 
                       You may ask question directly to the company after your status becomes waiting</p>,
                JP: <p>求人について、詳細のご確認や不明点のお問い合わせは、公平性の観点から受け付けておりません。応募後、選考中になり企業から連絡がありましたら、直接企業にお問合わせください。</p>
              },
            },
          ],
          showAnswer: false,
        },
        ////////////////////////////////////////////////////////////////////
        ///////////////////////  QUESTION # 7  /////////////////////////////
        //////////////////////// 3 SUBQUESTIONS  ///////////////////////////
        ////////////////////////////////////////////////////////////////////
        {
          question: {
            JP: 'その他',
            US: 'Others'
          },
          answers: [
            {
              subQuestion: {
                JP: "個人情報の取り扱いについて知りたい",
                US: 'Want to know privacy policy'
              },
              answer: {
                US: <Link to="/privacy-policy">Check here.</Link>,
                JP: <Link to="/privacy-policy">こちらからご覧ください。</Link>
              },
            },
            {
              subQuestion: {
                JP: "JOBチョイス事務局にフォームからお問合わせしたが、回答がない",
                US: 'I inquire from JOB choice secretariat form, but no answer yet'
              },
              answer: {
                US: <p>If you haven't received [inquiry complete] email, you may not have completed inquiry. Please retry inquiry in contact form page</p>,
                JP: <p>「お問合わせが完了しました」のメールは届いておりますでしょうか。届いてない場合はお問合わせが出来ていない可能性が御座いますので、お手数ですが、再度お問合わせフォームから送信して頂きますよう、お願い致します。</p>
              },
            },
            {
              subQuestion: {
                JP: "推奨ブラウザ環境を教えて欲しい",
                US: 'Recommended browser'
              },
              answer: {
                US: <p class="pre-wrap">
                      {"We JOB choice recommed to use following browser\n" +
                      "■ Windows\n" +
                      "・Google Chrome : latest version\n" +
                      "■ Mac(Mac OSX)\n" +
                      "・Google Chrome : latest version\n" +
                      "■ iPhone/iPad (iOS10 and later) \n" +
                      "・Safari  : latest version\n" +
                      "■ Android(5.0 and later)\n" +
                      "・Google Chrome 最新\n\n" +

                      "If you use not recommended browser, the display may be broken.\n"}
                    </p>,
                JP: <p class="pre-wrap">
                      {"JOBチョイスでは以下のブラウザ環境を推奨しています。\n" +
                      "■ Windowsをお使いの場合\n"+
                      "・Google Chrome 最新\n"+
                      "■ Mac(Mac OSX)をお使いの場合\n"+
                      "・Google Chrome 最新\n"+
                      "■ iPhone/iPad (iOS10以降) をお使いの場合\n"+
                      "・Safari 最新\n"+
                      "■ Android(5.0以降) をお使いの場合\n"+
                      "・Google Chrome 最新\n"+
                      "\n"+
                      "推奨環境以外でのご利用は正しく表示されない場合がございます。"}
                    </p>,
              },
            },
          ],
          showAnswer: false,
        },
      ]
    })
  }

  // Accepts the key of the Question
  // Toggles the selected Question
  handleToggle = (key) => {
    const [...questions] = this.state.questions
    questions[key].showAnswer = !questions[key].showAnswer
    this.setState({
      questions: questions
    })
  }

  handleParentSuccess() {
    this.setState({
      isLoading: true,
      modal: {
        ...this.state.modal,
        show: false,
      }
    })
    api.post('api/logout').then(response => {
      if (response.data.status === 200) {
        store.dispatch(logoutUser())
        this.props.history.push('/forgot-password')
      }
    }).catch(error => {
      console.log(error)
      store.dispatch(logoutUser())
      this.setState({
        isLoading: false,
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        }
      })
    })
  }

  handleInDevelopment = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      },
      showCollapsed: !this.state.showCollapsed
    }, () => {
      this.setState({
        modal: {
          messageKey: 'thisIsStillInDevelopment',
          message: LANG[localStorage.JobChoiceLanguage].thisIsStillInDevelopment,
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  render() {
    return (
      <div>
          <JobChoiceLayout className="jobchoice-body">
            <div className="container">
              <div className="flex-row-center">
                <div className="panel_1">
                  <div className="title"><strong>{ LANG[localStorage.JobChoiceLanguage].frequentlyAskQuestions }</strong></div>
                  <div className="faq-title-description">{ LANG[localStorage.JobChoiceLanguage].faqDescription }</div>
                    {this.state.questions.map((value, key) => {
                      return (
                        <div key={key} className="card faq-question-card">
                            <div className="faq-question-card-question-title" onClick={() => this.handleToggle(key)}>
                              {value.question[localStorage.JobChoiceLanguage]}
                            </div>
                            {value.showAnswer && value.answers.map((el,key) => {
                              return (
                                <div className="answer-card">
                                  <h5 className="answer-card-sub-question">{el.subQuestion[localStorage.JobChoiceLanguage]}</h5>
                                  <p>{el.answer[localStorage.JobChoiceLanguage]}</p>
                                </div>
                              )
                            })}
                        </div>
                      )
                    })}
                    <div className="faq-contact-link">
                      <Link to="/contact">{ LANG[localStorage.JobChoiceLanguage].faqBottomLink }</Link>
                    </div>
                </div>
              </div>
            </div>
            <ConfirmationModal 
              show={this.state.modal.show} 
              message={this.state.modal.message}
              messageKey={this.state.modal.messageKey}
              handleSuccess={this.handleParentSuccess}
              handleParentClose={this.handleParentClose} />
            <LoadingIcon show={this.state.isLoading} />
            </JobChoiceLayout>

            <Modal 
              messageKey={this.state.modal.messageKey}
              show={this.state.modal.modal} 
              message={this.state.modal.message}
              type={this.state.modal.modalType}
              redirect={this.state.modal.redirect}
              data={this.state.modal.data}
              handleParentClose={this.handleParentClose}
            />
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

export default connect(mapStateToProps)(FAQ)
