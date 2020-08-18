import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import './../../client/jobOfferDetail/JobOfferDetail'
import './JobDetail.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import "react-tabs/style/react-tabs.css"
import ModalSNS from '../../../components/modalSNS/ModalSNS'
import ModalTwitter from '../../../components/modalTwitter/ModalTwitter'
import ModalEmail from '../../../components/modalEmail/ModalEmail'
import ModalQrCode from '../../../components/modalQrCode/ModalQrCode'
import { LANG, EM, SITE } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import HatarakikataDisplay from '../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import {Breadcrumb} from 'react-bootstrap'
import JobQuestionComponent from './jobQuestionComponent/JobQuestionComponent'
import ReactPlayer from 'react-player'
import NumberFormat from 'react-number-format'
import { imageDateNow } from '../../../helpers'
import Img from 'react-fix-image-orientation'
import defaultJobImage from '../../../assets/img/job-avatar.jpg'
import { Helmet } from 'react-helmet'

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

class JobDetail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      detail: {},
      twitterAuth: {},
      work_exp_comment: '',
      preferred_work_num: '',
      will_apply: false,
      share: false,
      twitter: false,
      qrcode: false,
      link:null,
      currentTab: 0,
      showEmail: false,
      share_job_details: null,
      videoPlaybackError: null,
      hatarakikata_categories: [],
      category: [],

      formErrors: {
        work_exp_comment: "",
        preferred_work_num: LANG[localStorage.JobChoiceLanguage].thisQuestionRequiresAnswer,
      },

      isLoading: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
        data: null
      },
    }
    this.handleState = this.handleState.bind(this)
    this.handleJobApply = this.handleJobApply.bind(this)
    this.handleRegistrationValidation = this.handleRegistrationValidation.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  handleState = (newInput) => {this.setState(newInput)}

  componentDidMount() {
    window.scrollTo(0, 0)
    this.setState({
      share_job_details: this.props.location.state,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })

    const id = this.props.match.params.id

    const jobView = {
      model: 'Job',
      id: id
    }

    api.post('api/analytic', jobView).catch(error => {
      this.setState({
        modal: {
          messageKey: 'serverError',
          modal: true,
          modalType: 'error',
        },
      })
    })

    api.get('api/job/' + id).then(response => {
      this.setState({
        detail: response.data.results.job,
      })
      api.get('api/hataraki-kata-categories').then(response => {
        this.setState({
          hatarakikata_categories: response.data.results.hataraki_kata_categories,
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
            category: job_categories,
            isLoading: false,
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
            redirect: '/'
          },
          isLoading: false,
        })
      })
    }).catch(error => {
      this.setState({
        modal: {
          messageKey: 'null',
          message: error,
          modal: true,
          modalType: 'error',
        },
        isLoading: false
      })
    })

    // Remove snsApply and share job data if the user logged in already
    if (localStorage.accessToken) {
      localStorage.removeItem('snsApply')
      localStorage.removeItem('share_job_data')
    }
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

  handleRegistrationValidation = () => {
    this.setState({
      modal: {
        messageKey: 'pleaseRegister',
        message: LANG[localStorage.JobChoiceLanguage].pleaseRegister,
        modal: true,
        modalType: 'error',
        redirect: '/email-registration/job_seeker'
      },
      isLoading: false
    })
  }

  handleJobApply = () => {
    this.setState({
      modal: {
        messageKey: 'applicationSuccessful',
        message: LANG[localStorage.JobChoiceLanguage].applicationSuccessful,
        modal: true,
        modalType: 'success',
        redirect: '/jobs'
      },
      isLoading: false
    })
  }

  // This function is responsible for showing Apply Component
  // Only Job Seekers who have filled up their Basic Information can apply
  toggleApply = e => {
    if (this.props.user.data && this.props.user.data.job_seeker) {
      const user = this.props.user
      if ( !user.basicInfo ) {
        this.setState({
          modal: {
            messageKey: 'pleaseFillOutBasicInformation',
            message: LANG[localStorage.JobChoiceLanguage].pleaseFillOutBasicInformation,
            modal: true,
            modalType: 'error',
            redirect: "/account-profile",
            data: { whatTab: 1 }
          },
          isLoading: false
        })
      } else {
        this.setState({
          will_apply: !this.state.will_apply,
        })
      }
    } else {
      this.handleRegistrationValidation()
    }

  }

  // This function is responsible for showing SNS sharing feature of a job
  // Guest are redirected to registration page
  showModalSNS = () => {
    const jobID = { job_id: this.props.match.params.id }
    const user = this.props.user
    this.setState({ isLoading: true }, () => {
      // if user is logged in
      if (this.props.user.data) {
        api.post('api/shared-jobs-generate-link', jobID).then(response => {
          if (response.data.status === 200) {
          const link = response.data.results.link
            this.setState({
              share: true,
              link: link,
              isLoading: false
            });
          }
        }).catch(error => {
          if (error.response.status === 401) {
            this.handleRegistrationValidation()
          } else {
            this.setState({
              modal: {
                messageKey: null,
                message: error.response.data.error,
                modal: true,
                modalType: 'error',
                redirect: '/jobs'
              },
              isLoading: false
            })
          }
        })
      } else {
        this.handleRegistrationValidation()
      }
    })
  }

  handleClose = (value) => {
    this.setState({
      [value]: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
  }

  handleEmail = (showEmail) => {
    this.setState({
      showEmail: showEmail,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    });
  }

  tabClick = (id) => {
    this.setState({
      currentTab: id
    })
  }

  handleVideoPlaybackError() {
    this.setState({
      videoPlaybackError: 'urlChosen'
    })
  }

  render() {
    const detail = this.state.detail
    const tab = this.state.currentTab

    const employment_period = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.filter(
      function(el) {return el.value === detail.employment_period ? el : null })[0]
    const employment_status = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.filter(
      function(el) {return el.value === detail.employment_type ? el : null })[0]

    let days = detail.days ? detail.days : null

    let moment = require('moment')

    const start_time = moment(this.state.detail.start_time, "HH:mm:ss").format("HH:mm")
    const end_time = moment(this.state.detail.end_time, "HH:mm:ss").format("HH:mm")

    const user_checker = this.props.user && this.props.user.data ? this.props.user.data.id : null

    const nearest_station = detail.nearest_station
    const job_job_sub_categories = detail.job_job_sub_categories

    return (
      <div>
        <Helmet>
        <meta property="og:url" content={SITE + this.props.match.params.id} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={this.state.detail.title} />
        <meta property="og:description" content={this.state.detail.description} />
        <meta property="og:image" content={this.state.detail.job_image} />
        </Helmet>
        <JobChoiceLayout>
        <Breadcrumb className="breadcrumb-jobs">
          {this.props.user && this.props.user.constructor === Object ?
            <Breadcrumb.Item href="/">{ LANG[localStorage.JobChoiceLanguage].home }</Breadcrumb.Item> :
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>
          }/
          <Breadcrumb.Item href="/jobs">{ LANG[localStorage.JobChoiceLanguage].jobs }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobDetails }</Breadcrumb.Item>
        </Breadcrumb>
          <div className='container-fluid approval-background'>
          {!this.state.isLoading &&
            <>
            <div className="job-detail-top">
              <div className="col-md-12 col-xl-8 offset-xl-2 job-detail-row row-1">
                <div className='job-picture-outer'>
                  <div className='job-picture'>
                    <Img src={this.state.detail.job_image ? this.state.detail.job_image : defaultJobImage} alt="job"/>
                  </div>
                </div>
                <div className="job-detail-right-info">
                  <div className="job-detail">
                    <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].referenceID }</small></div>
                    <div className='job-detail-info main'>{this.state.detail.reference_id}</div>
                  </div>
                  <div className="job-detail">
                    <div className='job-detail-info main'>{this.state.detail.title}</div>
                  </div>
                  <div className="job-detail">
                    <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].company }</small></div>
                    <div className='job-detail-info main'>{this.state.detail.company.company_name}</div>
                  </div>
                  <div className="job-detail">
                    <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].salary }</small></div>
                    <div className='job-detail-info main'>
                      <NumberFormat
                        value={this.state.detail.salary}
                        displayType={'text'}
                        thousandSeparator={true}
                      />円
                      <span>～</span>
                      <NumberFormat
                        value={this.state.detail.salary_max_range && this.state.detail.salary_max_range.length !== 0 ? this.state.detail.salary_max_range : ''}
                        displayType={'text'}
                        thousandSeparator={true}
                      />円
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="job-detail-lower-main">
              <div className='col-sm-12 col-md-12 col-xl-8 offset-xl-2 job-detail-row row-2'>
              <div className="tablist-form">
                    {(!this.props.user.data || this.props.user.data.job_seeker) &&
                      <div className="apply-share">
                        <ButtonGroup>
                          <Button bsStyle="success" className="apply-btn" onClick={this.toggleApply}>
                            { LANG[localStorage.JobChoiceLanguage].apply }
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button bsStyle="primary" className="button-group" onClick={this.showModalSNS}>
                            { LANG[localStorage.JobChoiceLanguage].shareJob }
                          </Button>
                        </ButtonGroup>
                      </div>
                    }
                    {this.state.will_apply &&
                      <JobQuestionComponent
                        job_questions={this.state.detail.job_questions}
                        job_id = {this.state.detail.id}
                        share_job_details= {this.state.share_job_details}
                        handleJobApply={this.handleJobApply}
                        handleRegistrationValidation={this.handleRegistrationValidation}
                        setParent={this.handleState}
                      />
                    }
                    <div className="tab-header job-detail-tab-buttons-area">
                      <div className="job-detail-tab-btn-outer">
                        <button className={`btn job-detail-tab-btn ${tab === 0 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(0)}>{LANG[localStorage.JobChoiceLanguage].pricePlanEstimate}</button>
                      </div>
                      <div className="job-detail-tab-btn-outer">
                        <button className={`btn job-detail-tab-btn ${tab === 1 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(1)}>{ LANG[localStorage.JobChoiceLanguage].recruitmentBasicInfo }</button>
                      </div>
                      <div className="job-detail-tab-btn-outer">
                        <button className={`btn job-detail-tab-btn ${tab === 2 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(2)}>{ LANG[localStorage.JobChoiceLanguage].strength }</button>
                      </div>
                      <div className="job-detail-tab-btn-outer">
                        <button className={`btn job-detail-tab-btn ${tab === 3 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(3)}>{ LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo }</button>
                      </div>
                    </div>
                    {this.state.currentTab === 0 &&
                      <div className="job-detail-details-area">
                        <table className="table-job-detail">
                          <tbody>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobType }:</strong></th>
                              <td className="detail-value">{employment_period !== undefined ? employment_period.name : ''}</td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].employmentForm }:</strong></th>
                              <td className="detail-value">{employment_status !== undefined ? employment_status.name : ''}</td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].zipCode }:</strong></th>
                              <td className="detail-value">{this.state.detail.geolocation.zip_code}</td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].address }:</strong></th>
                              <td className="detail-value">{this.state.detail.geolocation.complete_address}</td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].locationDetails }:</strong></th>
                              <td className="detail-value">{this.state.detail.location_details}</td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].incentivePerShare }:</strong></th>
                              <td className="detail-value">
                                <NumberFormat value={this.state.detail.incentive_per_share}  displayType={'text'} thousandSeparator={true}/>
                                <span> 円</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    }
                    {this.state.currentTab === 1 &&
                      <div className="job-detail-details-area">
                        <table className="table-job-detail">
                          <tbody>
                            <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].nearestStation } 1:</strong></th>
                              <td className="detail-value">
                                <span>{this.state.detail.nearest_station[0].station}</span><br/>
                                <span>{localStorage.JobChoiceLanguage === "US" ?
                                  meansOptions.filter(function(el) {return el.value === nearest_station[0].transportation ? el : null })[0].en :
                                  meansOptions.filter(function(el) {return el.value === nearest_station[0].transportation ? el : null })[0].jp
                                  } :
                                </span>
                                <span>{this.state.detail.nearest_station[0].time_duration} { LANG[localStorage.JobChoiceLanguage].minutes }</span>
                              </td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].nearestStation } 2:</strong></th>
                              <td className="detail-value">
                              {this.state.detail.nearest_station.length > 1 ?
                                <>
                                  <span>{this.state.detail.nearest_station[1].station}</span>
                                  <span>
                                    {localStorage.JobChoiceLanguage === "US" ?
                                      meansOptions.filter(function(el) {return el.value === nearest_station[1].transportation ? el : null })[0].en :
                                      meansOptions.filter(function(el) {return el.value === nearest_station[1].transportation ? el : null })[0].jp
                                    } :
                                  </span>
                                  <span>{this.state.detail.nearest_station[1].time_duration}</span>
                                </>:
                                <span></span>
                              }
                              </td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobDescription }:</strong></th>
                              <td className="detail-value">{this.state.detail.description}</td>
                            </tr>
                            {this.state.detail.galleries.length > 0 && this.state.detail.galleries[0] ?
                              <tr>
                                <td className="detail-value" colSpan="2">
                                  <div className="job-detail-details-gallery-container">
                                    {this.state.detail.galleries.length > 0 && this.state.detail.galleries[0] ?
                                      <div>
                                        <Img src={imageDateNow(this.state.detail.galleries[0].file_path)} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                        <span>{this.state.detail.galleries[0].caption}</span>
                                      </div>:
                                      <span></span>
                                    }
                                  </div>
                                  <div className="job-detail-details-gallery-container">
                                    {this.state.detail.galleries.length > 1 && this.state.detail.galleries[1] ?
                                      <div>
                                        <Img src={imageDateNow(this.state.detail.galleries[1].file_path)} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                        <span>{this.state.detail.galleries[1].caption}</span>
                                      </div>:
                                      <span></span>
                                    }
                                  </div>
                                  <div className="job-detail-details-gallery-container">
                                  {this.state.detail.galleries.length > 2 && this.state.detail.galleries[2] ?
                                    <div>
                                      <Img src={imageDateNow(this.state.detail.galleries[2].file_path)} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                      <span>{this.state.detail.galleries[2].caption}</span>
                                    </div>:
                                    <span></span>
                                  }
                                  </div>
                                </td>
                              </tr>:
                              <span></span>
                            }
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobVideo }:</strong></th>
                              <td className="detail-value">
                              {this.state.detail.url_job_video !== null ?
                                <div className="player-container-border">
                                  {this.state.videoPlaybackError !== null ?
                                    <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage][this.state.videoPlaybackError]}</span>:
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
                              </td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].howToWorkChoice }:</strong></th>
                              <td className="detail-value">
                              {this.state.detail.hataraki_kata_resource.length === 0 ?
                                <div className="createJob-hatarakikata-display">
                                  <span></span>
                                </div>:
                                <div className="container">
                                  <div className="row createJob-hatarakikata-display">
                                    {this.state.detail.hataraki_kata_resource.map((value, key) => {
                                      return (
                                        <HatarakikataDisplay key={key} resource={value} />
                                      )})
                                    }
                                  </div>
                                </div>
                              }
                              </td>
                            </tr>
                            <tr>
                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].otherTag }:</strong></th>
                              <td className="detail-value">
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
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    }
                    {this.state.currentTab === 2 &&
                      <div className="job-detail-details-area">
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
                      </div>
                    }
                    {this.state.currentTab === 3 &&
                      <div className="job-detail-details-area">
                        <table className="table-job-detail">
                          <tbody>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo }:</strong></th>
                            <td className="detail-value">{this.state.detail.qualifications}</td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobCategory }:</strong></th>
                            <td className="detail-value">
                              <span>
                                { this.state.detail.job_job_sub_categories.length > 1 ? this.state.category.filter(
                                  function(el) {
                                    return el.id === job_job_sub_categories[0].job_sub_category.job_category_id ? el : null
                                  })[0].category : ''
                                }
                              </span><br/>
                              {job_job_sub_categories.length > 1 &&
                                <ul>
                                  {this.state.detail.job_job_sub_categories.map((sub_category, key) => {
                                    return (<li key={key}>{sub_category.job_sub_category.description}</li>)
                                  })}
                                </ul>
                              }
                            </td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].plannedHires }:</strong></th>
                            <td className="detail-value">{this.state.detail.planned_hire}</td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].benefits }:</strong></th>
                            <td className="detail-value">{this.state.detail.benefits}</td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].weekWorkDays }:</strong></th>
                            <td className="detail-value">
                              <span>{LANG[localStorage.JobChoiceLanguage].moreThan}{this.state.detail.no_days_week}{LANG[localStorage.JobChoiceLanguage].moreDays}</span>
                              {this.state.detail.no_days_week_max_range && this.state.detail.no_days_week_max_range.length !== 0 ?
                                <span>～ {this.state.detail.no_days_week_max_range}{LANG[localStorage.JobChoiceLanguage].withIn}{LANG[localStorage.JobChoiceLanguage].Days}</span> :
                                ''
                              }
                            </td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].workDaysAvailable }:</strong></th>
                            <td className="detail-value">
                              {days.map((value, key)=>{
                                return (
                                  <div className="days working-days-container" key={key}>
                                    <div key={key}>
                                    { EM[localStorage.JobChoiceLanguage].WEEKDAYS.filter(function(day) {return day.id === value.day ? day : null })[0].item }
                                    { (key+1 !== days.length) }
                                  </div>
                                  </div>
                                )
                              })}
                            </td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].workingHours }:</strong></th>
                            <td className="detail-value">{start_time} - {end_time}</td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].welfare }:</strong></th>
                            <td className="detail-value">
                            {this.state.detail.job_welfares.length === 0 ?
                              <span></span>:
                              <div>
                                <ul>
                                  {this.state.detail.job_welfares.map((welfare, key) => {
                                    return (
                                      <li key={key}>
                                        { localStorage.JobChoiceLanguage === "US" ?
                                          welfareOptions.filter(function(el) {return el.id === welfare.name ? el : null })[0].item_en :
                                          welfareOptions.filter(function(el) {return el.id === welfare.name ? el : null })[0].item_jp
                                        }
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            }
                            </td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period }:</strong></th>
                            <td className="detail-value">{this.state.detail.welfare_working_period}</td>
                          </tr>
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period_remarks }:</strong></th>
                            <td className="detail-value">{this.state.detail.working_condition}</td>
                          </tr>
                          {this.state.detail.job_reasons_to_hire && this.state.detail.job_reasons_to_hire.length > 0 ?
                          <>
                            {this.state.detail.job_reasons_to_hire.map((reason, key) => {
                              return(
                                <tr key={key}>
                                  <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period_remarks } {key+1} :</strong></th>
                                  <td className="detail-value">{reason.reason}</td>
                                </tr>
                              )
                            })}
                          </>:
                          <tr>
                            <th><strong>{ LANG[localStorage.JobChoiceLanguage].reason_to_hire } :</strong></th>
                            <td className="detail-value"></td>
                          </tr>
                          }
                          </tbody>
                        </table>
                      </div>
                    }
                  </div>
              </div>
            </div>
            </>
          }
          </div>

          <ModalSNS
            show={this.state.share}
            message={ LANG[localStorage.JobChoiceLanguage].chooseWhereToShare }
            type='sns-share'
            data={[this.props.match.params.id, this.state.link]}
            handleClose={this.handleClose}
            setParent={this.handleState}
            handleShowEmail={this.handleEmail}
          />

          <ModalTwitter
            show={this.state.twitter}
            handleClose={this.handleClose}
            twitterAuth={this.state.twitterAuth}
            data={[this.props.match.params.id, this.state.link]}
            setParent={this.handleState}
          />

          <Modal
            messageKey={this.state.modal.messageKey}
            show={this.state.modal.modal}
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
            handleParentClose={this.handleParentClose}
          />

          {this.props.user.data &&
            <ModalEmail
              show={this.state.showEmail}
              data={[user_checker, this.state.link]}
              detail={this.state.detail}
              closed={this.handleEmail}
              setParent={this.handleState}
            />
          }

          <ModalQrCode
            detail={this.state.detail}
            show={this.state.qrcode}
            handleClose={this.handleClose}
            data={[this.props.match.params.id, this.state.link]}
            setParent={this.handleState}
          />

          <LoadingIcon show={this.state.isLoading} />

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

export default connect(mapStateToProps, mapDispatchToProps)(JobDetail)
