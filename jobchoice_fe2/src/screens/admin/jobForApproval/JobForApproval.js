import React, { Component } from 'react'
import './JobForApproval.scss'
import { Redirect } from 'react-router-dom'
import api from '../../../utilities/api'
import { connect } from 'react-redux'
import Modal from '../../../components/modal/Modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import { LANG, EM  } from '../../../constants'
import { bindActionCreators } from "redux"
import * as authActions from "../../../store/auth/actions"
import HatarakikataDisplay from '../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import {Breadcrumb} from 'react-bootstrap'
import JobForApprovalGridContainer from './jobForApprovalComponent/JobForApprovalGridContainer'
import JobForApprovalGridItem from './jobForApprovalComponent/JobForApprovalGridItem'
import JobStatusIs from './JobStatusIs'
import ReasonToHireModal from './jobForApprovalComponent/ReasonToHireModal'
import JobWelfareModal from './jobForApprovalComponent/JobWelfareModal'
import JobWorkingConditionRemarksModal from './jobForApprovalComponent/JobWorkingConditionRemarksModal'
import { DateFormat } from "../../../helpers"
import NumberFormat from 'react-number-format'
import Img from 'react-fix-image-orientation'
import ReactPlayer from 'react-player'
import defaultJobImage from '../../../assets/img/job-avatar.jpg'

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

class JobForApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: null,
      applicantInfo: null,
      employment_period: [...EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD],
      employment_status: [...EM[localStorage.JobChoiceLanguage].EMPLOYMENT_STATUS],
      reasonToHire: false,
      welfare: false,
      working_period_remarks: false,
      isSaving: false,
      savingNote: false,
      videoPlaybackError: null,
      currentTab: 0,
      category: [],
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.handleChange = this.handleChange.bind(this)
  }
    
    componentDidMount() {
      this.props.handleLoadPage(true)
      api.get('api/manage/job/' + this.props.match.params.id).then(response => {
        this.setState({
          detail: response.data.results.job,
          applicantInfo: response.data.results.applied_job_counts
        }, () => {
        })
        api.get('api/job-category').then(response => {
          let job_categories = [...response.data.results.jobs].map(
            (el) => {
              el.job_sub_category.map((el) => {
                el['isSelected'] = false
                return el
              })
              return el
            }
          )
          this.setState({
            category: job_categories
          }, () => {
            this.props.handleLoadPage(false)
          })
        }).catch(error => {
          console.log(error)
          this.setState({
            modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/'
            },
            isLoading: false,
          })
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/home'
          },
        }, () => {
          this.props.handleLoadPage(false)
        })
      })
    }

    tabClick = (id) => {
      this.setState({
        currentTab: id
      })
    }

    handleApprovalStatus = (status) => {
      this.setState({
        modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
      }, () => {
        this.props.handleLoadPage(true)
      })
      
      api.patch('api/manage/job/' + this.state.detail.id, {approval_status: status}).then(response => {
        this.setState({
          modal: {
            messageKey: null,
            message: <JobStatusIs status={status}/>,
            modal: true,
            modalType: 'success',
            redirect: '/admin/manage/job-offers',
          },
        }, () => {
          this.props.handleLoadPage(false)
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/home'
          },
        }, () => {
          this.props.handleLoadPage(false)
        })
      })
    }

    handleChange = (state) => {
      this.setState({...state})
    }

    handleVideoPlaybackError() {
      this.setState({
        videoPlaybackError: 'urlChosen'
      })
    }

    render() {

    if (this.props.user.data.job_seeker || this.props.user.data.company) {
      return (<Redirect to="/home" />)
    }

    const tab = this.state.currentTab
    const hataraki_kata = this.state.detail ? this.state.detail.hataraki_kata_resource : ''
    const recruitment_tag = this.state.detail ? this.state.detail.recruitment_tag : ''
    const other_hataraki_kata = this.state.detail ? this.state.detail.other_hataraki_kata : ''
    const employment_period = this.state.detail ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.filter(el => el.value === this.state.detail.employment_period ? el : null)[0] : ''
    const employment_status = this.state.detail ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.filter(el => el.value === this.state.detail.employment_type ? el : null)[0] : ''
    let days =  null
    if (this.state.detail && this.state.detail.days) {
      days = this.state.detail.days
    }

    let moment = require('moment')

    const start_time = this.state.detail ? moment(this.state.detail.start_time, "HH:mm:ss").format("HH:mm A") : ''
    const end_time = this.state.detail ? moment(this.state.detail.end_time, "HH:mm:ss").format("HH:mm A") : ''
    const job_sub_categories = this.state.detail ? this.state.detail.job_job_sub_categories : []
    
    const views = this.state.detail && this.state.detail.analytics ? this.state.detail.analytics.views : 0
    const notes = this.state.detail && this.state.detail.notes ? this.state.detail.notes.notes : ''
    const payment_type = this.state.detail && this.state.detail.payment_type
    const publication_status = this.state.detail ? EM[localStorage.JobChoiceLanguage].PUBLICATION_STATUS.filter(el => el.value === this.state.detail.publication.status ? el : null)[0].name : ''
    return (
      <>
        {this.state.detail ? 
          <div className="col-md-9 col-sm-12 col-xs-12 manage-accounts-area">
          <div className="tablist-form job-for-approval-details-container">
                <Breadcrumb className="breadcrumb-jobs-management">
                  <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                  <Breadcrumb.Item href="/admin/manage/job-offers">{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</Breadcrumb.Item>/
                  <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobsForApproval }</Breadcrumb.Item>
                </Breadcrumb>
                <div className="job-for-approval-details-header tab-header">
                  <div className="tab-button approval-tab-btn">
                    <button className={`btn approval-btn ${tab === 0 ? 'btn-quad' : 'btn-outline-quad'}`} onClick={() => this.tabClick(0)}>{ LANG[localStorage.JobChoiceLanguage].jobOfferInformation }</button>
                  </div>
                  <div className="tab-button approval-tab-btn">
                    <button className={`btn approval-btn ${tab === 1 ? 'btn-quad' : 'btn-outline-quad'}`} onClick={() => this.tabClick(1)}>{ LANG[localStorage.JobChoiceLanguage].recruitmentDetails }</button>
                  </div>
                </div>
                {this.state.currentTab === 0 && 
                  <div className="table-responsive">
                    <div className="text-align-left job-offer-details-title">{ LANG[localStorage.JobChoiceLanguage].companyInformation }</div>
                    <JobForApprovalGridContainer>
                      <div className="job-for-approval-grid-row lefter toper">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].referenceID }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer ">{this.state.detail.reference_id}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].company }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer ">{this.state.detail.company.company_name}</JobForApprovalGridItem>
                      </div>
                    </JobForApprovalGridContainer>

                    <div className="text-align-left job-offer-details-title">{ LANG[localStorage.JobChoiceLanguage].basicInformation }</div>
                    <div className="job-for-approval-grid-container">
                      {/* Employment Status and Views */}
                      <div className="job-for-approval-grid-row lefter toper">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].employmentStatus }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{employment_status !== undefined ? employment_status.name : <div className="no-data-italic">{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</div>}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].views }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={views}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                      </div>
                      {/* Posted Company and Last Modified */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].company }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{this.state.detail.company.company_name}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].modifiedAt }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{DateFormat(this.state.detail.company.updated_at)}</JobForApprovalGridItem>
                      </div>
                      {/* Zip Code & Complete Address */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].zipCode }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.geolocation.zip_code}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].address }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.geolocation.complete_address}</JobForApprovalGridItem>
                      </div>
                      {/* Location Details */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].locationDetails }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.location_details}</JobForApprovalGridItem>
                      </div>
                      {/* Job Title */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].jobTitle }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.title}</JobForApprovalGridItem>
                      </div>
                      {/* Price */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].incentivePerShare }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <NumberFormat
                            value={this.state.detail.price}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                          {this.state.detail.price !== null ? ' 円' : ' - '}
                        </JobForApprovalGridItem>
                      </div>
                      {/* Job Description */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].jobDescription }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.description}</JobForApprovalGridItem>
                      </div>
                      {/* Incentives */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].incentivePerShare }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <NumberFormat value={this.state.detail.incentive_per_share}  displayType={'text'} thousandSeparator={true}/>
                        </JobForApprovalGridItem>
                      </div>
                      {/* Nearest Station and Nearest Station 2 */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].nearestStation }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          {this.state.detail ? 
                            <ul  className="text-align-left">
                              {this.state.detail.nearest_station.map((value, key)=>{
                                  return (
                                    <li key={key}>
                                      <strong>{value.station}</strong>
                                      (<span>{localStorage.JobChoiceLanguage === "US" ?
                                        meansOptions.filter(function(el) {return el.value === value.transportation ? el : null })[0].en :
                                        meansOptions.filter(function(el) {return el.value === value.transportation ? el : null })[0].jp
                                        } :
                                      </span>
                                      <span>{this.state.detail.nearest_station[0].time_duration} { LANG[localStorage.JobChoiceLanguage].minutes }</span>)
                                    </li>
                                  )
                                })
                              }
                            </ul>
                             : ''
                          }
                        </JobForApprovalGridItem>
                      </div>
                      {/* Image 1 - 4 */}
                      <div className="job-for-approval-grid-row-3 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].images }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <div className='job-picture'>
                            <Img src={ this.state.detail.job_image ? this.state.detail.job_image : defaultJobImage } alt="job"/>
                          </div>
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <div className='job-picture'>
                            {this.state.detail.galleries && this.state.detail.galleries[0] ? 
                              <div className="approval-subImage">
                                <Img src={this.state.detail.galleries[0].file_path} alt="sub img 1"/>
                                <small>{this.state.detail.galleries[0].caption}</small>
                              </div> :
                              LANG[localStorage.JobChoiceLanguage].noneChosen
                            }
                          </div>
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <div className='job-picture'>
                            {this.state.detail.galleries && this.state.detail.galleries[1] ? 
                              <div className="approval-subImage">
                                <Img src={this.state.detail.galleries[1].file_path} alt="sub img 2"/>
                                <small>{this.state.detail.galleries[1].caption}</small>
                              </div> :
                              LANG[localStorage.JobChoiceLanguage].noneChosen
                            }
                          </div>
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <div className='job-picture'>
                            {this.state.detail.galleries && this.state.detail.galleries[2] ? 
                              <div className="approval-subImage">
                                <Img src={this.state.detail.galleries[2].file_path} alt="sub img 3"/>
                                <small>{this.state.detail.galleries[2].caption}</small>
                              </div> :
                              LANG[localStorage.JobChoiceLanguage].noneChosen
                            }
                          </div>
                        </JobForApprovalGridItem>
                      </div>
                      {/* Job Video */}
                      <div className="job-for-approval-grid-row-2 lefter right-border bottomer">
                        <JobForApprovalGridItem className="grid-header bottomer">{ LANG[localStorage.JobChoiceLanguage].jobVideo }</JobForApprovalGridItem>
                          {this.state.detail.url_job_video !== null ?
                            <div className="player-container-border player-box">
                              {this.state.videoPlaybackError !== null ?
                                <span className="job-offer-detail-image-sub-caption-for-approval">{LANG[localStorage.JobChoiceLanguage][this.state.videoPlaybackError]}</span>:
                                <div class="player-wrapper-job-details">
                                  <ReactPlayer
                                    url={this.state.detail.url_job_video}
                                    className="player-job-details"
                                    onError={() => this.handleVideoPlaybackError()}
                                    width='100%'
                                    height='100%'
                                  />
                                </div>
                              }
                            </div>:
                            <span></span>
                          }
                      </div>
                      {/* Strength Header */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].strength }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <span>
                            {this.state.detail.job_strengths.length > 0 ?
                              this.state.detail.job_strengths.map((strength, key) => {
                                return (
                                  <>
                                    <div className="strength-header">
                                      <h6><strong>{strength.item}</strong></h6>
                                    </div>
                                    <div className="strength-description">
                                      <p>* {strength.description}</p>
                                    </div>
                                  </>
                                )
                              }) :
                              <tr>
                                <span></span>
                              </tr>
                            }
                          </span>
                        </JobForApprovalGridItem>
                      </div>
                      {/* Note */}
                      <div className="text-align-left job-offer-details-title"></div>
                      <div className="job-for-approval-grid-container">
                        <div className="job-for-approval-grid-row-2 lefter">
                          <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].note }</JobForApprovalGridItem>
                          <JobForApprovalGridItem className="bottomer toper">{ notes }</JobForApprovalGridItem>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                
                {this.state.currentTab === 1 && 
                  <div className="table-responsive">
                    <div className="text-align-left job-offer-details-title">{ LANG[localStorage.JobChoiceLanguage].recruitmentDetails }</div>
                    <div className="job-for-approval-grid-container">
                      {/* Qualification Requirements */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="toper">{this.state.detail.qualifications}</JobForApprovalGridItem>
                      </div>
                      {/* Job Category */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="toper grid-header">{ LANG[localStorage.JobChoiceLanguage].jobCategory }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="toper">
                          <span>
                            { this.state.detail.job_job_sub_categories.length > 1 ? this.state.category.filter(
                              function(el) {
                                return el.id === job_sub_categories[0].job_sub_category.job_category_id
                              })[0].category : ''
                            }
                          </span><br/>
                            {job_sub_categories.length > 1 &&
                              <ul>
                                {this.state.detail.job_job_sub_categories.map((sub_category, key) => {
                                  return (<li key={key}>{sub_category.job_sub_category.description}</li>)
                                })}
                              </ul>
                            }
                        </JobForApprovalGridItem>
                      </div>
                      {/* Job Type and Recruitment Number */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].jobType }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{employment_period !== undefined ? employment_period.name : <div className="no-data-italic">{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</div>}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].plannedHires }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={this.state.detail.planned_hire}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                      </div>
                      {/* Salary form and Week work days */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].salary }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{EM[localStorage.JobChoiceLanguage].SALARYOPTIONS.filter(el => el.value === payment_type ? el : null)[0].name}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].weekWorkDays }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{this.state.detail.no_days_week} <span className="squig">~</span> {this.state.detail.no_days_week_max_range}</JobForApprovalGridItem>
                      </div>
                      {/* Salary amount and Work Days available */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].salaryRemuneration }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={this.state.detail.salary}
                            displayType={'text'}
                            thousandSeparator={true}
                          />円 
                          <span className="squig">~</span>
                          <NumberFormat
                            value={this.state.detail.salary_max_range}
                            displayType={'text'}
                            thousandSeparator={true}
                          />円
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].workDaysAvailable }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          {days.map((value, key)=>{
                            return (
                              <>
                              {EM[localStorage.JobChoiceLanguage].WEEKDAYS.filter(day => day.id === value.day ? day : null)[0].item}{(key+1 !== days.length ? ', ' : '')}
                              </>
                            )
                          })}
                        </JobForApprovalGridItem>
                      </div>
                      {/* Sex and Age */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className=" grid-header">{ LANG[localStorage.JobChoiceLanguage].gender }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          {this.state.detail ? EM[localStorage.JobChoiceLanguage].GENDER.filter(el => el.value === this.state.detail.required_gender ? el : null)[0].name : ''}
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className=" grid-header">{ LANG[localStorage.JobChoiceLanguage].age }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{this.state.detail.required_min_age} <span className="squig">~</span> {this.state.detail.required_max_age}</JobForApprovalGridItem>
                      </div>
                      {/* Welfare and Working Hours */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className=" grid-header">{ LANG[localStorage.JobChoiceLanguage].welfare }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <button className="btn btn-link" onClick={() => this.setState({welfare: true})}>{ LANG[localStorage.JobChoiceLanguage].seeDetails }</button>
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className=" grid-header">{ LANG[localStorage.JobChoiceLanguage].workingHours }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{start_time} <span className="squig">~</span> {end_time}</JobForApprovalGridItem>
                      </div>
                      {/* Working condition remarks and Reasons to Hire */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].working_period_remarks }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <button className="btn btn-link" onClick={() => this.setState({working_period_remarks: true})}>{ LANG[localStorage.JobChoiceLanguage].seeDetails }</button>
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].reasonsToHire }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <button className="btn btn-link" onClick={() => this.setState({reasonToHire: true})}>{ LANG[localStorage.JobChoiceLanguage].seeDetails }</button>
                        </JobForApprovalGridItem>
                      </div>
                      {/* Working Period */}
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="grid-header bottomer">{ LANG[localStorage.JobChoiceLanguage].working_period }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">{this.state.detail.welfare_working_period}</JobForApprovalGridItem>
                      </div>
                      {/* Question and Answer */}
                      {this.state.detail.job_questions.length > 0 ? 
                        this.state.detail.job_questions.map((el, key) => {
                          return (
                            <>
                              <div className="job-for-approval-grid-row-2 lefter">
                                <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].additionalQuestionApply } {key+1}</JobForApprovalGridItem>
                                <JobForApprovalGridItem className="bottomer">
                                  {el.question} <br/>
                                  <span className={`${el.required_answer === 0 ? 'optional-badge' : 'required-badge'}`}>
                                    {el.required_answer === 0 ? LANG[localStorage.JobChoiceLanguage].optional : LANG[localStorage.JobChoiceLanguage].required}
                                  </span> <br/>
                                  {el.job_question_answers.length > 0 &&
                                    <div>
                                      { el.job_question_answers.map((answer, i) => {
                                        if(el.answer_type === 'single') {
                                          return (
                                            <div key={answer.id}>
                                              <label className="answer-answer admin-display-answer" htmlFor="question.question">
                                                <input
                                                  type="radio"
                                                  name={key}
                                                  value={answer.id}
                                                  disabled
                                                />
                                                {answer.answer}
                                              </label>
                                            </div>
                                          )
                                        }
                                        if(el.answer_type === 'multiple') {
                                          return (
                                            <div key={answer.id}>
                                              <label className="answer-answer admin-display-answer" htmlFor="question.question">
                                                <input
                                                  type="checkbox"
                                                  name={key}
                                                  value={answer.id}
                                                  disabled
                                                />
                                                {answer.answer}
                                              </label>
                                            </div>
                                          )
                                        }
                                      })}
                                    </div>
                                  }
                                  { el.answer_type === 'free_text' &&
                                    <div className= "admin-display-textarea">
                                      <textarea
                                        name={el.id}
                                        disabled
                                      />
                                    </div>
                                  }
                                </JobForApprovalGridItem>
                              </div>
                            </>)
                        })
                        : ''
                      }
                      <div className="job-for-approval-grid-row-2 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].otherTag }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <span>
                            {this.state.detail.other_hataraki_kata.length === 0 ?
                              <span></span>:
                              <div>
                                {this.state.detail.other_hataraki_kata.map((option, key) => {
                                  return (<div className="other-tag-container" key={key}>
                                    {localStorage.JobChoiceLanguage === "US" ? option.hataraki_kata.item_en : option.hataraki_kata.item_jp}
                                  </div>)
                                })}
                              </div>
                            }
                          </span>
                        </JobForApprovalGridItem>
                      </div>
                    </div>
                    <div className="text-align-left job-offer-details-title"></div>
                    <div className="job-for-approval-grid-container">
                      <div className="job-for-approval-grid-row-3 lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].hatarakikata }:</JobForApprovalGridItem>
                          {hataraki_kata.map((value,key)=> {
                            return (
                              <div className="job-for-approval-grid-item toper righter bottomer">
                                  <HatarakikataDisplay resource={value} key={key} />
                              </div>
                              
                            )
                          }) }
                      </div>
                    </div>
                    <div className="text-align-left job-offer-details-title">{ LANG[localStorage.JobChoiceLanguage].publicationInformation }</div>
                    <div className="job-for-approval-grid-container">
                      {/* Publication Dates */}
                      <div className="job-for-approval-grid-row lefter toper">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].publicationStartDate }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          {this.state.detail.publication.published_start_date ? DateFormat(this.state.detail.publication.published_start_date) : '-'}
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].publicationEndDate }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          {this.state.detail.publication.published_end_date ? DateFormat(this.state.detail.publication.published_end_date) : '-'}
                        </JobForApprovalGridItem>
                      </div>
                      {/* Publication Status and Number of Applicants*/}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].publicationStatus }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>{publication_status}</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].totalApplicants }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={this.state.applicantInfo.number_of_applicants}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                      </div>
                      {/*Undisclosed Number and Number of Disclosed */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].noOfUndisclosure }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={this.state.applicantInfo.number_of_undisclosed}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                        <JobForApprovalGridItem className="grid-header">{ LANG[localStorage.JobChoiceLanguage].noOfDisclosure }</JobForApprovalGridItem>
                        <JobForApprovalGridItem>
                          <NumberFormat
                            value={this.state.applicantInfo.number_of_disclosed}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                      </div>
                      {/* # Decline and reject */}
                      <div className="job-for-approval-grid-row lefter">
                        <JobForApprovalGridItem className="bottomer grid-header">{ LANG[localStorage.JobChoiceLanguage].numberOfRejectedApplications }</JobForApprovalGridItem>
                        <JobForApprovalGridItem className="bottomer">
                          <NumberFormat
                            value={this.state.applicantInfo.number_of_rejected}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </JobForApprovalGridItem>
                      </div>
                    </div>
                  </div>
                }
                {this.state.detail && this.state.detail.approval_status === 'waiting' ?
                  <div className="approval-btns">
                    <ButtonGroup>
                      <Button
                        className="aprroval-btn-reject"
                        onClick={() => this.handleApprovalStatus('rejected')}>{ LANG[localStorage.JobChoiceLanguage].reject }</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Button
                        className="aprroval-btn-accept"
                        onClick={() => this.handleApprovalStatus('approved')}>{ LANG[localStorage.JobChoiceLanguage].approve }</Button>
                    </ButtonGroup>
                  </div> :
                <div 
                  className={`job-for-approval-approval-status 
                  ${EM[localStorage.JobChoiceLanguage].APPROVAL_STATUS.filter(status => status.value === this.state.detail.approval_status ? status : null)[0].name}`}>
                  {EM[localStorage.JobChoiceLanguage].APPROVAL_STATUS.filter(status => status.value === this.state.detail.approval_status ? status : null)[0].name}
                </div>
              }
              </div>
              <Modal 
                messageKey={this.state.modal.messageKey}
                show={this.state.modal.modal} 
                message={this.state.modal.message}
                type={this.state.modal.modalType}
                redirect={this.state.modal.redirect} />

              {this.state.reasonToHire &&
                <ReasonToHireModal
                  show={this.state.reasonToHire}
                  details={this.state.detail.job_reasons_to_hire}
                  onClose={this.handleChange}
                />
              }
              {this.state.welfare &&
                <JobWelfareModal
                  show={this.state.welfare}
                  details={this.state.detail.job_welfares}
                  onClose={this.handleChange}
                />
              }
              {this.state.working_period_remarks &&
                <JobWorkingConditionRemarksModal
                  show={this.state.working_period_remarks}
                  details={this.state.detail.working_condition}
                  onClose={this.handleChange}
                />
              }
        </div> : ''}
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobForApproval)
