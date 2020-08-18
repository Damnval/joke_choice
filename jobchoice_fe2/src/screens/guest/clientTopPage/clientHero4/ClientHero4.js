import React, { Component } from 'react'
import './ClientHero4.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'

class ClientHero4 extends Component {

  renderStepContainer(className, title, desc) {
    return (
      <div className={`client-hero-four-step ${className}`}>
        <div className="client-hero-four-title">{title[localStorage.JobChoiceLanguage]}</div>
        <div className="client-hero-four-desc">{desc[localStorage.JobChoiceLanguage]}</div>
      </div>
    )
  }

  render() {
    
    return (
      <div className="client-hero-four">
        <div className="container">
          {this.renderStepContainer(
            '',
            {
              US: "1. Spreading power Japan's largest",
              JP: "①拡散力日本最大級"
            },
            {
              US: "Not only JOB Choice registrants but also outside users can be approached!" +
              "The job will jump out of the JOB choice because the share function allows the user to spread the job!" +
              "In addition, as we work in conjunction with Google For Jobs and Indie, job postings will be spread just by posting!",
              JP: "JOBチョイス内登録者だけではなく、外のユーザーにアプローチが可能！" +
              "また、Google For Jobsやインディードとも連携をしているので、掲載するだけで、求人拡散されます！" +
              "また、Google For Jobsやインディードとも連携をしているので、掲載するだけで、求人拡散されます！"
            }
          )}
          {this.renderStepContainer(
            '',
            {
              US: "2. Matching Visualization",
              JP: "②マッチング可視化"
            },
            {
              US: "\"Working method choice\" to select the working method that the user wants" +
              "Visualize the matching rate with a unique algorithm based on \"4 pieces of job offer\" and " +
              " \"Job offer tag\" that expresses the feature of the job offer! Reference image" +
              "We will prevent mismatches as we know what the applicant wants and how it works!",
              JP: "ユーザーが潜在的に望む働き方を選択する「働き方チョイス」と" +
              "求人の特徴を表現した「4コマ求人」「求人タグ」を元に独自のアルゴリズムでマッチング率を可視化！" +
              "応募者が何がどうった働き方を望んでいるのか分かるため、ミスマッチを防ぎます！"
            }
          )}
          <div className="client-hero-four-row">
            {this.renderStepContainer(
              'step-three',
              {
                US: "3. Published free! Adoption cost reduction!",
                JP: "③掲載無料！採用コスト削減！"
              },
              {
                US: "Information viewing charge (performance fee type), so there is no charge " +
                "according to the posting cost and the posting period! Jobs can be posted at low risk!\n\n" +
                "Information viewing charges are charged when you check the applicant's profile and" +
                "view the contact information for the applicant you want to hire. You don't have to pay for mismatched submissions.\n\n" +
                "Other plans are also available! For details, please refer to the price system at the bottom of the page!",
                JP: "情報閲覧課金（成果報酬型）なので、掲載費や掲載期間による課金はございません！低リスクで求人掲載が可能です！\n\n" +
                "情報閲覧課金とは、、応募者のプロフィールを確認して､採用したい応募者の連絡先を表示する時に料金が発生します。ミスマッチな応募に費用をかけずに済みます。\n\n" +
                "その他のプランもご用意！詳しくはページ下部の料金体系をご参照下さい！"
              }
            )}
            <div className="client-hero-four-table">
              <div className="client-hero-four-table-title">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridTitle }</div>
              <div className="client-hero-four-table-title bottomer lefter righter toper">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridSubTitle }</div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel1 }</div>
                <div className="client-hero-four-table-desc-text bold">1,0000円</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel2 }</div>
                <div className="client-hero-four-table-desc-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageFree }</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel3 }</div>
                <div className="client-hero-four-table-desc-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageFree }</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel4 }</div>
                <div className="client-hero-four-table-desc-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageBrowsing }</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel5 }</div>
                <div className="client-hero-four-table-desc-text bold">3,000円~</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel6 }</div>
                <div className="client-hero-four-table-desc-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageUnli }</div>
              </div>
              <div className="client-hero-four-table-desc bottomer lefter righter">
                <div className="client-hero-four-table-desc-sub-title righter">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero4GridLabel7 }</div>
                <div className="client-hero-four-table-desc-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageUnli }</div>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero4)
