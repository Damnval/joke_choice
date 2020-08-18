import React, { Component } from 'react'
import './JobOfferViewDetails.scss'
import { connect } from 'react-redux'
import { LANG, EM } from '../../constants'
import ReactPlayer from 'react-player'
import HatarakikataDisplay from '../hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import { Button } from 'react-bootstrap'
import Modal from '../../components/modal/Modal'
import Img from 'react-fix-image-orientation'
import { imageDateNow, handleSearchTranslation } from '../../helpers'

const salaryFrequencyOptions = [
  {
    item_en: 'Yearly',
    item_jp: '年収',
    value: 'yearly',
  },
  {
    item_en: 'Monthly',
    item_jp: '月収',
    value: 'monthly',
  },
  {
    item_en: 'Weekly',
    item_jp: '週給',
    value: 'weekly',
  },
  {
    item_en: 'Daily',
    item_jp: '日給',
    value: 'daily',
  },
  {
    item_en: 'Hourly',
    item_jp: '時給',
    value: 'hourly',
  },
]

const welfareOptions = [
  {
    item_jp: '健康保険',
    item_en: 'Health Care',
    id: 'health_insurance'
  },
  {
    item_jp: '厚生年金',
    item_en: 'Welfare Pension',
    id: 'welfare_pension'
  },
  {
    item_jp: '雇用保険',
    item_en: 'Employment Insurance',
    id: 'employment_insurance'
  },
  {
    item_jp: '労災保険',
    item_en: 'Labor Accident Insurance',
    id: 'labor_accident_insurance'
  },
]

const requiredOptions = [
  {
    value: 0,
    en: "Not Required",
    jp: "任意回答にする",
  },
  {
    value: 1,
    en: "Required",
    jp: "必須回答にする",
  },
]

const answerFormOptions = [
  {
    value: 'single',
    en: 'Single Choice',
    jp: '単一選択',
  },
  {
    value: 'multiple',
    en: 'Multiple Selection',
    jp: '複数選択',
  },
  {
    value: 'free_text',
    en: 'Input Field',
    jp: '入力欄',
  },
]

const meansOptions = [
  {
    en: "Walking",
    jp: "徒歩",
    value: "walk",
  },
  {
    en: "Bus",
    jp: "バス",
    value: "bus",
  },
  {
    en: "Train",
    jp: "電車",
    value: "train",
  },
  {
    en: "Car",
    jp: "自動車",
    value: "car",
  },
]

class JobOfferViewDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      videoPlaybackError: null,
      modal: {
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
        messageKey: null,
      },
      // time: {
      //   start_time: '',
      //   end_time: '',
      // }
    }
    
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  handleVideoPlaybackError() {
    this.setState({
      videoPlaybackError: LANG[localStorage.JobChoiceLanguage].urlChosenNotPlayable
    })
  }

  handleInDevelopment = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    }, () => {
      this.setState({
        modal: {
          messageKey: 'thisIsStillInDevelopment',
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

    const start_time_data = this.props.job.start_time && this.props.job.start_time !== null && this.props.job.start_time !== undefined ? this.props.job.start_time.split(":") : []
    const start_time = start_time_data.length > 0 ? start_time_data[0] + ':' + start_time_data[1] : ''

    const end_time_data = this.props.job.end_time && this.props.job.end_time !== null && this.props.job.end_time !== undefined ? this.props.job.end_time.split(":") : []
    const end_time = end_time_data.length > 0 ? end_time_data[0] + ':' + end_time_data[1] : ''
    
    return (
      <div className="job-offer-detail-bg">
        
        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
            <span>{LANG[localStorage.JobChoiceLanguage].pricePlanEstimate}</span>
          </div>

          <div className="createJob-links">
            {/* <Button onClick={()=>this.handleInDevelopment()} className="createJob-links-actual">{LANG[localStorage.JobChoiceLanguage].aboutCharges}</Button> */}
            {/* <Button onClick={()=>this.handleInDevelopment()} className="createJob-links-actual">{LANG[localStorage.JobChoiceLanguage].clickHereForRates}</Button> */}
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="employment_period">
              <span>
                {LANG[localStorage.JobChoiceLanguage].jobType}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">
              {handleSearchTranslation('EMPLOYMENT_PERIOD', this.props.job.employment_period)}
            </span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="employment_type">
              <span>
                {LANG[localStorage.JobChoiceLanguage].employmentForm}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">
              {handleSearchTranslation('EMPLOYMENT_TYPE', this.props.job.employment_type)}
            </span>
          </div>

          <div className="section-break"></div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="company_name">
              <span>
                {LANG[localStorage.JobChoiceLanguage].companyNameCreate}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.service_company}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="zip_code">
              <span>{LANG[localStorage.JobChoiceLanguage].zipCode}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.geolocation ? this.props.job.geolocation.zip_code: ''}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="complete_address">
              <span>{LANG[localStorage.JobChoiceLanguage].address}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.geolocation ? this.props.job.geolocation.complete_address: ''}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="location_details">
              <span>
                {LANG[localStorage.JobChoiceLanguage].locationDetails}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.location_details}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="incentive_per_share">
              <span>
                {LANG[localStorage.JobChoiceLanguage].incentivePerShare}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.price && this.props.job.price !== null && this.props.job.price.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} {this.props.job.price && this.props.job.price !== null && '円'}</span>
          </div>
          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <div></div>
            <div>
              <a className="job-offer-detail-link-share" href="#" onClick={()=>this.handleInDevelopment()}>※{LANG[localStorage.JobChoiceLanguage].pleaseReferHereShareReward}</a><br/>
              <a className="job-offer-detail-link-share" href="#" onClick={()=>this.handleInDevelopment()}>※{LANG[localStorage.JobChoiceLanguage].pleaseReferMoneyPerShare}</a>
            </div>
          </div>
        </div>
        
        
        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
            <span>
              {LANG[localStorage.JobChoiceLanguage].recruitmentBasicInfo}
            </span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="title">
              <span>{LANG[localStorage.JobChoiceLanguage].jobTitle}
              <span className="required-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
            </span>:</span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.title}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="thumbnail">
              <span>
                {LANG[localStorage.JobChoiceLanguage].thumbnail}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-image-main-container">
              {!this.props.job.job_image || this.props.job.job_image === null || this.props.job.job_image === "" ?
                <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>:
                <div>
                  <Img src={this.props.job.job_image} alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className="job-offer-detail-image"/>
                </div>
              }
            </div>
          </div>

          <div className="section-break"></div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="nearest_station1">
              <span>{LANG[localStorage.JobChoiceLanguage].nearestStation} 1
              <span className="required-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
              </span>:
              </span>
            </label>
            <div className="job-offer-detail-two-element-multispan-2">
              <span className="job-offer-detail-two-span">{this.props.job.nearest_station && this.props.job.nearest_station[0] && this.props.job.nearest_station[0].station}</span>
              <span className="job-offer-detail-two-span">
                <span className="job-offer-detail-left">
                  { this.props.job.nearest_station && this.props.job.nearest_station[0] && this.props.job.nearest_station[0].transportation !== null && this.props.job.nearest_station[0].transportation.length > 0 ?
                    <>
                      {localStorage.JobChoiceLanguage === "US" ? 
                        meansOptions.find(op => op.value === this.props.job.nearest_station[0].transportation).en : 
                        meansOptions.find(op => op.value === this.props.job.nearest_station[0].transportation).jp
                      } :
                    </> :
                    <span></span>
                  }
                </span>
                <span className="job-offer-detail-right">{this.props.job.nearest_station && this.props.job.nearest_station[0] && this.props.job.nearest_station[0].time_duration !== null ? this.props.job.nearest_station[0].time_duration + ' ' + LANG[localStorage.JobChoiceLanguage].minutes : ''}</span>
              </span>
            </div>
          </div>

          
          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
          <label htmlFor="nearest_station2">
              <span>{LANG[localStorage.JobChoiceLanguage].nearestStation} 2
              <span className="optional-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
              </span>:
              </span>
            </label>
            <div className="job-offer-detail-two-element-multispan-2">
              <span className="job-offer-detail-two-span">{this.props.job.nearest_station && this.props.job.nearest_station[1] && this.props.job.nearest_station[1].station}</span>
              <span className="job-offer-detail-two-span">
                <span className="job-offer-detail-left">
                  { this.props.job.nearest_station && this.props.job.nearest_station[1] && this.props.job.nearest_station[1].transportation !== null && this.props.job.nearest_station[1].transportation.length > 0 ?
                    <>
                      {localStorage.JobChoiceLanguage === "US" ? 
                        meansOptions.find(op => op.value === this.props.job.nearest_station[1].transportation).en : 
                        meansOptions.find(op => op.value === this.props.job.nearest_station[1].transportation).jp
                      } :
                    </> :
                    <span></span>
                  }
                </span>
                <span className="job-offer-detail-right">{this.props.job.nearest_station && this.props.job.nearest_station[1] && this.props.job.nearest_station[1].time_duration !== null ? this.props.job.nearest_station[1].time_duration + ' ' + LANG[localStorage.JobChoiceLanguage].minutes : ''}</span>
              </span>
            </div>
          </div>
          

          <div className="section-break"></div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="description">
              <span>
                {LANG[localStorage.JobChoiceLanguage].jobDescription}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span preserve-multiple-line">{this.props.job.description}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="main_image">
              <span>{LANG[localStorage.JobChoiceLanguage].mainImage}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-image-main-container">
            {this.props.job.galleries.length > 0 && this.props.job.galleries[0] ?
              <>
                <div>
                  <Img src={this.props.job.galleries[0].file_path} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                </div>
                <span className="job-offer-detail-image-sub-caption">{this.props.job.galleries[0].caption}</span>
              </> :
              <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="sub_image1">
              <span>
                {LANG[localStorage.JobChoiceLanguage].subImage}1
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-image-main-container">
            {this.props.job.galleries.length > 1 && this.props.job.galleries[1] ?
              <>
                <div>
                  <Img src={this.props.job.galleries[1].file_path} alt={LANG[localStorage.JobChoiceLanguage].subImage + '1'} className="job-offer-detail-image"/><br/>
                </div>
                <span className="job-offer-detail-image-sub-caption">{this.props.job.galleries[1].caption}</span>
              </>
              :
              <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="sub_image2">
              <span>{LANG[localStorage.JobChoiceLanguage].subImage}2
              <span className="optional-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
              </span>:
              </span>
            </label>
            <div className="job-offer-detail-image-main-container">
            {this.props.job.galleries.length > 2 && this.props.job.galleries[2] ?
              <>
                <div>
                  <Img src={this.props.job.galleries[2].file_path} alt={LANG[localStorage.JobChoiceLanguage].subImage + '2'} className="job-offer-detail-image"/><br/>
                </div>
                <span className="job-offer-detail-image-sub-caption">{this.props.job.galleries[2].caption}</span>
              </>
              :
              <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="url_job_video">
              <span>{LANG[localStorage.JobChoiceLanguage].jobVideo}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-image-main-container">
            {this.props.job.url_job_video && this.props.job.url_job_video !== null && this.props.job.url_job_video.length > 0 ?
              <div className="job-offer-detail-video">
                {this.state.videoPlaybackError !== null ? 
                  <span className="job-offer-detail-image-sub-caption">{this.state.videoPlaybackError}</span>:
                  <ReactPlayer
                    url={this.props.job.url_job_video}
                    onError={() => this.handleVideoPlaybackError()}
                  />
                }
              </div>:
              <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="hataraki_kata">
              <span>
                {LANG[localStorage.JobChoiceLanguage].howToWorkChoice}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <div id="hataraki_kata_area">
              {!this.props.job.hataraki_kata_resource || this.props.job.hataraki_kata_resource === null || this.props.job.hataraki_kata_resource.length === 0 ? 
                <div className="createJob-hatarakikata-display">
                  <span>{LANG[localStorage.JobChoiceLanguage].noHataSelected}</span>
                </div>:
                <div className="container">
                  <div className="row createJob-hatarakikata-display">
                    {this.props.job.hataraki_kata_resource.map((value, key) => {
                      return (
                        <HatarakikataDisplay key={key} resource={value} />
                      )})
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="other_hataraki_kata">
              <span>
                {LANG[localStorage.JobChoiceLanguage].otherTag}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">
              {
                !this.props.job.other_hataraki_kata || this.props.job.other_hataraki_kata === null || this.props.job.other_hataraki_kata.length === 0 ?
                LANG[localStorage.JobChoiceLanguage].noHataSelected :
                localStorage.JobChoiceLanguage === "US" ?
                this.props.hatarakikata_categories.find(cat => cat.id === this.props.job.other_hataraki_kata[0].hataraki_kata.hataraki_kata_category_id).item_en :
                this.props.hatarakikata_categories.find(cat => cat.id === this.props.job.other_hataraki_kata[0].hataraki_kata.hataraki_kata_category_id).item_jp

              }
            </span>
          </div>
          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <div className="job-offer-detail-two-element-solo-1"></div>
            <div className="job-offer-detail-two-element-solo-2">
              {!this.props.job.other_hataraki_kata || this.props.job.other_hataraki_kata === null || this.props.job.other_hataraki_kata.length === 0 ?
                <span className="job-offer-detail-two-span"></span>:
                <div>
                  <ul>
                    {this.props.job.other_hataraki_kata.map((option, key) => {
                      return (<div key={key}><li>{localStorage.JobChoiceLanguage === "US" ? option.hataraki_kata.item_en : option.hataraki_kata.item_jp}</li></div>)
                    })}
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>


        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
            <span>{LANG[localStorage.JobChoiceLanguage].strength}</span>
          </div>

          <div className="createJob-strength-info">
            <div className="createJob-strength-info-left">
              <div>
                <span>アピールポイントの</span><br />
                <span>書き方</span>
              </div>
            </div>
            <div className="createJob-strength-info-right">
              <span>
                <b>求職者の興味を持ってもらえそうな、
                働き方（扶養内・週3日・1日5時間・残業無し・
                お子様の都合でのお休み調整可）、就業環境や福利厚生
                （主婦がたくさん活躍中・社員食堂あり・社割あり・
                冷蔵庫あり・ウォーターサーバーあり）
                などの内容を記載してください。</b>
              </span><br /><br />
              <span>例）見出し：家庭と両立しながら活躍できる！</span><br />
              <span>本文：</span><br />
              <span>「週3日」「1日5時間～選べる」「曜日選べる」「扶養枠内」</span><br />
              <span>お子様がいらっしゃる方もたくさん活躍中なので、行事等があってもみんなでカバーできるから安心。</span><br />
              <span>仕事もプライベートも相談しあえる仲間がいるので活躍しやすい環境です。</span><br />
              <span>例）見出し：働きやすさ抜群！駅チカ・福利厚生充実</span><br />
              <span>本文：</span><br />
              <span>素敵なランチビュッフェやカフェが無料で利用可能！</span><br />
              <span>さらに、お昼寝・マッサージスペースも！働きやすい嬉しいポイントがいっぱいです。</span>
            </div>
          </div>

          {this.props.job.job_strengths && this.props.job.job_strengths.length !== 0 ?
            <>
              {this.props.job.job_strengths.map((strength, key) => {
                return (
                  <div key={key}>
                    <div className="job-offer-detail-strengths-area">
                      <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                        <label htmlFor={`header${key}`}>
                          <span>
                            {LANG[localStorage.JobChoiceLanguage].header} {key + 1}
                            <span className="optional-badge">
                              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                            </span>:
                          </span>
                        </label>
                        <span className="job-offer-detail-two-span">{strength.item}</span>
                      </div>
                      <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                        <label htmlFor={`description${key}`}>
                          <span>
                            {LANG[localStorage.JobChoiceLanguage].createJobMessage} {key + 1}
                            <span className="optional-badge">
                              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                            </span>:
                          </span>
                        </label>
                        <span className="job-offer-detail-two-span preserve-multiple-line">{strength.description}</span>
                      </div>
                    </div>
                    {key < this.props.job.job_strengths.length - 1 &&
                      <div className="section-break"></div>
                    }
                  </div>
                )
              })}
            </>:
            <div className="job-offer-detail-individual">
              <span>{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            </div>
          }
        </div>


        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
            <span>{LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="qualifications">
              <span>{LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span preserve-multiple-line">{this.props.job.qualifications}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="description">
              <span>{LANG[localStorage.JobChoiceLanguage].jobCategory}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">
              {this.props.job.job_job_sub_categories && this.props.job.job_job_sub_categories !== null && this.props.job.job_job_sub_categories.length > 0 ? 
                this.props.category.find(cat => cat.id === this.props.job.job_job_sub_categories[0].job_sub_category.job_category_id).category :
                ''
              }
            </span>
          </div>
          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <div className="job-offer-detail-two-element-solo-1"></div>
            <div className="job-offer-detail-two-element-solo-2">
              <ul>
                {this.props.job.job_job_sub_categories && this.props.job.job_job_sub_categories !== null && this.props.job.job_job_sub_categories.map((sub_category, key) => {
                  return (<div key={key}><li>{sub_category.job_sub_category.sub_category}</li></div>)
                })}
              </ul>
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="location_details">
              <span>{LANG[localStorage.JobChoiceLanguage].plannedHires}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.planned_hire}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="salary">
              <span>{LANG[localStorage.JobChoiceLanguage].salary}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-four-element">
              <span className="job-offer-detail-two-span job-offer-detail-four-element-1">
                {
                  this.props.job.payment_type && this.props.job.payment_type !== null && this.props.job.payment_type !== "" ?
                  localStorage.JobChoiceLanguage === "US" ? salaryFrequencyOptions.find(sal => sal.value === this.props.job.payment_type).item_en : salaryFrequencyOptions.find(sal => sal.value === this.props.job.payment_type).item_jp :
                  ''
                }
              </span>
              <span className="job-offer-detail-two-span job-offer-detail-four-element-2">{this.props.job.salary && this.props.job.salary !== null && this.props.job.salary.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} {this.props.job.salary && this.props.job.salary !== null && '円'} </span>
              <span className="job-offer-detail-two-span job-offer-detail-four-element-3">
                {this.props.job.salary_max_range && this.props.job.salary_max_range.length !== 0 ?
                  <span>～</span> :
                  <span></span>
                }
              </span>
              <span className="job-offer-detail-two-span job-offer-detail-four-element-4">
                {this.props.job.salary_max_range && this.props.job.salary_max_range.length !== 0 ?
                  <span>{this.props.job.salary_max_range !== null && this.props.job.salary_max_range.toLocaleString(navigator.language, { minimumFractionDigits: 0 })} {this.props.job.salary_max_range && this.props.job.salary_max_range !== null && '円'} </span> :
                  <span></span>
                }
              </span>
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="benefits">
              <span>{LANG[localStorage.JobChoiceLanguage].benefits}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.benefits}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="job_week">
              <span>{LANG[localStorage.JobChoiceLanguage].weekWorkDays}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-two-element">
              <div className="job-offer-detail-three-element">
                <span className="job-offer-detail-two-span job-offer-detail-three-element-1">{this.props.job.no_days_week && this.props.job.no_days_week.length > 0 && LANG[localStorage.JobChoiceLanguage].moreThan}{this.props.job.no_days_week}{this.props.job.no_days_week && this.props.job.no_days_week.length > 0 && LANG[localStorage.JobChoiceLanguage].preDays}</span>
                <span className="job-offer-detail-two-span job-offer-detail-center-text job-offer-detail-three-element-2">
                  {this.props.job.no_days_week_max_range && this.props.job.no_days_week_max_range.length !== 0 && this.props.job.no_days_week_max_range.length !== null && <span>～</span> }
                </span>
                <span className="job-offer-detail-two-span job-offer-detail-three-element-3">
                  {this.props.job.no_days_week_max_range && this.props.job.no_days_week_max_range.length !== 0 ?
                    <span>{LANG[localStorage.JobChoiceLanguage].withIn}{this.props.job.no_days_week_max_range}{LANG[localStorage.JobChoiceLanguage].Days}</span> :
                    <span></span>
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="week_days_available">
              <span>
                {LANG[localStorage.JobChoiceLanguage].workDaysAvailable}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-two-element-solo-2">
              {this.props.job.days.length === 0 ?
                <span></span>:
                <div>
                  <ul>
                    {this.props.job.days.map((day, key) => {
                      return (<li key={key}>{EM[localStorage.JobChoiceLanguage].WEEKDAYS.find(days => days.id === day.day).item}</li>)
                    })}
                  </ul>
                </div>
              }
            </div>
          </div>


          <div className="job-offer-detail-matching-calc-background">
            <label htmlFor="matching_calc_conditions">
              {LANG[localStorage.JobChoiceLanguage].matchingCalcConditions}
              <span className="required-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
              </span>:
            </label><br />
            <span>※性別年齢指定で完全非表示にする子は出来ません。下記設定でユーザーとのマッチング率を変更することができます。　詳しくはマッチングロジックについてをご参照下さい。</span>
            <div name="matching_calc_conditions">

              <div id="job-matching-gender" className="job-offer-detail-two-element">
                <div className="job-offer-detail-two-element">
                  <label>{LANG[localStorage.JobChoiceLanguage].gender}
                    <span className="required-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                    </span>:
                  </label>
                  <span className="job-offer-detail-two-span">{ handleSearchTranslation('MATCHING_CALC', this.props.job.ratio_gender_scope) }</span>
                </div>
                <div id="required_gender" className="job-offer-detail-two-element">
                  <label>{LANG[localStorage.JobChoiceLanguage].specificGenderRequired}{this.props.job.ratio_gender_scope === 'required' || this.props.job.ratio_gender_scope === 'preferable' ? <span className="required-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span> : <span></span>}:</label>
                  <span className="job-offer-detail-two-span">{ handleSearchTranslation('MATCHING_CALC_GENDER', this.props.job.required_gender) }</span>
                </div>
              </div>

              <div id="job-matching-age" className="job-offer-detail-two-element">
                <div className="job-offer-detail-two-element">
                  <label>{LANG[localStorage.JobChoiceLanguage].age}
                    <span className="required-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                    </span>:
                  </label>
                  <span className="job-offer-detail-two-span">{ handleSearchTranslation('MATCHING_CALC', this.props.job.ratio_age_scope) }</span>
                </div>
                <div id="job-matching-age-area" className="job-offer-detail-two-element">
                  <label>{LANG[localStorage.JobChoiceLanguage].ageRangeRequired}
                    {this.props.job.ratio_age_scope === 'required' || this.props.job.ratio_age_scope === 'preferable' ? 
                      <span className="required-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                      </span> :
                      <span className="optional-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                      </span>}:
                  </label>
                  <div className="job-offer-detail-three-element">
                    <span className="job-offer-detail-two-span job-offer-detail-three-element-1">{this.props.job.required_min_age}</span>
                    <span className="job-offer-detail-two-span job-offer-detail-three-element-2">～</span>
                    <span className="job-offer-detail-two-span job-offer-detail-three-element-3">{this.props.job.required_max_age}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>


          {/* <div className="job-offer-detail-time-info">
            <span>
              <b>時間が選べるお仕事の場合は具体的なシフトを複数ご登録ください。<br/>
              最上段に登録いただくシフトパターンが最も目立ちます。<br/>
              10時～16時など主婦が働きやすい時間帯を最上段にすると応募効果が高まるのでお勧めです。</b>
            </span><br /><br />
            <span>例）9時～18時のうち5時間から相談可の求人の場合</span><br />
            <span>○、10:00AM～4:00PM、11:00AM～5:00PM、9:00AM～6:00PM</span><br />
            <span>×、9:00AM～6:00PM、10:00AM～4:00PM、11:00AM～5:00PM</span><br />
          </div> */}

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="working_hours">
              <span>
                {LANG[localStorage.JobChoiceLanguage].workingHours}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <div className="job-offer-detail-two-element">
              <div className="job-offer-detail-three-element">
                <span className="job-offer-detail-two-span job-offer-detail-three-element-1">{start_time}</span>
                <span className="job-offer-detail-two-span job-offer-detail-center-text job-offer-detail-three-element-2">{this.props.job.end_time !== null && this.props.job.end_time !== "" && '～'}</span>
                <span className="job-offer-detail-two-span job-offer-detail-three-element-3">{end_time}</span>
              </div>
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="job_welfares">
              <span>{LANG[localStorage.JobChoiceLanguage].welfare}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <div>
              {this.props.job.job_welfares.length === 0 ?
                <span className="job-offer-detail-two-span"></span>:
                <div>
                  <ul>
                    {this.props.job.job_welfares.map((welfare, key) => {
                      return (
                        <div key={key}>
                          <li>
                            {localStorage.JobChoiceLanguage === "US" ? welfareOptions.find(wel => wel.id === welfare.name).item_en : welfareOptions.find(wel => wel.id === welfare.name).item_jp}
                          </li>
                        </div>)
                    })}
                  </ul>
                </div>
              }
            </div>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="welfare_working_period">
              <span>{LANG[localStorage.JobChoiceLanguage].working_period}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span preserve-multiple-line">{this.props.job.welfare_working_period}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="working_condition">
              <span>{LANG[localStorage.JobChoiceLanguage].working_period_remarks}
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span preserve-multiple-line">{this.props.job.working_condition}</span>
          </div>

          {this.props.job.job_reasons_to_hire && this.props.job.job_reasons_to_hire.length > 0 ?
            <>
            {this.props.job.job_reasons_to_hire.map((reason, key) => {
              return(
                <div key={key} className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                  <label htmlFor={`reason_to_hire${key}`}>
                    <span>{LANG[localStorage.JobChoiceLanguage].reason_to_hire} {key+1}
                      <span className="optional-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                      </span>
                    </span>
                  </label>
                  <span className="job-offer-detail-two-span preserve-multiple-line">{reason.reason}</span>
                </div>
              )
            })}
            </>:
            <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
              <label htmlFor="reason_to_hire">
                <span>{LANG[localStorage.JobChoiceLanguage].reason_to_hire} :</span>
              </label>
              <span className="job-offer-detail-two-span"></span>
            </div>
          }

          <div className="section-break"></div>

          {this.props.job.job_questions && this.props.job.job_questions.length > 0 ?
            <>
            {this.props.job.job_questions.map((question, key1) => {
              return(
                <div key={key1}>
                  <div className="job-offer-detail-question-area">
                    <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                      <label htmlFor={`question${key1}`}>
                        <span>{LANG[localStorage.JobChoiceLanguage].additionalQuestionApply} {key1+1}
                        </span>
                      </label>
                      <span className="job-offer-detail-two-span preserve-multiple-line">{question.question}</span>
                    </div>
                    <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                      <span className="required">
                        {question.required_answer !== null ?
                          question.required_answer === 0 ?
                            <span className="optional-badge"><small> {LANG[localStorage.JobChoiceLanguage].optional} </small></span> :
                            <span className="required-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span>
                          :
                          ''
                        }
                      </span>
                      <div></div>
                    </div>
                    <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
                      <label htmlFor={`answer_type${key1}`}>
                        <span>{LANG[localStorage.JobChoiceLanguage].answerForm} :</span>
                      </label>
                      <span className="job-offer-detail-two-span">
                        {question.answer_type && question.answer_type !== null ?
                          localStorage.JobChoiceLanguage === "US" ? 
                          answerFormOptions.find(ans => ans.value === question.answer_type).en : 
                          answerFormOptions.find(ans => ans.value === question.answer_type).jp :
                          ''
                        }
                      </span>
                    </div>
                    <div className="job-offer-detail-individual">
                      <label htmlFor="answers">
                        <span>{LANG[localStorage.JobChoiceLanguage].answerItem} :</span>
                      </label>
                    </div>
                    <div className="job-offer-detail-answer-area">
                      {question.job_question_answers && question.job_question_answers.length !== 0 &&
                        <>
                          {question.answer_type === "single" && question.job_question_answers.map((answer, key2) => {
                            return (
                              <span key={key2} className="job-offer-detail-answer-radio">
                                <label className="job-offer-detail-answer-radio-input">
                                  <input
                                    name={`question${key1}answerFormSpecific`}
                                    type="radio"
                                    value={answer.answer}
                                    disabled
                                  />
                                </label>
                                <label className="job-offer-detail-answer-radio-detail">{answer.answer}</label>
                              </span>
                            )
                          })}
                          {question.answer_type === "multiple" && question.job_question_answers.map((answer, key2) => {
                            return (
                              <span key={key2} className="job-offer-detail-answer-checkbox">
                                <label className="job-offer-detail-answer-checkbox-input">
                                  <input
                                    name={`question${key1}answerFormSpecific`}
                                    type="checkbox"
                                    value={answer.answer}
                                    disabled
                                  />
                                </label>
                                <label className="job-offer-detail-answer-checkbox-detail preserve-multiple-line">{answer.answer}</label>
                              </span>
                            )
                          })}
                        </>
                      }
                      {question.answer_type === "free_text" && 
                        <textarea
                          name={`question${key1}answerFormSpecific`}
                          noValidate
                          disabled
                        />
                      }
                    </div>
                  </div>
                  {key1 < this.props.job.job_questions.length - 1 && 
                    <div className="section-break"></div>
                  }
                </div>
              )
            })}
            </>:
            <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
              <label htmlFor="reason_to_hire">
                <span>{LANG[localStorage.JobChoiceLanguage].additionalQuestionApply} :</span>
              </label>
              <span className="job-offer-detail-two-span">{LANG[localStorage.JobChoiceLanguage].noneChosen}</span>
            </div>
          }
        </div>


        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
            <span>{LANG[localStorage.JobChoiceLanguage].applicationInformation}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="mail_reply_template">
              <span>{LANG[localStorage.JobChoiceLanguage].applicationReply}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span preserve-multiple-line">{this.props.job.mail_reply_template}</span>
          </div>

          <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
            <label htmlFor="mail_reply_email_address">
              <span>{LANG[localStorage.JobChoiceLanguage].applicationAddress}
                <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>:
              </span>
            </label>
            <span className="job-offer-detail-two-span">{this.props.job.mail_reply_email_address}</span>
          </div>
        </div>


        <div className="job-offer-detail-section">
          <div className="job-offer-detail-header">
              <span>{LANG[localStorage.JobChoiceLanguage].placementManagement}</span>
            </div>

            <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
              <label htmlFor="status">
                <span>
                  {LANG[localStorage.JobChoiceLanguage].publicationStatus}
                  <span className="required-badge">
                    <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                  </span>:
                </span>
              </label>
              <span className="job-offer-detail-two-span">{ handleSearchTranslation('PUBLICATION_STATUS', this.props.job.publication.status) }</span>
            </div>

            <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
              <label htmlFor="post_period">
                <span>
                  {LANG[localStorage.JobChoiceLanguage].postPeriod}
                  <span className="optional-badge">
                    <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                  </span>:
                </span>
              </label>
              <div className="job-offer-detail-two-element">
                <div className="job-offer-detail-three-element">
                  <span className="job-offer-detail-two-span job-offer-detail-three-element-1">{this.props.job.publication.published_start_date}</span>
                  <span className="job-offer-detail-two-span job-offer-detail-center-text job-offer-detail-three-element-2">{this.props.job.publication.published_end_date && this.props.job.publication.published_end_date !== "" && this.props.job.publication.published_end_date !== null && '～'}</span>
                  <span className="job-offer-detail-two-span job-offer-detail-three-element-3">{this.props.job.publication.published_end_date}</span>
                </div>
              </div>
            </div>

            <div className="job-offer-detail-individual job-offer-detail-two-element-multispan">
              <label htmlFor="published_comment">
                <span>
                  {LANG[localStorage.JobChoiceLanguage].memo} 
                  <span className="optional-badge">
                    <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                  </span>:
                </span>
              </label>
              <span className="job-offer-detail-two-span preserve-multiple-line">
                {this.props.job.published_comment}
              </span>
            </div>
        </div>

        <Modal show={this.state.modal.modal} 
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          messageKey={this.state.modal.messageKey} 
          handleParentClose={this.handleParentClose} 
        />

      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferViewDetails)
